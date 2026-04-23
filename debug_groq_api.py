import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
api_key = os.getenv("VITE_GROQ_CHATBOT_API_KEY")

print(f"DEBUG: Testing with key: {api_key[:10]}...")

try:
    client = Groq(api_key=api_key)
    # Check models list
    models = client.models.list()
    model_ids = [m.id for m in models.data]
    print(f"DEBUG: Available models: {model_ids}")
    
    # Try 8B model
    print("DEBUG: Trying llama-3.1-8b-instant...")
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": "hi"}],
        max_tokens=5
    )
    print(f"DEBUG: 8B Success: {completion.choices[0].message.content}")

except Exception as e:
    print(f"DEBUG: API ERROR: {e}")
