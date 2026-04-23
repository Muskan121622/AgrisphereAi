
import os

dataset_path = r'c:\Users\muska_ak5dqij\OneDrive\Desktop\A\Agrisphere\dataset'
report_file = os.path.join(dataset_path, 'horizontal_crop_vertical_year_report (4).xls')

try:
    with open(report_file, 'rb') as f:
        header = f.read(100)
    print(f"File Header Bytes: {header}")
    if b'html' in header.lower():
        print("It appears to be an HTML file.")
    elif b'Workbook' in header or b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1' in header:
        print("It appears to be a binary XLS file.")
    else:
        print("Unknown format.")
        
except Exception as e:
    print(f"Error: {e}")
