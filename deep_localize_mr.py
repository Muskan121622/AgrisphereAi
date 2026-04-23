import json
import time
from deep_translator import GoogleTranslator

# Master English Data
en_data = json.load(open('src/locales/en/translation.json', encoding='utf-8'))

# Existing Marathi content (to salvage what's already translated)
def get_existing_mr():
    try:
        content = open('src/locales/mr/translation.ts', encoding='utf-8').read()
        # Extract the object content between '{' and '};'
        start = content.find('{')
        end = content.rfind('};')
        if start != -1 and end != -1:
            # This is a bit risky but let's try to parse it as JSON by fixing some JS quirks
            obj_str = content[start:end+1]
            # Replace common JS patterns with JSON (approximate)
            obj_str = obj_str.replace("'", '"')
            # This might fail for complex files. Better to use a key-based approach.
            return content
    except:
        return ""
    return ""

mr_file_content = get_existing_mr()

translator = GoogleTranslator(source='en', target='mr')

def translate_recursive(obj, prefix=""):
    translated = {}
    for k, v in obj.items():
        full_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            translated[k] = translate_recursive(v, full_key)
        else:
            # Check if already translated in the current mr file
            # Pattern search for "key": "Marathi Value"
            pattern = f'"{k}":'
            found = False
            if pattern in mr_file_content:
                # Try to extract the existing translation
                idx = mr_file_content.find(pattern)
                val_start = mr_file_content.find('"', idx + 1 + len(k))
                val_end = mr_file_content.find('"', val_start + 1)
                if val_start != -1 and val_end != -1:
                    existing_val = mr_file_content[val_start+1:val_end]
                    # Simple heuristic: if it contains Marathi characters, it's translated
                    if any('\u0900' <= c <= '\u097F' for c in existing_val):
                        translated[k] = existing_val
                        found = True
            
            if not found:
                print(f"Translating: {full_key} -> {v[:30]}...")
                try:
                    translated[k] = translator.translate(v)
                    time.sleep(0.1) # Small delay
                except:
                    translated[k] = v # Fallback to English
    return translated

print("Starting deep localization for Marathi...")
final_mr = translate_recursive(en_data)

# Save as TS file
with open('src/locales/mr/translation.ts', 'w', encoding='utf-8') as f:
    f.write("const translation = ")
    f.write(json.dumps(final_mr, indent=2, ensure_ascii=False))
    f.write(";\n\nexport default translation;\n")

print("✅ Marathi deep localization complete!")
