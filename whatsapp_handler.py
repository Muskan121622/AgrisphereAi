import os
import requests
from twilio.twiml.messaging_response import MessagingResponse
from groq import Groq

# Assume wheat by default for the demo
DEFAULT_CROP = "Wheat"

def extract_location(values):
    """Extract Latitude and Longitude from Twilio payload."""
    lat = values.get('Latitude')
    lon = values.get('Longitude')
    return lat, lon

def get_open_meteo_data(lat, lon):
    """Fetch live data from Open-Meteo for the given coordinates."""
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,soil_moisture_0_to_7cm"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json().get('current', {})
    except Exception as e:
        print(f"Error fetching Open-Meteo data: {e}")
        return None

def generate_ai_response(lat, lon, weather_data):
    """Use Groq to generate a micro-climate expert response."""
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_CHATBOT_API_KEY")
    if not api_key:
        return "मुझे खेद है, लेकिन मेरा AI सर्वर अभी काम नहीं कर रहा है। (API Key Missing)"

    temp = weather_data.get('temperature_2m', 'N/A')
    moisture = weather_data.get('soil_moisture_0_to_7cm', 'N/A')
    
    # Convert moisture to percentage if it's a fraction (Open Meteo returns volumetric water content m³/m³)
    moisture_pct = "N/A"
    if isinstance(moisture, (float, int)):
        moisture_pct = f"{round(moisture * 100, 1)}%"

    prompt = f"""
    You are an AI-powered WhatsApp bot that acts as a micro-climate expert for farmers.
    A farmer from rural Punjab just shared their live GPS location: Latitude {lat}, Longitude {lon}.
    
    Live Satellite Data:
    - Soil Moisture: {moisture_pct}
    - Temperature: {temp}°C
    - Crop: {DEFAULT_CROP}
    
    Calculate a rough estimation for irrigation. For example, if moisture is > 30%, explicitly tell them NOT to over-irrigate.
    Give specific advice on how many hours to run drip irrigation to save water.
    
    REPLY STRICTLY IN HINDI. Keep it brief, professional, and easy to read. Example format:
    "आज मिट्टी की नमी 40% है। कृपया अधिक सिंचाई न करें। पानी बचाने के लिए आज केवल 2 घंटे ड्रिप सिंचाई का उपयोग करें।"
    """

    try:
        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful, expert agricultural AI."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=200
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq API Error: {e}")
        # Try fallback
        try:
            client = Groq(api_key=api_key)
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are a helpful expert agritech assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=200
            )
            return completion.choices[0].message.content.strip()
        except Exception as fallback_error:
            return "त्रुटि: अभी मौसम डेटा का विश्लेषण करने में असमर्थ। कृपया बाद में प्रयास करें।"


def handle_whatsapp_webhook(values):
    """Main handler for incoming WhatsApp messages."""
    response = MessagingResponse()
    
    lat, lon = extract_location(values)
    
    if lat and lon:
        print(f"Received Location: Lat {lat}, Lon {lon}")
        weather_data = get_open_meteo_data(lat, lon)
        
        if weather_data:
            ai_reply = generate_ai_response(lat, lon, weather_data)
            response.message(ai_reply)
        else:
            response.message("त्रुटि: आपके स्थान के लिए मौसम/मिट्टी का डेटा प्राप्त नहीं किया जा सका।")
    else:
        # No location provided. Prompt the user
        response.message(
            "नमस्ते! मैं आपका AI कृषि विशेषज्ञ हूँ।\n"
            "कृपया अपनी मिट्टी और मौसम की सटीक स्थिति जानने के लिए WhatsApp पर अपनी 'Live Location' साझा करें।"
        )
        
    return str(response)
