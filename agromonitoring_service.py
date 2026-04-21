import requests
import os
import json
from datetime import datetime, timedelta

class AgroMonitoringService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("VITE_AGROMONITIORING_KEY")
        self.base_url = "https://api.agromonitoring.com/agro/1.0"

    def create_polygon(self, name, coordinates):
        """
        Create a polygon for monitoring.
        Coordinates should be a list of [lon, lat] pairs forming a closed loop.
        Example: [[ [lon1, lat1], [lon2, lat2], [lon3, lat3], [lon1, lat1] ]]
        """
        url = f"{self.base_url}/polygons?appid={self.api_key}"
        data = {
            "name": name,
            "geo_json": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": coordinates
                }
            }
        }
        try:
            response = requests.post(url, json=data)
            if not response.ok:
                print(f"AgroMonitoring Error {response.status_code}: {response.text}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error creating polygon: {e}")
            return None

    def get_latest_ndvi(self, poly_id):
        """
        Get the most recent NDVI value for a polygon.
        """
        # Search last 30 days
        end = int(datetime.now().timestamp())
        start = int((datetime.now() - timedelta(days=30)).timestamp())
        
        url = f"{self.base_url}/ndvi/history?poly_id={poly_id}&start={start}&end={end}&appid={self.api_key}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            if data and len(data) > 0:
                # Get the latest one
                return data[-1]
            return None
        except Exception as e:
            print(f"Error fetching NDVI: {e}")
            return None

    def get_satellite_imagery(self, poly_id):
        """
        Get latest satellite imagery metadata (Sentinel-2/Landsat-8)
        """
        end = int(datetime.now().timestamp())
        start = int((datetime.now() - timedelta(days=14)).timestamp())
        
        url = f"{self.base_url}/image/search?poly_id={poly_id}&start={start}&end={end}&appid={self.api_key}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching imagery meta: {e}")
            return None

# Simple test script inside if name == main
if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    service = AgroMonitoringService()
    # Sample Samastipur Farm Polygon (approx 5 hectares)
    coords = [[
        [85.7760, 25.8670],
        [85.7775, 25.8670],
        [85.7775, 25.8685],
        [85.7760, 25.8685],
        [85.7760, 25.8670]
    ]]
    
    # Check if we have any existing polygons first to avoid duplicates
    # For demo purposes, we usually create one if none exist
    print("Fetching NDVI for real monitoring...")
    # poly = service.create_polygon("Samastipur Farm", coords)
    # if poly:
    #     print(f"Created/Found Polygon: {poly['id']}")
    #     ndvi = service.get_latest_ndvi(poly['id'])
    #     print(f"Latest NDVI: {ndvi}")
