
import datetime
import random
import os
import json
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY") or os.environ.get("VITE_GROQ_CHATBOT_API_KEY")
GEMINI_API_KEY = os.environ.get("VITE_GOOGLE_GEMINI_VISION_API_KEY") or os.environ.get("GEMINI_API_KEY")

try:
    import google.generativeai as genai
except ImportError:
    genai = None

"""
Seed-to-Market Advisory Engine
Provides end-to-end intelligence:
1. Seed Selection & Sowing
2. Fertilizer & Irrigation
3. Harvest Prediction
4. Market Forecast & Selling Options
"""

def generate_ai_advisory(crop, sowing_date, acres, current_price, state="India"):
    """
    Uses Groq API to generate detailed agronomic and market advice based on the specific state.
    """
    try:
        client = Groq(
            api_key=GROQ_API_KEY,
        )

        prompt = f"""
    You are an expert agricultural consultant for farmers in {state}, India. 
    The farmer is growing {crop}. 
    Sowing date was {sowing_date}. 
    Field size is {acres} acres.
    Current market price is ₹{current_price}/Quintal.

    Analyze the situation and provide a strictly valid JSON response.
    Do NOT use markdown code blocks. Just the raw JSON.
    
    CRITICAL: FIRST, validate if growing {crop} in {state} during this month (based on sowing date) is agronomically suitable.
    Strictly follow these Indian Season Rules:
    - Wheat (Rabi): Must be sown in Oct, Nov, or Dec. Sowing in Summer (May-Aug) is IMPOSSIBLE/WRONG.
    - Rice/Paddy (Kharif): Typically sown in June-July.
    - Cotton: Sown in April-May (North) or June-July (Central/South).
    - Maize: Kharif (June-July), Rabi (Oct-Nov), or Spring.
    - Mustard: Rabi (Oct-Nov).
    
    If data violates these rules, set is_valid to false and provide a warning.

    Structure:
    {{
        "seasonality_check": {{
            "is_valid": true/false,
            "message": "Start with '⚠️ Warning:' if invalid. Explain WHY the crop/date combination is risky or wrong. If valid, leave empty or 'Good timing'."
        }},
        "crop": "{crop}",
        "state": "{state}",
        "stage_1": {{
            "seed_varieties": ["Variety 1", "Variety 2"],
            "seed_treatment": "Chemicals to use",
            "recommended_technique": "How to sow",
            "voice_summary_en": "Short conversational summary of seed advice in English (max 2 sentences).",
            "voice_summary_hi": "Short conversational summary of seed advice in Hindi (max 2 sentences)."
        }},
        "stage_2": {{
            "fertilizer_plan": "Basal and top dressing detailed",
            "irrigation_schedule": "When to water",
            "pest_protection": "What to watch for",
            "voice_summary_en": "Short conversational summary of growth advice in English.",
            "voice_summary_hi": "Short conversational summary of growth advice in Hindi."
        }},
        "stage_3": {{
            "days_remaining": 120,
            "harvest_window": "DD Mon - DD Mon YYYY",
            "harvest_signs": "Visual signs of maturity",
            "post_harvest_care": "Drying and storage tips",
            "voice_summary_en": "Short conversational summary of harvest advice in English.",
            "voice_summary_hi": "Short conversational summary of harvest advice in Hindi."
        }},
        "stage_4": {{
            "current_price": {current_price},
            "estimated_revenue": "₹XXXXX",
            "trend": "Bullish/Bearish/Stable",
            "forecast": [
                {{"week": "Week 1", "price": 0}},
                {{"week": "Week 2", "price": 0}},
                {{"week": "Week 3", "price": 0}},
                {{"week": "Week 4", "price": 0}}
            ],
            "best_mandi": "Name of best nearby mandi in {state}",
            "voice_summary_en": "Short conversational market advice and mandi recommendation in English.",
            "voice_summary_hi": "Short conversational market advice and mandi recommendation in Hindi."
        }}
    }}
    """

        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            response_format={"type": "json_object"}
        )

        return json.loads(completion.choices[0].message.content)

    except Exception as e:
        print(f"Groq Error in Advisory: {e}")
        
        # FALLBACK TO GEMINI
        if genai and GEMINI_API_KEY:
            try:
                print("🔄 Falling back to Gemini 1.5 Flash...")
                genai.configure(api_key=GEMINI_API_KEY)
                model = genai.GenerativeModel('gemini-1.5-flash')
                # Gemini isn't strict on JSON mode, so we beg it
                gemini_resp = model.generate_content(prompt + "\n\nRETURN ONLY RAW JSON. NO MARKDOWN.")
                text = gemini_resp.text
                # Clean markdown code blocks if any
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0]
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0]
                return json.loads(text)
            except Exception as gemini_e:
                 print(f"❌ Gemini Fallback Failed: {gemini_e}")
        
        return {} # Final Fallback to empty dict

