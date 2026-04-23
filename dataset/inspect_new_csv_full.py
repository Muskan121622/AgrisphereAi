
import pandas as pd
import os
import sys

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
new_csv = os.path.join(dataset_path, 'Area Production (Agri) 2013-2014 to 2016-2017  Approved (1).csv')
output_file = os.path.join(dataset_path, 'inspect_new_csv_full.txt')

sys.stdout = open(output_file, 'w', encoding='utf-8')

print(f"--- Inspecting {os.path.basename(new_csv)} ---")
try:
    df = pd.read_csv(new_csv)
    print("Columns:", df.columns.tolist())
    print(f"Total Rows: {len(df)}")
    print("First 20 rows:")
    print(df.head(20).to_string())
    
    # Check for Shillong or District level data
    # Assuming standard columns if not printed correctly before
    for col in df.columns:
        if 'Dist' in col or 'Block' in col:
            print(f"\nUnique values in {col}:")
            print(df[col].unique())
    
    # Check Years
    if 'Year' in df.columns:
        print("\nYears available:", df['Year'].unique())
    elif 'Crop_Year' in df.columns:
        print("\nYears available:", df['Crop_Year'].unique())
        
except Exception as e:
    print(f"Error reading CSV: {e}")
