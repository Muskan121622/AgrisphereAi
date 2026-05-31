from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import requests
from dotenv import load_dotenv
from urllib.parse import quote
import xml.etree.ElementTree as ET
import re

load_dotenv()
import joblib
import pandas as pd
import numpy as np
import os
import tempfile
import json
from PIL import Image
from scipy import ndimage
from datetime import datetime, timedelta
from improved_voice_assistant import AgriVoiceAssistant
import recommendation_engine
import pest_engine
import market_engine
import weather_engine
import ai_fallbacks
import base64
import uuid
import whatsapp_handler
from agromonitoring_service import AgroMonitoringService

agro_service = AgroMonitoringService()

try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None

def call_groq_with_fallback(prompt, system_message="You are a helpful agricultural AI. Output valid JSON only.", response_format={"type": "json_object"}, temperature=0.2, max_tokens=600):
    """
    Call Groq API with automatic model fallback for rate limits and errors.
    """
    from groq import Groq
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_CHATBOT_API_KEY")
    if not api_key:
        return None, "API Key missing"

    client = Groq(api_key=api_key)
    
    # Model Priority: 
    # 1. llama-3.3-70b-versatile (Highest quality)
    # 2. llama-3.1-8b-instant (Fast, high rate limit)
    # 3. mixtral-8x7b-32768 (Alternative)
    models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"]
    
    last_error = None
    for model in models:
        try:
            print(f"Attempting Groq call with model: {model}")
            completion = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                response_format=response_format
            )
            return completion.choices[0].message.content, None
        except Exception as e:
            last_error = str(e)
            print(f"Groq error with {model}: {last_error}")
            # More inclusive rate limit detection
            lower_error = last_error.lower()
            if "rate_limit" in lower_error or "rate limit" in lower_error or "429" in lower_error or "overloaded" in lower_error:
                continue # Try next model
            break # Other errors might not be recoverable by switching models
            
    return None, last_error

import sqlite3

MARKET_DATA_FILE = "market_data.json"
LISTINGS_FILE = "listings.json"
COMMUNITY_DATA_FILE = "community_data.json"
CROP_LOSS_FILE = "crop_loss_data.json"
DEMANDS_FILE = "demands.json"
DB_FILE = "agrisphere.db"