def analyze_market(data):
    """
    Input: { "crop": "Rice", "sowing_date": "YYYY-MM-DD", "acres": 5, "state": "Punjab" }
    """
    crop = data.get('crop', 'rice').lower()
    sowing_date_str = data.get('sowing_date', datetime.date.today().strftime("%Y-%m-%d"))
    state = data.get('state', 'India')
    
    try:
        acres = float(data.get('acres', 1))
    except (ValueError, TypeError):
        acres = 1.0

    try:
        sowing_date = datetime.datetime.strptime(sowing_date_str, "%Y-%m-%d").date()
    except ValueError:
        sowing_date = datetime.date.today()

    # 1. Base Simulations (Quantitative)
    harvest_data = calculate_harvest_window(crop, sowing_date)
    market_data = simulate_market_prices(crop)
    
    # 2. AI Advisory Generation (Qualitative)
    # Use Groq to fill in specific agronomic advice
    ai_advisory = generate_ai_advisory(crop, sowing_date_str, acres, market_data['current_price'], state)
    
    # Merge Quantitative and Qualitative data into standard sections
    # Note: ai_advisory structure depends on the Prompt above (nested stage_X objects)
    return {
        "crop": crop.title(),
        "sowing_date": sowing_date.strftime("%Y-%m-%d"),
        "acres": acres,
        "state": state,
        "seasonality_check": ai_advisory.get('seasonality_check', {'is_valid': True, 'message': ''}),
        
        # Section 1: Pre-Sowing
        "stage_1": {
            "title": "Seed & Sowing",
            "recommended_technique": ai_advisory.get('stage_1', {}).get('recommended_technique', 'Standard drilling method'),
            "seed_varieties": ai_advisory.get('stage_1', {}).get('seed_varieties', ['Standard High Yield']),
            "seed_treatment": ai_advisory.get('stage_1', {}).get('seed_treatment', 'Treat with fungicide'),
            "voice_summary_en": ai_advisory.get('stage_1', {}).get('voice_summary_en', f"Here is the sowing advice for {crop}."),
            "voice_summary_hi": ai_advisory.get('stage_1', {}).get('voice_summary_hi', f"यहा {crop} की बुआई की सलाह है।")
        },
        
        # Section 2: Growth (Fertilizer & Irrigation)
        "stage_2": {
            "title": "Growth & Nutrition",
            "fertilizer_plan": ai_advisory.get('stage_2', {}).get('fertilizer_plan', 'Apply standard NPK'),
            "irrigation_schedule": ai_advisory.get('stage_2', {}).get('irrigation_schedule', 'Irrigate as needed'),
            "pest_protection": ai_advisory.get('stage_2', {}).get('pest_protection', 'Monitor for pests'),
            "voice_summary_en": ai_advisory.get('stage_2', {}).get('voice_summary_en', "Follow the fertilizer and irrigation plan."),
            "voice_summary_hi": ai_advisory.get('stage_2', {}).get('voice_summary_hi', "खाद और सिंचाई योजना का पालन करें।")
        },
        
        # Section 3: Harvest
        "stage_3": {
            "title": "Harvest Planning",
            "harvest_window": f"{harvest_data['start'].strftime('%d %b')} - {harvest_data['end'].strftime('%d %b %Y')}",
            "days_remaining": harvest_data['days_remaining'],
            "harvest_signs": ai_advisory.get('stage_3', {}).get('harvest_signs', 'Grains harden and change color'),
            "post_harvest_care": ai_advisory.get('stage_3', {}).get('post_harvest_care', 'Dry grain to 12% moisture'),
            "voice_summary_en": ai_advisory.get('stage_3', {}).get('voice_summary_en', "Harvest when mature."),
            "voice_summary_hi": ai_advisory.get('stage_3', {}).get('voice_summary_hi', "फसल पकने पर कटाई करें।")
        },
        
        # Section 4: Market & Sales
        "stage_4": {
            "title": "Market & Sales",
            "current_price": market_data['current_price'],
            "forecast": market_data['forecast'],
            "trend": market_data['trend'],
            "best_mandi": ai_advisory.get('stage_4', {}).get('best_mandi', f'Major {state} Mandi'),
            "estimated_revenue": calculate_revenue(crop, acres, market_data['current_price']),
            "voice_summary_en": ai_advisory.get('stage_4', {}).get('voice_summary_en', "Check market prices before selling."),
            "voice_summary_hi": ai_advisory.get('stage_4', {}).get('voice_summary_hi', "बेचने से पहले बाजार भाव चेक करें।")
        },
        
        "generated_at": datetime.datetime.now().strftime("%I:%M %p")
    }

