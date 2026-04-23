
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
input_file = os.path.join(dataset_path, 'shillong_multicrop_dataset_v2.csv')
model_dir = os.path.join(dataset_path, 'models')
os.makedirs(model_dir, exist_ok=True)

print("Loading dataset...")
df = pd.read_csv(input_file)

# Features to use
# We drop 'Crop_Year' to avoid overfitting to time (unless we want trend). 
# Let's keep it out for a general climate-soil model, or keep it if trend is strong.
# User wants "soil + climate + rainfall + terrain + crop practices".
# We have: Area (terrain/scale proxy?), Rainfall, Temp, Humidity, Fertilizer, Pesticide.
# We lack explicit Soil/Terrain.
features = ['Area', 'Avg_Temp', 'Avg_Humidity', 'Total_Rainfall_Season', 'Fertilizer', 'Pesticide']
target = 'Yield'

crops = df['Crop'].unique()
results = []

print(f"\nTraining models for {len(crops)} crops: {crops}")

for crop in crops:
    print(f"\n--- Training for {crop} ---")
    df_crop = df[df['Crop'] == crop].copy()
    
    # Drop rows with NaN in features
    df_crop = df_crop.dropna(subset=features + [target])
    
    if len(df_crop) < 10:
        print(f"Skipping {crop}: Not enough data ({len(df_crop)} rows)")
        continue
        
    X = df_crop[features]
    y = df_crop[target]
    
    # Simple split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.1, max_depth=5)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Results for {crop}:")
    print(f"  RMSE: {rmse:.4f}")
    print(f"  MAE:  {mae:.4f}")
    print(f"  R2:   {r2:.4f}")
    
    # Save model
    model_path = os.path.join(model_dir, f'xgb_model_{crop}.joblib')
    joblib.dump(model, model_path)
    
    results.append({
        'Crop': crop,
        'RMSE': rmse,
        'MAE': mae,
        'R2': r2,
        'Samples': len(df_crop)
    })

print("\n--- Final Summary ---")
results_df = pd.DataFrame(results)
print(results_df.to_string())

output_results = os.path.join(dataset_path, 'model_results.csv')
results_df.to_csv(output_results, index=False)
