import requests
import json
radius_m = 50000
search_lat = 25.8673
search_lng = 85.7766
overpass_query = f"""[out:json][timeout:15];
(
  node["shop"~"agrarian|seeds|farm|fertilizer"](around:{radius_m},{search_lat},{search_lng});
  node["name"~"Krishi|Beej|Seed|Kisan|Kendra|Urvaarak",i](around:{radius_m},{search_lat},{search_lng});
);
out body 30;
"""
print(f"Querying overpass...")
try:
    ov_resp = requests.post(
        'https://overpass-api.de/api/interpreter',
        data={'data': overpass_query},
        timeout=20
    ).json()
    for elem in ov_resp.get('elements', []):
        print(elem)
except Exception as e:
    print(f"Error: {e}")