def calculate_harvest_window(crop, sowing_date):
    # Simplified maturity days
    maturity_map = {
        'rice': (120, 150), 'wheat': (110, 140), 'cotton': (150, 180),
        'maize': (90, 110), 'tomato': (60, 80), 'potato': (90, 120),
        'sugarcane': (300, 365)
    }
    min_days, max_days = maturity_map.get(crop, (90, 120))
    
    start = sowing_date + datetime.timedelta(days=min_days)
    end = sowing_date + datetime.timedelta(days=max_days)
    days_remaining = (start - datetime.date.today()).days
    
    return {
        "start": start, "end": end, 
        "days_remaining": max(0, days_remaining)
    }

def simulate_market_prices(crop):
    # Simulation logic (preserved/simplified from original)
    base_prices = {'rice': 2200, 'wheat': 2125, 'cotton': 6000, 'maize': 2090, 
                   'tomato': 1500, 'potato': 1200, 'sugarcane': 315}
                   
    base = base_prices.get(crop, 2000)
    volatility = 0.05
    
    # Current fluctuation
    current_price = int(base * (1 + random.uniform(-volatility, volatility)))
    
    # Forecast
    forecast = []
    trend_type = random.choice(['Bullish', 'Bearish', 'Stable'])
    trend_factor = 0.02 if trend_type == 'Bullish' else -0.02 if trend_type == 'Bearish' else 0
    
    temp_price = current_price
    for i in range(1, 5):
        change = random.uniform(-0.01, 0.01) + trend_factor
        temp_price = int(temp_price * (1 + change))
        forecast.append({"week": f"Week {i}", "price": temp_price})
        
    return {"current_price": current_price, "forecast": forecast, "trend": trend_type}

def calculate_revenue(crop, acres, price):
    # Yield in Quintals per acre
    yields = {'rice': 25, 'wheat': 20, 'cotton': 10, 'maize': 30, 'tomato': 150, 'potato': 100}
    estimated_yield = yields.get(crop, 20) * acres
    return f"₹{int(estimated_yield * price):,}"

import requests

AGMARKNET_API_KEY = os.environ.get("VITE_AGMARKNET_KEY")

