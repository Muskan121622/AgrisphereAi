import json

en = json.load(open('src/locales/en/translation.json', encoding='utf-8'))
with open('src/locales/mr/translation.ts', encoding='utf-8') as f:
    mr_content = f.read()

root_keys = list(en.keys())
missing = []
for k in root_keys:
    if f'"{k}":' not in mr_content:
        missing.append(k)

print(f"Missing root keys in Marathi: {missing}")

# Check if Marathi has 'translation' root key (since it's in the English JSON)
if "translation" in en:
    en_core_keys = list(en["translation"].keys())
    missing_core = []
    for k in en_core_keys:
        if f'"{k}":' not in mr_content:
            missing_core.append(k)
    print(f"Missing core keys (inside 'translation') in Marathi: {missing_core[:10]}... (Total missing: {len(missing_core)})")
