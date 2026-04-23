
import urllib.request
import ssl
import re

url = "https://megagriculture.gov.in/PUBLIC/download_Default.aspx"

# Create unverified context
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

print(f"Fetching {url}...")
try:
    with urllib.request.urlopen(url, context=ctx) as response:
        html = response.read().decode('utf-8', errors='ignore')
    
    print(f"Successfully fetched {len(html)} bytes.")
    
    # Simple regex search for keywords in link text or nearby
    keywords = ['Soil', 'Weather', 'Rainfall', 'Temperature', 'Humidity', 'Yield', 'Production', 'Statistics', 'Handbook']
    
    print("\n--- Found Keywords/Links ---")
    # This regex is very basic, just looking for lines with keywords
    lines = html.split('\n')
    for i, line in enumerate(lines):
        for k in keywords:
            if k.lower() in line.lower():
                # Clean up the line a bit
                clean_line = re.sub(r'<[^>]+>', ' ', line).strip()
                if clean_line:
                    print(f"Line {i}: [{k}] {clean_line[:100]}...")

except Exception as e:
    print(f"Error fetching URL: {e}")