def fetch_agmarknet_data(state, district, market=None):
    """
    Fetches real-time data from Agmarknet API (Government of India).
    Tries multiple casing formats (Title, UPPER) to maximize hit rate.
    """
    # Standard Agmarknet API endpoint
    base_url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
    
    # Headers to mimic a browser
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://data.gov.in",
        "Referer": "https://data.gov.in/"
    }

    # Strategy: Fetch State-wide data (max 500) and filter locally to avoid server-side casing issues
    # This is more robust than guessing "Patna" vs "PATNA" in the API call
    
    # Retry Loop for Stability & Casing Discovery
    max_retries = 3
    
    # Define casings to try for the State
    state_casings = [state.title(), state.upper()]
    # If title and upper are same (e.g. "GOA"), avoid duplicate
    if state.title() == state.upper():
        state_casings = [state.title()]
        
    for attempt in range(max_retries):
        try:
            # Pick casing based on attempt (0=Title, 1=Upper, 2=Title again or fallback)
            state_query = state_casings[attempt % len(state_casings)]
            
            # Pagination: Fetch in batches to bypass 10k limit
            all_records = []
            offset = 0
            batch_size = 1000
            max_total_records = 15000  # Safety limit to prevent infinite loops
            
            print(f"Fetching Agmarknet data for State: {state_query} (Attempt {attempt+1}/{max_retries})...")
            
            while offset < max_total_records:
                params = {
                    "api-key": AGMARKNET_API_KEY,
                    "format": "json",
                    "filters[state]": state_query,
                    "limit": batch_size,
                    "offset": offset
                }
                
                if offset == 0:
                    print(f"  Fetching batch: offset {offset}...")
                else:
                    print(f"  Fetching batch: offset {offset}...", end='\r')
                
                # verify=False to bypass Govt SSL issues
                response = requests.get(base_url, params=params, headers=headers, timeout=20, verify=False)
                
                if response.status_code == 200:
                    data = response.json()
                    records = data.get('records', [])
                    
                    if not records or len(records) == 0:
                        # No more records available
                        break
                    
                    all_records.extend(records)
                    offset += batch_size
                    
                    # If we got fewer records than batch_size, we've reached the end
                    if len(records) < batch_size:
                        break
                else:
                    print(f"\n  API Error {response.status_code} at offset {offset}")
                    break
            
            records = all_records
            
            if response.status_code == 200 and records:
                
                # If we found a "substantial" number of records, assume this is the correct casing
                # If we found very few (e.g. < 5), it might be a partial match or wrong casing, so we might want to continue ONLY if we haven't tried all casings yet
                # But for now, let's accept any non-empty result, unless it's suspiciously small and we have another casing to try.
                
                if records and len(records) > 0:
                    print(f"SUCCESS: Fetched {len(records)} records for {state_query}")
                    
                    # If very few records and we have another casing option, treat it as a potential fail to force next casing
                    if len(records) < 10 and attempt < len(state_casings) - 1:
                        print(f"Warning: Only {len(records)} records found for {state_query}. Trying uppercase/variant might yield more...")
                        # But wait, we should check if our district is in here first!
                        # If our district is found, great. If not, maybe the other casing has it.
                        # Let's check locally first.
                        
                    # Debug: Print keys of the first record to understand structure
                    try:
                        print(f"DEBUG: Record Keys found: {list(records[0].keys())}")
                    except:
                        pass
                    
                    # Filter locally for District (Case-Insensitive)
                    filtered_records = []
                    target_district = district.lower().strip()
                    
                    for item in records:
                        api_district = item.get('district') or item.get('District') or item.get('District Name') or ''
                        api_market = item.get('market') or item.get('Market') or item.get('Market Name') or ''
                        
                        api_district = str(api_district).lower().strip()
                        api_market = str(api_market).lower().strip()
                        
                        # Match District (fuzzy: try exact, then partial)
                        district_match = False
                        if target_district in api_district or api_district in target_district:
                            district_match = True
                        # Try removing common suffixes ("City", "District", etc.)
                        elif target_district.replace(' city', '').replace(' district', '') in api_district:
                            district_match = True
                        elif api_district.replace(' city', '').replace(' district', '') in target_district:
                            district_match = True
                            
                        if district_match:
                            # Optional: Match Market if provided
                            if market and market.lower() not in api_market:
                                continue
                            filtered_records.append(item)
                    
                    
                    if filtered_records:
                        print(f"Match Found: {len(filtered_records)} records for {district}")
                        formatted_data = []
                        for item in filtered_records:
                            # Robust Key Lookup (Standard vs X0020 style)
                            # Helper to find key case-insensitively or with variants
                            def get_val(itm, keys):
                                for k in keys:
                                    if k in itm: return itm[k]
                                return None
                            
                            # Agmarknet returns prices in ₹/Quintal (100kg). We display ₹/kg.
                            def val_per_kg(val):
                                try:
                                    if val is None: return "N/A"
                                    price_quintal = float(val)
                                    price_kg = price_quintal / 100
                                    return f"{int(price_kg)}" # Return as int string for consistency
                                except:
                                    return val

                            formatted_data.append({
                                "market": get_val(item, ['market', 'Market']),
                                "commodity": get_val(item, ['commodity', 'Commodity']),
                                "variety": get_val(item, ['variety', 'Variety']),
                                "grade": get_val(item, ['grade', 'Grade']),
                                "min_price": val_per_kg(get_val(item, ['min_price', 'Min Price', 'Min X0020 Price'])),
                                "max_price": val_per_kg(get_val(item, ['max_price', 'Max Price', 'Max X0020 Price'])),
                                "modal_price": val_per_kg(get_val(item, ['modal_price', 'Modal Price', 'Modal X0020 Price'])),
                                "date": get_val(item, ['arrival_date', 'Arrival Date']),
                                "source": "Agmarknet (Govt. of India)"
                            })
                        return formatted_data
                    else:
                        print(f"No local match for district '{district}' in {len(records)} state records.")
                        # Do not retry if state data was found but district wasn't - it just means no data
                        return [] 
                else:
                     print(f"No records found for state: {state_query}")
                     # If state has no records, maybe retry? No, likely just empty.
                     return []
            else:
                print(f"API Error {response.status_code}")
                # Retry on 5xx errors
                if response.status_code >= 500:
                    continue
                
        except (requests.exceptions.ConnectionError, requests.exceptions.ChunkedEncodingError, requests.exceptions.ReadTimeout) as e:
            print(f"Connection Error on attempt {attempt+1}: {e}. Retrying...")
            import time
            time.sleep(1) # Backoff
            continue
            
        except Exception as e:
            print(f"Fetch failed: {e}")
            break # Don't retry logic errors
            
    print("Agmarknet returned no matching data (or failed) after all retries. Falling back to AI.")
    return []

