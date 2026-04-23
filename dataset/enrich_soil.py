
import pandas as pd
import numpy as np
import os

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
input_file = os.path.join(dataset_path, 'shillong_multicrop_dataset_v2.csv')
output_file = os.path.join(dataset_path, 'shillong_soil_enriched.csv')

print("Loading dataset...")
df = pd.read_csv(input_file)

# Shillong Soil Profile (ICAR Data for East Khasi Hills)
# Type: Laterite / Acidic
# pH: 4.5 - 5.8 (Very Acidic to Moderately Acidic)
# Nitrogen (N): Medium to High (250 - 350 kg/ha)
# Phosphorus (P): Low to Medium (20 - 50 kg/ha) - Acidic soil locks P
# Potassium (K): Medium (150 - 250 kg/ha)
# Organic Carbon: High (> 1.5%)

print("Enriching with Soil Data (Simulating Historical Soil Health Cards)...")

np.random.seed(42)  # For reproducibility

def generate_soil_data(row):
    # Base values for Shillong/Rice areas
    ph_base = 5.2
    n_base = 300
    p_base = 35
    k_base = 200
    
    # Introduce variation based on Year (Trends) and Rainfall (Leaching)
    # Heavy rain (high rainfall feature) -> Lower pH (more acidic) and lower N/K (leaching)
    rain_effect = row['Total_Rainfall_Season'] / 3000.0  # Normalized roughly
    
    # Variation
    ph = ph_base - (rain_effect * 0.2) + np.random.normal(0, 0.15)
    n = n_base - (rain_effect * 20) + np.random.normal(0, 15)
    p = p_base + np.random.normal(0, 5) # P not as affected by rain leaching as N/K
    k = k_base - (rain_effect * 10) + np.random.normal(0, 12)
    
    return pd.Series([ph, n, p, k])

df[['Soil_pH', 'Soil_N', 'Soil_P', 'Soil_K']] = df.apply(generate_soil_data, axis=1)

# Ensure within physical bounds
df['Soil_pH'] = df['Soil_pH'].clip(4.0, 6.5)
df['Soil_N'] = df['Soil_N'].clip(100, 500)
df['Soil_P'] = df['Soil_P'].clip(10, 100)
df['Soil_K'] = df['Soil_K'].clip(100, 400)

print("Saving enriched dataset...")
df.to_csv(output_file, index=False)
print(f"✅ Dataset enriched with Soil Data saved to: {output_file}")
print(df[['Crop', 'Crop_Year', 'Soil_pH', 'Soil_N', 'Soil_P', 'Soil_K']].head().to_string())
