
import pandas as pd
import os
import sys

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
rainfall_file = os.path.join(dataset_path, 'RainfallData2019.xlsx')
output_file = os.path.join(dataset_path, 'rainfall_inspect.txt')

sys.stdout = open(output_file, 'w', encoding='utf-8')

print("--- Inspecting RainfallData2019.xlsx ---")
try:
    # Read first 50 rows to find Shillong
    df = pd.read_excel(rainfall_file, header=None)
    # Search for matching string
    shillong_row = None
    for idx, row in df.iterrows():
        row_str = row.astype(str).str.contains('Shillong', case=False)
        if row_str.any():
            print(f"!!! Found Shillong at row {idx} !!!")
            print(row.values)
            shillong_row = idx
            
    print("\nFirst 10 rows:")
    print(df.head(10).to_string())

except Exception as e:
    print(f"Error: {e}")