def get_market_prices(state, district, market, category="Use best judgement"):
    """
    Hybrid: Tries Real API first, falls back to Groq AI.
    """
    # 1. Try Real API
    real_data = fetch_agmarknet_data(state, district, market)
    if real_data:
        return real_data
        
    print("Real data unavailable. Using AI Estimation...")

    # 2. Fallback to AI (Existing Logic)
    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)
        
        category_str = "vegetables and fruits" if not category or category == "All" else category
        
        prompt = f"""
        You are an expert Indian agricultural market analyst with access to real-time mandi price data.
        
        Task: Provide REALISTIC current market prices for '{category_str}' in:
        State: {state}
        District: {district}
        Date: {datetime.date.today().strftime('%d %b %Y')}
        
        CRITICAL INSTRUCTIONS:
        1. Research typical CURRENT Indian market prices for this region and season (January 2026)
        2. Prices MUST be in ₹ per kg (NOT quintals)
        3. Use REALISTIC ranges based on actual Indian wholesale mandi rates
        4. For vegetables: typically ₹10-40/kg, for fruits: ₹20-80/kg
        5. Consider seasonal availability (winter crops in January)
        6. Include 8-10 common commodities for this region
        
        Example realistic prices:
        - Tomato: ₹15-25/kg (winter season)
        - Onion: ₹20-35/kg
        - Potato: ₹12-20/kg
        - Cabbage: ₹10-18/kg
        
        STRICT JSON FORMAT:
        [
            {{
                "commodity": "Name",
                "variety": "Variety",
                "min_price": 15,
                "max_price": 25,
                "modal_price": 20,
                "date": "{datetime.date.today().strftime('%d %b %Y')}",
                "source": "AI Estimate"
            }}
        ]
        """
        
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        # Parse response (Groq might return {"commodities": [...] } or just [...])
        content = completion.choices[0].message.content
        data = json.loads(content)
        
        if isinstance(data, list):
            return data
        elif isinstance(data, dict):
            # Try to find the list inside
            for key, val in data.items():
                if isinstance(val, list):
                    return val
            return []
            
        return []

    except Exception as e:
        print(f"Groq Error in Market Prices: {e}")
        
        # FALLBACK TO GEMINI
        if genai and GEMINI_API_KEY:
            try:
                print("🔄 Falling back to Gemini 1.5 Flash for Prices...")
                genai.configure(api_key=GEMINI_API_KEY)
                model = genai.GenerativeModel('gemini-1.5-flash')
                gemini_resp = model.generate_content(prompt + "\n\nRETURN ONLY RAW JSON. NO MARKDOWN.")
                text = gemini_resp.text
                if "```json" in text: text = text.split("```json")[1].split("```")[0]
                elif "```" in text: text = text.split("```")[1].split("```")[0]
                
                data = json.loads(text)
                if isinstance(data, list): return data
                if isinstance(data, dict):
                     for k,v in data.items():
                         if isinstance(v, list): return v
                return []
            except Exception as gemini_e:
                 print(f"❌ Gemini Fallback Failed: {gemini_e}")
                 
        return []