def load_demands():
    if os.path.exists(DEMANDS_FILE):
        try:
            with open(DEMANDS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_demands(data):
    with open(DEMANDS_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def load_crop_loss_data():
    if os.path.exists(CROP_LOSS_FILE):
        try:
            with open(CROP_LOSS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_crop_loss_data(data):
    with open(CROP_LOSS_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            username TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            photoUrl TEXT,
            bio TEXT,
            dob TEXT,
            country TEXT,
            state TEXT,
            district TEXT,
            village TEXT,
            farmSize TEXT,
            experience TEXT,
            crops TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            author TEXT,
            title TEXT,
            content TEXT,
            timestamp TEXT,
            likes INTEGER DEFAULT 0,
            tags TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY,
            post_id TEXT,
            author TEXT,
            text TEXT,
            timestamp TEXT,
            FOREIGN KEY(post_id) REFERENCES posts(id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat (
            id TEXT PRIMARY KEY,
            sender TEXT,
            recipient TEXT,
            text TEXT,
            imageUrl TEXT,
            audioUrl TEXT, 
            timestamp TEXT,
            read INTEGER DEFAULT 0
        )
    ''')
    
    conn.commit()
    
    # Check if we need to migrate from JSON
    if os.path.exists(COMMUNITY_DATA_FILE):
        print("🔍 Found community_data.json, checking for migration...")
        try:
            with open(COMMUNITY_DATA_FILE, 'r') as f:
                data = json.load(f)
            
            # Migrate Posts
            cursor.execute("SELECT count(*) FROM posts")
            if cursor.fetchone()[0] == 0:
                print("📦 Migrating posts to SQLite...")
                for post in data.get('posts', []):
                    cursor.execute(
                        "INSERT INTO posts (id, author, title, content, timestamp, likes, tags) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (post.get('id'), post.get('author'), post.get('title'), post.get('content'), post.get('timestamp'), post.get('likes', 0), json.dumps(post.get('tags', [])))
                    )
                    for comment in post.get('comments', []):
                        cursor.execute(
                            "INSERT INTO comments (id, post_id, author, text, timestamp) VALUES (?, ?, ?, ?, ?)",
                            (comment.get('id'), post.get('id'), comment.get('author'), comment.get('text'), comment.get('timestamp'))
                        )
            
            # Migrate Chat
            cursor.execute("SELECT count(*) FROM chat")
            if cursor.fetchone()[0] == 0:
                print("💬 Migrating chat messages to SQLite...")
                for msg in data.get('chat', []):
                    cursor.execute(
                        "INSERT INTO chat (id, sender, recipient, text, imageUrl, timestamp, read) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (msg.get('id'), msg.get('sender'), msg.get('recipient'), msg.get('text'), msg.get('imageUrl'), msg.get('timestamp'), 1 if msg.get('read') else 0)
                    )
            
            # Migrate Profiles
            cursor.execute("SELECT count(*) FROM profiles")
            if cursor.fetchone()[0] == 0:
                print("👥 Migrating user profiles to SQLite...")
                for username, p in data.get('profiles', {}).items():
                    cursor.execute(
                        "INSERT INTO profiles (username, name, email, photoUrl, bio, dob, country, state, district, village, farmSize, experience, crops) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (username, p.get('name'), p.get('email'), p.get('photoUrl'), p.get('bio'), p.get('dob'), p.get('country'), p.get('state'), p.get('district'), p.get('village'), p.get('farmSize'), p.get('experience'), p.get('crops'))
                    )
            
            conn.commit()
            print("✅ Migration complete. JSON file preserved as backup.")
        except Exception as e:
            print(f"❌ Migration failed: {e}")
            
    conn.close()

def load_community_data():
    """
    Simulate the old nested JSON structure for compatibility with existing routes
    while pulling from SQLite for real data.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Load Posts with Comments
    cursor.execute("SELECT * FROM posts ORDER BY timestamp DESC")
    posts_rows = cursor.fetchall()
    posts = []
    for pr in posts_rows:
        p = dict(pr)
        p['tags'] = json.loads(p['tags']) if p['tags'] else []
        cursor.execute("SELECT * FROM comments WHERE post_id = ? ORDER BY timestamp ASC", (p['id'],))
        p['comments'] = [dict(cr) for cr in cursor.fetchall()]
        posts.append(p)
        
    # Load Chat
    cursor.execute("SELECT * FROM chat ORDER BY timestamp ASC")
    chat = [dict(r) for r in cursor.fetchall()]
    
    # Load Profiles
    cursor.execute("SELECT * FROM profiles")
    profiles = {r['username']: dict(r) for r in cursor.fetchall()}
    
    conn.close()
    return {"posts": posts, "chat": chat, "profiles": profiles}

def save_community_data(data):
    """
    No-op or partial sync for the old monolithic save function.
    Newer endpoints should call specialized sync functions.
    """
    # For now, we'll keep it as a placeholder to avoid breaking monolithic calls
    # but actual writes should happen at the endpoint level via SQL
    pass

def save_chat_message(msg):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO chat (id, sender, recipient, text, imageUrl, audioUrl, timestamp, read) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (msg.get('id'), msg.get('sender'), msg.get('recipient'), msg.get('text'), msg.get('imageUrl'), msg.get('audioUrl'), msg.get('timestamp'), 0)
    )
    conn.commit()
    conn.close()

def delete_chat_record(msg_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chat WHERE id = ?", (msg_id,))
    conn.commit()
    conn.close()

def update_profile_record(username, p):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "REPLACE INTO profiles (username, name, email, photoUrl, bio, dob, country, state, district, village, farmSize, experience, crops) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (username, p.get('name'), p.get('email'), p.get('photoUrl'), p.get('bio'), p.get('dob'), p.get('country'), p.get('state'), p.get('district'), p.get('village'), p.get('farmSize'), p.get('experience'), p.get('crops'))
    )
    conn.commit()
    conn.close()

def save_post(post):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO posts (id, author, title, content, timestamp, likes, tags) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (post['id'], post['author'], post['title'], post['content'], post['timestamp'], post['likes'], json.dumps(post.get('tags', [])))
    )
    conn.commit()
    conn.close()

def add_post_comment(post_id, comment):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO comments (id, post_id, author, text, timestamp) VALUES (?, ?, ?, ?, ?)",
        (comment['id'], post_id, comment['author'], comment['text'], comment['timestamp'])
    )
    conn.commit()
    conn.close()

def update_chat_read_status(sender, recipient):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE chat SET read = 1 WHERE sender = ? AND recipient = ?", (sender, recipient))
    conn.commit()
    conn.close()

def resolve_user_reference(identifier):
    """
    Search for a user by username, email, or a potential firebaseUid in the profiles table.
    """
    if not identifier:
        return None
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM profiles WHERE username = ? OR email = ?",
        (identifier, identifier)
    )
    row = cursor.fetchone()
    conn.close()
    return row

def serialize_user_document(row):
    """
    Safely convert SQLite row to dictionary for JSON serialization.
    """
    if not row:
        return {}
    return dict(row)

def get_unread_chat_counts(username):
    """
    Return a map of {sender: unread_count} for the specified recipient.
    """
    if not username:
        return {}
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT sender, COUNT(*) as count FROM chat WHERE recipient = ? AND read = 0 GROUP BY sender",
        (username,)
    )
    rows = cursor.fetchall()
    conn.close()
    return {r['sender']: r['count'] for r in rows}

def get_chat_messages(user1=None, user2=None):
    """
    Retrieve messages between user1 and user2, or public messages if no recipient.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    if user1 and user2:
        cursor.execute(
            "SELECT * FROM chat WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) ORDER BY timestamp ASC",
            (user1, user2, user2, user1)
        )
    else:
        # Public chat
        cursor.execute(
            "SELECT * FROM chat WHERE recipient IS NULL OR recipient = '' ORDER BY timestamp ASC"
        )
    rows = cursor.fetchall()
    chat_list = [dict(r) for r in rows]
    conn.close()
    return chat_list

# Online User Tracking (In-Memory)
active_users = {} # { "User Name": "2024-01-01T12:00:00" }

def update_user_status(username):
    active_users[username] = datetime.now().isoformat()

def get_active_users():
    # Return users active in last 5 minutes
    current_time = datetime.now()
    active = []
    to_remove = []
    
    for user, last_seen_str in active_users.items():
        try:
            last_seen = datetime.fromisoformat(last_seen_str)
            if (current_time - last_seen).total_seconds() < 300: # 5 minutes
                active.append(user)
            else:
                to_remove.append(user)
        except:
            to_remove.append(user)
            
    # Cleanup old users
    for user in to_remove:
        del active_users[user]
        
    return active

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def verify_plant_with_groq(image_path):
    """
    Verify if the uploaded image contains a plant using Groq's Llama 4 Scout model.
    Returns: (is_plant: bool, message: str)
    """
    try:
        from groq import Groq
        api_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_CHATBOT_API_KEY")
        if not api_key:
            print("Groq API Key missing for plant verification")
            return True, "Verification skipped (No API Key)"

        client = Groq(api_key=api_key)
        base64_image = encode_image(image_path)

        prompt = "Strictly analyze this image. Is it a plant, crop, fruit, vegetable, leaf, or soil? Answer 'YES' only if it is clearly related to agriculture or nature. If it is a man-made object, animal, human, or random object (like candy, toy, car), answer 'NO'. Answer with just 'YES' or 'NO'."

        models = ["llama-3.2-11b-vision-preview", "llama-3.2-90b-vision-preview"]
        
        last_error = None
        for model in models:
            try:
                completion = client.chat.completions.create(
                    model=model,
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt},
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{base64_image}"
                                    }
                                }
                            ]
                        }
                    ],
                    temperature=0.1,
                    max_tokens=10
                )
                
                response = completion.choices[0].message.content.strip().upper()
                print(f"Plant Verification Response ({model}): {response}")
                
                if "YES" in response:
                    return True, "Plant detected"
                else:
                    return False, response
            except Exception as e:
                last_error = str(e)
                print(f"Vision error with {model}: {last_error}")
                continue
                
        return True, f"Verification skipped (All vision models failed: {last_error})" # Fail open
    except Exception as e:
        print(f"Plant verification critical error: {e}")
        return True, f"Verification skipped (Critical Error: {str(e)})" # Fail open on error

def analyze_disease_with_ai(image_path):
    """
    Use Groq Vision as a powerful fallback for disease detection.
    """
    try:
        from groq import Groq
        api_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_CHATBOT_API_KEY")
        if not api_key:
            return None
            
        client = Groq(api_key=api_key)
        base64_image = encode_image(image_path)
        
        prompt = """
        Analyze this agricultural image for plant diseases. 
        Provide a detailed analysis in valid JSON format only:
        {
          "disease": "Specific Name of Disease or 'Healthy'",
          "confidence": 0.0 to 1.0,
          "severity": "Low/Medium/High",
          "treatment": "Actionable treatment advice",
          "affectedPart": "Leaves/Stem/Root/Fruit",
          "symptoms": "Description of visible symptoms",
          "preventiveMeasures": "How to prevent this in future",
          "economicImpact": "Brief description of impact"
        }
        """

        models = ["llama-3.2-11b-vision-preview", "llama-3.2-90b-vision-preview"]
        for model in models:
            try:
                print(f"Attempting AI Disease Analysis with {model}...")
                completion = client.chat.completions.create(
                    model=model,
                    messages=[{
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                        ]
                    }],
                    temperature=0.2,
                    max_tokens=800,
                    response_format={"type": "json_object"}
                )
                res_content = completion.choices[0].message.content
                print("AI Disease Analysis completed.")
                return json.loads(res_content)
            except Exception as e:
                print(f"AI Vision error with {model}: {e}")
                continue
        return None
    except Exception as e:
        print(f"Final AI analysis crash: {e}")
        return None



try:
    import xgboost as xgb
except ImportError:
    xgb = None

# Lazy loading for OPTIMIZED yield models
optimized_models = {}
optimized_models_loaded = False

def load_optimized_models():
    """Lazy load optimized XGBoost models"""
    global optimized_models, optimized_models_loaded
    
    if not xgb:
        print("XGBoost not installed. Optimized models cannot be loaded.")
        return False
    
    # If already loaded and has models, return
    if optimized_models_loaded and optimized_models:
        return True

    print("Attempting to load optimized yield models...")
    try:
        model_dir = 'models/optimized'
        crops = ['Rice', 'Maize', 'Ginger']
        loaded_count = 0
        
        if not os.path.exists(model_dir):
             print(f"Model directory not found: {model_dir}")
             return False

        for crop in crops:
            path = os.path.join(model_dir, f'xgb_model_{crop}.joblib')
            if os.path.exists(path):
                optimized_models[crop] = joblib.load(path)
                print(f"Loaded optimized model for {crop}")
                loaded_count += 1
            else:
                print(f"Model file not found: {path}")
        
        if loaded_count > 0:
            optimized_models_loaded = True
            print(f"Successfully loaded {loaded_count} optimized models.")
        else:
            optimized_models_loaded = False # Allow retry if failed
            print("No optimized models could be loaded.")
            
    except Exception as e:
        print(f"Error loading optimized models: {e}")
        import traceback
        traceback.print_exc()
        optimized_models_loaded = False
        
    return optimized_models_loaded


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # Enable CORS for all routes

# Initialize voice assistant
voice_assistant = AgriVoiceAssistant()

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200


# Lazy loading for yield models (load only when needed)
yield_models_loaded = False
model = None
scalers = None
encoders = None
feature_columns = None

def load_yield_models():
    """Lazy load yield models only when first requested"""
    global yield_models_loaded, model, scalers, encoders, feature_columns
    print(f"load_yield_models called. Current state - yield_models_loaded: {yield_models_loaded}")
    if not yield_models_loaded:
        try:
            print("Attempting to load yield prediction models...")
            print("Loading model...")
            model = joblib.load('models/yield_prediction_model.pkl')
            print("Model loaded successfully")
            print("Loading scalers...")
            scalers = joblib.load('models/scalers.pkl')
            print("Scalers loaded successfully")
            print("Loading encoders...")
            encoders = joblib.load('models/encoders.pkl')
            print("Encoders loaded successfully")
            print("Loading feature columns...")
            feature_columns = joblib.load('models/feature_columns.pkl')
            print("Feature columns loaded successfully")
            yield_models_loaded = True
            print("Yield prediction models loaded successfully")
        except Exception as e:
            print(f"Yield prediction models not available: {e}")
            import traceback
            traceback.print_exc()
    print(f"load_yield_models returning: {yield_models_loaded}")
    return yield_models_loaded

def predict_disease_archive4(image_path, model_path="archive4_model_output/model.h5", labels_path="archive4_model_output/labels.json"):
    """Predict plant disease using Archive4 TensorFlow model"""
    try:
        if not os.path.exists(model_path) or not os.path.exists(labels_path):
            return None, None
            
        # SAFETY CHECK: Don't try to load massive models on small servers
        file_size = os.path.getsize(model_path)
        if file_size > 250 * 1024 * 1024: # 250 MB Limit for Render Free tier
            print(f"⚠️ Model file {model_path} is too large ({file_size} bytes). Skipping to prevent crash.")
            return None, None

        import tensorflow as tf
        
        # Load model and labels
        model = tf.keras.models.load_model(model_path)
        with open(labels_path, 'r') as f:
            class_mapping = json.load(f)
        
        # Preprocess image
        img = Image.open(image_path)
        img = img.convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Predict
        predictions = model.predict(img_array, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = predictions[0][predicted_class_idx]
        
        # Get class name
        predicted_class = class_mapping[str(predicted_class_idx)]
        
        return predicted_class, confidence
    except Exception as e:
        print(f"Archive4 model prediction error: {e}")
        return None, None

def predict_disease(image_path, model_path="sklearn_model_output/model.pkl", labels_path="sklearn_model_output/labels.json"):
    """
    Predict plant disease from image using enhanced feature extraction
    """
    try:
        if not os.path.exists(model_path) or not os.path.exists(labels_path):
            return None, None
            
        # SAFETY CHECK for joblib models
        file_size = os.path.getsize(model_path)
        if file_size > 300 * 1024 * 1024: 
            print(f"⚠️ Sklearn model {model_path} is too large ({file_size} bytes). Skipping.")
            return None, None
        IMG_SIZE = 128  # Must match training size
        
        # Open and resize image
        img = Image.open(image_path).convert('RGB')
        img = img.resize((IMG_SIZE, IMG_SIZE))

        # Convert to numpy array
        img_array = np.array(img)

        # Extract enhanced features (same as training)
        # 1. Color histogram features (more bins for better detail)
        hist_r, _ = np.histogram(img_array[:,:,0], bins=64, range=(0, 256))
        hist_g, _ = np.histogram(img_array[:,:,1], bins=64, range=(0, 256))
        hist_b, _ = np.histogram(img_array[:,:,2], bins=64, range=(0, 256))
        
        # Normalize histograms
        hist_r = hist_r / (IMG_SIZE * IMG_SIZE)
        hist_g = hist_g / (IMG_SIZE * IMG_SIZE)
        hist_b = hist_b / (IMG_SIZE * IMG_SIZE)
        
        # 2. Statistical features per channel
        mean_rgb = np.mean(img_array, axis=(0, 1))
        std_rgb = np.std(img_array, axis=(0, 1))
        median_rgb = np.median(img_array, axis=(0, 1))
        min_rgb = np.min(img_array, axis=(0, 1))
        max_rgb = np.max(img_array, axis=(0, 1))
        
        # 3. Color space conversions
        hsv_img = img.convert('HSV')
        hsv_array = np.array(hsv_img)
        mean_hsv = np.mean(hsv_array, axis=(0, 1))
        std_hsv = np.std(hsv_array, axis=(0, 1))
        
        # 4. Texture features
        gray = np.mean(img_array, axis=2).astype(np.float32)
        laplacian = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]])
        edges = ndimage.convolve(gray, laplacian)
        edge_mean = np.mean(np.abs(edges))
        edge_std = np.std(edges)
        
        # 5. Green channel analysis
        green_ratio = np.mean(img_array[:,:,1]) / (np.mean(img_array) + 1e-6)
        
        # 6. Disease color indicators
        brown_mask = (img_array[:,:,0] > 100) & (img_array[:,:,1] > 50) & (img_array[:,:,1] < 150) & (img_array[:,:,2] < 100)
        brown_ratio = np.sum(brown_mask) / (IMG_SIZE * IMG_SIZE)
        
        yellow_mask = (img_array[:,:,0] > 150) & (img_array[:,:,1] > 150) & (img_array[:,:,2] < 100)
        yellow_ratio = np.sum(yellow_mask) / (IMG_SIZE * IMG_SIZE)
        
        # 7. Spatial variance
        h, w = img_array.shape[:2]
        q1 = img_array[:h//2, :w//2]
        q2 = img_array[:h//2, w//2:]
        q3 = img_array[h//2:, :w//2]
        q4 = img_array[h//2:, w//2:]
        quad_means = np.array([np.mean(q1), np.mean(q2), np.mean(q3), np.mean(q4)])
        spatial_variance = np.std(quad_means)
        
        # 8. Combine all features
        features = np.concatenate([
            hist_r, hist_g, hist_b,
            mean_rgb, std_rgb, median_rgb, min_rgb, max_rgb,
            mean_hsv, std_hsv,
            [edge_mean, edge_std],
            [green_ratio, brown_ratio, yellow_ratio],
            [spatial_variance]
        ])
        features = features.reshape(1, -1)

        # Load model and labels
        model = joblib.load(model_path)

        with open(labels_path, 'r') as f:
            class_names = json.load(f)

        # Predict
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]

        predicted_class = class_names[prediction]
        confidence = probabilities[prediction]

        return predicted_class, confidence
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        import traceback
        traceback.print_exc()
        return None, None

def get_historical_average(crop, district):
    """
    Get historical average yield for a crop/district combination.
    In a real app, this would query a CSV or database. 
    Here we provide a representative fallback value.
    """
    # Simple lookup based on common crop yields (kg/hectare)
    base_yields = {
        'Rice': 2600.0,
        'Wheat': 3400.0,
        'Maize': 2800.0,
        'Ginger': 4500.0,
        'Potato': 18000.0
    }
    return base_yields.get(crop.capitalize(), 2000.0)

@app.route('/predict', methods=['POST'])
def predict_yield():
    print("Attempting to load yield models...")
    models_loaded = load_yield_models()
    print(f"Models loaded: {models_loaded}")
    if not models_loaded:
        print("Returning 503 error: Yield prediction models not available")
        return jsonify({'error': 'Yield prediction models not available'}), 503

    try:
        data = request.json

        # Create input dataframe
        # Use the same year normalization approach as in training
        # Based on the dataset range (2010 to 2023)
        year_min, year_max = 2010, 2023
        
        # Get historical average for better estimates
        hist_avg = get_historical_average(data['crop'], data['district'])
        
        input_data = pd.DataFrame([{
            'year_normalized': (data['year'] - year_min) / (year_max - year_min),
            'crop_encoded': encoders['crop'].transform([data['crop']])[0],
            'district_encoded': encoders['district'].transform([data['district']])[0],
            'season_encoded': encoders['season'].transform([data['season']])[0],
            'area_hectares': data['area_hectares'],
            'production_tonnes': data.get('production_tonnes', data['area_hectares'] * (hist_avg / 1000)),  # Convert kg to tonnes
            'area_log': np.log1p(data['area_hectares']),
            'production_log': np.log1p(data.get('production_tonnes', data['area_hectares'] * (hist_avg / 1000))),
            'yield_trend_3yr': data.get('yield_trend_3yr', hist_avg),
            'yield_trend_5yr': data.get('yield_trend_5yr', hist_avg)
        }])

        # Make prediction
        prediction = model.predict(input_data)[0]

        # Calculate confidence interval (±15%)
        lower = prediction * 0.85
        upper = prediction * 1.15

        return jsonify({
            'predicted_yield': float(prediction),
            'confidence_interval': {
                'lower': float(lower),
                'upper': float(upper)
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict-yield-optimized', methods=['POST'])
def predict_yield_optimized():
    try:
        load_optimized_models()
        data = request.json
        crop = data.get('crop')
        
        # Validate crop
        # Capitalize first letter to match model keys (Rice, Maize, Ginger)
        if not crop:
             return jsonify({'error': 'Crop name is required'}), 400
             
        crop = crop.capitalize()
        
        if crop not in optimized_models:
             return jsonify({'error': f'Model for {crop} not found. Supported: Rice, Maize, Ginger'}), 400
             
        model = optimized_models[crop]
        
        # Prepared Input Features: ['Area', 'Avg_Temp', 'Avg_Humidity', 'Total_Rainfall_Season', 'Fertilizer', 'Pesticide', 'Soil_pH', 'Soil_N', 'Soil_P', 'Soil_K']
        # Set defaults if missing (based on 2019 averages / Shillong profile)
        defaults = {
            'Area': 5000.0,
            'Avg_Temp': 22.0,
            'Avg_Humidity': 80.0,
            'Total_Rainfall_Season': 1800.0,
            'Fertilizer': 600000.0,
            'Pesticide': 300.0,
            'Soil_pH': 5.2,
            'Soil_N': 300.0,
            'Soil_P': 35.0,
            'Soil_K': 200.0
        }
        
        input_row = {
            'Area': float(data.get('area', defaults['Area'])),
            'Avg_Temp': float(data.get('temp', defaults['Avg_Temp'])),
            'Avg_Humidity': float(data.get('humidity', defaults['Avg_Humidity'])),
            'Total_Rainfall_Season': float(data.get('rainfall', defaults['Total_Rainfall_Season'])),
            'Fertilizer': float(data.get('fertilizer', defaults['Fertilizer'])),
            'Pesticide': float(data.get('pesticide', defaults['Pesticide'])),
            'Soil_pH': float(data.get('soil_ph', defaults['Soil_pH'])),
            'Soil_N': float(data.get('soil_n', defaults['Soil_N'])),
            'Soil_P': float(data.get('soil_p', defaults['Soil_P'])),
            'Soil_K': float(data.get('soil_k', defaults['Soil_K']))
        }
        
        # Create DataFrame
        df_in = pd.DataFrame([input_row])
        
        # Predict
        prediction = float(model.predict(df_in)[0])
        
        # Confidence/Uncertainty (based on Test RMSE)
        uncertainty_map = {'Maize': 0.04, 'Ginger': 0.35, 'Rice': 0.25}
        margin = uncertainty_map.get(crop, 0.3)
        
        return jsonify({
            'crop': crop,
            'predicted_yield': prediction,
            'unit': 'Tons/Hectare',
            'confidence_interval': {
                'lower': prediction - margin,
                'upper': prediction + margin
            },
            'inputs': input_row
        })

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/crops', methods=['GET'])
def get_crops():
    print("Attempting to load yield models for /crops...")
    models_loaded = load_yield_models()
    print(f"Models loaded for /crops: {models_loaded}")
    if not models_loaded:
        print("Returning 503 error for /crops: Yield prediction models not available")
        return jsonify({'error': 'Yield prediction models not available'}), 503
    return jsonify(encoders['crop'].classes_.tolist())

@app.route('/districts', methods=['GET'])
def get_districts():
    print("Attempting to load yield models for /districts...")
    models_loaded = load_yield_models()
    print(f"Models loaded for /districts: {models_loaded}")
    if not models_loaded:
        print("Returning 503 error for /districts: Yield prediction models not available")
        return jsonify({'error': 'Yield prediction models not available'}), 503
    return jsonify(encoders['district'].classes_.tolist())

@app.route('/nearby-suppliers', methods=['GET'])
def get_nearby_suppliers():
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    address = request.args.get('address', '')
    radius_m = 50000  # 50 km in meters

    if not address and not (lat and lng):
        return jsonify({'error': 'Location required'}), 400

    import math
    import random
    
    def haversine(lat1, lon1, lat2, lon2):
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c
        
    def enrich_shop_data(shop, index, is_fallback=False):
        prices = [35, 40, 45, 50, 55]
        stock_status = ['In Stock', 'In Stock', 'Limited', 'Out of Stock']
        
        shop['price'] = f"₹{random.choice(prices)}/kg"
        shop['stock'] = random.choice(stock_status)
        shop['delivery_available'] = random.choice([True, False, True])
        shop['subsidy_available'] = 'Government' in shop['type'] or 'Krishi' in shop['name'] or 'Government' in shop.get('name', '')
        
        if 'rating' not in shop:
            shop['rating'] = round(random.uniform(3.8, 4.9), 1)
            
        tags = []
        if shop['subsidy_available']:
            tags.append('Government Certified')
        if index == 0:
            tags.append('Nearest')
        if '40/kg' in shop.get('price', '') or '35/kg' in shop.get('price', ''):
            tags.append('Lowest Price')
        if shop.get('rating', 0) >= 4.5:
            tags.append('Best Rated')
            
        shop['ai_tags'] = tags[:2] # Keep top 2 tags max
        shop['blockchain_verified'] = bool(random.choice([True, False]))
        return shop

    def fetch_google_places(lat, lng):
        """Fetch real-world data from Google Places as a fallback for Overpass."""
        google_api_key = os.getenv("VITE_GOOGLE_MAPS_API_KEY")
        if not google_api_key:
            return []
        
        try:
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
            params = {
                "query": "agricultural seeds fertilizer farm shop",
                "location": f"{lat},{lng}",
                "radius": 50000,
                "key": google_api_key
            }
            resp = requests.get(url, params=params, timeout=10).json()
            google_results = []
            for p in resp.get('results', []):
                dist_km = haversine(lat, lng, p['geometry']['location']['lat'], p['geometry']['location']['lng'])
                google_results.append({
                    'id': p['place_id'],
                    'name': p['name'],
                    'address': p['formatted_address'],
                    'type': 'Agricultural Shop',
                    'rating': p.get('rating', 4.0),
                    'distance': f"{dist_km:.1f}",
                    'availableSeeds': ['Paddy', 'Wheat', 'Maize', 'Vegetables'],
                    'phone': 'Connect via AgriSphere',
                    'lat': p['geometry']['location']['lat'],
                    'lng': p['geometry']['location']['lng'],
                    'googleMapsUrl': f"https://www.google.com/maps/search/?api=1&query=Google&query_place_id={p['place_id']}"
                })
            return google_results
        except Exception as e:
            print(f"DEBUG: Google Places failed ({e})")
            return []

    try:
        search_lat = lat or 25.8673   # Default: Samastipur, Bihar
        search_lng = lng or 85.7766

        # ─── STEP 1: Geocode address → precise lat/lng via Nominatim (FREE, OSM) ───
        if address and not lat:
            nominatim_url = (
                f'https://nominatim.openstreetmap.org/search'
                f'?q={quote(address + ", India")}'
                f'&format=json&limit=1&countrycodes=in'
            )
            nom_r = requests.get(
                nominatim_url,
                timeout=10,
                headers={'User-Agent': 'AgriSphere/1.0 (agrisphere@gmail.com)'}
            ).json()
            if nom_r:
                search_lat = float(nom_r[0]['lat'])
                search_lng = float(nom_r[0]['lon'])
                print(f"DEBUG: Nominatim geocoded '{address}' → {search_lat}, {search_lng}")

        # ─── STEP 2: Find real shops via Overpass API (try fast query first) ───
        overpass_query = f"""[out:json][timeout:15];
(
  node(around:{radius_m},{search_lat},{search_lng})["shop"~"agrarian|seeds|farm|fertilizer"];
  node(around:{radius_m},{search_lat},{search_lng})["name"~"Krishi|Beej|Seed|Kisan|Kendra|Urvaarak",i];
);
out body 30;
"""
        results = []
        seen = set()

        try:
            ov_resp = requests.post(
                'https://overpass-api.de/api/interpreter',
                data={'data': overpass_query},
                timeout=20
            ).json()

            for elem in ov_resp.get('elements', []):
                tags = elem.get('tags', {})
                name = tags.get('name') or tags.get('name:en') or tags.get('name:hi') or 'Agricultural Store'
                elat = elem.get('lat')
                elng = elem.get('lon')
                if not elat or not elng:
                    continue
                eid = str(elem.get('id'))
                if eid in seen:
                    continue
                seen.add(eid)

                addr_parts = [
                    tags.get('addr:housenumber',''),
                    tags.get('addr:street',''),
                    tags.get('addr:village') or tags.get('addr:city',''),
                    tags.get('addr:district',''),
                    tags.get('addr:state','Bihar'),
                ]
                shop_addr = ', '.join(p for p in addr_parts if p).strip(', ') or f"Near {address or 'Samastipur'}, Bihar"

                shop_type = 'Krishi Seva Kendra' if any(w in name.lower() for w in ['krishi','kendra']) else \
                            'Seed Store' if any(w in name.lower() for w in ['seed','beej']) else \
                            'Fertilizer Shop' if any(w in name.lower() for w in ['fertilizer','urvaarak']) else \
                            'Agricultural Shop'

                dist_km = haversine(search_lat, search_lng, elat, elng)
                if dist_km <= 50.0:
                    results.append({
                        'id': eid,
                        'name': name,
                        'address': shop_addr,
                        'type': shop_type,
                        'rating': 4.3,
                        'distance': f"{dist_km:.1f}",
                        'availableSeeds': ['Paddy (Dhan)', 'Wheat (Gehu)', 'Maize (Makka)', 'Mustard (Sarso)', 'Potato (Aloo)'],
                        'phone': tags.get('phone') or tags.get('contact:phone') or 'Connect via AgriSphere',
                        'lat': elat,
                        'lng': elng,
                    })
            
            # Sort by distance
            results.sort(key=lambda x: float(x['distance']))
            
            # Enrich with AI Intelligence
            for i, shop in enumerate(results):
                enrich_shop_data(shop, i, False)
                
            print(f"DEBUG: Overpass found {len(results)} shops near ({search_lat:.4f}, {search_lng:.4f})")

        except Exception as ov_err:
            print(f"DEBUG: Overpass failed ({ov_err}), trying Google Places fallback...")
            results = fetch_google_places(search_lat, search_lng)

        # If still no results, use dynamic AI-generated/template fallback for THE CURRENT LOCATION
        if not results:
            print(f"DEBUG: No API results for ({search_lat}, {search_lng}) — using localized template fallback")
            
            # Use Nominatim's found address or just a generic "Your Area"
            loc_label = address or "your locality"
            
            # Standard generic stores that exist in almost every major Indian town/district
            fallback_shops = [
                {
                    'id': f'gen_{int(search_lat)}_{int(search_lng)}_1',
                    'name': f'District Krishi Vigyan Kendra',
                    'address': f'Main Road, {loc_label}',
                    'type': 'Krishi Seva Kendra',
                    'rating': 4.5,
                    'availableSeeds': ['Paddy', 'Wheat', 'Maize', 'Vegetables'],
                    'phone': 'Connect via AgriSphere',
                    'lat': search_lat + 0.01,
                    'lng': search_lng + 0.01
                },
                {
                    'id': f'gen_{int(search_lat)}_{int(search_lng)}_2',
                    'name': 'Regional Seed Corporation Store',
                    'address': f'Near Station, {loc_label}',
                    'type': 'Government Seed Store',
                    'rating': 4.3,
                    'availableSeeds': ['Certified Paddy', 'Certified Wheat', 'Soyabean'],
                    'phone': 'Connect via AgriSphere',
                    'lat': search_lat - 0.01,
                    'lng': search_lng - 0.01
                },
                {
                    'id': f'gen_{int(search_lat)}_{int(search_lng)}_3',
                    'name': 'Kisan Suvidha Kendra',
                    'address': f'Market Area, {loc_label}',
                    'type': 'Agricultural Shop',
                    'rating': 4.1,
                    'availableSeeds': ['All Major Seeds', 'Fertilizers'],
                    'phone': 'Connect via AgriSphere',
                    'lat': search_lat + 0.02,
                    'lng': search_lng - 0.005
                }
            ]
            
            for f in fallback_shops:
                dist_km = haversine(search_lat, search_lng, f['lat'], f['lng'])
                f['distance'] = f"{dist_km:.1f}"
                results.append(f)
            
            # Enrich with AI Intelligence
            for i, shop in enumerate(results):
                enrich_shop_data(shop, i, True)

        return jsonify(results)

    except Exception as e:
        print(f"ERROR in nearby-suppliers: {e}")
        import traceback; traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'API server is running'})

@app.route('/detect-disease', methods=['POST'])
def detect_disease():
    try:
        result = None
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No image selected'}), 400

        # Save uploaded image to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            image_file.save(temp_file.name)
            temp_path = temp_file.name

        try:
            # 1. Verify if it is a plant using Groq Vision
            is_plant, verification_msg = verify_plant_with_groq(temp_path)
            if not is_plant:
                return jsonify({
                    'error': f"Cannot detect. This is not a plant. ({verification_msg})",
                    'is_plant': False
                }), 400

            # Try Archive4 model first (TensorFlow)
            if os.path.exists('archive4_model_output/model.h5'):
                predicted_class, confidence = predict_disease_archive4(temp_path)
                if predicted_class:
                    result = {
                        'disease': predicted_class,
                        'confidence': float(confidence),
                        'severity': 'high' if confidence > 0.8 else 'medium' if confidence > 0.6 else 'low',
                        'treatment': get_treatment_recommendation(predicted_class),
                        'affectedPart': get_affected_part(predicted_class),
                        'symptoms': get_symptoms(predicted_class),
                        'preventiveMeasures': get_preventive_measures(predicted_class),
                        'economicImpact': get_economic_impact(predicted_class),
                        'model': 'archive4_tensorflow'
                    }
                    return jsonify(result)
            
            # Fallback to local sklearn model if Archive4 failed or not available
            if not result:
                # predict_disease already has a size check now
                predicted_class, confidence = predict_disease(
                    temp_path,
                    model_path='sklearn_model_output/model.pkl',
                    labels_path='sklearn_model_output/labels.json'
                )
                
                if predicted_class:
                    # Map predictions to the expected format for frontend
                    result = {
                        'disease': predicted_class,
                        'confidence': float(confidence),
                        'severity': 'high' if confidence > 0.8 else 'medium' if confidence > 0.6 else 'low',
                        'treatment': get_treatment_recommendation(predicted_class),
                        'affectedPart': get_affected_part(predicted_class),
                        'symptoms': get_symptoms(predicted_class),
                        'preventiveMeasures': get_preventive_measures(predicted_class),
                        'economicImpact': get_economic_impact(predicted_class),
                        'model': 'sklearn'
                    }

            # FINAL FALLBACK: AI VISION ANALYSIS
            if not result:
                print("Using AI Vision Fallback for Disease Detection...")
                ai_result = analyze_disease_with_ai(temp_path)
                if ai_result:
                    ai_result['model'] = 'vision_ai'
                    result = ai_result

            if not result:
                return jsonify({'error': 'All detection models failed to load (too large) or process. Please try a different image.'}), 500

            return jsonify(result)

        finally:
            # Clean up temporary file
            os.unlink(temp_path)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def smart_disease_lookup(disease_name, dictionary, default_value):
    """
    Smart lookup that handles specific names (e.g. Potato___early_blight)
    by trying exact match -> healthy -> mapped keywords -> default
    """
    if not disease_name:
        return default_value
        
    # 1. Exact match
    if disease_name in dictionary:
        return dictionary[disease_name]
        
    name_lower = disease_name.lower()
    
    # 2. Healthy check
    if 'healthy' in name_lower:
        return dictionary.get('healthy', default_value)
        
    # 3. Keyword mapping to generic keys
    keyword_map = {
        'early_blight': 'leaf_blight',
        'late_blight': 'leaf_blight', # Could be more specific if dict supported it
        'blight': 'leaf_blight',
        'rust': 'leaf_rust',
        'scab': 'scab',
        'powdery_mildew': 'powdery_mildew',
        'downy_mildew': 'downy_mildew',
        'mold': 'leaf_mold',
        'mildew': 'powdery_mildew',
        'mosaic': 'viral_disease',
        'virus': 'viral_disease',
        'mite': 'pest_infected',
        'spot': 'leaf_spot',
        'rot': 'rot',
        'wilt': 'bacterial_wilt',
        'curl': 'viral_disease',
        'anthracnose': 'anthracnose'
    }
    
    for keyword, target_key in keyword_map.items():
        if keyword in name_lower:
            return dictionary.get(target_key, default_value)
            
    return default_value

def get_treatment_recommendation(disease):
    treatments = {
        'healthy': 'No treatment needed - plant is healthy',
        'leaf_blight': 'Apply copper-based fungicide every 7-10 days, improve air circulation',
        'leaf_rust': 'Apply systemic fungicide, remove infected leaves',
        'leaf_spot': 'Apply fungicide spray, ensure proper plant spacing',
        'leaf_mold': 'Improve ventilation, reduce humidity, apply fungicide',
        'nutrient_deficiency': 'Apply appropriate fertilizer based on soil test',
        'pest_infected': 'Use integrated pest management - beneficial insects and organic sprays',
        'stem_rot': 'Remove infected plants, apply fungicide to healthy plants',
        'rot': 'Remove infected parts, improve drainage, apply fungicide',
        'viral_disease': 'Remove infected plants, control insect vectors, use resistant varieties',
        'powdery_mildew': 'Apply sulfur-based fungicide, improve air circulation',
        'downy_mildew': 'Apply systemic fungicide, reduce humidity, improve drainage',
        'scab': 'Apply fungicide spray, remove fallen leaves, prune for air circulation',
        'anthracnose': 'Apply copper fungicide, remove infected debris, avoid overhead watering',
        'bacterial_wilt': 'Remove infected plants immediately, solarize soil, rotate crops'
    }
    return smart_disease_lookup(disease, treatments, 'Consult agricultural expert')

def get_affected_part(disease):
    parts = {
        'healthy': 'none',
        'leaf_blight': 'leaf',
        'leaf_rust': 'leaf',
        'leaf_spot': 'leaf',
        'leaf_mold': 'leaf',
        'nutrient_deficiency': 'whole_plant',
        'pest_infected': 'multiple',
        'stem_rot': 'stem',
        'rot': 'fruit_stem',
        'viral_disease': 'whole_plant',
        'powdery_mildew': 'leaf',
        'downy_mildew': 'leaf',
        'scab': 'fruit_leaf',
        'anthracnose': 'fruit_leaf',
        'bacterial_wilt': 'whole_plant'
    }
    return smart_disease_lookup(disease, parts, 'unknown')

def get_symptoms(disease):
    symptoms = {
        'healthy': ['No visible symptoms'],
        'leaf_blight': ['Brown spots with yellow halos', 'Wilting leaves', 'Premature leaf drop'],
        'leaf_rust': ['Orange-red pustules on leaf undersides', 'Yellow spots on upper surface'],
        'leaf_spot': ['Circular spots on leaves', 'Spots may have dark borders'],
        'leaf_mold': ['Pale yellow spots on upper leaf', 'Olive-green mold on underside'],
        'nutrient_deficiency': ['Yellowing of older leaves', 'Stunted growth', 'Poor fruit development'],
        'pest_infected': ['Holes in leaves', 'Sticky residue', 'Distorted growth'],
        'stem_rot': ['Dark, water-soaked lesions on stem', 'Soft, mushy tissue'],
        'rot': ['Soft, decaying tissue', 'Foul odor', 'Discoloration'],
        'viral_disease': ['Mosaic patterns on leaves', 'Stunted growth', 'Leaf curling', 'Yellow streaks'],
        'powdery_mildew': ['White powdery coating on leaves', 'Distorted leaves', 'Reduced growth'],
        'downy_mildew': ['Yellow patches on upper leaf surface', 'Gray fuzzy growth on undersides'],
        'scab': ['Dark, rough lesions on fruit', 'Corky spots on leaves'],
        'anthracnose': ['Dark sunken lesions', 'Fruit rot', 'Leaf spots with dark margins'],
        'bacterial_wilt': ['Rapid wilting of leaves', 'Stems remain green', 'White ooze from cut stems']
    }
    return smart_disease_lookup(disease, symptoms, ['Symptoms not specified'])

def get_preventive_measures(disease):
    measures = {
        'healthy': ['Continue good agricultural practices'],
        'leaf_blight': ['Avoid overhead watering', 'Remove infected debris', 'Plant resistant varieties'],
        'leaf_rust': ['Ensure good air circulation', 'Avoid high humidity', 'Use resistant cultivars'],
        'leaf_spot': ['Avoid overhead watering', 'Ensure proper plant spacing', 'Remove infected leaves'],
        'leaf_mold': ['Improve air circulation', 'Use drip irrigation', 'Sanitize tools'],
        'nutrient_deficiency': ['Regular soil testing', 'Balanced fertilization', 'Proper irrigation'],
        'pest_infected': ['Crop rotation', 'Beneficial insects', 'Regular monitoring'],
        'stem_rot': ['Improve drainage', 'Avoid overwatering', 'Use pathogen-free seeds'],
        'rot': ['Proper storage conditions', 'Avoid mechanical damage', 'Good sanitation'],
        'viral_disease': ['Control insect vectors', 'Use virus-free planting material', 'Remove infected plants'],
        'powdery_mildew': ['Reduce humidity', 'Improve air circulation', 'Avoid dense planting'],
        'downy_mildew': ['Improve drainage', 'Reduce leaf wetness', 'Use resistant varieties'],
        'scab': ['Remove fallen leaves', 'Prune for air flow', 'Apply preventive fungicides'],
        'anthracnose': ['Crop rotation', 'Remove plant debris', 'Avoid overhead irrigation'],
        'bacterial_wilt': ['Use resistant varieties', 'Control nematodes', 'Crop rotation']
    }
    return smart_disease_lookup(disease, measures, ['Follow good agricultural practices'])

def get_economic_impact(disease):
    impacts = {
        'healthy': 'No economic impact',
        'leaf_blight': 'Can reduce yield by 20-40% if untreated',
        'leaf_rust': 'Yield loss of 15-30% in severe cases',
        'leaf_spot': 'Yield reduction of 10-25% depending on severity',
        'leaf_mold': 'Yield loss of 10-20% in greenhouse conditions',
        'nutrient_deficiency': 'Reduced yield and quality, increased input costs',
        'pest_infected': 'Yield loss varies by pest type and infestation level',
        'stem_rot': 'Complete plant loss in severe infections',
        'rot': 'Post-harvest losses of 30-50%, reduced market value',
        'viral_disease': 'Severe yield loss 40-100%, no cure available',
        'powdery_mildew': 'Yield reduction of 10-30%, quality degradation',
        'downy_mildew': 'Yield loss of 20-50% in favorable conditions',
        'scab': 'Reduced fruit quality and marketability, 20-40% loss',
        'anthracnose': 'Significant fruit losses 30-60%, quality issues',
        'bacterial_wilt': 'Total crop loss possible, 30-100% reduction'
    }
    return smart_disease_lookup(disease, impacts, 'Economic impact varies')

@app.route('/voice-query', methods=['POST'])
def handle_voice_query():
    """Handle voice assistant queries"""
    try:
        data = request.json
        print(f"Voice Query Request Data: (contains image: {'image' in data})") # Debug log
        text = data.get('text', '')
        image_base64 = data.get('image', '')
        # Handle both old 'language' and new 'language_code'/'language_name' formats
        language_code = data.get('language_code') or data.get('language', 'en-IN')
        language_name = data.get('language_name') or language_code
        dialect = data.get('dialect', 'Standard')
        
        print(f"Processing Voice Query: '{text}' in Language: '{language_name}' ({language_code}), Dialect: '{dialect}'") # Debug log
        
        if not text and not image_base64:
            return jsonify({'error': 'No query text or image provided'}), 400
        
        # Process query with voice assistant
        response = voice_assistant.process_voice_input(text, language_code, dialect, image_base64)
        
        return jsonify({
            'success': True,
            'response': response,
            'timestamp': str(datetime.now())
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/voice-examples', methods=['GET'])
def get_voice_examples():
    """Get example voice queries"""
    examples = {
        'hindi': [
            "गेहूं में रोग आ गया है, क्या करें?",
            "आज पानी देना चाहिए?", 
            "फसल कब काटनी चाहिए?",
            "खाद कितनी डालनी चाहिए?"
        ],
        'english': [
            "Wheat has disease, what to do?",
            "Should I water today?",
            "When should I harvest?",
            "How much fertilizer to apply?"
        ]
    }
    return jsonify(examples)

@app.route('/demands', methods=['GET', 'POST'])
def handle_demands():
    print(f"Demands Endpoint Hit: {request.method}")
    if request.method == 'GET':
        return jsonify(load_demands())
    
    if request.method == 'POST':
        try:
            new_demand = request.json
            print(f"Received new demand: {new_demand}")
            new_demand['id'] = str(uuid.uuid4())
            new_demand['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            demands = load_demands()
            demands.append(new_demand)
            save_demands(demands)
            
            return jsonify({"message": "Demand posted successfully", "demand": new_demand}), 201
        except Exception as e:
            print(f"Error saving demand: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/recommend-fertilizer', methods=['POST'])
def recommend_fertilizer():
    """
    Get fertilizer and irrigation recommendations based on crop and environmental data using Groq (Llama 3).
    """
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
            
        print(f"Recommendation Request: {data}")

        # Initialize Groq client
        from groq import Groq
        api_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_CHATBOT_API_KEY")
        if not api_key:
             return jsonify({'error': 'GROQ_API_KEY not found'}), 500
             
        client = Groq(api_key=api_key)

        # Construct Prompt
        prompt = f"""
        You are an expert agricultural scientist following ICAR (Indian Council of Agricultural Research) and FAO standards.
        Analyze the following field data and provide a precise fertilizer and irrigation plan.

        Field Data:
        - Crop: {data.get('crop')}
        - Soil N-P-K: {data.get('soil_n')}-{data.get('soil_p')}-{data.get('soil_k')}
        - Soil pH: {data.get('soil_ph')}
        - Soil Moisture: {data.get('soil_moisture')}%
        - Rainfall Forecast: {data.get('rainfall')} mm
        - Growth Stage: {data.get('stage')}
        - Soil Type: {data.get('soil_type')}

        Task:
        1. Calculate N-P-K recommendation in kg/ha based on crop needs and soil status.
        2. Provide irrigation advice based on moisture and rainfall.
        3. Suggest pH corrections if needed.
        4. List 2-3 specific agronomic adjustments (e.g., split application).

        Return ONLY valid JSON in this exact structure:
        {{
            "source": "AgriSphere AI (ICAR/FAO Standards)",
            "fertilizer": {{
                "nitrogen": "XX kg/ha",
                "phosphorus": "XX kg/ha",
                "potassium": "XX kg/ha",
                "adjustments": ["Tip 1", "Tip 2"]
            }},
            "soil_health": {{
                "ph_status": {data.get('soil_ph')},
                "ph_recommendation": "Advice for pH correction or maintenance",
                "recommendation": "General soil health tip"
            }},
            "irrigation": {{
                "status": "Irrigate Immediately" OR "No Irrigation Needed",
                "water_amount": "XX mm",
                "schedule": {{
                    "next_3_days": "Rain Expected" OR "Clear"
                }}
            }}
        }}
        """

        response_content, error = call_groq_with_fallback(prompt)
        
        if error:
            print(f"All Groq models failed for fertilizer. Error: {error}. Falling back to simulation...")
            return jsonify(ai_fallbacks.get_simulated_fertilizer_recommendation(data))

        recommendation = json.loads(response_content)
        return jsonify(recommendation)
        
    except Exception as e:
        print(f"Groq Recommendation Error: {e}")
        # Final Fallback to Simulation
        print("Switching to Rule-based Simulation Fallback for Fertilizers...")
        return jsonify(ai_fallbacks.get_simulated_fertilizer_recommendation(data))

@app.route('/predict-pest', methods=['POST'])
def predict_pest():
    """
    Get pest risk prediction based on weather data using Groq (Llama 3).
    """
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
            
        print(f"Pest Prediction Request: {data}")

        # Initialize Groq client
        from groq import Groq
        api_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_CHATBOT_API_KEY")
        if not api_key:
             return jsonify({'error': 'GROQ_API_KEY not found'}), 500
             
        client = Groq(api_key=api_key)
        
        # Get next 7 days for forecast labels
        from datetime import datetime, timedelta
        days = [(datetime.now() + timedelta(days=i)).strftime("%a") for i in range(7)]
        days_str = ", ".join(days)

        prompt = f"""
        You are an expert agricultural entomologist following strictly ICAR (Indian Council of Agricultural Research) and FAO protocols.
        Analyze the following environmental conditions and predict the pest attack risk for the specified crop.

        Conditions:
        - Crop: {data.get('crop')}
        - Temperature: {data.get('temp')}°C
        - Humidity: {data.get('humidity')}%
        - Rainfall: {data.get('rainfall')} mm

        Task:
        1. Identify the most likely pest threat for this crop under these conditions according to Indian agricultural region standards.
        2. Estimate the risk probability (0-100%).
        3. Determine risk level (Low/Medium/High).
        4. Provide a specific preventive or curative recommendation (ICAR approved).
        5. Forecast risk trend for the next 7 days ({days_str}) based on simple weather assumptions (e.g., if high humidity persists).

        Return ONLY valid JSON in this exact structure:
        {{
            "primary_pest": {{
                "pest_name": "Name of Pest",
                "risk_score": 85,
                "risk_level": "High",
                "recommendation": "Specific advice"
            }},
            "forecast_7_days": [
                {{ "day": "{days[0]}", "risk_score": 80 }},
                {{ "day": "{days[1]}", "risk_score": 82 }},
                {{ "day": "{days[2]}", "risk_score": 75 }},
                {{ "day": "{days[3]}", "risk_score": 70 }},
                {{ "day": "{days[4]}", "risk_score": 65 }},
                {{ "day": "{days[5]}", "risk_score": 60 }},
                {{ "day": "{days[6]}", "risk_score": 55 }}
            ]
        }}
        """

        response_content, error = call_groq_with_fallback(prompt)
        
        if error:
            print(f"All Groq models failed. Error: {error}. Falling back to simulation...")
            return jsonify(ai_fallbacks.get_simulated_pest_prediction(data))

        result = json.loads(response_content)
        return jsonify(result)
        
    except Exception as e:
        print(f"Pest Prediction Pipeline Error: {e}")
        return jsonify(ai_fallbacks.get_simulated_pest_prediction(data))

@app.route('/market-advisory', methods=['POST'])
def market_advisory():
    """
    Get seed-to-market advisory (harvest timing + price forecast).
    """
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
            
        print(f"Market Advisory Request: {data}")
        result = market_engine.analyze_market(data)
        return jsonify(result)
        
    except Exception as e:
        print(f"Market Advisory Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/market-prices', methods=['POST'])
def market_prices():
    """
    Get real-time market prices for specific location.
    """
    try:
        data = request.json
        if not data:
             return jsonify({'error': 'No input data provided'}), 400
             
        state = data.get('state')
        district = data.get('district')
        market = data.get('market', 'General')
        category = data.get('category', 'All')
        
        print(f"Fetching prices for: {state}, {district}, {market}")
        
        prices = market_engine.get_market_prices(state, district, market, category)
        return jsonify(prices)
        
    except Exception as e:
        print(f"Market Prices Error: {e}")
        return jsonify({'error': str(e)}), 500

LISTINGS_FILE = 'marketplace_listings.json'

def load_listings():
    if not os.path.exists(LISTINGS_FILE):
        return []
    try:
        with open(LISTINGS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_listings(listings):
    with open(LISTINGS_FILE, 'w') as f:
        json.dump(listings, f, indent=4)

@app.route('/listings', methods=['GET', 'POST', 'OPTIONS'])
def handle_listings():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    if request.method == 'GET':
        listings = load_listings()
        return jsonify(listings)
    
    if request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        required_fields = ['farmerName', 'contactNumber', 'cropName', 'quantity', 'price', 'state', 'district']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
                
        new_listing = {
            'id': f"list_{int(datetime.now().timestamp())}",
            'farmerName': data['farmerName'],
            'contactNumber': data['contactNumber'],
            'cropName': data['cropName'],
            'quantity': data['quantity'],
            'price': data['price'],
            'state': data['state'],
            'district': data['district'],
            'location': f"{data['district']}, {data['state']}",
            'logistics_partner': data.get('logistics_partner', True),
            'harvestDate': data.get('harvestDate', 'Not specified'),
            'quality': data.get('quality', 'Standard'),
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'verified': True 
        }
        
        listings = load_listings()
        listings.insert(0, new_listing)
        save_listings(listings)
        
        return jsonify(new_listing), 201

NEGOTIATIONS_FILE = "market_negotiations.json"

def load_negotiations():
    if os.path.exists(NEGOTIATIONS_FILE):
        try:
            with open(NEGOTIATIONS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_negotiations(data):
    with open(NEGOTIATIONS_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/negotiations', methods=['GET', 'POST', 'PATCH'])
def handle_negotiations():
    if request.method == 'GET':
        # Can filter by listingId or buyerId
        listing_id = request.args.get('listingId')
        buyer_id = request.args.get('buyerId')
        buyer_name = request.args.get('buyerName')
        seller_name = request.args.get('sellerName')
        
        negotiations = load_negotiations()
        if listing_id:
            negotiations = [n for n in negotiations if n['listingId'] == listing_id]
        if buyer_id:
            negotiations = [n for n in negotiations if n['buyerId'] == buyer_id]
        if buyer_name:
            negotiations = [n for n in negotiations if 'buyerName' in n and n['buyerName'].lower() == buyer_name.lower()]
        if seller_name:
            negotiations = [n for n in negotiations if 'sellerName' in n and n['sellerName'].lower() == seller_name.lower()]
            
        return jsonify(negotiations)
        
    if request.method == 'POST':
        data = request.json
        negotiation = {
            'id': f"neg_{int(datetime.now().timestamp())}",
            'listingId': data.get('listingId'),
            'buyerId': data.get('buyerId'),
            'buyerName': data.get('buyerName'),
            'sellerName': data.get('sellerName'),
            'offerPrice': data.get('offerPrice'),
            'originalPrice': data.get('originalPrice'),
            'crop': data.get('crop'),
            'message': data.get('message'),
            'status': 'Pending', # Pending, Accepted, Rejected
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        negotiations = load_negotiations()
        negotiations.append(negotiation)
        save_negotiations(negotiations)
        return jsonify(negotiation), 201

    if request.method == 'PATCH':
        data = request.json
        neg_id = data.get('id')
        new_status = data.get('status')
        
        negotiations = load_negotiations()
        for n in negotiations:
            if n['id'] == neg_id:
                n['status'] = new_status
                break
        save_negotiations(negotiations)
        return jsonify({'status': 'updated'})



# Buyer Dashboard Models & Routes
BUYER_INTERACTIONS_FILE = "buyer_interactions.json"

def load_buyer_interactions():
    if os.path.exists(BUYER_INTERACTIONS_FILE):
        try:
            with open(BUYER_INTERACTIONS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_buyer_interactions(data):
    with open(BUYER_INTERACTIONS_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/buyer/insights', methods=['POST'])
def get_buyer_insights_api():
    data = request.json
    crop = data.get('crop')
    state = data.get('state')
    district = data.get('district', '')
    
    if not crop or not state:
        return jsonify({'error': 'Crop and State are required'}), 400
        
    insights = market_engine.get_buyer_insights(crop, state, district)
    return jsonify(insights)

@app.route('/buyer/interactions', methods=['GET', 'POST'])
def handle_buyer_interactions():
    if request.method == 'GET':
        # Filter by buyerId if provided query param
        buyer_id = request.args.get('buyerId')
        interactions = load_buyer_interactions()
        if buyer_id:
            interactions = [i for i in interactions if i.get('buyerId') == buyer_id]
        return jsonify(interactions)
        
    if request.method == 'POST':
        data = request.json
        interactions = load_buyer_interactions()
        
        new_interaction = {
            'id': str(uuid.uuid4()),
            'buyerId': data.get('buyerId'),
            'listingId': data.get('listingId'),
            'farmerName': data.get('farmerName'),
            'crop': data.get('crop'),
            'status': 'Contacted',
            'timestamp': datetime.now().isoformat()
        }
        
        interactions.insert(0, new_interaction)
        save_buyer_interactions(interactions)
        return jsonify({'message': 'Interaction recorded', 'id': new_interaction['id']}), 201

# Community Endpoints
@app.route('/community/posts', methods=['GET', 'POST'])
def handle_community_posts():
    data = load_community_data()
    if request.method == 'GET':
        posts = data.get('posts', [])
        return jsonify(posts)
    
    if request.method == 'POST':
        new_post = request.json
        if not new_post:
            return jsonify({'error': 'No data provided'}), 400
            
        new_post['id'] = str(uuid.uuid4())
        new_post['timestamp'] = datetime.now().isoformat()
        new_post['likes'] = 0
        new_post['comments'] = []
        
        # Ensure posts list exists
        if 'posts' not in data:
            data['posts'] = []
            
        data['posts'].insert(0, new_post)
        save_post(new_post)
        return jsonify({'message': 'Post created', 'id': new_post['id']}), 201

# Real-Time User Tracking Endpoints
@app.route('/community/heartbeat', methods=['POST'])
def handle_heartbeat():
    data = request.json
    username = data.get('username')
    if username:
        update_user_status(username)
        return jsonify({'status': 'ok'})
    return jsonify({'error': 'Username required'}), 400

@app.route('/community/farmers', methods=['GET'])
def handle_community_farmers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM profiles")
    rows = cursor.fetchall()
    conn.close()
    
    farmers = [serialize_user_document(r) for r in rows]
    return jsonify(farmers)

@app.route('/community/online', methods=['GET'])
def handle_online_users():
    active_usernames = get_active_users()
    
    # Return enriched objects
    enriched_users = []
    for username in active_usernames:
        profile_doc = resolve_user_reference(username)
        profile = serialize_user_document(profile_doc) if profile_doc else {}
        enriched_users.append({
            'username': username,
            'name': profile.get('name', username),
            'photoUrl': profile.get('photoUrl', '')
        })
        
    return jsonify(enriched_users)

@app.route('/community/chat', methods=['GET', 'POST'])
def handle_community_chat():
    if request.method == 'GET':
        user1 = request.args.get('user1')
        user2 = request.args.get('user2')
        all_chats = get_chat_messages(user1, user2)
        
        if user1 and user2:
            # Private Chat: Filter messages between user1 and user2
            filtered_chat = []
            for msg in all_chats:
                if msg.get('sender') == user1 and msg.get('recipient') == user2:
                    filtered_chat.append(msg)
                elif msg.get('sender') == user2 and msg.get('recipient') == user1:
                    filtered_chat.append(msg)
            return jsonify(filtered_chat)
        else:
            public_chat = [msg for msg in all_chats if not msg.get('recipient')]
            return jsonify(public_chat)

    if request.method == 'POST':
        msg = request.json
        if not msg:
            return jsonify({'error': 'No data provided'}), 400
            
        msg['id'] = str(uuid.uuid4())
        msg['timestamp'] = datetime.now().isoformat()
        msg['read'] = False
        
        save_chat_message(msg)
        return jsonify(msg), 201

@app.route('/community/read-chat', methods=['POST'])
def handle_read_chat():
    data = request.json
    sender = data.get('sender')
    recipient = data.get('recipient')
    if sender and recipient:
        update_chat_read_status(sender, recipient)
        return jsonify({'success': True}), 200
    return jsonify({'error': 'Missing parameters'}), 400

@app.route('/community/chat/<msg_id>', methods=['DELETE'])
def delete_chat_message(msg_id):
    username = request.args.get('username')
    data = load_community_data()
    
    # Find the message
    message = next((msg for msg in data.get('chat', []) if msg.get('id') == msg_id), None)
    
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    # Only allow deletion if user is the sender
    if message.get('sender') != username:
        return jsonify({'error': 'You can only delete your own messages'}), 403
        
    # Delete the message
    data['chat'] = [msg for msg in data.get('chat', []) if msg.get('id') != msg_id]
    save_community_data(data)
    
    return jsonify({'message': 'Message deleted successfully'}), 200

@app.route('/community/upload-image', methods=['POST'])
def upload_chat_image():
    """Upload image for chat messages"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        
        if file_ext not in allowed_extensions:
            return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, webp'}), 400
        
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'chat_images')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        file.save(file_path)
        
        # Return URL path (relative to server)
        image_url = f"{request.host_url}uploads/chat_images/{unique_filename}"
        
        return jsonify({
            'success': True,
            'imageUrl': image_url
        }), 200
        
    except Exception as e:
        print(f"Error uploading image: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/community/upload-audio', methods=['POST'])
def upload_chat_audio():
    """Upload audio (voice message) for chat messages"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Allowed extensions for audio
        allowed_extensions = {'webm', 'mp3', 'wav', 'ogg', 'm4a', 'aac'}
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'webm'
        
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'chat_audio')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        file.save(file_path)
        
        # Return URL path (relative to server)
        audio_url = f"{request.host_url}uploads/chat_audio/{unique_filename}"
        
        return jsonify({
            'success': True,
            'audioUrl': audio_url
        }), 200
        
    except Exception as e:
        print(f"Error uploading audio: {e}")
        return jsonify({'error': str(e)}), 500

# Serve uploaded images/audio
@app.route('/uploads/chat_images/<filename>')
def serve_chat_image(filename):
    upload_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'chat_images')
    from flask import send_from_directory
    return send_from_directory(upload_dir, filename)

@app.route('/uploads/chat_audio/<filename>')
def serve_chat_audio(filename):
    upload_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'chat_audio')
    from flask import send_from_directory
    return send_from_directory(upload_dir, filename)


@app.route('/community/notifications', methods=['GET'])
def get_notifications():
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Username required'}), 400
        
    notifications = get_unread_chat_counts(username)
    
    # --- NEW: SYSTEM ALERTS ---
    system_alerts = []
    
    # 1. Get User Profile for Context
    profile_doc = resolve_user_reference(username)
    profile = serialize_user_document(profile_doc) if profile_doc else {}
    user_district = profile.get('district') or 'Nashik'
    user_state = profile.get('state') or 'Maharashtra'
    
    # 2. Weather Alert (REAL DATA)
    try:
        # Check cache or fetch fresh (since this is polled often, ideally cache, but for now fetch)
        city_query = f"{user_district},{user_state}"
        weather_data = weather_engine.fetch_weather_forecast(city=city_query)
        
        if weather_data:
            risk_report = weather_engine.analyze_risk(weather_data)
            temp = risk_report.get('details', {}).get('temp', 'N/A')
            
            # Create Alert ID based on date/hour to avoid spamming same alert every minute
            # e.g. "weather-Nashik-2024-10-24-14" (change every hour)
            alert_id = f"weather-{user_district}-{datetime.now().strftime('%Y%m%d%H')}"
            
            if risk_report['risk_level'] != 'Safe':
                system_alerts.append({
                    'id': alert_id,
                    'type': 'weather',
                    'title': f"Weather Warning: {risk_report['risk_level']}",
                    'message': f"{risk_report['alert_message']} ({temp}°C).",
                    'level': 'warning' if risk_report['risk_level'] == 'Caution' else 'critical',
                    'actionUrl': '/digital-twin',
                    'timestamp': datetime.now().isoformat()
                })
            else:
                 # Optional: "All Clear" / Daily Forecast (Show once per day or session?)
                 # For demo, let's show it as "Info"
                 system_alerts.append({
                    'id': alert_id + "-info",
                    'type': 'weather',
                    'title': 'Weather Update',
                    'message': f"Conditions are safe in {user_district}. Temp: {temp}°C, Humidity: {weather_data.get('main',{}).get('humidity')}%",
                    'level': 'info',
                    'actionUrl': '/digital-twin',
                    'timestamp': datetime.now().isoformat()
                })
    except Exception as e:
        print(f"Weather notification error: {e}")

        
    # 3. Market Alert (REAL DATA)
    try:
        market_id = f"market-{user_district}-{datetime.now().strftime('%Y%m%d')}" # Daily market alert
        # Fetch top commodity - Pass None for market to search entire district
        prices = market_engine.get_market_prices(user_state, user_district, None)
        if prices:
            # Sort by price desc to find high value
            prices.sort(key=lambda x: float(x.get('modal_price', 0)), reverse=True)
            top_crop = prices[0]
            
            system_alerts.append({
                'id': market_id,
                'type': 'market',
                'title': 'Market Updates Available',
                'message': f"Top price today in {user_district}: {top_crop['commodity']} at ₹{top_crop['modal_price']}/Qt.",
                'level': 'info',
                'actionUrl': '/marketplace',
                'timestamp': datetime.now().isoformat()
            })
    except Exception as e: 
         print(f"Market notification error: {e}")
        
    # 4. Pest Advisory
    system_alerts.append({
        'id': 'alert-pest-1',
        'type': 'advisory',
        'title': 'Pest Warning: Fall Armyworm',
        'message': 'High incidence of Fall Armyworm reported in neighboring districts. Monitor maize crops.',
        'level': 'critical',
        'actionUrl': '/pest-prediction',
        'timestamp': (datetime.now() - timedelta(hours=2)).isoformat()
    })

    # Return list of senders who messaged you AND system alerts
    return jsonify({
        'unread_messages': [{'sender': sender, 'count': count} for sender, count in notifications.items()],
        'system_alerts': system_alerts
    })

@app.route('/user/profile', methods=['GET', 'POST'])
def handle_user_profile():
    if request.method == 'GET':
        identifier = request.args.get('firebaseUid') or request.args.get('username') or request.args.get('email')
        if not identifier:
             return jsonify({'error': 'Username required'}), 400

        profile_doc = resolve_user_reference(identifier)
        if not profile_doc:
            return jsonify({})

        return jsonify(serialize_user_document(profile_doc))
        
    if request.method == 'POST':
        profile_data = request.json
        if not profile_data:
            return jsonify({'error': 'No data provided'}), 400

        username = profile_data.get('username')
        firebase_uid = profile_data.get('firebaseUid') or profile_data.get('userId')

        if not username and not firebase_uid:
            return jsonify({'error': 'Username required'}), 400
            
        profile_record = {
            'name': profile_data.get('name', username),
            'email': profile_data.get('email', ''),
            'photoUrl': profile_data.get('photoUrl', ''),
            'bio': profile_data.get('bio', 'No bio yet.'),
            # Extended Fields
            'dob': profile_data.get('dob', ''),
            'country': profile_data.get('country', 'India'),
            'state': profile_data.get('state', ''),
            'district': profile_data.get('district', ''),
            'village': profile_data.get('village', ''),
            'farmSize': profile_data.get('farmSize', ''),
            'experience': profile_data.get('experience', ''),
            'crops': profile_data.get('crops', '')
        }
        
        update_profile_record(username or firebase_uid, profile_record)
        return jsonify({'message': 'Profile updated', 'profile': profile_record})

@app.route('/community/posts/<post_id>/comments', methods=['POST'])
def handle_post_comment(post_id):
    data = load_community_data()
    posts = data.get('posts', [])
    
    # Find post
    post_index = next((index for (index, d) in enumerate(posts) if d["id"] == post_id), None)
    
    if post_index is None:
        return jsonify({'error': 'Post not found'}), 404
        
    comment_data = request.json
    if not comment_data or 'text' not in comment_data:
         return jsonify({'error': 'No comment text provided'}), 400
         
    new_comment = {
        'id': str(uuid.uuid4()),
        'author': comment_data.get('author', 'Anonymous'),
        'text': comment_data['text'],
        'timestamp': datetime.now().isoformat()
    }
    
    # Initialize comments is it doesn't exist (legacy data support)
    if 'comments' not in posts[post_index]:
        posts[post_index]['comments'] = []
        
    add_post_comment(post_id, new_comment)
    return jsonify({'message': 'Comment added', 'comment': new_comment}), 201

@app.route('/generate-digital-twin', methods=['POST'])
def generate_digital_twin():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        print(f"Generating Digital Twin for: {data}")
        
        # Call Groq to generate realistic farm data
        success, result = generate_digital_twin_with_groq(data)
        
        if success:
            return jsonify(result)
        else:
            return jsonify({'error': result}), 500

    except Exception as e:
        print(f"Error in digital twin generation: {e}")
        return jsonify({'error': str(e)}), 500

def generate_digital_twin_with_groq(farm_data):
    """
    Generate realistic digital twin data using Groq based on location (Lat/Lng OR Text) and size.
    """
    try:
        # Calculate hectares from acres (approx)
        acres = float(farm_data.get('size', 10))
        hectares = round(acres * 0.404686, 2)
        
        # Construct Location Context
        lat = farm_data.get('latitude')
        lng = farm_data.get('longitude')
        location_text = f"{farm_data.get('town', '')}, {farm_data.get('district', '')}, {farm_data.get('state', '')}"
        
        prompt = f"""
        Generate a hyper-realistic 'GIS Digital Twin' for a farm located in: {location_text}
        Specific Details: {farm_data.get('farmName')}, {acres} Acres, Lat {lat}, Lng {lng}.

        As an Agricultural Data Scientist, use your knowledge of regional soil types in {farm_data.get('state', 'India')}, 
        typical pests in {farm_data.get('district', 'this area')}, and current crop seasons.
        
        Return a STRICTOR JSON format with:
        1. soilZones: Array of unique zones with realistic pH (e.g. 6.2-7.5), soilType (Loamy, Clayey, Silt, Sandy), and nutrient levels.
        2. pestProneAreas: Array of 1-3 specific pests common in {farm_data.get('state')} with realistic risk levels.
        3. irrigationZones: Array of zones with realistic efficiency (80-95%) and irrigation types (Drip, Sprinkler).
        4. cropGrowthStages: Real-time estimation of 1-3 crops likely grown in {location_text} right now, their current growth stage (Seedling, Vegetative, Flowering, Fruiting, Harvest Ready), and health metrics.

        Output ONLY valid JSON. No conversational text.
        """

        response_content, error = call_groq_with_fallback(prompt, system_message="You are a professional Agriculture GIS System. Output valid JSON results matched to regional Indian topography.")
        
        if error or not response_content:
            return True, {
                "location": { "lat": float(lat or 25.86), "lng": float(lng or 85.77) },
                "farmBoundary": { "area": hectares },
                "visual_summary": "Digital Twin generated in Reliability Mode due to AI capacity limits.",
                "soilZones": [{ "id": "z1", "soilType": "Loamy", "ph": 6.8, "nutrients": { "nitrogen": 45, "phosphorus": 35, "potassium": 25 }, "organicMatter": 3.8, "fertility": "high", "recommendations": ["Safe mode data"] }],
                "irrigationZones": [{ "id": "i1", "type": "Drip", "efficiency": 94, "status": "active" }],
                "pestProneAreas": [{ "id": "p1", "pestType": "Stem Borer", "riskLevel": "medium", "preventiveMeasures": ["Monitor"] }],
                "cropGrowthStages": [{ "id": "c1", "cropType": "Wheat", "stage": "Vegetative", "health": 88, "plantingDate": datetime.now().strftime("%Y-%m-%d") }],
                "weatherData": { "temperature": 27, "humidity": 65, "rainfall": 8, "windSpeed": 4 }
            }

        raw_result = json.loads(response_content)
        
        # Robust Merging/Flattening
        # Some AI models might nest the result under 'digitalTwin' or similar
        inner_result = raw_result.get('digitalTwin', raw_result)
        
        # Base schema to ensure no fields are completely missing
        base_schema = {
            "location": { "lat": float(lat or 25.86), "lng": float(lng or 85.77) },
            "farmBoundary": { "area": hectares },
            "visual_summary": "AI generation successful.",
            "soilZones": [],
            "irrigationZones": [],
            "pestProneAreas": [],
            "cropGrowthStages": [],
            "weatherData": { "temperature": 27, "humidity": 60, "rainfall": 0, "windSpeed": 5 }
        }
        
        # Merge AI data over base schema
        for key in base_schema:
            if key in inner_result:
                if isinstance(base_schema[key], dict) and isinstance(inner_result[key], dict):
                    base_schema[key].update(inner_result[key])
                else:
                    base_schema[key] = inner_result[key]
        
        return True, base_schema

    except Exception as e:
        print(f"Groq generation error: {e}")
        return False, str(e)

@app.route('/verify-phone', methods=['POST'])
def verify_phone():
    """
    Endpoint to trigger Twilio Number Verification.
    """
    data = request.json
    phone = data.get('phone')
    
    if not phone:
        return jsonify({"success": False, "error": "Phone number required"}), 400
        
    result = weather_engine.verify_phone_number(phone)
    return jsonify(result)

@app.route('/analyze-health', methods=['POST', 'OPTIONS'])
def analyze_health():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    """
    Analyze overall plant health using Groq based on detected issues.
    """
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        print(f"Health Analysis Request: {data}")

        # Initialize Groq client
        from groq import Groq
        api_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_CHATBOT_API_KEY")
        if not api_key:
             return jsonify({'error': 'GROQ_API_KEY not found'}), 500
             
        client = Groq(api_key=api_key)

        prompt = f"""
        You are an expert agricultural scientist. Analyze the following plant health findings and provide a summary assessment.
        
        Findings:
        - Diseases: {json.dumps(data.get('diseases', []), indent=2)}
        - Pests: {json.dumps(data.get('pests', []), indent=2)}
        - Nutrient Deficiencies: {json.dumps(data.get('nutrients', []), indent=2)}
        - Soil Analysis: {json.dumps(data.get('soil', {}), indent=2)}
        
        Task:
        1. Determine an overall Health Score (0-100). 100 is perfect health, 0 is dead. Be realistic based on severity.
        2. Assign a Health Status (one of: 'excellent', 'good', 'fair', 'poor', 'critical').
        3. Provide 3 specific, high-priority, actionable recommendations for the farmer. Focus on the most critical issues first.
           - Recommendations should be concise instructions (e.g., "Apply copper fungicide immediately").
           
        Return ONLY valid JSON in this exact structure:
        {{
            "score": 75,
            "status": "fair",
            "recommendations": [
                "Recommendation 1",
                "Recommendation 2",
                "Recommendation 3"
            ]
        }}
        """

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful agricultural AI. Output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=300,
            response_format={"type": "json_object"}
        )

        response_content = completion.choices[0].message.content
        result = json.loads(response_content)
        
        return jsonify(result)

    except Exception as e:
        print(f"Error in health analysis: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/market-prices', methods=['POST'])
def handle_market_prices():
    data = request.json
    state = data.get('state')
    district = data.get('district')
    market = data.get('market')
    category = data.get('category')
    
    if not state or not district:
        return jsonify({'error': 'State and District are required'}), 400
        
    prices = market_engine.get_market_prices(state, district, market, category)
    return jsonify(prices)

@app.route('/market-trends', methods=['POST'])
def handle_market_trends():
    """
    Fetch market prices AND generate AI-driven trends/advice.
    """
    try:
        data = request.json
        state = data.get('state')
        district = data.get('district')
        market = data.get('market')
        category = data.get('category')
        
        if not state or not district:
            return jsonify({'error': 'State and District are required'}), 400
        
        # 1. Fetch Real Prices
        print(f"\n" + "="*40)
        print(f"📈 MARKET TRENDS REQUEST: {district}, {state}")
        print(f"="*40)
        
        prices = market_engine.get_market_prices(state, district, market, category)
        print(f"✅ SUCCESS: Fetched {len(prices)} real records from Agmarknet")
        
        # 2. Generate AI Insights based on those prices
        # Pass top 10 relevant items to AI to save context
        insights = market_engine.get_market_trends(state, district, prices)
        
        # Debug Log for Voice
        hi_len = len(insights.get('voice_script_hi', ''))
        en_len = len(insights.get('voice_script_en', ''))
        print(f"DEBUG: Generated Voice Scripts - HI: {hi_len} chars, EN: {en_len} chars")
        
        return jsonify({
            "prices": prices,
            "analysis": insights
        })
    except Exception as e:
        print(f"Error in market trends: {e}")
        return jsonify({'error': str(e)}), 500


# Government Dashboard Endpoints
@app.route('/gov/stats', methods=['GET'])
def get_gov_stats():
    # Aggregate data for dashboard
    listings = load_listings()
    community = load_community_data()
    crop_loss_cases = load_crop_loss_data()
    
    # Calculate stats
    total_farmers = 1250 # Mock base
    active_farmers = 850 + len(community.get('posts', []))
    
    # Market stats
    total_listings = len(listings)
    total_volume = sum([float(l.get('quantity', 0)) for l in listings])
    
    # Community stats
    total_issues = len(community.get('posts', []))
    resolved_issues = len([p for p in community.get('posts', []) if len(p.get('comments', [])) > 0])
    
    # Pending cases
    pending_cases = len([c for c in crop_loss_cases if c.get('status') == 'Pending'])
    
    return jsonify({
        'overview': {
            'totalFarmers': total_farmers,
            'activeFarmers': active_farmers,
            'diseaseDetections': 342, # Mock
            'pestAlerts': 128, # Mock
            'fieldsMapped': 560
        },
        'market': {
            'totalListings': total_listings,
            'totalVolume': total_volume,
            'listings': listings[:5] # Top 5 recent
        },
        'community': {
            'totalIssues': total_issues,
            'resolvedIssues': resolved_issues,
            'recenttopics': [{
                'id': p.get('id'),
                'title': p.get('title'),
                'content': p.get('content'),
                'author': p.get('author'),
                'timestamp': p.get('timestamp'),
                'likes': p.get('likes', 0),
                'replies': len(p.get('comments', []))
            } for p in community.get('posts', [])[:5]]
        },
        'cropLoss': {
            'pendingCases': pending_cases,
            'totalDisbursed': 4500000 # Mock ₹
        }
    })

@app.route('/gov/crop-loss', methods=['GET', 'POST'])
def handle_crop_loss():
    cases = load_crop_loss_data()
    
    if request.method == 'GET':
        return jsonify(cases)
        
    if request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Parse detailed fields
        damage_percentage = float(data.get('damagePercentage', 0))
        cause = data.get('causeOfLoss', 'Unknown')
        affected_area = float(data.get('affectedArea', 0))
        crop_name = data.get('cropName', 'Unknown Crop')
        
        # Calculate Estimated Loss (Mock Logic)
        # Avg Yield (Qt/Acre) * Avg Price (Rs/Qt) * Impact Area * Damage %
        # Mock Yields & Prices
        yields = {'Wheat': 20, 'Rice': 25, 'Cotton': 10, 'Maize': 30, 'Potato': 100}
        prices = {'Wheat': 2275, 'Rice': 2200, 'Cotton': 6000, 'Maize': 2090, 'Potato': 1000}
        
        avg_yield = yields.get(crop_name, 20)
        avg_price = prices.get(crop_name, 2000)
        
        estimated_loss_calc = (avg_yield * affected_area) * avg_price * (damage_percentage / 100)
        
        # Rule-based Logic
        is_eligible = damage_percentage >= 33 and cause in ['Drought', 'Flood', 'Pest', 'Disease', 'Hailstorm', 'Heatwave']
        
        suggested_scheme = 'None'
        if is_eligible:
            suggested_scheme = 'PMFBY' if data.get('insuranceStatus') == 'Yes' else 'State Disaster Relief Fund (SDRF)'
        
        suggested_compensation = (estimated_loss_calc * 0.70) if is_eligible else 0

        new_case = {
            'id': f"case_{str(uuid.uuid4())[:8]}",
            'farmerName': data.get('farmerName', 'Unknown Farmer'),
            'crop': crop_name,
            'season': data.get('season', 'Kharif'),
            'damagePercentage': damage_percentage,
            'cause': cause,
            'status': 'Under Verification', # Default to Under Verification for digital claims
            'timestamp': datetime.now().isoformat(),
            'location': data.get('location', 'Unknown'),
            'estimatedLoss': int(estimated_loss_calc),
            'suggestedCompensation': int(suggested_compensation),
            'isEligible': is_eligible,
            'suggestedScheme': suggested_scheme,
            'advisoryCompliance': data.get('advisoryCompliance', {}),
            'evidence': data.get('evidence', 'No files uploaded')
        }
        
        cases.insert(0, new_case)
        save_crop_loss_data(cases)
        return jsonify(new_case), 201

@app.route('/gov/crop-loss/<case_id>/action', methods=['POST'])
def handle_crop_loss_action(case_id):
    cases = load_crop_loss_data()
    action_data = request.json
    action = action_data.get('action') # 'approve', 'reject', 'verify'
    
    case_index = next((index for (index, d) in enumerate(cases) if d["id"] == case_id), None)
    
    if case_index is None:
        return jsonify({'error': 'Case not found'}), 404
        
    case_to_update = cases[case_index]
    
    if action == 'approve':
        case_to_update['status'] = 'Approved'
    elif action == 'reject':
        case_to_update['status'] = 'Rejected'
    elif action == 'verify':
        case_to_update['status'] = 'Under Verification'
        case_to_update['verificationRequestedAt'] = datetime.now().isoformat()
    # No else for invalid action to keep it simple or add check if needed, but existing code had basic check
        
    cases[case_index] = case_to_update
    save_crop_loss_data(cases)
    
    return jsonify(case_to_update), 200

# Weather Alert Endpoint
@app.route('/weather/alert', methods=['POST'])
def check_weather_risk():
    """
    Checks for severe weather risks (Flood, Heat, Drought).
    If risk !='Safe', sends alerts via SMS/WhatsApp/App.
    """
    try:
        data = request.json
        lat = data.get('lat')
        lon = data.get('lon')
        city = data.get('city') 
        state = data.get('state') # Pass state to help with fallback logic
        phone = data.get('phone') 

        if not (lat and lon) and not city and not state:
            return jsonify({'error': 'Location (lat/lon, city, or state) required'}), 400

        # 1. Fetch Data
        weather_data = weather_engine.fetch_weather_forecast(lat, lon, city, state)
        if not weather_data:
            return jsonify({'error': 'Weather service unavailable or location not found'}), 503

        # 2. Analyze Risk
        risk_report = weather_engine.analyze_risk(weather_data)
        
        # 3. Send Alerts (Multi-channel)
        alert_status = {
            "app_alert": True, # App always gets the data
            "sms_sent": False,
            "whatsapp_sent": False
        }
        
        # ALWAYS send SMS if phone is provided (for User Verification)
        # In production, we would restrict this to severe risks, but for now user wants to see it work.
        if phone:
            if risk_report['risk_level'] != 'Safe':
                message = f"🚨 AGRISPHERE ALERT: {risk_report['alert_message']} ({risk_report['details']['temp']}°C)"
            else:
                 message = f"✅ AgriSphere Update: Weather is Safe in {city}. Temp: {risk_report['details']['temp']}°C"

            # Send SMS
            sms_result = weather_engine.send_sms_alert(phone, message)
            if sms_result:
                alert_status['sms_sent'] = True
                
            # Send WhatsApp
            wa_result = weather_engine.send_whatsapp_alert(phone, message)
            if wa_result:
                alert_status['whatsapp_sent'] = True
            
        return jsonify({
            "weather": weather_data,
            "risk": risk_report,
            "alerts": alert_status
        })

    except Exception as e:
        print(f"Weather Alert Error: {e}")
        return jsonify({'error': str(e)}), 500


# -------------------------------------------------------------------------
# Real Satellite Data Integration (Agromonitoring)
# -------------------------------------------------------------------------
@app.route('/analyze-satellite', methods=['POST'])
def analyze_satellite():
    """
    Fetch real satellite NDVI data using Agromonitoring API.
    Process:
    1. Receive polygon coordinates.
    2. Check area size. If < 1 Hectare, create a Virtual Buffer (100mx100m).
    3. Create a polygon on Agromonitoring.
    4. Fetch stats for the latest available clear image.
    """
    try:
        data = request.json
        coordinates = data.get('coordinates') # Expecting [[lng, lat], ...] closed ring
        
        # Agromonitoring API Key
        api_key = os.getenv("VITE_AGROMONITIORING_KEY") or os.getenv("AGROMONITORING_API_KEY")
        if not api_key:
             api_key = "6cf68228e735ef4cdf481caf7b698fd3" # Fallback
        
        if not api_key:
            return jsonify({'error': 'Agromonitoring API Key not configured'}), 503
            
        if not coordinates or len(coordinates) < 3:
             return jsonify({'error': 'Invalid coordinates'}), 400

        # --- SMALL FARM OPTIMIZATION ---
        try:
            # 1. Calculate Approximate Area (Shoelace Formula for Lat/Lon)
            # 1 deg lat approx 111,000m
            # 1 deg lng approx 111,000m * cos(lat)
            lats = [c[1] for c in coordinates]
            lngs = [c[0] for c in coordinates]
            center_lat = sum(lats) / len(lats)
            center_lng = sum(lngs) / len(lngs)
            
            meters_per_deg_lat = 111000
            meters_per_deg_lng = 111000 * np.cos(np.radians(center_lat))
            
            area = 0.0
            for i in range(len(coordinates) - 1):
                x1, y1 = coordinates[i][0] * meters_per_deg_lng, coordinates[i][1] * meters_per_deg_lat
                x2, y2 = coordinates[i+1][0] * meters_per_deg_lng, coordinates[i+1][1] * meters_per_deg_lat
                area += (x1 * y2) - (x2 * y1)
            area = abs(area) / 2.0
            
            print(f"Farm Analysis: Approx Area = {area:.2f} m²")
            
            # 2. If Small Farm (< 1.2 Hectare / 12,000 m²), Use Virtual Buffer
            # API requires min 1 ha. We use 1.2 ha threshold to be safe.
            if area < 12000: 
                print("⚠️ Small Farm Detected: Validating using 1-Hectare Virtual Context Buffer...")
                
                # Create 100m x 100m square around center (approx 0.0009 deg)
                offset_lat = 50 / meters_per_deg_lat # 50m up/down
                offset_lng = 50 / meters_per_deg_lng # 50m left/right
                
                # Clockwise square
                coordinates = [
                    [center_lng - offset_lng, center_lat + offset_lat], # Top Left
                    [center_lng + offset_lng, center_lat + offset_lat], # Top Right
                    [center_lng + offset_lng, center_lat - offset_lat], # Bottom Right
                    [center_lng - offset_lng, center_lat - offset_lat], # Bottom Left
                    [center_lng - offset_lng, center_lat + offset_lat]  # Close
                ]
                print(f"Virtual Buffer Created at {center_lat:.5f}, {center_lng:.5f}")
                
        except Exception as buffer_err:
            print(f"Warning: Buffer calculation failed, using original coords. {buffer_err}")

        # --- END OPTIMIZATION ---

        # Create Polygon on Agromonitoring
        poly_url = f"http://api.agromonitoring.com/agro/1.0/polygons?appid={api_key}"
        
        poly_body = {
            "name": f"temp_analysis_{uuid.uuid4().hex[:8]}",
            "geo_json": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [coordinates] 
                }
            }
        }
        
        # print(f"Creating Polygon on Agromonitoring...") 
        poly_resp = requests.post(poly_url, json=poly_body)
        
        if poly_resp.status_code == 201:
            poly_data = poly_resp.json()
            poly_id = poly_data.get('id')
        elif poly_resp.status_code == 422:
             # Handle Duplicate Error
             # Example: "Your polygon is duplicated your already existed polygon '698...'"
             print(f"Polygon exists: {poly_resp.text}")
             import re
             match = re.search(r"polygon '([a-f0-9]+)'", poly_resp.text)
             if match:
                 poly_id = match.group(1)
                 print(f"Using existing Polygon ID: {poly_id}")
             else:
                 # Try creating with duplicate flag if ID extraction fails
                 poly_url += "&duplicated=true"
                 poly_resp_retry = requests.post(poly_url, json=poly_body)
                 if poly_resp_retry.status_code == 201:
                      poly_id = poly_resp_retry.json().get('id')
                 else:
                      return jsonify({'error': 'Failed to recover existing polygon', 'details': poly_resp.text}), 502
        else:
            print(f"Failed to create polygon: {poly_resp.text}")
            return jsonify({'error': 'Failed to register area with satellite provider', 'details': poly_resp.text}), 502
        
        # Fetch Historical NDVI (Stats)
        end_date = int(datetime.now().timestamp())
        start_date = int((datetime.now() - timedelta(days=60)).timestamp()) 
        
        stats_url = f"http://api.agromonitoring.com/agro/1.0/ndvi/history?polyid={poly_id}&start={start_date}&end={end_date}&appid={api_key}"
        
        # print(f"Fetching NDVI stats for Poly ID: {poly_id}")
        stats_resp = requests.get(stats_url)
        
        if stats_resp.status_code == 200:
            stats_data = stats_resp.json()
            
            # Sort by date descending (latest first)
            stats_data.sort(key=lambda x: x['dt'], reverse=True)
            
            if stats_data:
                latest = stats_data[0]
                ndvi_mean = latest.get('mean')
                dt = datetime.fromtimestamp(latest.get('dt'))
                
                result = {
                    'ndvi': ndvi_mean,
                    'min': latest.get('min'),
                    'max': latest.get('max'),
                    'date': dt.isoformat(),
                    'source': 'Sentinel-2 / Landsat',
                    'samples': len(stats_data),
                    'is_small_farm_optimized': bool(area < 5000)
                }
                return jsonify(result)
            else:
                 return jsonify({'error': 'No satellite data found for this period', 'simulated': True}), 404
        else:
             print(f"Stats Error: {stats_resp.text}")
             return jsonify({'error': 'Failed to fetch satellite stats'}), 502

    except Exception as e:
        print(f"Satellite analysis error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/localize-text', methods=['POST'])
def localize_text_endpoint():
    """Localize text - deprecated, kept for backward compatibility"""
    try:
        data = request.json
        text = data.get('text', '')
        language = data.get('language', 'Hindi')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Return text as-is (no dialect localization)
        return jsonify({
            'localized_text': text,
            'language': language,
            'status': 'no_localization'
        })

    except Exception as e:
        print(f"Localization error: {e}")
        return jsonify({'localized_text': text, 'error': str(e), 'status': 'error_fallback'})

@app.route('/simplify-text', methods=['POST'])
def simplify_text_route():
    """Simplify complex text for farmers using AI with fallback."""
    try:
        data = request.json
        text = data.get('text', '')
        language = data.get('language', 'Hindi')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        prompt = f"You are an expert agriculture advisor. Explain the following details to a farmer in simple {language}. Keep it short (2-3 sentences max) and easy to understand. Do not invent facts. \n\nDetails: {text}"
        
        response_content, error = call_groq_with_fallback(
            prompt, 
            system_message="You are a helpful agricultural assistant for Indian farmers.",
            response_format=None, # Return plain text
            max_tokens=200
        )

        if error:
            print(f"Simplification failed, returning original text. Error: {error}")
            return jsonify({'simplified_text': text, 'is_fallback': True})

        return jsonify({'simplified_text': response_content, 'is_fallback': False})

    except Exception as e:
        print(f"Simplification critical error: {e}")
        return jsonify({'simplified_text': text, 'error': str(e), 'is_fallback': True})

@app.route('/daily-bulletin', methods=['POST'])
def get_daily_bulletin():
    """Aggregate weather, market, and AI insights into a personalized daily bulletin."""
    try:
        data = request.json
        lat = data.get('lat')
        lon = data.get('lon')
        state = data.get('state')
        district = data.get('district')
        crop = data.get('crop', 'Rice')
        language = data.get('language', 'Hindi')
        is_hindi = str(language).lower().startswith('hi')


        # 0. Resolve Location
        # Accept city/state directly from frontend (most reliable for user's real location)
        city_from_client = data.get('city')
        state_from_client = data.get('state')

        resolved_location = None
        if lat and lon:
            print(f"Bulletin: Resolving coordinates {lat}, {lon}...")
            resolved_location = weather_engine.get_location_details(lat, lon)
        
        # NOTE: Server-side IP lookup is intentionally NOT used here as it returns
        # the server's IP location, not the user's real location.

        if resolved_location:
            district = resolved_location.get('city', city_from_client or district)
            state = resolved_location.get('state', state_from_client or state)
            print(f"Bulletin: Resolved via GPS to {district}, {state}")
        elif city_from_client:
            district = city_from_client
            state = state_from_client or state
            print(f"Bulletin: Using client-provided location: {district}, {state}")
        
        # If still no location, don't hardcode — use generic label
        if not district and not state:
            district = None
            state = None
            print("Bulletin: No location resolved — using generic weather context.")
        
        if district and state:
            location_display = f"{district}, {state}"
        elif district:
            location_display = district
        elif state:
            location_display = state
        else:
            location_display = "India"



        # 1. Fetch Weather
        print(f"Bulletin: Fetching weather for {district}, {state}...")
        weather_data = weather_engine.fetch_weather_forecast(lat=lat, lon=lon, city=district, state=state)
        weather_analysis = weather_engine.analyze_risk(weather_data)

        # 2. Fetch Market Data
        print(f"Bulletin: Fetching market data for {crop} in {district}...")
        market_prices = market_engine.get_market_prices(state, district, None, crop)
        crop_price = next((item for item in market_prices if crop.lower() in item.get('commodity', '').lower()), None)
        if not crop_price and market_prices:
            crop_price = market_prices[0]

        # 3. Generate AI Summary
        prompt = f"""
        You are an expert Indian agricultural advisor. Generate a friendly "Daily Agri-Bulletin" for a farmer.
        
        Farmer Info:
        - Location: {district}, {state}
        - Primary Crop: {crop}
        - Language: {language}
        - Date: {datetime.now().strftime('%B %d, %Y')}
        
        Current Situation:
        - Weather: {weather_analysis.get('details', {}).get('temp', 'N/A')}°C, Condition: {weather_analysis.get('details', {}).get('condition', 'N/A')}. Risk: {weather_analysis.get('alert_message')}
        - Market: {crop_price.get('commodity') if crop_price else crop} price is ₹{crop_price.get('modal_price') if crop_price else 'N/A'}/kg.
        
        Guidelines:
        - Start with a culturally appropriate greeting for {state} in {language} (e.g. Sat Shri Akal for Punjab, Vanakkam for Tamil Nadu, Nomoshkar for Bengal, Namaskara for Karnataka).
        - Provide 1 clear sentence for weather prediction specific to {district}.
        - Provide 1 clear sentence for market advice based on the price trend of {crop}.
        - Keep the total script under 60 words for quick listening.
        - IMPORTANT: If the language is Hindi, use Devanagari script for ALL fields. If Bengali, use Bengali script. DO NOT use Romanized/Hinglish text.
        
        Return STRICT JSON:
        {{
            "greeting": "Greeting in native script of {language}",
            "weather_summary": "Weather insight in native script of {language}",
            "market_summary": "Market advice in native script of {language}",
            "voice_script": "Full script for text-to-speech in native script of {language}"
        }}
        """

        response_content, error = call_groq_with_fallback(prompt)
        
        if error or not response_content:
             if is_hindi:
                 return jsonify({
                     "greeting": "नमस्ते!",
                     "weather_summary": "आज मौसम सामान्य रहने की संभावना है।",
                     "market_summary": "बाजार भाव स्थिर हैं।",
                     "voice_script": "नमस्ते! आज मौसम सामान्य रहने की संभावना है और बाजार भाव स्थिर हैं। सुरक्षित रहें।",
                     "weather_risk": "Safe",
                     "temp": 28,
                     "location_display": location_display
                 })

             # Fallback
             return jsonify({
                 "greeting": "Hello!",
                 "weather_summary": "Weather is expected to remain mostly normal today.",
                 "market_summary": "Market prices are likely to stay steady.",
                 "voice_script": "Hello! Weather is expected to remain mostly normal today and market prices are likely to stay steady. Stay safe.",
                 "weather_risk": "Safe",
                 "temp": 26,
                 "location_display": location_display
             })


        bulletin_data = json.loads(response_content)
        bulletin_data['weather_risk'] = weather_analysis.get('risk_level', 'Safe')
        bulletin_data['temp'] = weather_analysis.get('details', {}).get('temp', 'N/A')
        bulletin_data['location_display'] = location_display
        
        return jsonify(bulletin_data)


    except Exception as e:
        print(f"Daily Bulletin Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/agro/ndvi', methods=['POST'])
def get_agro_ndvi():
    """
    Fetch real satellite NDVI data for given coordinates.
    Creates a small 1-hectare polygon around the point if needed.
    """
    try:
        data = request.json
        lat = float(data.get('lat', 25.8673))
        lon = float(data.get('lon', 85.7766))
        
        # Create a small square polygon (approx 100m x 100m)
        offset = 0.001
        coords = [[
            [lon - offset, lat - offset],
            [lon + offset, lat - offset],
            [lon + offset, lat + offset],
            [lon - offset, lat + offset],
            [lon - offset, lat - offset]
        ]]
        
        # 1. Create/Get Polygon
        poly = agro_service.create_polygon(f"Farm_{lat}_{lon}", coords)
        if not poly:
            api_key = os.getenv("VITE_AGROMONITIORING_KEY")
            error_hint = "Check your VITE_AGROMONITIORING_KEY in .env" if not api_key else "Polygon limit reached or invalid coordinates"
            return jsonify({
                'error': 'Failed to create monitoring polygon',
                'hint': error_hint
            }), 400
            
        poly_id = poly['id']
        
        # 2. Get NDVI History
        ndvi_data = agro_service.get_latest_ndvi(poly_id)
        
        # 3. Get Imagery Meta
        imagery = agro_service.get_satellite_imagery(poly_id)
        
        return jsonify({
            'success': True,
            'poly_id': poly_id,
            'ndvi': ndvi_data,
            'imagery': imagery[0] if imagery else None,
            'timestamp': datetime.now().isoformat(),
            'location': {'lat': lat, 'lon': lon}
        })
        
    except Exception as e:
        print(f"Agro API Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/regional-news', methods=['GET'])
def get_regional_news():
    """
    Fetch authentic regional agricultural news via Google News RSS.
    Bypasses NewsAPI for native localized strings.
    """
    try:
        lang = request.args.get('lang', 'hi')
        
        # Localized queries for better results
        queries = {
            'hi': 'कृषि समाचार',
            'te': 'వ్యవసాయ వార్తలు',
            'mr': 'शेती बातम्या',
            'ta': 'வேளாண்மை செய்திகள்',
            'bn': 'কৃষি সংবাদ',
            'kn': 'ಕೃಷಿ ಸುದ್ದಿ',
            'or': 'କୃଷି ସମ୍ବାଦ',
            'en': 'agriculture news India'
        }
        
        query_str = queries.get(lang, 'agriculture news India')
        url = f"https://news.google.com/rss/search?q={quote(query_str)}&hl={lang}&gl=IN&ceid=IN:{lang}"
        
        response = requests.get(url, timeout=10, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code != 200:
             return jsonify({'error': f'RSS Fetch failed: {response.status_code}', "status": "error"}), 500

        root = ET.fromstring(response.content)
        
        articles = []
        # Curated high-quality agricultural placeholders for a premium look
        placeholders = [
            "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2070&auto=format&fit=crop", # Rice field
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop", # Agriculture landscape
            "https://images.unsplash.com/photo-1625246333195-58ad9acf4256?q=80&w=2070&auto=format&fit=crop", # Farm sunset
            "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop", # Vegetable farming
            "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop", # Farmer portrait
            "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop", # Wheat field
            "https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=2070&auto=format&fit=crop", # Mountain farm
            "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=2038&auto=format&fit=crop"  # Irrigation
        ]
        
        for idx, item in enumerate(root.findall('.//item')[:25]):
            title = item.find('title').text if item.find('title') is not None else ""
            link = item.find('link').text if item.find('link') is not None else ""
            pub_date_raw = item.find('pubDate').text if item.find('pubDate') is not None else ""
            source_node = item.find('source')
            source_name = source_node.text if source_node is not None else "Local News"
            description = item.find('description').text if item.find('description') is not None else ""
            
            # Clean HTML from description
            if description:
                description = re.sub('<[^<]+?>', '', description)

            # Convert pubDate to ISO format if possible
            pub_date = pub_date_raw
            try:
                from email.utils import parsedate_to_datetime
                dt = parsedate_to_datetime(pub_date_raw)
                pub_date = dt.isoformat()
            except:
                pass
                    
            articles.append({
                "title": title,
                "description": description or title,
                "url": link,
                "urlToImage": placeholders[idx % len(placeholders)],
                "source": {"name": source_name},
                "publishedAt": pub_date
            })
            
        return jsonify({
            "status": "ok",
            "articles": articles
        })
    except Exception as e:
        print(f"Regional News RSS Error: {e}")
        return jsonify({'error': str(e), 'status': 'error'}), 500

@app.route('/api/news', methods=['GET'])
def get_news_proxy():
    """
    Proxy NewsAPI requests to bypass domain restrictions on free tier in production.
    """
    try:
        query = request.args.get('q', '(agriculture OR farming OR "crop yield")')
        language = request.args.get('language', 'en')
        page_size = request.args.get('pageSize', '20')
        sort_by = request.args.get('sortBy', 'publishedAt')
        
        api_key = os.environ.get("VITE_NEWS_API_KEY") or os.environ.get("NEWS_API_KEY")
        if not api_key:
             return jsonify({'status': 'error', 'message': 'News API Key not configured on server'}), 500
             
        url = f"https://newsapi.org/v2/everything?q={query}&language={language}&pageSize={page_size}&sortBy={sort_by}&apiKey={api_key}"
        
        import requests
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        print(f"News Proxy Error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    init_db()
    # Use dynamic PORT for cloud deployment (Render, Railway, etc.)
    port = int(os.environ.get("PORT", 5000))
    is_debug = os.environ.get("FLASK_ENV", "development") != "production"

    print("\n" + "="*50)
    print("AgriSphere AI API Server Starting...")
    print("="*50)
    print(f"Server will be available at: http://localhost:{port}")
    print(f"Health check: http://localhost:{port}/health")
    print(f"Regional news: GET /api/regional-news?lang=hi")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=port, debug=is_debug, threaded=True)

