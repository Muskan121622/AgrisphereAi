import json
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

data = json.load(open('src/locales/en/translation.json', encoding='utf-8'))
va_en = data['translation'].get('voiceAssistant', {})

print("=== ENGLISH voiceAssistant top-level keys ===")
print(list(va_en.keys()))

hero = va_en.get('hero', {})
print("\n=== hero keys ===")
print(list(hero.keys()))
print("hero.title:", hero.get('title','MISSING'))
print("hero.desc:", hero.get('desc','MISSING'))
print("hero.startBtn:", hero.get('startBtn','MISSING'))

features = va_en.get('features', {})
print("\n=== features keys ===")
print(list(features.keys()))
print("features.sectionTitle:", features.get('sectionTitle','MISSING'))

# Check if Marathi has voiceAssistant
content = open('src/locales/mr/translation.ts', encoding='utf-8').read()
va_start = content.find('"voiceAssistant": {')
if va_start == -1:
    print("\n[ERROR] Marathi: voiceAssistant OBJECT not found!")
else:
    print(f"\n[OK] Marathi: voiceAssistant object found at char {va_start}")
    # Try to check if hero exists within it
    hero_start = content.find('"hero"', va_start)
    if hero_start == -1:
        print("[ERROR] Marathi voiceAssistant.hero not found!")
    else:
        print(f"[OK] Marathi voiceAssistant.hero found at char {hero_start}")
        print("Context:", repr(content[hero_start:hero_start+200]))
