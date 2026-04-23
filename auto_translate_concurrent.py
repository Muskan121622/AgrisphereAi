import json
import os
import concurrent.futures
from deep_translator import GoogleTranslator

LANG_MAP = {
    'bn': 'bn',
    'mr': 'mr',
    'ta': 'ta',
    'te': 'te',
    'kn': 'kn',
    'hindi': 'hi'
}

def translate_value(val, lang_code):
    if not isinstance(val, str) or not val.strip():
        return val
    if '{{' in val and '}}' in val:
        # Ignore complex formatting
        try:
            return GoogleTranslator(source='en', target=lang_code).translate(val)
        except:
            return val
    try:
        translated = GoogleTranslator(source='en', target=lang_code).translate(val)
        return translated if translated else val
    except Exception as e:
        return val

def translate_dict_concurrent(d, lang_code):
    translated_dict = {}
    
    # Flatten the dict first to count operations
    def flatten(d, prefix=''):
        flat = {}
        for k, v in d.items():
            if isinstance(v, dict):
                flat.update(flatten(v, prefix + k + '.'))
            elif isinstance(v, str):
                flat[prefix + k] = v
        return flat
        
    def unflatten(flat):
        result = {}
        for k, v in flat.items():
            parts = k.split('.')
            d = result
            for part in parts[:-1]:
                if part not in d:
                    d[part] = {}
                d = d[part]
            d[parts[-1]] = v
        return result

    flat_dict = flatten(d)
    
    print(f"Translating {len(flat_dict)} items for {lang_code}...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        future_to_key = {executor.submit(translate_value, v, lang_code): k for k, v in flat_dict.items()}
        for future in concurrent.futures.as_completed(future_to_key):
            k = future_to_key[future]
            try:
                translated_val = future.result()
                flat_dict[k] = translated_val
            except Exception as exc:
                print(f'{k} generated an exception: {exc}')
                
    return unflatten(flat_dict)

def dict_to_js_string(d):
    json_str = json.dumps(d, ensure_ascii=False, indent=2)
    inner = json_str[json_str.find('{')+1 : json_str.rfind('}')]
    return inner.strip()

def process_file(lang_folder, lang_code, missing_data):
    file_path = f"src/locales/{lang_folder}/translation.ts"
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print(f"\n--- Processing {lang_folder} ({lang_code}) ---")
    translated_data = translate_dict_concurrent(missing_data, lang_code)
    
    js_inject = dict_to_js_string(translated_data)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "export default translation;" in content:
        parts = content.split('export default translation;')
        main_content = parts[0]
        
        last_brace_idx = main_content.rfind('}')
        if last_brace_idx != -1:
            before_brace = main_content[:last_brace_idx].strip()
            if before_brace.endswith(','):
                before_brace = before_brace[:-1]
                
            new_content = before_brace + ",\n  " + js_inject + "\n};\n\nexport default translation;\n"
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Successfully patched {lang_folder}")
        else:
            print(f"Could not find closing brace in {lang_folder}")
    else:
        print(f"Unexpected file structure in {lang_folder}")

def main():
    with open('temp_english_missing.json', 'r', encoding='utf-8') as f:
        missing_data = json.load(f)
        
    for lang_folder, lang_code in LANG_MAP.items():
        process_file(lang_folder, lang_code, missing_data)
        
    print("\nAll translations complete!")

if __name__ == '__main__':
    main()
