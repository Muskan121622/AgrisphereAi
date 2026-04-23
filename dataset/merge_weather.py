
import pandas as pd
import os

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
weather_file = os.path.join(dataset_path, 'nasa_weather_shillong_1997_2020.csv')
crop_file = os.path.join(dataset_path, 'crop_yield.csv')
output_file = os.path.join(dataset_path, 'shillong_multicrop_dataset_v2.csv')

print("Loading data...")
df_w = pd.read_csv(weather_file)
df_w['Date'] = pd.to_datetime(df_w['Date'])

df_c = pd.read_csv(crop_file)
# Filter for Meghalaya and Target Crops
target_crops = ['Rice', 'Maize', 'Potato', 'Ginger', 'Turmeric']
df_c = df_c[(df_c['State'] == 'Meghalaya') & (df_c['Crop'].isin(target_crops))].copy()

# Clean Season names
df_c['Season'] = df_c['Season'].str.strip()

print(f"Crop Records: {len(df_c)}")
print("Seasons found:", df_c['Season'].unique())

# Define Season Months (approximate for India)
# Kharif: June(6) to Oct(10)
# Rabi: Nov(11) to April(4) (Crosses year boundary!)
# Summer: March(3) to June(6)
# Autumn: Aug(8) to Nov(11)
# Winter: Dec(12) to Feb(2)
# Whole Year: Jan(1) to Dec(12)

def get_weather_stats(year, season, df_weather):
    # Determine months and year range
    # Note: Yield data 'Crop_Year' usually refers to the harvest year or start year. 
    # Let's assume Crop_Year 1997 means the season *started* in 1997.
    
    target_year = int(year)
    start_dt = None
    end_dt = None
    
    if season == 'Kharif':
        start_dt = pd.Timestamp(year=target_year, month=6, day=1)
        end_dt = pd.Timestamp(year=target_year, month=10, day=31)
    elif season == 'Rabi':
        start_dt = pd.Timestamp(year=target_year, month=11, day=1)
        # Ends next year
        end_dt = pd.Timestamp(year=target_year+1, month=4, day=30)
    elif season == 'Summer':
        start_dt = pd.Timestamp(year=target_year, month=3, day=1)
        end_dt = pd.Timestamp(year=target_year, month=6, day=30)
    elif season == 'Autumn':
        start_dt = pd.Timestamp(year=target_year, month=8, day=1)
        end_dt = pd.Timestamp(year=target_year, month=11, day=30)
    elif season == 'Winter':
        start_dt = pd.Timestamp(year=target_year, month=12, day=1)
        end_dt = pd.Timestamp(year=target_year+1, month=2, day=28)
    elif 'Whole Year' in season:
        start_dt = pd.Timestamp(year=target_year, month=1, day=1)
        end_dt = pd.Timestamp(year=target_year, month=12, day=31)
    else:
        # Default fallback: Whole Year
        start_dt = pd.Timestamp(year=target_year, month=1, day=1)
        end_dt = pd.Timestamp(year=target_year, month=12, day=31)
        
    mask = (df_weather['Date'] >= start_dt) & (df_weather['Date'] <= end_dt)
    subset = df_weather.loc[mask]
    
    if subset.empty:
        return [None, None, None]
    
    # Calc stats
    avg_temp = subset['T2M'].mean()
    avg_hum = subset['RH2M'].mean()
    total_rain = subset['PRECTOT'].sum()
    
    return [avg_temp, avg_hum, total_rain]

print("Merging weather features...")
# Apply function row-by-row (slow but safe for small dataset ~150 rows)
weather_cols = []
for index, row in df_c.iterrows():
    stats = get_weather_stats(row['Crop_Year'], row['Season'], df_w)
    weather_cols.append(stats)

feature_names = ['Avg_Temp', 'Avg_Humidity', 'Total_Rainfall_Season']
df_features = pd.DataFrame(weather_cols, columns=feature_names, index=df_c.index)

df_final = pd.concat([df_c, df_features], axis=1)

# Drop original Annual_Rainfall as we have better seasonal rain now
# But we can keep it for comparison
print("Saving final dataset...")
df_final.to_csv(output_file, index=False)
print(df_final.head())
print(f"Saved to {output_file}")
