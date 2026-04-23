#!/usr/bin/env python3
"""
Improved Voice Assistant for Agricultural Questions
Provides accurate answers in Hindi and English using Groq API (Llama 3)
"""

import json
import re
from datetime import datetime
import os
from dotenv import load_dotenv
from groq import Groq
try:
    import google.generativeai as genai
except ImportError:
    genai = None

# Load environment variables
load_dotenv()

# Configure Groq API
# Attempt to get key from environment, fallback to hardcoded if necessary (though env is preferred)
# Note: In production, rely strictly on os.environ
GROQ_API_KEY = os.environ.get("GROQ_API_KEY") or os.environ.get("VITE_GROQ_CHATBOT_API_KEY") or "gsk_y256a7183zXj7Z123" # Placeholder if missing, user should ensure env is set

class AgriVoiceAssistant:
    def __init__(self):
        # Initialize Groq
        try:
            self.client = Groq(api_key=GROQ_API_KEY)
            self.model = "llama-3.3-70b-versatile" # High quality model
            print(f"AgriVoiceAssistant: Groq initialized with model: {self.model}")
        except Exception as e:
            print(f"AgriVoiceAssistant: Failed to initialize Groq: {e}")
            self.client = None
            
        # Initialize Gemini
        try:
            gemini_key = os.environ.get("VITE_GOOGLE_GEMINI_VISION_API_KEY")
            if genai and gemini_key:
                genai.configure(api_key=gemini_key)
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
                print("AgriVoiceAssistant: Gemini fallback initialized")
            else:
                self.gemini_model = None
        except Exception as e:
            print(f"AgriVoiceAssistant: Gemini initialization failed: {e}")
            self.gemini_model = None
            
        self.knowledge_base = self.load_agricultural_knowledge()
        
    def load_agricultural_knowledge(self):
        """Load comprehensive agricultural knowledge base"""
        return {
            # Crop Diseases
            "diseases": {
                "wheat_rust": {
                    "hindi": "गेहूं में रतुआ रोग",
                    "symptoms": ["पत्तियों पर नारंगी-लाल धब्बे", "पत्तियां पीली होना"],
                    "treatment": "प्रोपिकोनाजोल या टेबुकोनाजोल का छिड़काव करें",
                    "prevention": "प्रतिरोधी किस्मों का उपयोग करें"
                },
                "tomato_blight": {
                    "hindi": "टमाटर में झुलसा रोग", 
                    "symptoms": ["पत्तियों पर भूरे धब्बे", "फलों पर काले धब्बे"],
                    "treatment": "कॉपर सल्फेट या मैंकोजेब का छिड़काव करें",
                    "prevention": "उचित दूरी पर रोपाई करें"
                },
                "rice_blast": {
                    "hindi": "धान में ब्लास्ट रोग",
                    "symptoms": ["पत्तियों पर आंख के आकार के धब्बे", "बालियों का सूखना"],
                    "treatment": "ट्राइसाइक्लाजोल का छिड़काव करें",
                    "prevention": "संतुलित उर्वरक का प्रयोग करें"
                }
            },
            
            # Fertilizers and Nutrients
            "fertilizers": {
                "nitrogen_deficiency": {
                    "hindi": "नाइट्रोजन की कमी",
                    "symptoms": ["पुरानी पत्तियां पीली", "धीमी वृद्धि"],
                    "treatment": "यूरिया 2 किलो प्रति एकड़ डालें",
                    "timing": "बुआई के 20-25 दिन बाद"
                },
                "phosphorus_deficiency": {
                    "hindi": "फास्फोरस की कमी", 
                    "symptoms": ["पत्तियों का बैंगनी रंग", "जड़ों का कम विकास"],
                    "treatment": "डीएपी 1 बोरी प्रति एकड़ डालें",
                    "timing": "बुआई के समय"
                },
                "potassium_deficiency": {
                    "hindi": "पोटाश की कमी",
                    "symptoms": ["पत्तियों के किनारे जलना", "फलों का कम विकास"],
                    "treatment": "म्यूरेट ऑफ पोटाश 50 किलो प्रति एकड़",
                    "timing": "फूल आने के समय"
                }
            },
            
            # Irrigation and Water Management
            "irrigation": {
                "wheat": {
                    "hindi": "गेहूं की सिंचाई",
                    "frequency": "15-20 दिन के अंतराल पर",
                    "critical_stages": ["बुआई के बाद", "फूल आने पर", "दाना भरने पर"],
                    "water_amount": "5-6 सेमी पानी प्रति सिंचाई"
                },
                "rice": {
                    "hindi": "धान की सिंचाई",
                    "frequency": "खेत में हमेशा 2-3 सेमी पानी रखें",
                    "critical_stages": ["रोपाई के बाद", "कल्ले निकलने पर", "बाली आने पर"],
                    "water_amount": "150-200 सेमी पानी पूरे सीजन में"
                }
            },
            
            # Pest Management
            "pests": {
                "aphids": {
                    "hindi": "माहू कीट",
                    "identification": "छोटे हरे या काले कीड़े पत्तियों पर",
                    "treatment": "इमिडाक्लोप्रिड का छिड़काव करें",
                    "organic": "नीम का तेल या साबुन का घोल"
                },
                "bollworm": {
                    "hindi": "सुंडी कीट",
                    "identification": "फलों और फूलों को खाने वाली सुंडी",
                    "treatment": "बीटी या स्पिनोसैड का छिड़काव",
                    "prevention": "फेरोमोन ट्रैप लगाएं"
                }
            },
            
            # Weather and Timing
            "weather_advice": {
                "monsoon": {
                    "hindi": "बारिश के मौसम की सलाह",
                    "crops": "धान, मक्का, कपास की बुआई का समय",
                    "precautions": "जल निकासी की व्यवस्था करें"
                },
                "winter": {
                    "hindi": "सर्दी के मौसम की सलाह", 
                    "crops": "गेहूं, जौ, चना की बुआई",
                    "precautions": "पाला से बचाव करें"
                }
            }
        }
    
    def process_voice_input(self, text, language_code="en-IN", dialect="Standard", image_base64=None):
        """Process voice input and generate appropriate response"""
        text = text.lower().strip()
        
        # Clean and normalize text
        text = self.normalize_text(text)
        
        # If image is provided, use vision processing
        if image_base64:
            return self.process_vision_input(image_base64, text, language_code, dialect)
            
        # Identify query type and generate response
        response = self.generate_response(text, language_code)
        
        return response
    
    def process_vision_input(self, image_base64, text, language_code="en-IN", dialect="Standard"):
        """Process image-based queries using LLama 3.2 Vision model"""
        if not self.client:
            return self.handle_general_fallback(text, language_code)
            
        try:
            # Construct the vision prompt
            system_instruction = f"""You are AgriSphere AI. You are looking at a field photo provided by a farmer.
            Analyze the image carefully for:
            1. Plant diseases or pests.
            2. Nutrient deficiencies (yellowing, spots).
            3. Soil quality or irrigation state.
            4. Crop growth stage.

            The user's question is: "{text}"

            Reply strictly in '{language_code}' ({dialect} dialect).
            PROVIDE TECHNICAL BUT PRACTICAL ADVICE based on the image content.
            
            Required JSON Structure (Return ONLY JSON):
            {{
                "text": "Comprehensive analysis of the image (4-6 sentences) explaining the detected issues, their causes, and detailed agricultural impact in {language_code}.",
                "audio_text": "A friendly, detailed spoken summary (2-3 sentences) of what you see in the photo in {language_code}.",
                "solution": "Specific product, pesticide, or organic remedy recommended in {language_code}.",
                "confidence": "High/Medium/Low based on image clarity",
                "detected_objects": ["list", "of", "detected", "issues"]
            }}
            """

            completion = self.client.chat.completions.create(
                model="llama-3.2-11b-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": system_instruction},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                temperature=0.2,
                max_tokens=600,
                response_format={"type": "json_object"}
            )

            result = json.loads(completion.choices[0].message.content)
            return result
        except Exception as e:
            print(f"Vision Processing Error: {e}")
            return self.handle_general_fallback(text, language_code)

    def normalize_text(self, text):
        """Normalize text for better matching"""
        # Simple cleanup without regex to avoid encoding issues
        text = text.replace('?', ' ').replace('.', ' ').replace(',', ' ').replace('!', ' ')
        return text.strip()
    
    def generate_response(self, text, language_code="en-IN"):
        """Generate appropriate agricultural response"""
        
        # 1. General Fallback to Groq AI
        return self.call_groq_api(text, language_code)

    def call_groq_api(self, text, language_code="en-IN"):
        """Call Groq API for general queries with automatic model and provider fallback"""
        # 1. Try Groq Models
        if self.client:
            models = [self.model, "llama-3.1-8b-instant"]
            for model_name in models:
                try:
                    print(f"AgriVoiceAssistant: Proposing query to Groq ({model_name})")
                    system_instruction = f"""You are AgriSphere AI. Expert agricultural advisor for Indian farmers.
                    Language: {language_code}. 
                    Return ONLY a JSON object reflecting this structure:
                    {{
                        "text": "Detailed, thorough answer (4-6 sentences) in {language_code}.",
                        "audio_text": "Detailed, friendly spoken version (2-3 sentences) in {language_code}.",
                        "solution": "Action item.",
                        "timing": "When to apply."
                    }}
                    """
                    
                    completion = self.client.chat.completions.create(
                        model=model_name,
                        messages=[
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": f"Problem: {text}"}
                        ],
                        temperature=0.7,
                        max_tokens=500
                    )

                    response_text = completion.choices[0].message.content.strip()
                    return self.parse_json_robustly(response_text)
                    
                except Exception as e:
                    print(f"AgriVoiceAssistant: Groq {model_name} failed: {e}")
                    continue

        # 2. Fallback to Gemini
        if self.gemini_model:
            try:
                print("AgriVoiceAssistant: Falling back to Gemini")
                prompt = f"""You are AgriSphere AI. Expert agricultural advisor for Indian farmers.
                Language: {language_code}. 
                Respond to: '{text}'
                Return ONLY JSON:
                {{
                    "text": "Detailed, thorough answer (4-6 sentences) in {language_code}.",
                    "audio_text": "Detailed, friendly spoken version (2-3 sentences) in {language_code}.",
                    "solution": "Action item.",
                    "timing": "When to apply."
                }}
                """
                response = self.gemini_model.generate_content(prompt)
                return self.parse_json_robustly(response.text)
            except Exception as e:
                print(f"AgriVoiceAssistant: Gemini failed: {e}")

        # 3. Final Fallback (Local KB / Rule-based)
        return self.handle_general_fallback(text, language_code)

    def parse_json_robustly(self, text):
        """Extract and parse JSON from LLM response text"""
        try:
            # Try direct parse
            return json.loads(text)
        except:
            # Try regex extraction
            try:
                json_match = re.search(r'\{.*\}', text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group(0))
            except:
                pass
        raise ValueError("Could not parse JSON from AI response")

    def handle_disease_query(self, text, language_code):
        """Handle disease-related queries"""
        is_hindi = language_code == 'hi-IN'
        # Detect crop type
        crop = self.detect_crop(text)
        
        if 'wheat' in text or 'gehun' in text or 'गेहूं' in text:
            disease_info = self.knowledge_base['diseases']['wheat_rust']
            if is_hindi:
                return {
                    'text': f"गेहूं में रतुआ रोग हो सकता है। उपचार: {disease_info['treatment']}। बचाव: {disease_info['prevention']}।",
                    'audio_text': f"गेहूं में रतुआ रोग है। प्रोपिकोनाजोल का छिड़काव करें।",
                    'solution': disease_info['treatment'],
                    'prevention': disease_info['prevention']
                }
            else:
                return {
                    'text': f"Wheat rust disease detected. Treatment: Apply propiconazole fungicide spray.",
                    'audio_text': "Wheat rust disease detected. Apply fungicide spray.",
                    'solution': "Apply propiconazole or tebuconazole spray",
                    'prevention': "Use resistant varieties"
                }
        
        elif 'tomato' in text or 'tamatar' in text or 'टमाटर' in text:
            disease_info = self.knowledge_base['diseases']['tomato_blight']
            if is_hindi:
                return {
                    'text': f"{disease_info['hindi']} हो सकता है। उपचार: {disease_info['treatment']}",
                    'audio_text': f"टमाटर में झुलसा रोग है। कॉपर सल्फेट का छिड़काव करें।",
                    'solution': disease_info['treatment'],
                    'prevention': disease_info['prevention']
                }
        
        # If specific disease not found, use Groq
        return self.call_groq_api(text, language_code)
    
    def handle_fertilizer_query(self, text, language_code):
        """Handle fertilizer-related queries"""
        is_hindi = language_code == 'hi-IN'
        if any(word in text for word in ['yellow', 'peela', 'पीला', 'nitrogen']):
            fert_info = self.knowledge_base['fertilizers']['nitrogen_deficiency']
            if is_hindi:
                return {
                    'text': f"{fert_info['hindi']} हो सकती है। उपचार: {fert_info['treatment']}",
                    'audio_text': "नाइट्रोजन की कमी है। यूरिया डालें।",
                    'solution': fert_info['treatment'],
                    'timing': fert_info['timing']
                }
        return self.call_groq_api(text, language_code)
    
    def handle_irrigation_query(self, text, language_code):
        """Handle irrigation queries"""
        is_hindi = language_code == 'hi-IN'
        crop = self.detect_crop(text)
        if crop == 'wheat':
            irr_info = self.knowledge_base['irrigation']['wheat']
            if is_hindi:
                return {
                    'text': f"{irr_info['hindi']}: {irr_info['frequency']} सिंचाई करें।",
                    'audio_text': "गेहूं में 15-20 दिन के अंतराल पर सिंचाई करें।",
                    'solution': f"Frequency: {irr_info['frequency']}",
                    'amount': irr_info['water_amount']
                }
        return self.call_groq_api(text, language_code)
    
    def handle_pest_query(self, text, language_code):
        """Handle pest-related queries"""
        return self.call_groq_api(text, language_code)
    
    def handle_harvest_query(self, text, language_code):
        """Handle harvest timing queries"""
        is_hindi = language_code == 'hi-IN'
        crop = self.detect_crop(text)
        if is_hindi:
            if crop == 'wheat':
                return {
                    'text': "गेहूं की कटाई मार्च-अप्रैल में करें जब दाने सुनहरे हो जाएं।",
                    'audio_text': "गेहूं की कटाई मार्च-अप्रैल में करें।",
                    'solution': "Harvest when grains turn golden",
                    'timing': "March-April"
                }
        return self.call_groq_api(text, language_code)
    
    def handle_weather_query(self, text, language_code):
        """Handle weather-related queries"""
        return self.call_groq_api(text, language_code)
    
    def handle_general_fallback(self, text, language_code="en-IN"):
        """Handle general farming queries when AI fails with localized messages"""
        fallbacks = {
            'hi-IN': {
                'text': "मैं AgriSphere AI हूं। तकनीकी समस्या के कारण मैं अभी संपर्क नहीं कर पा रहा हूं।",
                'audio_text': "तकनीकी समस्या है। कृपया बाद में प्रयास करें।",
                'solution': "सर्वर व्यस्त है, बाद में प्रयास करें",
                'examples': ["फसल में रोग", "खाद की मात्रा", "सिंचाई का समय"]
            },
            'as-IN': {
                'text': "মই AgriSphere AI। কাৰিকৰী সমস্যাৰ বাবে মই এতিয়া সংযোগ কৰিব পৰা নাই।",
                'audio_text': "কাৰিকৰী সমস্যা হৈছে। পিছত চেষ্টা কৰক।",
                'solution': "চাৰ্ভাৰ ব্যস্ত আছে",
                'examples': ["শস্যৰ ৰোগ", "সাৰৰ পৰিমাণ", "জলসিঞ্চনৰ সময়"]
            },
            'bn-IN': {
                'text': "আমি AgriSphere AI। প্রযুক্তিগত সমস্যার কারণে আমি এখন যোগাযোগ করতে পারছি না।",
                'audio_text': "প্রযুক্তিগত সমস্যা হয়েছে। পরে চেষ্টা করুন।",
                'solution': "সার্ভার ব্যস্ত আছে",
                'examples': ["ফসলের রোগ", "সারের পরিমাণ", "সেচের সময়"]
            },
            'mni-IN': {
                'text': "ঐহাক AgriSphere AI নি। কারিকরী সমস্যা অমনা মরম ওইরগা ঐহাক হৌজিক কন্টাক্ট তৌবা ঙমদ্রে।",
                'audio_text': "কারিকরী সমস্যা অমা লৈরে। চাংয়েং তৌবিয়ু।",
                'solution': "সার্ভার বিজি ওইরে",
                'examples': ["লাউ মরিক", "সাউ শিজিন্নবা", "লৌউ সিংউ"]
            }
        }
        
        # Determine fallback based on code or name
        lang_key = 'en-IN'
        l_code = str(language_code).lower()
        if 'hi' in l_code or 'hindi' in l_code: lang_key = 'hi-IN'
        elif 'as' in l_code or 'assam' in l_code: lang_key = 'as-IN'
        elif 'bn' in l_code or 'bengali' in l_code: lang_key = 'bn-IN'
        elif 'mni' in l_code or 'manipuri' in l_code: lang_key = 'mni-IN'
        
        if lang_key in fallbacks:
            return fallbacks[lang_key]
            
        # Default English fallback
        return {
            'text': "I am AgriSphere AI. Due to technical issues, I cannot connect right now. Please try again later.",
            'audio_text': "Technical issue. Please try again later.",
            'solution': "Server busy, try again later",
            'examples': ["Crop diseases", "Fertilizer advice", "Irrigation timing"]
        }
    
    def detect_crop(self, text):
        """Detect crop type from text"""
        crop_keywords = {
            'wheat': ['wheat', 'gehun', 'गेहूं'],
            'rice': ['rice', 'dhan', 'धान', 'chawal', 'चावल'],
            'tomato': ['tomato', 'tamatar', 'टमाटर'],
            'potato': ['potato', 'aloo', 'आलू'],
            'cotton': ['cotton', 'kapas', 'कपास'],
            'sugarcane': ['sugarcane', 'ganna', 'गन्ना']
        }
        
        for crop, keywords in crop_keywords.items():
            if any(keyword in text for keyword in keywords):
                return crop
        
        return 'general'

# Example usage and testing
def test_voice_assistant():
    """Test the voice assistant with sample queries"""
    assistant = AgriVoiceAssistant()
    
    test_queries = [
        "गेहूं में रोग आ गया है, क्या करें?",
        "What is the best fertilizer for tomatoes?"
    ]
    
    print("AgriSphere AI Voice Assistant Test (Groq Powered)")
    print("=" * 50)
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        response = assistant.process_voice_input(query)
        print(f"Response: {response}")

if __name__ == "__main__":
    test_voice_assistant()