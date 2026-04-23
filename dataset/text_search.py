
import os
import sys

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
report_file = os.path.join(dataset_path, 'horizontal_crop_vertical_year_report (4).xls')
output_file = os.path.join(dataset_path, 'text_search_output.txt')

sys.stdout = open(output_file, 'w', encoding='utf-8')

print("--- Text Search in horizontal_crop_vertical_year_report (4).xls ---")
try:
    with open(report_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    print(f"File size: {len(content)} characters")
    
    if "District" in content:
        print("XXX 'District' FOUND in text XXX")
    else:
        print("'District' NOT found")
        
    if "Shillong" in content:
        print("XXX 'Shillong' FOUND in text XXX")
    else:
        print("'Shillong' NOT found")

    if "Khasi" in content:
         print("XXX 'Khasi' FOUND in text XXX")
    else:
         print("'Khasi' NOT found")

except Exception as e:
    print(f"Error reading file: {e}")
