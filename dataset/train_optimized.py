
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
input_file = os.path.join(dataset_path, 'shillong_soil_enriched.csv') # Use Enriched Dataset
model_dir = os.path.join(dataset_path, 'models', 'optimized') # Save to optimized folder directly
os.makedirs(model_dir, exist_ok=True)

print("Loading dataset...")
df = pd.read_csv(input_file)

# Refined Scope
target_crops = ['Rice', 'Maize', 'Ginger']
# Extended Features to include Soil Data
features = ['Area', 'Avg_Temp', 'Avg_Humidity', 'Total_Rainfall_Season', 'Fertilizer', 'Pesticide', 'Soil_pH', 'Soil_N', 'Soil_P', 'Soil_K']
target = 'Yield'

results = []

print(f"\nTraining OPTIMIZED models for: {target_crops}")

for crop in target_crops:
    print(f"\n--- Optimizing for {crop} ---")
    df_crop = df[df['Crop'] == crop].copy()
    
    # Drop rows with NaN
    df_crop = df_crop.dropna(subset=features + [target])
    
    if len(df_crop) < 5:
        print(f"Skipping {crop}: Not enough data.")
        continue
        
    X = df_crop[features]
    y = df_crop[target]
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Hyperparameter Grid
    param_grid = {
        'n_estimators': [100, 200, 500, 1000],
        'learning_rate': [0.01, 0.05, 0.1, 0.2],
        'max_depth': [3, 4, 5, 6, 8],
        'subsample': [0.7, 0.8, 0.9, 1.0],
        'colsample_bytree': [0.7, 0.8, 0.9, 1.0],
        'gamma': [0, 0.1, 0.2]
    }
    
    reg = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
    
    # Randomized Search
    # Using n_iter=20 to keep it fast but effective
    search = RandomizedSearchCV(
        reg, param_grid, n_iter=50, scoring='r2', cv=3, verbose=1, random_state=42, n_jobs=-1
    )
    
    search.fit(X_train, y_train)
    
    best_model = search.best_estimator_
    print(f"Best Params: {search.best_params_}")
    
    # Evaluate
    y_pred = best_model.predict(X_test)
    
    # For very small datasets (like Ginger n=22), R2 can be volatile.
    # We will report it but also look at Training R2 to filter "failed to learn"
    y_train_pred = best_model.predict(X_train)
    r2_train = r2_score(y_train, y_train_pred)
    
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Results for {crop}:")
    print(f"  Train R2: {r2_train:.4f}")
    print(f"  Test R2:  {r2:.4f}")
    print(f"  RMSE:     {rmse:.4f}")
    
    # Save best model
    model_path = os.path.join(model_dir, f'xgb_model_{crop}.joblib')
    joblib.dump(best_model, model_path)
    
    results.append({
        'Crop': crop,
        'Test_R2': r2,
        'Train_R2': r2_train,
        'RMSE': rmse,
        'Samples': len(df_crop)
    })

print("\n--- Optimized Results ---")
results_df = pd.DataFrame(results)
print(results_df.to_string())

output_results = os.path.join(dataset_path, 'optimized_results.csv')
results_df.to_csv(output_results, index=False)
