"""
Fix script: Find all English fallback strings in regional translation files and re-translate them.
Compares each regional value against the English source. If they match, re-translate.
"""
import json
import re
import time
from deep_translator import GoogleTranslator

LANG_MAP = {
    'mr': 'mr',
    
    'mr': 'mr',
    
    
    
    
}

def flatten_dict(d, prefix=''):
    """Flatten nested dict to dot-notation keys."""
    flat = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            flat.update(flatten_dict(v, key))
        elif isinstance(v, str):
            flat[key] = v
    return flat

def translate_string(text, lang_code):
    """Translate a single string, with retries."""
    if not text or not text.strip():
        return text
    for attempt in range(3):
        try:
            result = GoogleTranslator(source='en', target=lang_code).translate(text)
            return result if result else text
        except Exception as e:
            if attempt < 2:
                time.sleep(2)
            else:
                print(f"  [FAIL] Could not translate: {text[:40]}...")
                return text

def set_nested(d, key_path, value):
    """Set a value in a nested dict using dot-notation key."""
    keys = key_path.split('.')
    for k in keys[:-1]:
        if k not in d:
            d[k] = {}
        d = d[k]
    d[keys[-1]] = value

def get_nested(d, key_path):
    """Get a value from nested dict using dot-notation key."""
    keys = key_path.split('.')
    for k in keys:
        if not isinstance(d, dict) or k not in d:
            return None
        d = d[k]
    return d

def extract_ts_object(content):
    """Extract the const translation = { ... } object from a TS file."""
    # Find the start of the object
    start_patterns = [
        'const translation = {',
        'const hindiTranslation = {',
        'const bn = {',
        'const mr = {',
    ]
    obj_start = -1
    for p in start_patterns:
        idx = content.find(p)
        if idx != -1:
            obj_start = content.find('{', idx)
            break
    
    if obj_start == -1:
        return None, None, None
    
    # Find the matching closing brace
    depth = 0
    i = obj_start
    while i < len(content):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                return content[:obj_start], content[obj_start:i+1], content[i+1:]
        i += 1
    return None, None, None

def process_language(lang_folder, lang_code, en_flat):
    """Fix untranslated (English fallback) strings in a language file."""
    file_path = f"src/locales/{lang_folder}/translation.ts"
    
    try:
        content = open(file_path, encoding='utf-8').read()
    except FileNotFoundError:
        print(f"  [{lang_folder}] File not found, skipping.")
        return
    
    print(f"\n=== Processing {lang_folder} ({lang_code}) ===")
    
    # Find all English strings still present in the regional file
    fixes_needed = []
    
    for en_key, en_val in en_flat.items():
        if not en_val or len(en_val) < 3:
            continue
        # If the English value appears literally in the file, it's a fallback
        if f'"{en_val}"' in content or f"'{en_val}'" in content:
            fixes_needed.append((en_key, en_val))
    
    if not fixes_needed:
        print(f"  [{lang_folder}] No English fallbacks found!")
        return
    
    print(f"  [{lang_folder}] Found {len(fixes_needed)} English fallbacks to fix:")
    for key, val in fixes_needed[:10]:
        print(f"    - {key}: {val[:50]}")
    if len(fixes_needed) > 10:
        print(f"    ... and {len(fixes_needed)-10} more")
    
    # Translate each fallback
    updated_content = content
    fixed_count = 0
    
    for en_key, en_val in fixes_needed:
        translated = translate_string(en_val, lang_code)
        if translated and translated != en_val:
            # Replace the English string with the Marathi translation
            old = f'"{en_val}"'
            new = f'"{translated}"'
            if old in updated_content:
                updated_content = updated_content.replace(old, new, 1)
                fixed_count += 1
                print(f"    [OK] {en_key}: {en_val[:30]} -> {translated[:40]}")
        time.sleep(0.15)  # Rate limit protection
    
    # Write the fixed file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"  [{lang_folder}] Fixed {fixed_count}/{len(fixes_needed)} strings.")

def main():
    # Load English translation as flat dict
    en_data = json.load(open('src/locales/en/translation.json', encoding='utf-8'))
    en_translation = en_data.get('translation', en_data)
    en_flat = flatten_dict(en_translation)
    
    print(f"English source has {len(en_flat)} strings to check against.")
    
    for lang_folder, lang_code in LANG_MAP.items():
        process_language(lang_folder, lang_code, en_flat)
    
    print("\n=== All languages fixed! ===")

if __name__ == '__main__':
    main()
