
import joblib
import pandas as pd
import os
import numpy as np

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
model_dir = os.path.join(dataset_path, 'models')

def load_model(crop):
    path = os.path.join(model_dir, f'xgb_model_{crop}.joblib')
    if os.path.exists(path):
        return joblib.load(path)
    return None

def predict():
    print("--- Meghalaya Yield Prediction (Optimized) ---")
    print("Supported Crops: Rice, Maize, Ginger")
    
    crop_input = input("Enter Crop Name: ").strip().capitalize()
    
    # Fuzzy match or simple map
    valid_crops = ['Rice', 'Maize', 'Ginger']
    if crop_input not in valid_crops:
        print(f"Error: Only {valid_crops} are supported in this high-accuracy version.")
        return

    model = load_model(crop_input)
    if not model:
        print(f"Error: Model file for {crop_input} not found.")
        return

    print(f"\nEnter conditions for {crop_input} (Press Enter for Defaults):")
    
    # Defaults based on 2019 averages
    defaults = {
        'Area': 5000,
        'Avg_Temp': 22.0,
        'Avg_Humidity': 80.0,
        'Total_Rainfall_Season': 1800.0,
        'Fertilizer': 600000.0,
        'Pesticide': 300.0
    }
    
    inputs = {}
    for feat in ['Area', 'Avg_Temp', 'Avg_Humidity', 'Total_Rainfall_Season', 'Fertilizer', 'Pesticide']:
        val = input(f"{feat} (Default {defaults[feat]}): ")
        if val.strip() == "":
            inputs[feat] = defaults[feat]
        else:
            inputs[feat] = float(val)
            
    # Create DataFrame
    df_in = pd.DataFrame([inputs])
    
    # Predict
    pred = model.predict(df_in)[0]
    
    # Uncertainty Estimates based on Test RMSE from optimization
    # Maize RMSE ~0.03, Ginger ~0.30, Rice ~0.24
    uncertainty_map = {'Maize': 0.04, 'Ginger': 0.35, 'Rice': 0.25}
    margin = uncertainty_map.get(crop_input, 0.3)
    
    print(f"\n🌟 Prediction Results for {crop_input} 🌟")
    print(f"Predicted Yield: {pred:.3f} Tons/Hectare")
    print(f"Confidence Interval: {pred - margin:.3f} to {pred + margin:.3f}")
    if crop_input == 'Maize':
        print("Model Confidence: Very High (>99%)")
    elif crop_input == 'Ginger':
        print("Model Confidence: High (>93%)")
    else:
        print("Model Confidence: Moderate (Requires more soil data for >95%)")
    print("---------------------------------------")

if __name__ == "__main__":
    predict()
