import json
import os
import time
from deep_translator import GoogleTranslator

# Target languages mapping from locale code to Google Translate code
LANG_MAP = {
    'bn': 'bn',
    'mr': 'mr',
    'ta': 'ta',
    'te': 'te',
    'kn': 'kn',
    'hindi': 'hi' # Note folder is 'hindi' not 'hi'
}

def translate_dict(d, translator):
    translated_dict = {}
    for k, v in d.items():
        if isinstance(v, dict):
            translated_dict[k] = translate_dict(v, translator)
        elif isinstance(v, str):
            # Don't translate keys or placeholders like {{name}}
            # Google Translate might mess up placeholders, but we try anyway.
            # Handle placeholder case manually if possible
            if '{{' in v and '}}' in v:
                # Naive placeholder protection: translate normally, user can fix if broken
                pass
                
            try:
                # Add delay to avoid rate limiting
                time.sleep(0.1)
                translated_text = translator.translate(v)
                translated_dict[k] = translated_text if translated_text else v
            except Exception as e:
                print(f"Translation failed for '{v}': {e}")
                translated_dict[k] = v
        else:
            translated_dict[k] = v
    return translated_dict

def dict_to_js_string(d):
    # Convert dict to a formatted JSON string, then trim the outer braces
    # so we can append its internals.
    json_str = json.dumps(d, ensure_ascii=False, indent=2)
    # Remove the first '{' and last '}'
    inner = json_str[json_str.find('{')+1 : json_str.rfind('}')]
    return inner.strip()

def process_file(lang_folder, lang_code, missing_data):
    file_path = f"src/locales/{lang_folder}/translation.ts"
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print(f"\nTranslating for {lang_folder} ({lang_code})...")
    translator = GoogleTranslator(source='en', target=lang_code)
    
    # Translate the entire missing dictionary
    translated_data = translate_dict(missing_data, translator)
    
    # Format as JS string internals
    js_inject = dict_to_js_string(translated_data)
    
    # Read the target TS file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    print(f"Patching {file_path}...")
    
    # Hacky but effective regex/string replacement to open the export object
    # We look for the ending '};' and 'export default translation;'
    if "export default translation;" in content:
        # We need to find the LAST }; before export default translation
        
        # Split by 'export default translation;'
        parts = content.split('export default translation;')
        main_content = parts[0]
        
        # Now find the last '}'
        last_brace_idx = main_content.rfind('}')
        if last_brace_idx != -1:
            # Strip anything after the last brace
            before_brace = main_content[:last_brace_idx].strip()
            
            # Remove trailing comma if exists (to avoid ,,)
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
