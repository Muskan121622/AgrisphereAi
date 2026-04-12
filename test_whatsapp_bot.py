import requests

def test_whatsapp_bot(lat="30.900965", lon="75.857277"):
    print(f"Sending mock WhatsApp Location Pin to local API... (Lat: {lat}, Lon: {lon})")
    try:
        response = requests.post(
            'http://localhost:5000/whatsapp-webhook', 
            data={'Latitude': lat, 'Longitude': lon}
        )
        print("\n--- TwiML Response XML ---")
        print(response.text)
        print("--------------------------\n")
    except Exception as e:
        print(f"Error testing bot: {e}")

if __name__ == "__main__":
    test_whatsapp_bot()
