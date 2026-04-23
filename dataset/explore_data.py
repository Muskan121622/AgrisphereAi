
import pandas as pd
import os
import sys

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
crop_yield_file = os.path.join(dataset_path, 'crop_yield.csv')
rainfall_file = os.path.join(dataset_path, 'RainfallData2019.xlsx')
report_file = os.path.join(dataset_path, 'horizontal_crop_vertical_year_report (4).xls')
output_file = os.path.join(dataset_path, 'explore_output.txt')

# Redirect stdout to file
sys.stdout = open(output_file, 'w', encoding='utf-8')

print("--- Checking crop_yield.csv ---")
try:
    df_crop = pd.read_csv(crop_yield_file)
    print("Columns:", df_crop.columns.tolist())
    
    # Check for Meghalaya
    df_ne = df_crop[df_crop['State'] == 'Meghalaya']
    print(f"\nTotal records for Meghalaya: {len(df_ne)}")
    if not df_ne.empty:
        print("Sample Meghalaya records:")
        print(df_ne.head().to_string())
    else:
        print("No Meghalaya records found!")

except Exception as e:
    print(f"Error reading crop_yield.csv: {e}")

print("\n--- Checking RainfallData2019.xlsx ---")
try:
    df_rain = pd.read_excel(rainfall_file)
    print("Columns:", df_rain.columns.tolist())
    print("First 5 rows:")
    print(df_rain.head().to_string())
except Exception as e:
    print(f"Error reading RainfallData2019.xlsx: {e}")

print("\n--- Checking horizontal_crop_vertical_year_report (4).xls ---")
try:
    # Requires xlrd
    df_rep = pd.read_excel(report_file)
    print("Columns:", df_rep.columns.tolist())
    print("First 5 rows:")
    print(df_rep.head().to_string())
except Exception as e:
    print(f"Error reading report xls: {e}")
