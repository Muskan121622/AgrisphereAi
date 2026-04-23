
import os
import re
import pandas as pd
import sys

# Try to import pypdf
try:
    from pypdf import PdfReader
except ImportError:
    try:
        import PyPDF2 as PdfReader
    except ImportError:
        print("Error: neither pypdf nor PyPDF2 is installed.")
        # sys.exit(1) # Don't exit, just print error so I can see it.

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
humidity_files = [f for f in os.listdir(dataset_path) if 'Humidity' in f and f.endswith('.pdf')]

extracted_data = []

print(f"Found {len(humidity_files)} PDF files.")

for f in humidity_files:
    year_match = re.search(r'year (\d{4})', f)
    year = int(year_match.group(1)) if year_match else None
    
    file_path = os.path.join(dataset_path, f)
    print(f"\nProcessing {f} (Year: {year})...")
    
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        
        # Simple heuristic: Look for 'Shillong' and numbers
        # This part depends HEAVILY on the PDF layout. 
        # I'll just print the first 500 chars to see format.
        print("First 500 chars:")
        print(text[:500])
        
        extracted_data.append({'filename': f, 'year': year, 'text_snippet': text[:100]})
        
    except Exception as e:
        print(f"Failed to read {f}: {e}")

if not extracted_data:
    print("No data extracted.")
