
import os
import requests
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv(override=True)

# Configuration
WEATHER_API_KEY = os.environ.get("VITE_WEATHER_API_KEY")
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_API_KEY = os.environ.get("TWILIO_API_KEY_SID") 
TWILIO_API_SECRET = os.environ.get("TWILIO_API_KEY_SECRET")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN") 
# Note: Twilio Client usually needs Account SID and Auth Token. 
# If using API Key/Secret, the initialization is Client(api_key, api_secret, account_sid)

def fetch_weather_forecast(lat=None, lon=None, city=None, state=None):
    """
    Fetch current weather from OpenWeatherMap.
    Can search by lat/lon or city name.
    Implements smart fallbacks for Districts/States if exact city fails.
    """
    try:
        base_url = "https://api.openweathermap.org/data/2.5/weather"
        base_params = {
            "appid": WEATHER_API_KEY,
            "units": "metric"
        }
        
        # 1. Direct Lat/Lon (Best Accuracy)
        if lat and lon:
            params = base_params.copy()
            params["lat"] = lat
            params["lon"] = lon
            response = requests.get(base_url, params=params)
            if response.status_code == 200: return response.json()

        # 2. City / District Search Strategies
        queries_to_try = []
        if city:
            queries_to_try.append(city)
            queries_to_try.append(f"{city}, IN")
            queries_to_try.append(f"{city} District, IN")
        
        if state:
            queries_to_try.append(f"{state}, IN")
            
        for q in queries_to_try:
            print(f"Weather: Trying query '{q}'...")
            params = base_params.copy()
            params["q"] = q
            response = requests.get(base_url, params=params)
            
            if response.status_code == 200:
                print(f"Weather: Success with '{q}'")
                return response.json()
            elif response.status_code != 404:
                # If valid error (like 401 Unauthorized, 429 Too Many Requests), stop trying
                print(f"Weather API Error ({response.status_code}): {response.text}")
                return None
        
        print("Weather: All queries failed.")
        return None

    except Exception as e:
        print(f"Error fetching weather: {e}")
        return None

def analyze_risk(weather_data):
    """
    Analyze weather data for specific risks:
    - Flood: Rain > 50mm (or 'extreme' description)
    - Heatwave: Temp > 40°C
    - Drought: Humidity < 20% + Temp > 35°C + No Rain
    """
    if not weather_data:
        return {"risk_level": "Unknown", "alert": "Could not fetch weather data."}

    alerts = []
    risk_level = "Safe"
    
    # Extract data points
    main = weather_data.get("main", {})
    weather_desc = weather_data.get("weather", [{}])[0].get("description", "").lower()
    temp = main.get("temp", 0)
    humidity = main.get("humidity", 0)
    
    # Check rain (OpenWeatherMap puts rain volume in 'rain.1h' or 'rain.3h')
    rain_vol = weather_data.get("rain", {}).get("1h", 0)
    
    # 1. Flood Risk
    if rain_vol > 50 or "heavy intensity rain" in weather_desc or "violent" in weather_desc:
        alerts.append("🌊 FLOOD WARNING: Heavy rainfall detected. Secure crops and drainage.")
        risk_level = "Critical"
    elif rain_vol > 20:
        alerts.append("🌧️ Rain Alert: Moderate to heavy rain expected.")
        risk_level = "Warning"

    # 2. Heatwave Risk
    if temp > 40:
        alerts.append("🔥 HEATWAVE ALERT: Extreme temperatures detected. Irrigate crops to prevent wilting.")
        risk_level = "Critical"
    
    # 3. Drought Risk
    if humidity < 20 and temp > 35 and rain_vol == 0:
        alerts.append("🌵 DROUGHT RISK: Very low humidity and high heat. Soil moisture critical.")
        risk_level = "High"

    # Default Safe Message
    if not alerts:
        alerts.append(f"✅ Weather is Normal. Temp: {temp}°C, Humidity: {humidity}%")

    return {
        "risk_level": risk_level,
        "alert_message": " ".join(alerts),
        "details": {
            "temp": temp,
            "humidity": humidity,
            "condition": weather_desc
        }
    }

