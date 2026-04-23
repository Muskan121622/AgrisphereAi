
import pandas as pd
import os
import sys

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
report_file = os.path.join(dataset_path, 'horizontal_crop_vertical_year_report (4).xls')
output_file = os.path.join(dataset_path, 'html_report_output.txt')

sys.stdout = open(output_file, 'w', encoding='utf-8')

print("--- Reading horizontal_crop_vertical_year_report (4).xls as HTML ---")
try:
    dfs = pd.read_html(report_file)
    print(f"Found {len(dfs)} tables.")
    for i, df in enumerate(dfs):
        print(f"\nTable {i} Columns:", df.columns.tolist())
        print(f"Table {i} Head:")
        print(df.head().to_string())
        
        # Check for District or Shillong
        if 'District' in str(df.columns) or 'District' in str(df.iloc[0].values):
            print("!!! District column FOUND !!!")
        
        # Check for Shillong
        if df.astype(str).apply(lambda x: x.str.contains('Shillong', case=False)).any().any():
             print("!!! 'Shillong' entries FOUND !!!")
        elif df.astype(str).apply(lambda x: x.str.contains('Khasi', case=False)).any().any():
             print("!!! 'Khasi' entries FOUND (East Khasi Hills?) !!!")

except Exception as e:
    print(f"Error reading HTML: {e}")
