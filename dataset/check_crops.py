
import pandas as pd
import os

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
crop_file = os.path.join(dataset_path, 'crop_yield.csv')

try:
    df = pd.read_csv(crop_file)
    df_ne = df[df['State'] == 'Meghalaya']
    crops = df_ne['Crop'].unique()
    print(f"Meghalaya Crops ({len(crops)}):")
    print(sorted(crops))
    
    # Check counts for target crops
    targets = ['Rice', 'Maize', 'Potato', 'Ginger', 'Turmeric']
    print("\nTarget Crop Counts:")
    for t in targets:
         count = len(df_ne[df_ne['Crop'] == t])
         print(f"{t}: {count}")

except Exception as e:
    print(f"Error: {e}")