def get_buyer_insights(crop, state, district=""):
    """
    Generate AI-driven buying insights for a specific crop/location.
    """
    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)

        # Try to get REAL market prices for grounding
        real_prices = get_market_prices(state, district, None, crop)
        price_context = ""
        current_price = "N/A"
        
        if real_prices and len(real_prices) > 0:
            latest = real_prices[0]
            current_price = latest.get('modal_price', 'N/A')
            price_context = f"REAL TIME DATA: Current price in local mandis for {crop} is ₹{current_price}/kg."
        else:
            # Fallback to simulation
            price_data = simulate_market_prices(crop)
            current_price = price_data.get('current_price', 'N/A')
            price_context = f"SIMULATED DATA: Estimated price is ₹{current_price}/Quintal."
        
        prompt = f"""
        You are a Senior Strategic Agricultural Procurement Advisor for a bulk buyer in India.
        Provide detailed, expert-level market intelligence for:
        Crop: {crop}
        Location: {district}, {state}, India
        {price_context}
        Date: {datetime.date.today().strftime('%d %B %Y')}
        
        Analyze current trends and provide 3 DETAILED strategic insights aimed at a BUYER (trader/retailer).
        
        Each insight MUST be 4-5 sentences long and cover:
        1. Price Trend — Explain clearly WHY prices are rising, falling or stable. Mention specific demand-supply factors, seasonal patterns, arrivals at mandis, and which states or weather events are influencing prices. Give a realistic price outlook for the next 2-4 weeks.
        2. Procurement Strategy — Give specific, actionable buying advice (e.g., how much to buy, when is the best window, should they negotiate, buy in spot market or contract). Explain the financial rationale and the risk of waiting.
        3. Quality & Logistics — Name specific source districts/regions in {state} or nearby states (e.g., for Bihar mention Begusarai or Khagaria, for Punjab mention Bathinda, etc.) with better quality or lower moisture produce. Advise on preferred transport modes, storage requirements, and quality certification tips for {crop}.
        
        RETURN JSON Structure:
        {{
            "analysis_brief": "2-3 sentence executive summary of the current market situation including price level, trend direction, and overall opportunity for buyers.",
            "demand_indicator": "High" | "Medium" | "Low",
            "price_forecast": "Likely to Rise" | "Stable" | "Likely to Drop",
            "msp_comparison": "Above MSP" | "Below MSP" | "Near MSP",
            "current_price": "{current_price}",
            "voice_script": "A detailed spoken briefing for the buyer (150-200 words). Start with the location and crop. Cover: current price context, demand situation, price trend reasoning, procurement recommendation, and quality/logistics tip. Use a professional but conversational tone, as if speaking to a client. End with a clear action recommendation.",
            "insights": [
                {{
                    "type": "Price Trend",
                    "icon": "trending",
                    "text": "..."
                }},
                {{
                    "type": "Procurement Strategy",
                    "icon": "strategy",
                    "text": "..."
                }},
                {{
                    "type": "Quality & Logistics",
                    "icon": "logistics",
                    "text": "..."
                }}
            ]
        }}
        """
        
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.4,
            response_format={"type": "json_object"}
        )
        
        content = completion.choices[0].message.content
        result = json.loads(content)
        # Ensure price is passed through as string/number safely
        result['current_price'] = current_price
        return result
        
    except Exception as e:
        print(f"Error generating buyer insights: {e}")
        return {
            "analysis_brief": "Unable to generate insights at the moment.",
            "demand_indicator": "Medium",
            "current_price": "N/A",
            "voice_script": "I apologize, but I am unable to access real-time market intelligence right now.",
            "insights": []
        }

