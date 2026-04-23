
import pandas as pd
import os
import re

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
crop_file = os.path.join(dataset_path, 'crop_yield.csv')
output_file = os.path.join(dataset_path, 'shillong_rice_dataset.csv')

print("Loading crop yield data...")
df = pd.read_csv(crop_file)

# Filter for Meghalaya and Rice
# The user mentioned Rice (upland & lowland). In dataset checking earlier, we saw:
# 'Rice', Seasons: 'Autumn     ', 'Summer     ', 'Winter     ', 'Kharif     '
# We will take all Rice entries for Meghalaya.
df_meg = df[(df['State'] == 'Meghalaya') & (df['Crop'] == 'Rice')].copy()

print(f"Meghalaya Rice Records: {len(df_meg)}")

# Initialize Monthly Rainfall columns with NaN
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
for m in months:
    df_meg[f'Rain_{m}'] = -1.0 # placeholder

# Map indices for rainfall based on our inspection
# Indices: 3=Jan, 5=Feb, ..., 25=Dec
rain_indices = {
    'Jan': 3, 'Feb': 5, 'Mar': 7, 'Apr': 9, 'May': 11, 'Jun': 13,
    'Jul': 15, 'Aug': 17, 'Sep': 19, 'Oct': 21, 'Nov': 23, 'Dec': 25
}

# Iterate through rainfall files
files = [f for f in os.listdir(dataset_path) if f.startswith('RainfallData') and f.endswith('.xlsx')]

for f in files:
    year_match = re.search(r'(\d{4})', f)
    if not year_match:
        continue
    year = int(year_match.group(1))
    
    file_path = os.path.join(dataset_path, f)
    print(f"Processing Rainfall {year}...")
    
    try:
        # Read file (header=None to access by index easily as structure varies or has multi-header)
        df_r = pd.read_csv(file_path) if f.endswith('.csv') else pd.read_excel(file_path, header=None)
        
        # Find Shillong row
        target_row = None
        for idx, row in df_r.iterrows():
            if row.astype(str).str.contains('a.GOVT. FRUIT GARDEN,SHILLONG', case=False, regex=False).any():
                target_row = row
                break
        
        if target_row is not None:
            # Update the main df for this year
            # We apply this to ALL seasons of Rice in that year (same rainfall)
            mask = df_meg['Crop_Year'] == year
            if mask.any():
                for m, idx in rain_indices.items():
                    try:
                        val = float(target_row[idx])
                        df_meg.loc[mask, f'Rain_{m}'] = val
                    except:
                        pass # keep -1.0 or NaN
                print(f"  > Merged rainfall for {year}")
            else:
                print(f"  > No Rice records found for {year}")
        else:
            print(f"  > Shillong station not found in {f}")

    except Exception as e:
        print(f"  > Error processing {f}: {e}")

# Replace -1.0 with Annual_Rainfall / 12 (Simple Imputation) or just NaN
# User wants "Rainfall" feature. 
# Strategy: create a 'Season_Rainfall' column.
# Rice seasons: Kharif (Jun-Oct), Autumn (same?), Winter (Rabi?), Summer.
# Simplification: Use Annual_Rainfall from yield csv as primary, and columns as extra.
# Let's save it.

print("\nSaving dataset...")
df_meg.to_csv(output_file, index=False)
print(f"Saved to {output_file}")
print("Columns:", df_meg.columns.tolist())
print(df_meg.head())
