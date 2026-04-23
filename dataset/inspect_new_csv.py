
import pandas as pd
import os

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
new_csv = os.path.join(dataset_path, 'Area Production (Agri) 2013-2014 to 2016-2017  Approved (1).csv')

print(f"--- Inspecting {os.path.basename(new_csv)} ---")
try:
    df = pd.read_csv(new_csv)
    print("Columns:", df.columns.tolist())
    print(f"Total Rows: {len(df)}")
    print("First 5 rows:")
    print(df.head().to_string())
    
    # Check for Shillong or District level data
    print("\nState/District unique values:")
    if 'District' in df.columns:
        print(df['District'].unique())
    elif 'State' in df.columns:
        print(df['State'].unique())
        
except Exception as e:
    print(f"Error reading CSV: {e}")
