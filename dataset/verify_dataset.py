
import pandas as pd
import os

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
output_file = os.path.join(dataset_path, 'shillong_rice_dataset.csv')

print("--- Verifying Dataset Content ---")
try:
    df = pd.read_csv(output_file)
    print("Columns:", df.columns.tolist())
    
    # Check 2016-2019 for valid rainfall
    recent_years = df[df['Crop_Year'] >= 2016]
    print(f"\nRecords for 2016+: {len(recent_years)}")
    
    if not recent_years.empty:
        print(recent_years[['Crop_Year', 'Rain_Jun', 'Rain_Jul']].head(20).to_string())
    else:
        print("No recent data found!")
        
    # Check if any -1.0 remains in recent years?
    # Actually -1.0 was placeholder.
    
except Exception as e:
    print(f"Error: {e}")
