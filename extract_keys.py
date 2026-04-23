import json
import os

KEYS_TO_EXTRACT = [
    "voiceAssistant",
    "yield",
    "pest",
    "fertilizer",
    "seedFinder",
    "advisoryHub",
    "community",
    "cropLoss"
]

def extract():
    with open('src/locales/en/translation.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    translation_root = data.get('translation', data) # fallback if it's the root
    if 'translation' in data:
        # Check if the keys are in data['translation'] or at root
        pass

    extracted = {}
    for key in KEYS_TO_EXTRACT:
        # Check in translation obj
        if key in data.get('translation', {}):
            extracted[key] = data['translation'][key]
        # Check in root obj
        elif key in data:
            extracted[key] = data[key]
        else:
            print(f"Warning: {key} not found in English JSON")
            
    with open('temp_english_missing.json', 'w', encoding='utf-8') as f:
        json.dump(extracted, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(extracted)} modules to temp_english_missing.json")

if __name__ == '__main__':
    extract()