def get_market_trends(state, district, commodities_data):
    """
    Generates e-NAM style market intelligence:
    1. Trend Analysis (Graph data)
    2. Strategic Advice (Sell vs Hold)
    3. Price Forecast

    commodities_data: List of dicts { 'commodity': 'Tomato', 'modal_price': 20, ... }
    """
    try:
        from groq import Groq
        # Force fresh key load from env
        current_key = os.environ.get("VITE_GROQ_CHATBOT_API_KEY") or os.environ.get("GROQ_API_KEY") or GROQ_API_KEY
        print(f"DEBUG: Market AI Key Loaded: {current_key[:5]}...{current_key[-4:] if current_key else 'None'}")
        
        client = Groq(api_key=current_key)

        # Simplify input for AI to save tokens
        # Take top 5 relevant commodities or all if fewer
        summary_list = []
        for item in commodities_data[:10]: 
            summary_list.append(f"{item.get('commodity')} ({item.get('variety', '')}): ₹{item.get('modal_price')}/kg")
        
        data_str = "\n".join(summary_list)

        prompt = f"""
        You are a friendly agricultural advisor in {district}, {state}.
        Analyze these mandi prices:
        {data_str}

        Task: Provide a detailed market analysis and advice BASED ON YOUR FORECASTS.

        Output must be VALID JSON with these exact keys:
        
        1. "trends": List of 3 top crops. {{ "commodity": "...", "trend_direction": "...", "forecast_7_days": [price1, price2...] }}
           - CRITICAL: The "forecast_7_days" MUST matches your advice.
           - If trend is "Rising", numbers must go up.
        
        2. "advice": List of 3 actionable tips (English).
           - REQUIRED: Reference the graph prediction.
           - Example: "Hold Onion for 5 days as prices are projected to rise to ₹25."
           - Example: "Sell Tomato immediately as graph shows a drop to ₹10 next week."
        
        3. "market_summary": A summary string starting with "In {district}, {state}...".
        
        4. "market_summary_hi": Translation of market_summary to Hindi.
        
        5. "advice_hi": Translation of the 3 advice tips to Hindi (List of strings).

        STRICT JSON FORMAT.
        """

        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            response_format={"type": "json_object"}
        )

        parsed_data = json.loads(completion.choices[0].message.content)
        
        # ---------------------------------------------------------
        # PROGRAMMATIC SCRIPT CONSTRUCTION (Guarantees Content!)
        # ---------------------------------------------------------
        
        # English Script construction
        summary_en = parsed_data.get("market_summary", f"Values for {district} are updated.")
        advice_en_list = parsed_data.get("advice", [])
        
        # Combine everything into a long script
        script_en_parts = [f"Hello farmer friend in {district}, {state}."]
        script_en_parts.append(summary_en)
        if advice_en_list:
            script_en_parts.append("Here is your strategic advice:")
            for idx, tip in enumerate(advice_en_list, 1):
                script_en_parts.append(f"Tip {idx}: {tip}")
        else:
            script_en_parts.append("Please monitor local markets closely.")
            
        parsed_data["voice_script_en"] = " ".join(script_en_parts)

        # Hindi Script construction
        summary_hi = parsed_data.get("market_summary_hi", summary_en) # Fallback to English if missing
        advice_hi_list = parsed_data.get("advice_hi", [])
        
        script_hi_parts = [f"Namaste {district} ke kisan bhai."]
        script_hi_parts.append(summary_hi)
        if advice_hi_list:
            script_hi_parts.append("Aapke liye zaroori salah:")
            for idx, tip in enumerate(advice_hi_list, 1):
                script_hi_parts.append(f"Salah {idx}: {tip}")
        elif advice_en_list:
            # Fallback: Read English advice if Hindi missing
            script_hi_parts.append("Strategic advice:")
            script_hi_parts.extend(advice_en_list)
            
        parsed_data["voice_script_hi"] = " ".join(script_hi_parts)

        return parsed_data

    except Exception as e:
        print(f"Groq Error in Market Trends: {e}")
        
        # FALLBACK TO GEMINI
        if genai and GEMINI_API_KEY:
            try:
                print("🔄 Falling back to Gemini 1.5 Flash for Trends...")
                genai.configure(api_key=GEMINI_API_KEY)
                model = genai.GenerativeModel('gemini-1.5-flash')
                gemini_resp = model.generate_content(prompt + "\n\nRETURN ONLY RAW JSON. NO MARKDOWN.")
                text = gemini_resp.text
                if "```json" in text: text = text.split("```json")[1].split("```")[0]
                elif "```" in text: text = text.split("```")[1].split("```")[0]
                
                parsed_data = json.loads(text)
                
                # Regenerate Scripts locally to be safe (same logic as main block)
                summary_en = parsed_data.get("market_summary", f"Values for {district} are updated.")
                advice_en_list = parsed_data.get("advice", [])
                
                script_en = f"Hello farmer friend in {district}. " + summary_en
                if advice_en_list: script_en += " Advice: " + ". ".join(advice_en_list)
                parsed_data["voice_script_en"] = script_en
                
                # Hindi fallback
                parsed_data["voice_script_hi"] = parsed_data.get("market_summary_hi", summary_en)
                
                return parsed_data
            except Exception as gemini_e:
                 print(f"❌ Gemini Fallback Failed: {gemini_e}")

        return {
            "market_summary": "Market trend analysis currently unavailable.",
            "trends": [],
            "advice": ["Monitor local mandi prices daily."],
            "voice_script_en": "Market analysis is currently unavailable. Please check back later.",
            "voice_script_hi": "Bazaar vishleshan uplabdh nahi hai. Kripya baad mein check karein."
        }


if __name__ == "__main__":
    # Test
    print(analyze_market({'crop': 'rice', 'state': 'Punjab'}))


