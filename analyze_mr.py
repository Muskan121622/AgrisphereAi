import json
import re

def get_keys(d, prefix=""):
    keys = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.update(get_keys(v, key))
        else:
            keys[key] = v
    return keys

# Load English keys
en_data = json.load(open('src/locales/en/translation.json', encoding='utf-8'))
en_translation = en_data.get('translation', en_data)
en_keys = get_keys(en_translation)

# Extract Marathi keys using regex (since it's a TS file)
mr_content = open('src/locales/mr/translation.ts', encoding='utf-8').read()
# Basic regex for keys
mr_keys_found = re.findall(r'"([a-zA-Z0-9\.]+)"\s*:', mr_content)

missing = []
for k in en_keys:
    # This is a bit simplified as the key in TS might be nested and not "nav.home" literal
    pass

print(f"English has {len(en_keys)} keys.")

# Let's count how many Marathi strings are actually English
mr_eng_count = 0
for k, v in en_keys.items():
    if f'"{v}"' in mr_content:
        mr_eng_count += 1

print(f"Found {mr_eng_count} English strings in Marathi file.")
