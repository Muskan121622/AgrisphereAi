import os
import sys
import json
from dotenv import load_dotenv

# Add the current directory to sys.path so we can import market_engine 
sys.path.append(os.getcwd())

from market_engine import fetch_agmarknet_data

def test_agmarknet():
    load_dotenv(override=True)
    state = "Gujarat"
    district = "Surendranagar"
    
    print(f"Testing Agmarknet fetch for {state}, {district}...")
    results = fetch_agmarknet_data(state, district)
    
    if results:
        print(f"✅ SUCCESS: Found {len(results)} records.")
        # Print first few records
        for i, r in enumerate(results[:5]):
            print(f"  {i+1}. {r['commodity']} at {r['market']}: ₹{r['modal_price']}/kg")
    else:
        print("❌ FAILED: No records found.")

if __name__ == "__main__":
    test_agmarknet()
