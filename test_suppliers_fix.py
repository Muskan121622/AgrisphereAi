import requests
import json

def test_nearby_suppliers():
    url = "http://localhost:8080/nearby-suppliers"
    
    # Imphal coordinates
    params = {
        "lat": 24.8170,
        "lng": 93.9368,
        "address": "Imphal, Manipur"
    }
    
    print(f"Testing nearby-suppliers for: {params['address']}")
    try:
        response = requests.get(url, params=params)
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        print("\nResults found:")
        for i, shop in enumerate(data):
            print(f"{i+1}. {shop['name']} - {shop['address']} ({shop['distance']} km)")
            # Check if any Bihar mention remains
            if "Bihar" in shop['address'] or "Samastipur" in shop['name']:
                print("❌ ERROR: Bihar fallback still present!")
            else:
                print("✅ OK: Location looks local.")
                
        if not data:
            print("No results returned.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_nearby_suppliers()
