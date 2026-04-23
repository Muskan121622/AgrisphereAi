
import requests
import pandas as pd
import json
import os
import time

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
weather_output_file = os.path.join(dataset_path, 'nasa_weather_shillong_1997_2020.csv')

# Shillong
lat = 25.57
lon = 91.88
start_year = 1997
end_year = 2020

# NASA POWER API Endpoint (Daily)
base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"

# Using PRECTOT as per user example, instead of PRECTOTCOR
params = {
    'parameters': 'T2M,RH2M,PRECTOT', 
    'community': 'AG',
    'longitude': lon,
    'latitude': lat,
    'start': f"{start_year}0101",
    'end': f"{end_year}1231",
    'format': 'JSON'
}

print(f"Fetching weather data from NASA POWER (Params: {params['parameters']})...")
try:
    response = requests.get(base_url, params=params)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        properties = data.get('properties', {}).get('parameter', {})
        
        t2m = properties.get('T2M', {})
        rh2m = properties.get('RH2M', {})
        prec = properties.get('PRECTOT', {})
        
        dates = sorted(t2m.keys())
        rows = []
        for d in dates:
            rows.append({
                'Date': d,
                'T2M': t2m.get(d, None),
                'RH2M': rh2m.get(d, None),
                'PRECTOT': prec.get(d, None)
            })
            
        df_weather = pd.DataFrame(rows)
        if not df_weather.empty:
            df_weather['Date'] = pd.to_datetime(df_weather['Date'], format='%Y%m%d')
            df_weather['Year'] = df_weather['Date'].dt.year
            df_weather['Month'] = df_weather['Date'].dt.month
            
            print(f"Fetched {len(df_weather)} daily records.")
            print(df_weather.head())
            
            df_weather.to_csv(weather_output_file, index=False)
            print(f"Saved to {weather_output_file}")
        else:
             print("Data dataframe is empty.")
        
    else:
        print("Failed to fetch data.")
        print(response.text[:200])

except Exception as e:
    print(f"Error executing request: {e}")
