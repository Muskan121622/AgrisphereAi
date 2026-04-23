
import pandas as pd
import os
import re

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
crop_yield_file = os.path.join(dataset_path, 'crop_yield.csv')

print("--- Checking Year Range in crop_yield.csv for Meghalaya ---")
try:
    df = pd.read_csv(crop_yield_file)
    df_meg = df[df['State'] == 'Meghalaya']
    if not df_meg.empty:
        years = df_meg['Crop_Year'].unique()
        print(f"Meghalaya Yield Years: Min={min(years)}, Max={max(years)}")
        print(f"All Years: {sorted(years)}")
    else:
        print("No Meghalaya data found.")
except Exception as e:
    print(f"Error reading CSV: {e}")

print("\n--- Checking File Names for Years ---")
files = os.listdir(dataset_path)

rainfall_years = []
humidity_years = []

for f in files:
    # RainfallData2016.xlsx
    rain_match = re.search(r'RainfallData(\d{4})', f)
    if rain_match:
        rainfall_years.append(int(rain_match.group(1)))
    
    # Monthly Humidity for the year 20120001 (1).pdf
    # Pattern seems to be year + 0001?
    hum_match = re.search(r'Humidity for the year (\d{4})', f)
    if hum_match:
        humidity_years.append(int(hum_match.group(1)))

print(f"Rainfall File Years: {sorted(list(set(rainfall_years)))}")
print(f"Humidity File Years: {sorted(list(set(humidity_years)))}")