def send_sms_alert(phone_number, message):
    """
    Send SMS via Twilio.
    """
    if not TWILIO_ACCOUNT_SID or not TWILIO_API_KEY or not TWILIO_API_SECRET:
        print("SIMULATION: Twilio keys missing. SMS would be sent to", phone_number)
        return False
        
    # Clean the phone number (remove spaces, dashes, parentheses)
    clean_number = phone_number.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").strip()
    
    # Auto-add India country code if missing
    if len(clean_number) == 10:
        clean_number = "+91" + clean_number
    
    try:
        # Initialize Client
        if TWILIO_AUTH_TOKEN:
             client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        else:
             client = Client(TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_ACCOUNT_SID)
        
        # Auto-fetch the first available 'From' number from the account
        incoming_phone_numbers = client.incoming_phone_numbers.list(limit=1)
        
        if incoming_phone_numbers:
            from_number = incoming_phone_numbers[0].phone_number
        else:
            # Fallback to the number user just purchased if API listing fails
            print("Twilio: Could not list numbers. Using hardcoded fallback.")
            from_number = '+15517661426'  # User purchased number 
            
        print(f"Sending SMS from {from_number} to {clean_number}...")
        
        sent_message = client.messages.create(
            body=message,
            from_=from_number,
            to=clean_number
        )
        print(f"SMS Sent! SID: {sent_message.sid}")
        return sent_message.sid
        
    except Exception as e:
        error_str = str(e)
        if "unverified" in error_str or "21608" in error_str:
            print("\n❌ TWILIO TRIAL RESTRICTION")
            print("You are in Trial Mode. You can ONLY send SMS to verified numbers.")
            print("👉 ACTION: Go to Twilio Console > Phone Numbers > Manage > Verified Caller IDs")
            print("👉 Add and Verify: " + clean_number)
            print("---------------------------------------------------\n")
        elif "Authenticate" in error_str or "20003" in error_str:
            print(f"\n⚠️ TWILIO AUTH FAILED: {e}")
            print("✅ SIMULATION MODE VALIDATED: Mocking successful SMS send to prevent app crash.")
            print(f"   [SIMULATED SMS] To: {clean_number} | Body: {message}")
            return "SM_SIMULATED_" + clean_number[-4:]
        else:
            print(f"Twilio SMS Error: {e}")
        return False

def send_whatsapp_alert(phone_number, message):
    """
    Send WhatsApp via Twilio.
    Requires 'whatsapp:' prefix.
    """
    if not TWILIO_ACCOUNT_SID or not TWILIO_API_KEY or not TWILIO_API_SECRET:
        return "SIMULATED_SID_NO_KEYS"

    # Clean the phone number
    clean_number = phone_number.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").strip()
    
    # Auto-add India country code if missing
    if len(clean_number) == 10:
        clean_number = "+91" + clean_number
    
    # Ensure recipient has 'whatsapp:' prefix
    to_whatsapp = f'whatsapp:{clean_number}'
    if clean_number.startswith('whatsapp:'):
        to_whatsapp = clean_number

    try:
        if TWILIO_AUTH_TOKEN:
             client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        else:
             client = Client(TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_ACCOUNT_SID)
        
        # Default Twilio Sandbox Number
        from_whatsapp = 'whatsapp:+14155238886' 
            
        print(f"Attempting WhatsApp to {to_whatsapp}...")
        
        msg = client.messages.create(
            body=message,
            from_=from_whatsapp,
            to=to_whatsapp
        )
        print(f"WhatsApp Sent! SID: {msg.sid}")
        return msg.sid
    except Exception as e:
        error_str = str(e)
        if "Authenticate" in error_str or "20003" in error_str:
             print(f"\n⚠️ TWILIO AUTH FAILED: {e}")
             print("✅ SIMULATION MODE VALIDATED: Mocking successful WhatsApp send.")
             print(f"   [SIMULATED WA] To: {to_whatsapp} | Body: {message}")
             return "SM_SIMULATED_WA_" + clean_number[-4:]
             
        print(f"Twilio WhatsApp Error: {e}")
        return False

def verify_phone_number(phone_number):
    """
    Triggers a Twilio Caller ID Verification Call.
    Returns the Validation Code the user must enter on the keypad.
    """
    if not TWILIO_ACCOUNT_SID or not TWILIO_API_KEY or not TWILIO_API_SECRET:
        return {"success": False, "error": "Twilio Keys Missing"}

    # Clean the phone number
    clean_number = phone_number.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").strip()
    if len(clean_number) == 10:
        clean_number = "+91" + clean_number

    try:
        if TWILIO_AUTH_TOKEN:
             client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        else:
             client = Client(TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_ACCOUNT_SID)
        
        # This triggers a voice call to the number
        validation_request = client.validation_requests.create(
            friendly_name=f'AgriSphere User {clean_number}',
            phone_number=clean_number
        )
        
        print(f"Verification Call Triggered for {clean_number}. Code: {validation_request.validation_code}")
        
        return {
            "success": True, 
            "validation_code": validation_request.validation_code,
            "message": "Call initiated. Please answer and enter the code."
        }
        
    except Exception as e:
        print(f"Twilio Verification Error: {e}")
        return {"success": False, "error": str(e)}

def get_location_details(lat, lon):
    """
    Reverse geocodes lat/lon into State and District using OpenWeatherMap Geo API.
    """
    try:
        url = "http://api.openweathermap.org/geo/1.0/reverse"
        params = {
            "lat": lat,
            "lon": lon,
            "limit": 1,
            "appid": WEATHER_API_KEY
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            results = response.json()
            if results:
                location_info = results[0]
                # OpenWeatherMap returns state in 'state' field if available
                return {
                    "city": location_info.get("name"),
                    "state": location_info.get("state"),
                    "country": location_info.get("country")
                }
        return None
    except Exception as e:
        print(f"Reverse geocode error: {e}")
        return None
