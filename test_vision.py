import requests
import base64
import os

def test_groq_vision():
    # Load sample image (I'll use a small placeholder or just a base64 string for a 1x1 pixel if needed, 
    # but I'll try to find a real one if I can)
    # Since I don't have a real image on disk, I'll use a known small red dot base64
    red_dot = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
    
    url = "http://localhost:5000/voice-query"
    payload = {
        "text": "Identify what is in this image.",
        "language": "English",
        "dialect": "Standard",
        "image": red_dot
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_groq_vision()
