
import requests
import datetime

# User provided key
API_KEY = "449a1cf47863af2098396887ec15e864"
LAT = 25.57
LON = 91.88

# Try Agromonitoring API (Current Soil Data)
# Docs: https://agromonitoring.com/api/soil
url_current = f"http://api.agromonitoring.com/agro/1.0/soil?lat={LAT}&lon={LON}&appid={API_KEY}"

print(f"Testing Soil API for Shillong (Lat: {LAT}, Lon: {LON})...")
try:
    response = requests.get(url_current)
    if response.status_code == 200:
        data = response.json()
        print("✅ SUCCESS: Connected to Agromonitoring API!")
        print(f"Current Soil Temp (10cm): {data.get('t10')} K")
        print(f"Current Moisture: {data.get('moisture')}")
    else:
        print(f"❌ FAILED: Status {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ ERROR: {e}")

# Check Historical Availability (If premium/available)
# Agromonitoring Historical Soil API usually requires polygon id, but let's check basic access first.
