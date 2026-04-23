
import joblib
import pandas as pd
import os
import matplotlib.pyplot as plt

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
model_dir = os.path.join(dataset_path, 'models')

crops = ['Maize', 'Ginger', 'Rice']
feature_names = ['Area', 'Avg_Temp', 'Avg_Humidity', 'Total_Rainfall_Season', 'Fertilizer', 'Pesticide']

print("--- 🧠 inside the AI's Brain: Feature Importance ---")

for crop in crops:
    path = os.path.join(model_dir, f'xgb_model_{crop}.joblib')
    if os.path.exists(path):
        model = joblib.load(path)
        
        # XGBoost provides feature_importances_
        # We need to map them back to feature names
        importances = model.feature_importances_
        
        # Create a dataframe for nicer display
        feat_imp = pd.DataFrame({
            'Feature': feature_names,
            'Importance': importances
        }).sort_values(by='Importance', ascending=False)
        
        print(f"\n🌽 {crop} Model relies on:")
        print(feat_imp.to_string(index=False))
