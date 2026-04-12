import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  "en": {
    "translation": {
      "nav": {
        "home": "Home",
        "marketplace": "Marketplace",
        "communityForum": "Community Forum",
        "advisoryHub": "Advisory Hub",
        "voiceAssistant": "Voice Assistant",
        "fertilizerAi": "Fertilizer AI",
        "pestForecast": "Pest Forecast",
        "adminDashboard": "Authority Dashboard",
        "buyerDashboard": "Buyer Dashboard",
        "farmerDashboard": "Farmer Dashboard",
        "diseaseDetection": "Disease Detection",
        "yieldPrediction": "Yield Prediction",
        "digitalTwin": "Digital Twin",
        "login": "Login",
        "getStarted": "Get Started",
        "logout": "Logout",
        "saveProfile": "Save Profile",
        "aiTools": "Smart Farming Tools",
        "seedFinder": "Seed Finder",
        "traceability": "Web3 Traceability"
      },
      "home": {
        "heroTitle1": "India's First",
        "heroTitle2": "AI + GIS Smart Farming",
        "heroSubtitle": "Intelligence Platform",
        "heroDescription": "pests, nutrient deficiency, and fungal infections. Increase yields by 30%, reduce costs by 40%.",
        "exploreFeatures": "Watch Demo",
        "floatingAlert": "Check Weather Risks",
        "featuresTitle": "Intelligent Features for",
        "featuresSubtitle": "Modern Farming",
        "featuresDesc": "Cutting-edge technology designed to revolutionize every aspect of your agricultural operations",
        "aboutTitle": "AgriSphere AI is India's first comprehensive AI + GIS Smart Farming Intelligence Platform. We combine multi-class disease detection, digital twin technology, yield prediction, and end-to-end agricultural advisory to transform farming from seed to market.",
        "aboutDesc": "Our platform supports offline mode for villages, Hindi voice commands, government scheme recommendations, farmer-buyer marketplace, and blockchain traceability. From small family farms to large commercial operations, we provide rural-accessible technology that increases yields by 30% while reducing costs by 40%.",
        "howItWorks": "How It Works",
        "howItWorksSubtitle": "Get started in minutes with our simple 4-step process",
        "ctaTitle": "Ready to Transform Your",
        "ctaSubtitle": "Agricultural Business?",
        "ctaDesc": "Join thousands of farmers who are already using AgriSphere AI to increase yields and reduce costs",
        "ctaFreeTrial": "Start Your Free Trial",
        "ctaDemo": "Schedule a Demo",
        "features": {
          "f1": {
            "title": "AI Disease Detection",
            "desc": "Advanced ML models analyze images to detect diseases & pests with 95% accuracy",
            "b1": "Pest Detection",
            "b2": "Nutrient Deficiency",
            "b3": "Fungal Infections",
            "b4": "Soil Texture Analysis"
          },
          "f2": {
            "title": "GIS Digital Twin",
            "desc": "Complete farm replica with mapping & growth tracking",
            "b1": "Field Boundaries",
            "b2": "Soil Zones",
            "b3": "Irrigation Zones",
            "b4": "Growth Stages"
          },
          "f3": {
            "title": "Yield Prediction",
            "desc": "ML-powered yields forecasting using weather & soil data",
            "b1": "Weather Analysis",
            "b2": "Soil Type Mapping",
            "b3": "Historical Data",
            "b4": "ML Forecasting"
          },
          "f4": {
            "title": "Weather Risk Engine",
            "desc": "Real-time alerts for floods, drought, and heatwaves",
            "b1": "Flood Alerts",
            "b2": "Drought Warning",
            "b3": "Heatwave Detection",
            "b4": "SMS Alerts"
          },
          "f5": {
            "title": "Fertilizer & Irrigation AI",
            "desc": "Smart NPK & water scheduling for optimal nutrition",
            "b1": "NPK Analysis",
            "b2": "Water Prediction",
            "b3": "Smart Scheduling",
            "b4": "Nutrition Optimization"
          }
        },
        "stats": {
          "activeFarmers": "Active Farmers",
          "accuracyRate": "Accuracy Rate",
          "fieldsMapped": "Fields Mapped",
          "yieldIncrease": "Yield Increase"
        },
        "bulletin": {
          "liveUpdate": "Live Daily Bulletin",
          "playBulletin": "Play Bulletin",
          "stopAudio": "Stop Audio",
          "generating": "Generating your daily insight..."
        },
        "advanced": {
          "title": "Advanced AI Intelligence",
          "desc": "Cutting-edge features that set AgriSphere AI apart",
          "pests": {
            "title": "Pest Attack Prediction",
            "desc": "AI forecasts pest attack probability (0-100%) for next 7 days",
            "b1": "Climate Analysis",
            "b2": "7-Day Risk Forecast",
            "b3": "Prevention Alerts",
            "b4": "Treatment Recommendations"
          },
          "seedToMarket": {
            "title": "Seed-to-Market Advisory",
            "desc": "Complete guidance from seed selection to market pricing",
            "b1": "Seed Selection",
            "b2": "Sowing Time",
            "b3": "Harvest Prediction",
            "b4": "Market Pricing"
          },
          "voice": {
            "title": "Voice Assistant (Hindi)",
            "desc": "Farmers speak in local language, AI responds with advice",
            "b1": "Hindi Support",
            "b2": "Voice Recognition",
            "b3": "Local Languages",
            "b4": "Audio Responses"
          },
          "schemes": {
            "title": "Government Schemes AI",
            "desc": "Auto-identifies subsidies, loans, and PM-KISAN benefits",
            "b1": "Subsidy Matching",
            "b2": "Loan Eligibility",
            "b3": "Insurance Plans",
            "b4": "PM-KISAN"
          },
          "marketplace": {
            "title": "Farmer-Buyer Marketplace",
            "desc": "Direct selling platform with AI pricing and logistics",
            "b1": "Direct Selling",
            "b2": "AI Pricing",
            "b3": "Logistics",
            "b4": "Income Boost"
          },
          "blockchain": {
            "title": "Blockchain Traceability",
            "desc": "Track crop origin and supply chain for quality assurance",
            "b1": "Origin Tracking",
            "b2": "Supply Chain",
            "b3": "Authenticity",
            "b4": "Quality Assurance"
          }
        },
        "rural": {
          "title": "Built for Rural India",
          "subtitle": "Accessible technology designed for village farmers",
          "offline": {
            "title": "Offline Mode",
            "desc": "Works without internet with local caching"
          },
          "languages": {
            "title": "Hindi + Local Languages",
            "desc": "Full support for regional languages and voice"
          },
          "sms": {
            "title": "SMS Fallback Alerts",
            "desc": "Critical alerts sent via SMS when offline"
          },
          "community": {
            "title": "Community Forums",
            "desc": "Farmers discuss pests and schemes"
          }
        },
        "women": {
          "title": "Rural Women Agri-Entrepreneur",
          "subtitle": "Empowering women-led microbusinesses in agriculture",
          "microbusiness": {
            "title": "Microbusiness Support",
            "desc": "Training for honey, spices, and handicraft businesses"
          },
          "training": {
            "title": "Training Modules",
            "desc": "Comprehensive training for women entrepreneurs"
          },
          "marketAccess": {
            "title": "Marketplace Access",
            "desc": "Direct listings for women-led products"
          }
        },
        "testimonials": {
          "title": "What Farmers Say",
          "subtitle": "Real stories from farmers transforming their operations",
          "t1": {
            "name": "Rajesh Kumar",
            "loc": "Punjab, India",
            "text": "AgriSphere's multi-class AI detected stem borer in my wheat early. The pest prediction saved my entire 10-acre crop and increased yield by 35%!",
            "benefit": "35% yield increase"
          },
          "t2": {
            "name": "Anita Sharma",
            "loc": "Maharashtra, India",
            "text": "The GIS digital twin mapped my field perfectly. AI-powered management cut water usage by 45%. Marketplace got me ₹2000/quintal extra!",
            "benefit": "45% water savings"
          },
          "t3": {
            "name": "Vikram Patel",
            "loc": "Gujarat, India",
            "text": "Voice assistant in Hindi is amazing! 'Tamatar mein rog hai' - instantly got disease type, treatment cost. Offline mode works perfectly in my village.",
            "benefit": "Hindi voice support"
          }
        },
        "tech": {
          "title": "Built on Cutting-Edge Technology",
          "subtitle": "Enterprise-grade tech stack powering your farm",
          "t1": "Yield prediction",
          "t2": "Time series analysis",
          "t3": "Advanced regression",
          "t4": "Digital twin mapping",
          "t5": "Disease detection",
          "t6": "Supply traceability",
          "t7": "Hindi commands",
          "t8": "Village accessibility",
          "t9": "Alert fallback",
          "t10": "Instant notifications",
          "t11": "Data security"
        },
        "learnMore": "Learn more",
        "footer": {
          "tagline": "Empowering farmers with AI and GIS technology for sustainable, profitable agriculture.",
          "col1": "Features",
          "col2": "Platform",
          "col3": "Support",
          "iot": "IoT Monitoring",
          "weather": "Weather Alerts",
          "community": "Community",
          "help": "Help Center",
          "docs": "Documentation",
          "api": "API Guide",
          "contact": "Contact",
          "copyright": "© 2025 AgriSphere AI. All rights reserved."
        },
        "heroBadge": "AI-Powered Smart Agriculture"
      },
      "disease": {
        "title": "AI Crop Disease Detection",
        "backHome": "Back to Home",
        "desc": "Revolutionary multi-class AI system detecting diseases, pests, nutrient deficiencies, and soil texture from leaf, stem, fruit, and soil images with 95%+ accuracy using ensemble CNN models.",
        "startBtn": "Start Detection",
        "uploadBtn": "Upload Images",
        "saveBtn": "Saved Reports",
        "hideBtn": "Hide Saved",
        "reportsTitle": "Offline Disease Reports",
        "noReports": "No saved reports found.",
        "capTitle": "Multi-Class Detection Capabilities",
        "pestTitle": "Pest Detection & Treatment",
        "aiTitle": "Enhanced Multi-Class AI Detection",
        "howTitle": "How AI Detection Works",
        "accuracy": "Accuracy",
        "types": {
          "leaf": {
            "title": "Leaf Disease Detection",
            "desc": "Analyze leaf images for fungal infections, bacterial diseases, and viral infections",
            "d1": "Blight",
            "d2": "Rust",
            "d3": "Mosaic Virus",
            "d4": "Bacterial Spot"
          },
          "stem": {
            "title": "Stem Analysis",
            "desc": "Detect stem borers, rot, and structural damage in crop stems",
            "d1": "Stem Borer",
            "d2": "Stem Rot",
            "d3": "Canker",
            "d4": "Wilt"
          },
          "fruit": {
            "title": "Fruit Inspection",
            "desc": "Identify fruit diseases, pest damage, and quality issues",
            "d1": "Fruit Rot",
            "d2": "Pest Damage",
            "d3": "Cracking",
            "d4": "Discoloration"
          },
          "soil": {
            "title": "Soil Health Analysis",
            "desc": "AI-powered soil texture and nutrient deficiency detection",
            "d1": "Nutrient Deficiency",
            "d2": "pH Imbalance",
            "d3": "Salinity",
            "d4": "Compaction"
          }
        },
        "pests": {
          "p1": {
            "name": "Aphids",
            "damage": "Sap sucking",
            "treatment": "Neem oil spray"
          },
          "p2": {
            "name": "Thrips",
            "damage": "Leaf damage",
            "treatment": "Blue sticky traps"
          },
          "p3": {
            "name": "Whitefly",
            "damage": "Virus transmission",
            "treatment": "Yellow traps"
          },
          "p4": {
            "name": "Caterpillars",
            "damage": "Leaf eating",
            "treatment": "Bt spray"
          }
        },
        "how": {
          "s1": {
            "title": "Image Capture",
            "desc": "Take photo of affected plant part"
          },
          "s2": {
            "title": "AI Analysis",
            "desc": "CNN models process image data"
          },
          "s3": {
            "title": "Classification",
            "desc": "Multi-class detection results"
          },
          "s4": {
            "title": "Treatment Plan",
            "desc": "Actionable recommendations"
          }
        },
        "stats": {
          "disease": "Disease Activity",
          "pests": "Pest Pressure",
          "soil": "Soil Health History",
          "diseaseDesc": "Based on weather & crops",
          "pest": "Pest Detection",
          "pestDesc": "Forecast for next 7 days",
          "soilDesc": "Recent nutrient checks"
        },
        "score": "Score",
        "issues": "Issues",
        "diseasesCount": "Monitored Diseases",
        "pestsCount": "Active Pest Threats",
        "viewSummary": "View Quick Summary"
      },
      "marketplace": {
        "title": "Smart Marketplace & Advisory",
        "subtitle": "Get AI-driven crop advisory and connect directly with buyers/sellers in your area.",
        "tabs": {
          "advisory": "Advisory",
          "listings": "Listings",
          "trends": "Trends",
          "demands": "Buyer Demands"
        },
        "demands": {
          "title": "Live Buyer Demands",
          "noDemands": "No active buyer demands found for your region.",
          "verified": "Verified Buyer",
          "targetPrice": "Target Price",
          "contactBtn": "Contact Buyer",
          "locationPref": "Location Preference"
        },
        "advisory": {
          "title": "AgriSphere Smart Advisory",
          "desc": "Personalized, state-specific AI advice based on your sowing date and locality.",
          "selectCrop": "Select Crop",
          "chooseCrop": "Choose a crop...",
          "state": "State",
          "selectState": "Select your state",
          "sowingDate": "Sowing Date",
          "pickDate": "Pick a date",
          "fieldSize": "Field Size (Acres)",
          "analyzeBtn": "Generate AI Report",
          "analyzing": "Generating Report...",
          "missingInfo": "Information Missing",
          "selectPrompt": "Please select crop, state, and sowing date.",
          "readyTitle": "AI Advisory Report for",
          "steps": {
            "s1": {
              "title": "Phase 1: Seed & Sowing",
              "subtitle": "Optimal techniques and variety selection"
            },
            "s2": {
              "title": "Phase 2: Growth & Care",
              "subtitle": "Irrigation and fertilization schedule"
            },
            "s3": {
              "title": "Phase 3: Maturity & Harvest",
              "subtitle": "Monitoring signs of readiness"
            },
            "s4": {
              "title": "Phase 4: Market Intelligence",
              "subtitle": "Price forecasting and mandi selection"
            }
          },
          "results": {
            "varieties": "Recommended Varieties",
            "technique": "Recommended Technique",
            "proTip": "Pro-Tip / Seed Treatment",
            "fertilizer": "Fertilizer Schedule",
            "irrigation": "Irrigation Plan",
            "pestAlert": "Pest & Disease Alert",
            "daysLeft": "Days Remaining",
            "harvestWindow": "Optimal Harvest Window",
            "maturitySigns": "Signs of Maturity",
            "postHarvest": "Post-Harvest Care",
            "recommendedMandi": "Recommended Mandi",
            "bestValue": "Best value for your region in",
            "sellHere": "Sell My Produce Here"
          },
          "selectDistrict": "Select District",
          "stages": {
            "s1": {
              "title": "Phase 1: Seed & Sowing",
              "subtitle": "Optimal techniques and variety selection"
            },
            "s2": {
              "title": "Phase 2: Growth & Care",
              "subtitle": "Irrigation and fertilization schedule"
            },
            "s3": {
              "title": "Phase 3: Maturity & Harvest",
              "subtitle": "Monitoring signs of readiness"
            },
            "s4": {
              "title": "Phase 4: Market Intelligence",
              "subtitle": "Price forecasting and mandi selection"
            }
          }
        },
        "trends": {
          "title": "AI Market Insights",
          "livePrices": "Live Mandi Prices",
          "forecast": "Price Forecast",
          "updated": "Market Data Updated",
          "fetched": "Latest mandi rates and AI trends synced.",
          "fetchError": "Failed to fetch market trends.",
          "detailsMissing": "Location Missing",
          "enterStateDistrict": "Please enter State and District to see trends.",
          "findMandiRates": "Find today's mandi rates",
          "selectState": "Select State for Rates",
          "enterDistrict": "Enter District Name",
          "typeDistrict": "Type your district...",
          "category": "Category",
          "allCommodities": "All Commodities",
          "vegetables": "Vegetables",
          "fruits": "Fruits",
          "cereals": "Cereals",
          "pulses": "Pulses",
          "oilseeds": "Oilseeds",
          "spices": "Spices",
          "fibres": "Fibres",
          "flowers": "Flowers",
          "dryFruits": "Dry Fruits",
          "beverages": "Beverages",
          "checkRates": "Check Live Rates",
          "strategicAdvisory": "Strategic Advisory",
          "recommendations": "Recommendations",
          "forecastTitle": "7-Day Price Forecast",
          "source": "Verified Govt Source",
          "minPrice": "Min",
          "maxPrice": "Max",
          "modalPrice": "Market Rate",
          "noRates": "No price data found for this selection.",
          "low": "Low",
          "medium": "Medium",
          "high": "High"
        },
        "listings": {
          "filters": "Market Filters",
          "search": "Search crop...",
          "contactFarmer": "Contact Farmer",
          "noListings": "No listings found in your area.",
          "form": {
            "postTitle": "Sell Your Crop",
            "postSubtitle": "Post a free listing to reach local buyers.",
            "name": "Your Name",
            "contact": "Phone Number",
            "crop": "Crop Name",
            "qty": "Quantity (Quintals)",
            "price": "Price (per Quintal)",
            "selectState": "Select Your State",
            "submit": "Post Listing"
          },
          "fillAllFields": "Please fill in all listing details.",
          "listingPosted": "Listing posted successfully",
          "listingLive": "Market Listing Live!",
          "listingLiveMsg": "Your {{crop}} listing is now visible to buyers at ₹{{price}}/Q.",
          "listingError": "Failed to post listing.",
          "negotiate": {
            "title": "Negotiate for {{crop}}",
            "desc": "Propose a counter-offer to {{seller}}. The farmer will review and respond.",
            "send": "Send Counter-Offer"
          },
          "negotiations": {
            "myOffers": "My Sent Offers",
            "receivedOffers": "Offers Received from Buyers",
            "accept": "Accept Offer",
            "reject": "Reject",
            "statusUpdated": "Negotiation status updated.",
            "newOffer": "New Counter-Offer Received!"
          }
        },
        "alerts": {
          "seasonality": "Seasonality Warning"
        },
        "states": {
          "bihar": "Bihar",
          "uttarPradesh": "Uttar Pradesh",
          "punjab": "Punjab",
          "haryana": "Haryana",
          "madhyaPradesh": "Madhya Pradesh"
        },
        "langEn": "English",
        "langHi": "Hindi",
        "langBn": "Bengali",
        "langAs": "Assamese",
        "langKn": "Kannada"
      },
      "advisoryHub": {
        "title": "AgriSphere Advisory Hub",
        "subtitle": "Real-time schemes, news, and expert videos for smart farming.",
        "tabs": {
          "schemes": "Schemes & Subsidies",
          "calculator": "Fertilizer Calculator",
          "news": "Farming News",
          "videos": "Video Tutorials"
        },
        "refresh": "Refresh Content",
        "eligibility": {
          "title": "Check Eligibility",
          "desc": "Update your profile to see relevant government schemes.",
          "state": "State",
          "landSize": "Land Size (Acres)",
          "farmerType": "Farmer Type",
          "profileUpdated": "Profile updated! Checking eligibility..."
        },
        "offline": {
          "loadedCache": "Offline: Loaded schemes from cache."
        },
        "success": {
          "addedSchemes": "Added {{count}} new schemes."
        },
        "info": {
          "noNewSchemes": "AI couldn't find any new unique schemes right now."
        },
        "error": {
          "loadSchemes": "Failed to load more schemes."
        },
        "loading": {
          "askingAi": "Asking AI for more schemes...",
          "findingSchemes": "Finding New Schemes...",
          "loadingNews": "Loading News...",
          "loadingVideos": "Loading Videos...",
          "loadingCalc": "Loading Calculator..."
        },
        "buttons": {
          "loadMore": "Load More",
          "findAi": "Find More from AI",
          "refresh": "Refresh Content",
          "calculate": "Calculate Nutrients"
        },
        "noData": {
          "noSchemes": "No eligible schemes found for this profile in {{state}}.",
          "allIndiaBtn": "View All India Schemes",
          "noNews": "No news available at the moment.",
          "noVideos": "No videos available at the moment."
        },
        "toasts": {
          "videosRefreshed": "Videos refreshed!",
          "newsRefreshed": "News refreshed!",
          "schemesRefreshed": "Schemes refreshed!"
        },
        "configNeeded": {
          "title": "Configuration Needed",
          "desc": "Please add {{key}} to your .env file to see {{feature}}."
        }
      },
      "yield": {
        "title": "Optimized Yield Prediction",
        "desc": "Predict crop yield using advanced XGBoost models trained on 23 years of Meghalaya's climate data.",
        "supportedCrops": "Supported Crops",
        "inputTitle": "Input Parameters",
        "selectCrop": "Select Crop",
        "area": "Area (Acres)",
        "areaNote": "1 Acre ≈ 0.4 Hectares",
        "rainfall": "Rainfall (mm)",
        "temp": "Avg Temp (°C)",
        "humidity": "Humidity (%)",
        "fertilizer": "Fertilizer (kg)",
        "pesticide": "Pesticide (kg)",
        "soilPh": "Soil pH",
        "soilN": "Soil N (kg/ha)",
        "soilP": "Soil P (kg/ha)",
        "soilK": "Soil K (kg/ha)",
        "predictBtn": "Generate Prediction",
        "analyzing": "Analyzing...",
        "resultsTitle": "Prediction Results",
        "totalProduction": "Total Est. Production",
        "revenue": "Revenue",
        "yieldEfficiency": "Yield Efficiency",
        "models": {
          "rf": "Random Forest",
          "lstm": "LSTM Networks",
          "gb": "Gradient Boosting",
          "xgb": "XGBoost"
        },
        "potentialRevenue": "Potential Revenue",
        "perHectare": "per hectare",
        "approx": "approximate",
        "confidence": "Confidence Interval",
        "modelUsed": "Model Used",
        "trainingData": "Training Data",
        "accuracyNote": "Note: Rice predictions are now highly accurate (~99.7%) thanks to the integration of Soil Health Card data (pH, N, P, K).",
        "kharifSeason": "Kharif Season",
        "tonsPerHa": "t/ha",
        "confidenceRange": "Confidence Range",
        "fiveYearAvg": "5-Year Average",
        "trend": "Historical Trend",
        "regionalPerformance": "Regional Performance",
        "readyDesc": "Enter parameters and click \"Generate Prediction\" to see results.",
        "predictionSuccess": "Prediction Success",
        "estimatedProduction": "Estimated Production",
        "tonsUnit": "Tons",
        "summary": {
          "report": "Your predicted yield for {{crop}} is {{total}} tons. To maintain this efficiency of {{efficiency}} tons per hectare, ensure optimal NPK levels and timely irrigation as per the weather forecast."
        },
        "avgTemp": "Avg Temp (°C)"
      },
      "pest": {
        "title": "Pest Attack Prediction (AI Forecasting)",
        "inputTitle": "Field Conditions",
        "inputDesc": "Enter current weather and crop details",
        "selectCrop": "Select Crop",
        "temp": "Temperature (°C)",
        "humidity": "Humidity (%)",
        "rainfall": "Rainfall (mm)",
        "predictBtn": "Predict Pest Risk",
        "analyzing": "Analyzing Risk...",
        "resultsTitle": "Forecast Result",
        "probability": "Pest Attack Probability",
        "riskLevel": "{{level}} Risk",
        "primaryThreat": "Primary Threat",
        "recommendation": "Recommendation",
        "forecast7Days": "7-Day Risk Forecast",
        "readyDesc": "Adjust sliders and click Predict to see AI Analysis",
        "advisorTitle": "AI Agro-Advisor",
        "advisorDesc": "Hear this analysis in your language",
        "stopBtn": "Stop",
        "summary": {
          "prediction": "Prediction: {{name}} with {{level}} risk ({{score}}%).",
          "recommendation": "Recommendation: {{recommendation}}",
          "weather": "Weather: {{temp}}°C, {{humidity}}% Humidity, {{rainfall}}mm Rain.",
          "crop": "Crop: {{crop}}."
        }
      },
      "fertilizer": {
        "title": "Smart Fertilizer & Irrigation",
        "subtitle": "AI-powered recommendations for optimal crop nutrition and water management",
        "inputTitle": "Field Parameters",
        "cropType": "Crop Type",
        "selectCrop": "Select crop",
        "nitrogen": "Nitrogen (N)",
        "phosphorus": "Phosphorus (P)",
        "potassium": "Potassium (K)",
        "moisture": "Soil Moisture (%)",
        "moistureDry": "Dry",
        "moistureWet": "Wet",
        "rainfall": "Rainfall Forecast (mm)",
        "soilPh": "Soil pH",
        "growthStage": "Growth Stage",
        "selectStage": "Select Stage",
        "stages": {
          "sowing": "Sowing",
          "vegetative": "Vegetative",
          "flowering": "Flowering",
          "harvest": "Harvest"
        },
        "getBtn": "Get Recommendation",
        "analyzing": "Analyzing...",
        "results": {
          "noDataTitle": "No Recommendations Yet",
          "noDataDesc": "Enter field details and click \"Get Recommendation\" to see AI insights.",
          "planTitle": "Fertilizer Plan",
          "adjustments": "Smart Adjustments",
          "phAlert": "pH Alert",
          "irrigationTitle": "Irrigation Schedule",
          "waterAmount": "Water Amount",
          "applyWater": "Apply {{amount}} water.",
          "rainNote": "Rain expected next 3 days.",
          "moistureNote": "Keep moisture optimal.",
          "temperature": "Temperature",
          "windSpeed": "Wind Speed",
          "normal": "Normal"
        }
      },
      "community": {
        "title": "Kisan Sarathi Community",
        "subtitle": "Connect with fellow farmers, share knowledge, and grow together.",
        "searchPlaceholder": "Search discussions, questions, or experts...",
        "askBtn": "Ask a Question",
        "tabs": {
          "feed": "Community Feed",
          "experts": "Expert Advice",
          "myPosts": "My Activity"
        },
        "stats": {
          "members": "Members",
          "discussions": "Discussions",
          "experts": "Experts Online"
        },
        "chatWith": "Chat with",
        "globalChat": "Global Chat",
        "onlineFarmers": "Online Farmers",
        "you": "You",
        "deleteMessageConfirm": "Are you sure you want to delete this message?",
        "replyTitle": "Write a reply...",
        "replyBtn": "Reply",
        "noReplies": "No replies yet. Be the first!",
        "translatingToast": "AI is translating this post...",
        "aiTranslating": "AI is translating this post.",
        "translatePost": "Translate Post",
        "deleteMessage": "Delete Message",
        "errorPost": "Failed to post question",
        "errorSend": "Failed to send message"
      },
      "common": {
        "today": "Today",
        "yesterday": "Yesterday",
        "messages": "New Messages",
        "clickToChat": "Click to chat",
        "active": "active",
        "loading": "Loading...",
        "localizing": "Localizing...",
        "localized": "Analysis localized to {{lang}} in {{dialect}} dialect.",
        "dialectTransform": "Transforming advice into {{dialect}} dialect...",
        "listening": "Listening...",
        "voiceError": "Voice input failed. Please try again.",
        "error": "Error",
        "success": "Success",
        "generatedOn": "Generated on",
        "crops": {
          "rice": "Rice",
          "wheat": "Wheat",
          "maize": "Maize",
          "sugarcane": "Sugarcane",
          "potato": "Potato",
          "tomato": "Tomato",
          "ginger": "Ginger"
        },
        "playEnglish": "Play English (Full)",
        "playHindi": "Play Hindi (हिंदी)",
        "soldBy": "Sold by",
        "other": "Other",
        "farmerTypes": {
          "small": "Small Farmer",
          "marginal": "Marginal Farmer",
          "large": "Large Farmer",
          "landless": "Landless Laborer"
        },
        "voiceUnsupported": "Voice search not supported in this browser.",
        "offline": "Offline",
        "tryAgain": "Try Again",
        "ready": "Ready",
        "in": "in",
        "unit": {
          "acres": "Acres",
          "hectares": "Hectares",
          "tons": "Tons",
          "quintals": "Quintals",
          "kilograms": "kg"
        },
        "all": "All States"
      },
      "digitalTwin": {
        "title": "GIS Smart Farm Digital Twin",
        "subtitle": "Create a complete digital replica of your farm with advanced GIS mapping, multi-layer visualization, and real-time monitoring for precision agriculture.",
        "featuring": "✨ Featuring: Farm Boundaries • Soil Zones • Irrigation Planning • Pest Risk Maps • NDVI Crop Health • Weather Analysis",
        "setupTitle": "Farm Setup",
        "setupDesc": "Enter your farm details or coordinates to generate your digital twin.",
        "farmName": "Farm Name",
        "ownerName": "Owner Name",
        "state": "State",
        "district": "District",
        "town": "Town/Village",
        "coordinates": "Coordinates",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "useCurrent": "Use Current Location",
        "size": "Farm Size (Acres)",
        "generateBtn": "Generate Digital Twin",
        "generating": "Generating Digital Twin...",
        "quickDemo": "Quick Demo",
        "drawMap": "Draw on Map",
        "capabilities": "Digital Twin Capabilities",
        "visualization": "Multi-Layer GIS Visualization",
        "interactiveMap": "Interactive GIS Map: {{name}}",
        "liveData": "Live Farm Intelligence",
        "explainBtn": "Explain Farm Status",
        "stopBtn": "Stop",
        "accuracy": "Accuracy",
        "update": "Update Digital Twin",
        "hectares": "Hectares",
        "area": "Farm Area",
        "features": {
          "soil": {
            "title": "Soil Zone Classification",
            "desc": "Multi-layer soil analysis with texture, pH, and nutrient mapping",
            "f1": "Soil Texture",
            "f2": "pH Zones",
            "f3": "Nutrient Maps",
            "f4": "Fertility Index"
          },
          "irrigation": {
            "title": "Irrigation Zone Planning",
            "desc": "Smart irrigation zone design based on crop needs and soil conditions",
            "f1": "Water Zones",
            "f2": "Drip Planning",
            "f3": "Sprinkler Layout",
            "f4": "Efficiency Maps"
          },
          "pest": {
            "title": "Pest-Prone Area Detection",
            "desc": "Historical pest data analysis to identify high-risk zones",
            "f1": "Risk Zones",
            "f2": "Pest History",
            "f3": "Prevention Areas",
            "f4": "Treatment Maps"
          },
          "growth": {
            "title": "Crop Growth Staging",
            "desc": "Real-time crop growth stage monitoring across different field zones",
            "f1": "Growth Stages",
            "f2": "Maturity Maps",
            "f3": "Harvest Zones",
            "f4": "Yield Prediction"
          },
          "weather": {
            "title": "Weather Microclimate",
            "desc": "Field-specific microclimate analysis and weather pattern mapping",
            "f1": "Temperature Zones",
            "f2": "Humidity Maps",
            "f3": "Wind Patterns",
            "f4": "Frost Risk"
          }
        },
        "layers": {
          "satellite": "Satellite Imagery",
          "soilHealth": "Soil Health",
          "cropHealth": "Crop Health",
          "weather": "Weather Data",
          "pests": "Pest Alerts",
          "base": "Base Layer",
          "analysis": "Analysis Layer",
          "monitoring": "Monitoring Layer",
          "environmental": "Environmental Layer",
          "alert": "Alert Layer",
          "daily": "Daily",
          "weekly": "Weekly",
          "realtime": "Real-time",
          "hourly": "Hourly",
          "asneeded": "As needed"
        },
        "drawDesc": "Pinpoint your location and trace the exact shape of your land.",
        "exploreNote": "Explore {{owner}}'s farm with multi-layer GIS visualization. Click on zones for detailed information.",
        "initializing": {
          "status": "Initializing Digital Twin Engine...",
          "mapping": "Mapping boundaries for",
          "soil": "Analyzing soil sensor data layers...",
          "irrigation": "Designing irrigation grid for",
          "pests": "Calculating historical pest risk zones..."
        },
        "insights": {
          "mappedZones": "Mapped Soil Zones",
          "activeZones": "Active Irrigation Zones",
          "growthStages": "Avg Growth Stage",
          "health": "Health Score"
        },
        "summary": {
          "prefix": "Farm Status Report for {{area}} hectares.",
          "zones": "We have identified {{soil}} distinct soil zones and {{irrigation}} irrigation zones.",
          "health": "Overall crop health is {{health}}%.",
          "pestWarning": "Warning: High pest risk detected. Immediate action recommended.",
          "pestLow": "Pest risk is currently low."
        }
      },
      "iot": {
        "title": "IoT Smart Farm Monitoring",
        "subtitle": "Real-time soil health and environment monitoring using low-cost sensor nodes.",
        "liveMonitoring": "Live Monitoring",
        "viewAnalytics": "View Analytics",
        "liveDataHeader": "Live Sensor Data",
        "moisture": "Moisture",
        "ph": "pH Level",
        "temp": "Temp",
        "nitrogen": "Nitrogen",
        "phosphorus": "Phosphorus",
        "potassium": "Potassium",
        "alertsTitle": "Active Alerts",
        "recsTitle": "Irrigation Recommendations",
        "alertsCount": "Active Alerts ({{count}})",
        "recsCount": "Irrigation Recommendations ({{count}})",
        "noAlerts": "No active alerts. Your field conditions are optimal.",
        "noRecs": "No irrigation recommendations at this time.",
        "startIrrigation": "Start Irrigation",
        "irrigationFor": "for {{duration}} mins",
        "features": {
          "title": "System Features",
          "f1": {
            "title": "Real-time Monitoring",
            "desc": "24/7 continuous soil parameter monitoring",
            "items": [
              "Soil Moisture",
              "pH Levels",
              "Temperature",
              "Conductivity"
            ]
          },
          "f2": {
            "title": "Smart Alerts",
            "desc": "AI-powered alert system for critical conditions",
            "items": [
              "Threshold Alerts",
              "Predictive Warnings",
              "Mobile Notifications",
              "Email Reports"
            ]
          },
          "f3": {
            "title": "Auto Irrigation",
            "desc": "Automated irrigation based on soil conditions",
            "items": [
              "Smart Scheduling",
              "Zone Control",
              "Water Optimization",
              "Remote Control"
            ]
          },
          "f4": {
            "title": "Data Analytics",
            "desc": "Historical data analysis and trend monitoring",
            "items": [
              "Trend Analysis",
              "Performance Reports",
              "Yield Correlation",
              "ROI Tracking"
            ]
          }
        },
        "benefits": {
          "title": "Smart Farming Benefits",
          "b1": {
            "title": "40% Water Savings",
            "desc": "Precision irrigation control"
          },
          "b2": {
            "title": "25% Yield Increase",
            "desc": "Optimal growing conditions"
          },
          "b3": {
            "title": "60% Labor Reduction",
            "desc": "Automated monitoring"
          },
          "b4": {
            "title": "Real-time Insights",
            "desc": "Instant decision making"
          }
        }
      },
      "weather": {
        "title": "Smart Weather Risks & Alerts",
        "subtitle": "Advanced GIS-based weather risk detection for your specific farm location.",
        "locationTitle": "Risk Scanning Control",
        "locationDesc": "Select your location to check for local weather hazards and receive automated alerts.",
        "selectState": "Select State",
        "selectDistrict": "Select District",
        "phoneLabel": "Phone Number (for SMS Alerts)",
        "phoneVerify": "Verify",
        "phoneCalling": "Calling...",
        "scanBtn": "Check Risks",
        "scanning": "Scanning GIS Data...",
        "systemSafe": "System Safe",
        "alert": "Alert",
        "riskDetected": "Risk Detected",
        "standby": "System Standby",
        "placeholder": "Select your location and click 'Check Risks' to start scanning your area for hazards.",
        "temp": "Temperature",
        "humidity": "Humidity",
        "toasts": {
          "verifyTitle": "📞 Incoming Call from Twilio",
          "verifyDesc": "Answer the call and enter code: {{code}}",
          "verifyFailed": "Verification Failed",
          "riskTitle": "⚠️ Risk Detected",
          "smsSent": "🚨 SMS Alert sent to {{phone}}",
          "safeTitle": "✅ Conditions Safe",
          "safeDesc": "No severe weather threats detected."
        }
      },
      "voiceAssistant": {
        "hero": {
          "title": "Voice Assistant for Farmers",
          "desc": "Speak naturally in Hindi or your local language. Get instant AI-powered agricultural advice with voice responses designed for rural farmers.",
          "startBtn": "Start Speaking",
          "chooseLangBtn": "Choose Language"
        },
        "features": {
          "sectionTitle": "Voice Assistant Features",
          "f1": {
            "title": "Hindi Voice Recognition",
            "desc": "Speak naturally in Hindi and get instant responses",
            "example": "Gehun mein rog a gaya hai, kya karein?",
            "response": "Wheat disease detected. Apply fungicide spray."
          },
          "f2": {
            "title": "Local Language Support",
            "desc": "Support for regional languages across India"
          },
          "f3": {
            "title": "Audio Responses",
            "desc": "Get detailed audio responses in your preferred language",
            "item1": "Clear pronunciation",
            "item2": "Slow/Fast speed",
            "item3": "Repeat option",
            "item4": "Save audio"
          },
          "f4": {
            "title": "Offline Voice Commands",
            "desc": "Basic voice commands work even without internet",
            "item1": "Weather check",
            "item2": "Crop calendar",
            "item3": "Basic diagnosis",
            "item4": "Emergency help"
          }
        },
        "examples": {
          "sectionTitle": "Real Conversation Examples",
          "solutionPrefix": "Solution",
          "e1": {
            "farmer": "Tomato mein patte peelay ho rahe hain",
            "farmerTrans": "Tomato leaves are turning yellow",
            "ai": "यह नाइट्रोजन की कमी हो सकती है। यूरिया का छिड़काव करें।",
            "aiTrans": "This could be nitrogen deficiency. Apply urea spray.",
            "solution": "Apply 2kg urea per acre with water spray"
          },
          "e2": {
            "farmer": "Kya aaj pani dena chahiye?",
            "farmerTrans": "Should I water today?",
            "ai": "मिट्टी में नमी 40% है। 2 दिन बाद पानी दें।",
            "aiTrans": "Soil moisture is 40%. Water after 2 days.",
            "solution": "Wait 2 days, then apply 25mm irrigation"
          },
          "e3": {
            "farmer": "Fasal kab kaatni chahiye?",
            "farmerTrans": "When should I harvest the crop?",
            "ai": "आपकी गेहूं 15 दिन में तैयार होगी। दाने सुनहरे होने का इंतज़ार करें।",
            "aiTrans": "Your wheat will be ready in 15 days. Wait for golden grains.",
            "solution": "Harvest when moisture content is 12-14%"
          }
        },
        "demo": {
          "sectionTitle": "Try Voice Assistant Live",
          "selectLang": "Select Language / भाषा चुनें",
          "listening": "सुन रहा हूं... / Listening...",
          "pressToSpeak": "बोलने के लिए दबाएं / Press to Speak",
          "processing": "प्रोसेसिंग... / Processing...",
          "youSaid": "आपने कहा / You said:",
          "aiResponse": "🤖 AgriSphere AI का जवाब / Response:",
          "exampleQuestionsTitle": "उदाहरण प्रश्न / Example Questions:",
          "noteTitle": "Note",
          "noteDesc": "Voice recognition requires a modern browser with microphone permissions. Works best in Chrome/Edge.",
          "noteHindiDesc": "नोट: आवाज़ पहचान के लिए आधुनिक ब्राउज़र और माइक्रोफ़ोन की अनुमति चाहिए।"
        },
        "langs": {
          "sectionTitle": "Supported Languages",
          "hindi": "Hindi",
          "english": "English (India)",
          "fullSupport": "Full Support"
        },
        "howItWorks": {
          "sectionTitle": "How Voice Assistant Works",
          "s1": {
            "title": "Speak Question",
            "desc": "Ask in Hindi or local language"
          },
          "s2": {
            "title": "AI Processing",
            "desc": "Voice recognition & understanding"
          },
          "s3": {
            "title": "Generate Response",
            "desc": "AI creates personalized answer"
          },
          "s4": {
            "title": "Audio Reply",
            "desc": "Hear response in your language"
          }
        },
        "benefits": {
          "sectionTitle": "Voice Assistant Benefits",
          "b1": {
            "title": "Easy to Use",
            "desc": "No typing required, just speak"
          },
          "b2": {
            "title": "Rural Friendly",
            "desc": "Works for illiterate farmers"
          },
          "b3": {
            "title": "Instant Help",
            "desc": "Get answers in seconds"
          },
          "b4": {
            "title": "Local Language",
            "desc": "Understand & respond in Hindi"
          }
        },
        "digitalTwin": {
          "title": "Farm Digital Twin",
          "subtitle": "Visualize your farm with GIS, IoT, and AI-driven spatial analysis.",
          "initializing": {
            "status": "Creating your digital farm twin...",
            "mapping": "Mapping field boundaries for",
            "soil": "Analyzing soil zones based on location",
            "irrigation": "Planning irrigation systems for",
            "pests": "Detecting pest-prone areas"
          },
          "capabilities": "Digital Twin Capabilities",
          "features": {
            "gis": {
              "title": "GIS Plot Mapping",
              "desc": "Satellite-based boundary mapping with sub-meter accuracy",
              "f1": "Boundary Detection",
              "f2": "Area Calculation",
              "f3": "Elevation Mapping",
              "f4": "Geo-fencing"
            },
            "soil": {
              "title": "Soil Health Mapping",
              "desc": "Spatial distribution of nutrients and soil types",
              "f1": "NPK Gradients",
              "f2": "pH Variation",
              "f3": "Texture Analysis",
              "f4": "Carbon Seq."
            },
            "irrigation": {
              "title": "Smart Irrigation",
              "desc": "VRT-based irrigation planning and moisture tracking",
              "f1": "Hydraulic Zones",
              "f2": "Moisture Flux",
              "f3": "Drip Planning",
              "f4": "Runoff Predict."
            }
          },
          "insights": {
            "pestRisk": "Pest Risk Areas",
            "growthStages": "Crop Growth Stages",
            "health": "Health",
            "risk": "risk",
            "mappedZones": "Mapped zones",
            "activeZones": "Active zones",
            "avgHealth": "Average %"
          },
          "areaNote": "acres"
        },
        "farmerDashboard": {
          "title": "Smart Farmer Dashboard",
          "subtitle": "Your centralized hub for AI operations and farm management.",
          "metrics": {
            "models": "AI Models",
            "activeModels": "active models",
            "area": "Mapped Area",
            "hectares": "hectares",
            "detections": "Detections",
            "types": "distinct types",
            "accuracy": "Avg. Accuracy"
          },
          "tabs": {
            "overview": "Overview",
            "disease": "Disease AI",
            "twin": "Digital Twin",
            "yield": "Yield Predict",
            "pest": "Pest Forecast",
            "marketplace": "Marketplace"
          }
        }
      },
      "gov": {
        "title": "Ministry of Agriculture Dashboard",
        "subtitle": "National Command & Control Centre",
        "operational": "System Operational",
        "genReport": "Generate Report",
        "stats": {
          "regFarmers": "Registered Farmers",
          "activeAlerts": "Active Alerts",
          "cropLossCases": "Crop Loss Cases",
          "estDisbursement": "Est. Disbursement"
        },
        "tabs": {
          "overview": "Overview & Analytics",
          "cropLoss": "Crop Loss Compensation",
          "market": "Market Intelligence"
        },
        "charts": {
          "diseaseTrend": "Disease Detection Trend",
          "communityIssues": "Community Issues",
          "prices": "State-wise Avg Prices",
          "listings": "Live Listings Overview"
        },
        "cases": {
          "title": "Compensation Case Management",
          "search": "Search case ID...",
          "noCases": "No active cases found.",
          "eligible": "Eligible",
          "reviewRequired": "Review Required",
          "verify": "Verify",
          "reject": "Reject",
          "approve": "Approve",
          "status": {
            "approved": "Approved",
            "rejected": "Rejected",
            "underVerification": "Under Verification",
            "pending": "Approval Pending"
          }
        },
        "report": {
          "generated": "Report Generated",
          "downloaded": "The report has been downloaded to your device.",
          "totalVolume": "Total Volume Traded"
        },
        "caseActions": {
          "approved": "Case Approved",
          "rejected": "Case Rejected",
          "verified": "Verification Requested",
          "updated": "Case {{id}} has been updated.",
          "errorUpdate": "Failed to update case status",
          "errorFetch": "Failed to fetch government dashboard data"
        },
        "labels": {
          "replies": "Replies",
          "loss": "Loss",
          "cause": "Cause",
          "damage": "Damage",
          "estLoss": "Est. Loss",
          "scheme": "Scheme"
        }
      },
      "buyer": {
        "title": "Verified Buyer Dashboard",
        "welcome": "Welcome, {{name}}",
        "subtitle": "Sourcing fresh produce directly from farmers.",
        "panIndia": "Pan India",
        "postDemand": "Post Demand",
        "tabs": {
          "listings": "Listing Feed",
          "intelligence": "Market Intelligence",
          "deals": "My Deals"
        },
        "filters": {
          "search": "Search wheat, rice, Punjab...",
          "allCrops": "All Crops",
          "allStates": "All States"
        },
        "card": {
          "quantity": "Quantity",
          "price": "Price",
          "farmer": "Farmer",
          "harvest": "Harvest",
          "callFarmer": "Call Farmer",
          "grade": "Grade"
        },
        "intelligence": {
          "title": "Market Demand Analysis",
          "scope": "Market Scope",
          "config": "Configure AI analysis target",
          "forecast": "Trend Forecast",
          "demand": "Demand Level",
          "vsMsp": "Vs MSP",
          "avgPrice": "Avg. Market Price",
          "genBtn": "Generate AI Insights",
          "analyzing": "Analyzing...",
          "strategicAnalysis": "AI Strategic Analysis",
          "mspComparison": "MSP vs Market Price",
          "brief": "Intelligence Brief"
        },
        "contact": {
          "title": "Contact Farmer",
          "desc": "Connect with {{name}} directly.",
          "phone": "Phone Number",
          "whatsapp": "WhatsApp",
          "call": "Call Now",
          "close": "Close"
        },
        "demand": {
          "title": "Post Buying Requirement",
          "desc": "Farmers matching these criteria will be alerted.",
          "crop": "Target Crop",
          "quantity": "Quantity (Quintals)",
          "price": "Target Price/Qtl",
          "location": "Preferred Location (Optional)",
          "postBtn": "Post Demand",
          "cancel": "Cancel"
        },
        "contactFarmer": "Contact Farmer",
        "saveListing": "Save for later",
        "errorInsights": "Failed to fetch market insights",
        "loginRequired": "Login Required",
        "loginRequiredDesc": "Please login as a buyer to contact farmers.",
        "fillFields": "Please fill in required fields.",
        "errorPostDemand": "Failed to post demand.",
        "recordedNote": "Interactions are recorded in your 'My Deals' tab.",
        "trader": "Trader",
        "loading": "Loading live marketplace...",
        "noListings": "No listings found matching your criteria.",
        "gradeA": "Grade A",
        "ready": "Ready",
        "targetCrop": "Target Crop",
        "targetState": "Target State",
        "unknown": "Unknown",
        "noDeals": "No active deals yet.",
        "dealLabel": "{{crop}} Deal",
        "withLabel": "with {{name}}",
        "toast": {
          "saved": "Listing saved for later",
          "unsaved": "Listing removed from saved"
        }
      },
      "cropLoss": {
        "title": "Crop Loss Compensation Claim",
        "subtitle": "Government of India - Ministry of Agriculture",
        "sections": {
          "farmer": "Farmer Details",
          "crop": "Crop Details",
          "loss": "Loss Details",
          "evidence": "Evidence Upload",
          "compliance": "Advisory Compliance",
          "declaration": "Final Declaration"
        },
        "fields": {
          "name": "Farmer Name",
          "mobile": "Mobile Number",
          "state": "State",
          "district": "District",
          "village": "Village",
          "area": "Total Farm Area (Acres)",
          "insurance": "PMFBY Insurance Status",
          "cropName": "Crop Name",
          "season": "Season",
          "sowingDate": "Sowing Date",
          "harvestDate": "Expected Harvest Date",
          "affectedArea": "Affected Area (Acres)",
          "cause": "Cause of Loss",
          "damageDate": "Date Damage Observed",
          "damagePercent": "Estimated Damage Percentage (%)",
          "minDamageNote": "Minimum 33% required",
          "complianceFert": "Applied fertilizers as recommended",
          "complianceIrri": "Followed irrigation schedule",
          "compliancePest": "Reported pests early via tool"
        },
        "placeholders": {
          "name": "Full Name",
          "mobile": "+91...",
          "insurance": "Select Status",
          "insYes": "Enrolled (Yes)",
          "insNo": "Not Enrolled",
          "selectCrop": "Select Crop",
          "selectCause": "Select Cause",
          "village": "Village Name"
        },
        "seasons": {
          "kharif": "Kharif",
          "rabi": "Rabi",
          "zaid": "Zaid"
        },
        "advisory": {
          "title": "Confirm your adherence to AgriSphere advisories. This impacts claim approval.",
          "verifiedNote": "Will be verified against AI usage logs."
        },
        "causes": {
          "flood": "Flood / Heavy Rain",
          "drought": "Drought",
          "pest": "Pest Attack",
          "disease": "Crop Disease",
          "hailstorm": "Hailstorm",
          "heatwave": "Heatwave"
        },
        "ai": {
          "title": "AI Assistant Tips",
          "uploadPhotos": "Please upload photos of affected leaves/stems for AI verification.",
          "specifyPest": "Mention specific pest name if known (e.g., Pink Bollworm).",
          "gpsEnable": "Ensure GPS location is enabled while taking photos."
        },
        "evidence": {
          "uploadBtn": "Click to upload photos/video",
          "note": "Upload at least 2 photos (Close-up & Wide angle). GPS metadata will be extracted."
        },
        "declaration": {
          "check": "I hereby declare that the information provided above is true.",
          "note": "I understand that any false claim will lead to rejection and legal action."
        },
        "submitBtn": "Submit Claim",
        "success": "Claim submitted successfully!",
        "error": "Failed to submit claim. Please try again.",
        "agreeError": "You must agree to the declaration."
      },
      "farmerDashboard": {
        "title": "Comprehensive AI Agriculture Dashboard",
        "subtitle": "Advanced AI-powered agriculture management system combining disease detection, GIS digital twin, and yield prediction for precision farming.",
        "tabs": {
          "overview": "Overview",
          "disease": "AI Disease Detection",
          "twin": "GIS Digital Twin",
          "yield": "Yield Prediction",
          "pest": "Pest Forecast",
          "marketplace": "Marketplace"
        },
        "metrics": {
          "models": "AI Models",
          "area": "Farm Area",
          "detections": "Detection Classes",
          "accuracy": "Accuracy",
          "activeModels": "Active Models",
          "hectares": "Hectares",
          "types": "Disease/Pest Types",
          "precision": "AI Precision"
        },
        "status": {
          "active": "Active",
          "live": "Live",
          "types": "Types"
        },
        "yield": {
          "title": "Crop Yield Predictions (2025)",
          "perHectare": "per hectare",
          "advancedTitle": "Advanced AI Yield Prediction",
          "modelPerformance": "ML Model Performance"
        },
        "twin": {
          "title": "GIS-Based Smart Farm Digital Twin",
          "activeZones": "Active Zones",
          "monitored": "Monitored",
          "average": "Average",
          "spatialFeatures": "Spatial Analysis Features",
          "precisionBenefits": "Precision Agriculture Benefits"
        }
      },
      "seeds": {
        "title": "Smart Seed",
        "titleProcurement": "Procurement",
        "heroBadge": "Blockchain Smart Procurement System (Beta)",
        "heroDescription": "We don't just recommend seeds—we connect you to verified nearby suppliers with price intelligence and real-time accessibility.",
        "verifySeedNet": "Verify on SeedNet",
        "locateShops": "Locate Shops",
        "searchPlaceholder": "Search for seeds or shops...",
        "all": "All",
        "govtSubsidized": "Govt Subsidized",
        "private": "Private",
        "inStock": "In Stock",
        "outOfStock": "Out of Stock",
        "subsidyAvailable": "Subsidy Available",
        "call": "Call Store",
        "docsNeeded": "Docs Needed",
        "requiredDocs": "Required Documents",
        "carryDocs": "Please carry these documents to {{shopName}} to avail subsidies.",
        "advisorTitle": "AI Seed Advisor",
        "advisorDesc": "Get personalized seed recommendations based on your season and crop.",
        "selectSeason": "Select Season",
        "seasonRabi": "Rabi",
        "seasonKharif": "Kharif",
        "aiTip": "AI considers your current soil texture and micro-climate for these rankings.",
        "selectSeasonPrompt": "Select a season to see AI recommendations",
        "checkAvailability": "Check Availability",
        "tags": {
          "lowestPrice": "Lowest Price",
          "nearest": "Nearest",
          "blockchainVerified": "Blockchain Verified"
        },
        "currentPrice": "Current Price",
        "marketRate": "Market Rate",
        "rating": "Rating",
        "viewRoute": "View Route",
        "checkWithStore": "Check with store",
        "unit": {
          "km": "km"
        },
        "tabs": {
          "findShops": "Find Shops",
          "advisor": "Seed Advisor"
        },
        "toasts": {
          "locating": "Locating you...",
          "locatingDesc": "Fetching your GPS coordinates for nearby shops.",
          "found": "Location Found",
          "foundDesc": "Showing verified seed suppliers near {{city}}, {{state}}.",
          "errorLoc": "Failed to fetch nearby shops.",
          "permDenied": "Geolocation Denied",
          "permDeniedDesc": "Please enable location to find nearby shops."
        }
      },
      "trace": {
        "title": "Web3 Traceability",
        "subtitle": "Immutable, end-to-end crop tracking powered by Smart Contracts.",
        "connectBtn": "Connect Wallet",
        "connected": "Connected: {{account}}",
        "walletConnected": "Wallet Connected",
        "simulatedWallet": "Simulated Wallet Connected",
        "simulatedWalletDesc": "No Web3 provider detected. Using demo account.",
        "connectionFailed": "Connection Failed",
        "trackTab": "Track a Crop",
        "registerTab": "Register Batch",
        "searchHint": "Enter Batch ID (e.g. BATCH-7241) or Scan QR",
        "traceBtn": "Trace Data",
        "recordFound": "Record Found",
        "recordFoundDesc": "Immutable Web3 records retrieved.",
        "recordNotFound": "Record Not Found",
        "recordNotFoundDesc": "Batch ID {{id}} does not exist on the ledger.",
        "verifiedBatchTrace": "Verified Batch Trace",
        "authentic": "Authentic",
        "signedBy": "Signed by:",
        "queryHint": "Enter a Batch ID to query the blockchain.",
        "ledgerInfo": "Data is strictly verified via Web3 Immutable Ledger.",
        "mintTitle": "Mint New Crop Record",
        "mintDesc": "Record your harvest on the blockchain. This data cannot be altered once submitted.",
        "batchIdLabel": "Generated Batch ID",
        "cropLabel": "Crop / Product Type",
        "cropPlaceholder": "e.g. Basmati Rice, Organic Apples",
        "originLabel": "Origin Location",
        "originPlaceholder": "Farm Address or GPS Coordinates",
        "qualityLabel": "Quality / Certification",
        "signingNotice": "By submitting this transaction, you are signing a cryptographic proof. You will need to confirm the transaction in your Web3 wallet. Gas fees may apply.",
        "mintingBtn": "Minting to Blockchain...",
        "signRegisterBtn": "Sign & Register Crop",
        "mintSuccess": "Minting Successful",
        "mintSuccessDesc": "Batch {{id}} permanently minted to blockchain.",
        "actions": {
          "harvested": "Harvested & Registered",
          "quality": "Quality Checked",
          "transit": "In Transit",
          "retailer": "Arrived at Retailer"
        }
      }
    }
  },
  "hi": {
    "translation": {
      "nav": {
        "home": "होम",
        "marketplace": "बाज़ार",
        "communityForum": "कम्युनिटी फोरम",
        "advisoryHub": "सलाहकार केंद्र",
        "voiceAssistant": "वॉयस असिस्टेंट",
        "fertilizerAi": "उर्वरक एआई",
        "pestForecast": "कीट का पूर्वानुमान",
        "adminDashboard": "प्रशासन डैशबोर्ड",
        "buyerDashboard": "खरीदार डैशबोर्ड",
        "farmerDashboard": "किसान डैशबोर्ड",
        "diseaseDetection": "रोग की पहचान",
        "yieldPrediction": "उपज भविष्यवाणी",
        "digitalTwin": "डिजिटल ツिन",
        "login": "लॉगिन",
        "getStarted": "शुरू करें",
        "logout": "लॉगआउट",
        "saveProfile": "प्रोफ़ाइल सहेजें",
        "aiTools": "स्मार्ट खेती उपकरण",
        "seedFinder": "बीज खोजक",
        "traceability": "Web3 ट्रैसेबिलिटी"
      },
      "home": {
        "heroTitle1": "भारत का पहला",
        "heroTitle2": "AI + GIS स्मार्ट खेती",
        "heroSubtitle": "इंटेलिजेंस प्लेटफॉर्म",
        "heroDescription": "कीटों, पोषक तत्वों की कमी और फंगल संक्रमण का पता लगाएं। उपज में 30% की वृद्धि करें, लागत में 40% की कमी करें।",
        "exploreFeatures": "डेमो देखें",
        "floatingAlert": "मौसम जोखिमों की जाँच करें",
        "featuresTitle": "इसके लिए बुद्धिमान विशेषताएं",
        "featuresSubtitle": "आधुनिक खेती",
        "featuresDesc": "आपके कृषि कार्यों के हर पहलू में क्रांति लाने के लिए डिज़ाइन की गई अत्याधुनिक तकनीक",
        "aboutTitle": "एग्रीस्फीयर AI भारत का पहला व्यापक AI + GIS स्मार्ट खेती इंटेलिजेंस प्लेटफॉर्म है। हम खेती को बीज से बाजार तक बदलने के लिए बहु-वर्ग रोग पहचान, डिजिटल ट्विन तकनीक, उपज भविष्यवाणी और एंड-टू-एंड कृषि सलाह को जोड़ते हैं।",
        "aboutDesc": "हमारा प्लेटफॉर्म गांवों के लिए ऑफलाइन मोड, हिंदी वॉयस कमांड, सरकारी योजना सिफारिशों, किसान-खरीदार बाजार और ब्लॉकचेन ट्रैसेबिलिटी का समर्थन करता है।",
        "howItWorks": "यह कैसे काम करता है",
        "howItWorksSubtitle": "हमारी सरल 4-चरणीय प्रक्रिया के साथ कुछ ही मिनटों में शुरू करें",
        "ctaTitle": "क्या आप अपने कृषि व्यवसाय को",
        "ctaSubtitle": "बदलने के लिए तैयार हैं?",
        "ctaDesc": "उन हजारों किसानों से जुड़ें जो पहले से ही उपज बढ़ाने और लागत कम करने के लिए एग्रीस्फीयर AI का उपयोग कर रहे हैं।",
        "ctaFreeTrial": "नि: शुल्क परीक्षण शुरू करें",
        "ctaDemo": "डेमो शेड्यूल करें",
        "features": {
          "f1": {
            "title": "AI रोग पहचान",
            "desc": "उन्नत ML मॉडल 95% सटीकता के साथ रोगों और कीटों का पता लगाते हैं",
            "bullets": [
              "कीट पहचान",
              "पोषक तत्व कमी",
              "फफूंद संक्रमण",
              "मिट्टी बनावट विश्लेषण"
            ],
            "b1": "कीट पहचान",
            "b2": "पोषक तत्व कमी",
            "b3": "फफूंद संक्रमण",
            "b4": "मिट्टी बनावट विश्लेषण"
          },
          "f2": {
            "title": "GIS डिजिटल ट्विन",
            "desc": "मैपिंग और विकास ट्रैकिंग के साथ पूर्ण फार्म प्रतिकृति",
            "bullets": [
              "खेत सीमाएं",
              "मिट्टी क्षेत्र",
              "सिंचाई क्षेत्र",
              "विकास अवस्थाएं"
            ],
            "b1": "खेत सीमाएं",
            "b2": "मिट्टी क्षेत्र",
            "b3": "सिंचाई क्षेत्र",
            "b4": "विकास अवस्थाएं"
          },
          "f3": {
            "title": "उपज पूर्वानुमान",
            "desc": "मौसम और मिट्टी के डेटा का उपयोग करके उपज का पूर्वानुमान",
            "bullets": [
              "मौसम विश्लेषण",
              "मिट्टी प्रकार मानचित्रण",
              "ऐतिहासिक डेटा",
              "ML पूर्वानुमान"
            ],
            "b1": "मौसम विश्लेषण",
            "b2": "मिट्टी प्रकार मानचित्रण",
            "b3": "ऐतिहासिक डेटा",
            "b4": "ML पूर्वानुमान"
          },
          "f4": {
            "title": "मौसम जोखिम इंजन",
            "desc": "बाढ़, सूखे और लू के लिए रीयल-टाइम अलर्ट",
            "bullets": [
              "बाढ़ अलर्ट",
              "सूखा चेतावनी",
              "लू का पता लगाना",
              "SMS अलर्ट"
            ],
            "b1": "बाढ़ अलर्ट",
            "b2": "सूखा चेतावनी",
            "b3": "लू का पता लगाना",
            "b4": "SMS अलर्ट"
          },
          "f5": {
            "title": "उर्वरक और सिंचाई AI",
            "desc": "इष्टतम पोषण के लिए स्मार्ट NPK और सिंचाई शेड्यूलिंग",
            "bullets": [
              "NPK विश्लेषण",
              "जल पूर्वानुमान",
              "स्मार्ट शेड्यूलिंग",
              "पोषण अनुकूलन"
            ],
            "b1": "NPK विश्लेषण",
            "b2": "जल पूर्वानुमान",
            "b3": "स्मार्ट शेड्यूलिंग",
            "b4": "पोषण अनुकूलन"
          }
        },
        "stats": {
          "activeFarmers": "सक्रिय किसान",
          "accuracyRate": "सटीकता दर",
          "fieldsMapped": "मैप किए गए क्षेत्र",
          "yieldIncrease": "उपज वृद्धि"
        },
        "bulletin": {
          "liveUpdate": "दैनिक लाइव बुलेटिन",
          "playBulletin": "बुलेटिन सुनें",
          "stopAudio": "ऑडियो बंद करें",
          "generating": "आपकी दैनिक जानकारी तैयार की जा रही है..."
        },
        "advanced": {
          "title": "उन्नत AI इंटेलिजेंस",
          "desc": "अत्याधुनिक सुविधाएं जो AgriSphere AI को अलग बनाती हैं",
          "pests": {
            "title": "कीट हमले का पूर्वानुमान",
            "desc": "AI अगले 7 दिनों के लिए कीट हमले की संभावना पूर्वानुमान करता है",
            "b1": "जलवायु विश्लेषण",
            "b2": "7-दिन जोखिम पूर्वानुमान",
            "b3": "रोकथाम अलर्ट",
            "b4": "उपचार सिफारिशें"
          },
          "seedToMarket": {
            "title": "बीज-से-बाजार सलाह",
            "desc": "बीज चयन से बाजार मूल्य तक सम्पूर्ण मार्गदर्शन",
            "b1": "बीज चयन",
            "b2": "बुवाई का समय",
            "b3": "फसल पूर्वानुमान",
            "b4": "बाजार मूल्य"
          },
          "voice": {
            "title": "वॉयस असिस्टेंट (हिंदी)",
            "desc": "किसान स्थानीय भाषा में बोलते हैं, AI सलाह देता है",
            "b1": "हिंदी समर्थन",
            "b2": "वॉयस पहचान",
            "b3": "स्थानीय भाषाएं",
            "b4": "ऑडियो प्रतिक्रियाएं"
          },
          "schemes": {
            "title": "सरकारी योजनाएं AI",
            "desc": "स्वत: सब्सिडी, ऋण और PM-KISAN लाभ की पहचान",
            "b1": "सब्सिडी मिलान",
            "b2": "ऋण पात्रता",
            "b3": "बीमा योजनाएं",
            "b4": "PM-KISAN"
          },
          "marketplace": {
            "title": "किसान-खरीदार बाजार",
            "desc": "AI मूल्य और लॉजिस्टिक्स के साथ प्रत्यक्ष बिक्री",
            "b1": "प्रत्यक्ष बिक्री",
            "b2": "AI मूल्य",
            "b3": "लॉजिस्टिक्स",
            "b4": "आय वृद्धि"
          },
          "blockchain": {
            "title": "ब्लॉकचेन ट्रेसेबिलिटी",
            "desc": "गुणवत्ता आश्वासन के लिए फसल मूल ट्रैक करें",
            "b1": "मूल ट्रैकिंग",
            "b2": "आपूर्ति श्रृंखला",
            "b3": "प्रामाणिकता",
            "b4": "गुणवत्ता आश्वासन"
          }
        },
        "rural": {
          "title": "ग्रामीण भारत के लिए निर्मित",
          "subtitle": "गांव के किसानों के लिए सुलभ तकनीक",
          "offline": {
            "title": "ऑफलाइन मोड",
            "desc": "स्थानीय कैशिंग के साथ इंटरनेट के बिना काम करता है"
          },
          "languages": {
            "title": "हिंदी + स्थानीय भाषाएं",
            "desc": "क्षेत्रीय भाषाओं और वॉयस के लिए पूर्ण समर्थन"
          },
          "sms": {
            "title": "SMS फॉलबैक अलर्ट",
            "desc": "ऑफलाइन होने पर SMS द्वारा महत्वपूर्ण अलर्ट"
          },
          "community": {
            "title": "सामुदायिक फोरम",
            "desc": "किसान कीट और योजनाओं पर चर्चा करते हैं"
          }
        },
        "women": {
          "title": "ग्रामीण महिला कृषि उद्यमी",
          "subtitle": "महिलाओं के नेतृत्व वाले लघु व्यवसायों को सशक्त बनाना",
          "microbusiness": {
            "title": "लघु व्यवसाय सहायता",
            "desc": "शहद, मसाले और हस्तशिल्प व्यवसायों के लिए प्रशिक्षण"
          },
          "training": {
            "title": "प्रशिक्षण मॉड्यूल",
            "desc": "महिला उद्यमियों के लिए व्यापक प्रशिक्षण"
          },
          "marketAccess": {
            "title": "मार्केटप्लेस पहुंच",
            "desc": "महिलाओं के नेतृत्व वाले उत्पादों की प्रत्यक्ष लिस्टिंग"
          }
        },
        "testimonials": {
          "title": "किसान क्या कहते हैं",
          "subtitle": "किसानों की वास्तविक कहानियां",
          "t1": {
            "name": "राजेश कुमार",
            "loc": "पंजाब, भारत",
            "text": "AgriSphere के बहु-वर्ग AI ने मेरे गेहूं में तना छेदक को समय पर पकड़ लिया। 10 एकड़ की फसल बच गई और उपज 35% बढ़ी!",
            "benefit": "35% उपज वृद्धि"
          },
          "t2": {
            "name": "अनीता शर्मा",
            "loc": "महाराष्ट्र, भारत",
            "text": "GIS डिजिटल ट्विन ने मेरे खेत का सही मानचित्रण किया। पानी 45% कम लगा। मार्केटप्लेस से ₹2000/क्विंटल अधिक मिला!",
            "benefit": "45% पानी बचत"
          },
          "t3": {
            "name": "विक्रम पटेल",
            "loc": "गुजरात, भारत",
            "text": "हिंदी वॉयस असिस्टेंट शानदार है! 'टमाटर में रोग है' - तुरंत रोग प्रकार और उपचार लागत मिली। ऑफलाइन मोड गांव में बढ़िया चलता है।",
            "benefit": "हिंदी वॉयस सपोर्ट"
          }
        },
        "tech": {
          "title": "अत्याधुनिक तकनीक पर निर्मित",
          "subtitle": "आपके खेत को शक्ति देने वाला उद्यम-श्रेणी तकनीकी स्टैक",
          "t1": "उपज पूर्वानुमान",
          "t2": "समय श्रृंखला विश्लेषण",
          "t3": "उन्नत प्रतिगमन",
          "t4": "डिजिटल ट्विन मैपिंग",
          "t5": "रोग पहचान",
          "t6": "आपूर्ति ट्रेसेबिलिटी",
          "t7": "हिंदी कमांड",
          "t8": "गांव सुलभता",
          "t9": "अलर्ट फॉलबैक",
          "t10": "तत्काल सूचनाएं",
          "t11": "डेटा सुरक्षा"
        },
        "learnMore": "और जानें",
        "footer": {
          "tagline": "टिकाऊ, लाभदायक कृषि के लिए AI और GIS तकनीक से किसानों को सशक्त बनाना।",
          "col1": "सुविधाएं",
          "col2": "प्लेटफॉर्म",
          "col3": "सहायता",
          "iot": "IoT निगरानी",
          "weather": "मौसम अलर्ट",
          "community": "समुदाय",
          "help": "सहायता केंद्र",
          "docs": "दस्तावेज़ीकरण",
          "api": "API मार्गदर्शिका",
          "contact": "संपर्क",
          "copyright": "© 2025 AgriSphere AI. सर्वाधिकार सुरक्षित।"
        },
        "heroBadge": "AI-संचालित स्मार्ट कृषि",
        "advancedTitle": "उन्नत AI इंटेलिजेंस",
        "advancedDesc": "अत्याधुनिक सुविधाएं जो AgriSphere AI को अलग बनाती हैं",
        "advFeatures": {
          "a1": {
            "title": "कीट हमले का पूर्वानुमान",
            "desc": "AI अगले 7 दिनों के लिए कीट हमले की संभावना (0-100%) पूर्वानुमान करता है",
            "tags": [
              "जलवायु विश्लेषण",
              "7-दिन जोखिम पूर्वानुमान",
              "रोकथाम अलर्ट",
              "उपचार सिफारिशें"
            ]
          },
          "a2": {
            "title": "बीज-से-बाजार सलाह",
            "desc": "बीज चयन से बाजार मूल्य निर्धारण तक सम्पूर्ण मार्गदर्शन",
            "tags": [
              "बीज चयन",
              "बुवाई का समय",
              "फसल पूर्वानुमान",
              "बाजार मूल्य"
            ]
          },
          "a3": {
            "title": "वॉयस असिस्टेंट (हिंदी)",
            "desc": "किसान स्थानीय भाषा में बोलते हैं, AI सलाह के साथ जवाब देता है",
            "tags": [
              "हिंदी समर्थन",
              "वॉयस पहचान",
              "स्थानीय भाषाएं",
              "ऑडियो प्रतिक्रियाएं"
            ]
          },
          "a4": {
            "title": "सरकारी योजनाएं AI",
            "desc": "स्वत: सब्सिडी, ऋण और PM-KISAN लाभ की पहचान करता है",
            "tags": [
              "सब्सिडी मिलान",
              "ऋण पात्रता",
              "बीमा योजनाएं",
              "PM-KISAN"
            ]
          },
          "a5": {
            "title": "किसान-खरीदार बाजार",
            "desc": "AI मूल्य और लॉजिस्टिक्स के साथ प्रत्यक्ष बिक्री प्लेटफॉर्म",
            "tags": [
              "प्रत्यक्ष बिक्री",
              "AI मूल्य",
              "लॉजिस्टिक्स",
              "आय वृद्धि"
            ]
          },
          "a6": {
            "title": "ब्लॉकचेन ट्रेसेबिलिटी",
            "desc": "गुणवत्ता आश्वासन के लिए फसल मूल और आपूर्ति श्रृंखला ट्रैक करें",
            "tags": [
              "मूल ट्रैकिंग",
              "आपूर्ति श्रृंखला",
              "प्रामाणिकता",
              "गुणवत्ता आश्वासन"
            ]
          }
        },
        "ruralTitle": "ग्रामीण भारत के लिए निर्मित",
        "ruralDesc": "गांव के किसानों के लिए डिज़ाइन की गई सुलभ तकनीक",
        "ruralFeatures": {
          "r1": {
            "title": "ऑफलाइन मोड",
            "desc": "स्थानीय कैशिंग के साथ इंटरनेट के बिना काम करता है"
          },
          "r2": {
            "title": "हिंदी + स्थानीय भाषाएं",
            "desc": "क्षेत्रीय भाषाओं और वॉयस के लिए पूर्ण समर्थन"
          },
          "r3": {
            "title": "SMS फॉलबैक अलर्ट",
            "desc": "ऑफलाइन होने पर SMS के माध्यम से महत्वपूर्ण अलर्ट"
          },
          "r4": {
            "title": "सामुदायिक फोरम",
            "desc": "किसान कीट और योजनाओं पर चर्चा करते हैं"
          }
        },
        "womenTitle": "ग्रामीण महिला कृषि उद्यमी",
        "womenDesc": "कृषि में महिलाओं के नेतृत्व वाले लघु व्यवसायों को सशक्त बनाना",
        "womenFeatures": {
          "w1": {
            "title": "लघु व्यवसाय सहायता",
            "desc": "शहद, मसाले और हस्तशिल्प व्यवसायों के लिए प्रशिक्षण"
          },
          "w2": {
            "title": "प्रशिक्षण मॉड्यूल",
            "desc": "महिला उद्यमियों के लिए व्यापक प्रशिक्षण"
          },
          "w3": {
            "title": "मार्केटप्लेस पहुंच",
            "desc": "महिलाओं के नेतृत्व वाले उत्पादों की प्रत्यक्ष लिस्टिंग"
          }
        },
        "testimonialsTitle": "किसान क्या कहते हैं",
        "testimonialsDesc": "किसानों की वास्तविक कहानियां"
      },
      "disease": {
        "title": "AI फसल रोग पहचान",
        "backHome": "होम पर वापस जाएं",
        "desc": "पत्ती, तना, फल और मिट्टी की छवियों से 95%+ सटीकता के साथ रोगों, कीटों, पोषक तत्वों की कमी और मिट्टी की बनावट का पता लगाने वाली क्रांतिकारी बहु-वर्ग AI प्रणाली।",
        "startBtn": "पहचान शुरू करें",
        "uploadBtn": "छवियां अपलोड करें",
        "saveBtn": "सहेजी गई रिपोर्ट",
        "hideBtn": "छुपाएं",
        "reportsTitle": "ऑफलाइन रोग रिपोर्ट",
        "noReports": "कोई सहेजी गई रिपोर्ट नहीं मिली।",
        "capTitle": "बहु-वर्ग पहचान क्षमताएं",
        "pestTitle": "कीट पहचान एवं उपचार",
        "aiTitle": "उन्नत बहु-वर्ग AI पहचान",
        "howTitle": "AI पहचान कैसे काम करती है",
        "accuracy": "सटीकता",
        "types": {
          "leaf": {
            "title": "पत्ती रोग पहचान",
            "desc": "फफूंद, जीवाणु और वायरल संक्रमणों के लिए पत्ती की छवियों का विश्लेषण",
            "d1": "झुलसा",
            "d2": "जंग",
            "d3": "मोज़ेक वायरस",
            "d4": "जीवाणु धब्बा"
          },
          "stem": {
            "title": "तना विश्लेषण",
            "desc": "तने में बोरर, सड़न और संरचनात्मक क्षति का पता लगाएं",
            "d1": "तना छेदक",
            "d2": "तना सड़न",
            "d3": "कैंकर",
            "d4": "मुरझाना"
          },
          "fruit": {
            "title": "फल निरीक्षण",
            "desc": "फल रोगों, कीट क्षति और गुणवत्ता समस्याओं की पहचान",
            "d1": "फल सड़न",
            "d2": "कीट क्षति",
            "d3": "दरारें",
            "d4": "रंग बदलना"
          },
          "soil": {
            "title": "मिट्टी स्वास्थ्य विश्लेषण",
            "desc": "AI-संचालित मिट्टी की बनावट और पोषक तत्व कमी पहचान",
            "d1": "पोषक तत्व कमी",
            "d2": "pH असंतुलन",
            "d3": "लवणता",
            "d4": "संघनन"
          }
        },
        "pests": {
          "p1": {
            "name": "माहू",
            "damage": "रस चूसना",
            "treatment": "नीम तेल छिड़काव"
          },
          "p2": {
            "name": "थ्रिप्स",
            "damage": "पत्ती क्षति",
            "treatment": "नीले चिपचिपे जाल"
          },
          "p3": {
            "name": "सफेद मक्खी",
            "damage": "वायरस प्रसार",
            "treatment": "पीले जाल"
          },
          "p4": {
            "name": "इल्लियां",
            "damage": "पत्ती खाना",
            "treatment": "Bt छिड़काव"
          }
        },
        "how": {
          "s1": {
            "title": "छवि कैप्चर",
            "desc": "प्रभावित पौधे के हिस्से की फोटो लें"
          },
          "s2": {
            "title": "AI विश्लेषण",
            "desc": "CNN मॉडल छवि डेटा संसाधित करते हैं"
          },
          "s3": {
            "title": "वर्गीकरण",
            "desc": "बहु-वर्ग पहचान परिणाम"
          },
          "s4": {
            "title": "उपचार योजना",
            "desc": "कार्रवाई योग्य सिफारिशें"
          }
        },
        "stats": {
          "disease": "रोग गतिविधि",
          "diseaseDesc": "मौसम और फसलों के आधार पर",
          "pest": "कीट पहचान",
          "pests": "कीट दबाव",
          "pestDesc": "अगले 7 दिनों का पूर्वानुमान",
          "soil": "मिट्टी स्वास्थ्य इतिहास",
          "soilDesc": "हालिया पोषक तत्व जांच"
        },
        "score": "स्कोर",
        "issues": "समस्याएं",
        "diseasesCount": "निगरानी किए गए रोग",
        "pestsCount": "सक्रिय कीट खतरे",
        "viewSummary": "त्वरित सारांश देखें"
      },
      "marketplace": {
        "title": "स्मार्ट मार्केटप्लेस और सलाह",
        "subtitle": "AI-संचालित फसल सलाह प्राप्त करें और अपने क्षेत्र के खरीदारों/विक्रेताओं से सीधे जुड़ें।",
        "tabs": {
          "advisory": "सलाह",
          "listings": "लिस्टिंग",
          "trends": "रुझान",
          "demands": "खरीदार की मांग"
        },
        "demands": {
          "title": "लाइव खरीदार मांग",
          "noDemands": "आपके क्षेत्र के लिए कोई सक्रिय खरीदार मांग नहीं मिली।",
          "verified": "सत्यापित खरीदार",
          "targetPrice": "लक्षित मूल्य",
          "contactBtn": "खरीदार से संपर्क करें",
          "locationPref": "स्थान वरीयता"
        },
        "advisory": {
          "title": "एग्रीस्फीयर स्मार्ट सलाह",
          "desc": "आपकी बुवाई की तारीख और इलाके के आधार पर व्यक्तिगत, राज्य-विशिष्ट AI सलाह।",
          "selectCrop": "फसल चुनें",
          "chooseCrop": "एक फसल चुनें...",
          "state": "राज्य",
          "selectState": "अपना राज्य चुनें",
          "sowingDate": "बुवाई की तारीख",
          "pickDate": "तारीख चुनें",
          "fieldSize": "खेत का आकार (एकड़)",
          "analyzeBtn": "AI रिपोर्ट तैयार करें",
          "analyzing": "रिपोर्ट तैयार की जा रही है...",
          "missingInfo": "जानकारी गायब है",
          "selectPrompt": "कृपया फसल, राज्य और बुवाई की तारीख चुनें।",
          "readyTitle": "इसके लिए AI सलाहकार रिपोर्ट:",
          "steps": {
            "s1": {
              "title": "चरण 1: बीज और बुवाई",
              "subtitle": "इष्टतम तकनीक और किस्म का चयन"
            },
            "s2": {
              "title": "चरण 2: विकास और देखभाल",
              "subtitle": "सिंचाई और निषेचन कार्यक्रम"
            },
            "s3": {
              "title": "चरण 3: परिपक्वता और कटाई",
              "subtitle": "तैयार होने के संकेतों की निगरानी"
            },
            "s4": {
              "title": "चरण 4: बाजार खुफिया",
              "subtitle": "मूल्य पूर्वानुमान और मंडी चयन"
            }
          },
          "results": {
            "varieties": "अनुशंसित किस्में",
            "technique": "अनुशंसित तकनीक",
            "proTip": "प्रो-टिप / बीज उपचार",
            "fertilizer": "उर्वरक कार्यक्रम",
            "irrigation": "सिंचाई योजना",
            "pestAlert": "कीट और रोग अलर्ट",
            "daysLeft": "शेष दिन",
            "harvestWindow": "इष्टतम कटाई का समय",
            "maturitySigns": "परिपक्वता के संकेत",
            "postHarvest": "कटाई के बाद की देखभाल",
            "recommendedMandi": "अनुशंसित मंडी",
            "bestValue": "आपके क्षेत्र के लिए सर्वोत्तम मूल्य",
            "sellHere": "अपनी फसल यहाँ बेचें"
          },
          "selectDistrict": "Select District",
          "stages": {
            "s1": {
              "title": "Phase 1: Seed & Sowing",
              "subtitle": "Optimal techniques and variety selection"
            },
            "s2": {
              "title": "Phase 2: Growth & Care",
              "subtitle": "Irrigation and fertilization schedule"
            },
            "s3": {
              "title": "Phase 3: Maturity & Harvest",
              "subtitle": "Monitoring signs of readiness"
            },
            "s4": {
              "title": "Phase 4: Market Intelligence",
              "subtitle": "Price forecasting and mandi selection"
            }
          }
        },
        "trends": {
          "title": "AI बाजार अंतर्दृष्टि",
          "livePrices": "लाइव मंडी भाव",
          "forecast": "मूल्य पूर्वानुमान",
          "updated": "बाजार डेटा अपडेट किया गया",
          "fetched": "नवीनतम मंडी भाव और AI रुझान सिंक किए गए।",
          "fetchError": "बाजार के रुझान प्राप्त करने में विफल।",
          "detailsMissing": "स्थान गायब है",
          "enterStateDistrict": "रुझान देखने के लिए कृपया राज्य और जिला दर्ज करें।",
          "findMandiRates": "आज के मंडी भाव जानें",
          "selectState": "भावों के लिए राज्य चुनें",
          "enterDistrict": "ज़िले का नाम दर्ज करें",
          "typeDistrict": "अपना ज़िला टाइप करें...",
          "category": "श्रेणी",
          "allCommodities": "सभी वस्तुएं",
          "vegetables": "सब्जियां",
          "fruits": "फल",
          "cereals": "अनाज",
          "pulses": "दालें",
          "oilseeds": "तिलहन",
          "spices": "मसाले",
          "fibres": "फाइबर",
          "flowers": "फूल",
          "dryFruits": "सूखे मेवे",
          "beverages": "पेय पदार्थ",
          "checkRates": "लाइव भाव जांचें",
          "strategicAdvisory": "रणनीतिक सलाह",
          "recommendations": "सिफारिशें",
          "forecastTitle": "7-दिवसीय मूल्य पूर्वानुमान",
          "source": "सत्यापित सरकारी स्रोत",
          "minPrice": "न्यूनतम",
          "maxPrice": "अधिकतम",
          "modalPrice": "बाजार भाव",
          "noRates": "इस चयन के लिए कोई मूल्य डेटा नहीं मिला।",
          "low": "कम",
          "medium": "मध्यम",
          "high": "अधिक"
        },
        "listings": {
          "filters": "बाजार फिल्टर",
          "search": "फसल खोजें...",
          "contactFarmer": "किसान से संपर्क करें",
          "noListings": "आपके क्षेत्र में कोई लिस्टिंग नहीं मिली।",
          "form": {
            "postTitle": "अपनी फसल बेचें",
            "postSubtitle": "स्थानीय खरीदारों तक पहुंचने के लिए निःशुल्क लिस्टिंग पोस्ट करें।",
            "name": "आपका नाम",
            "contact": "फोन नंबर",
            "crop": "फसल का नाम",
            "qty": "मात्रा (क्विंटल)",
            "price": "मूल्य (प्रति क्विंटल)",
            "selectState": "अपना राज्य चुनें",
            "submit": "लिस्टिंग पोस्ट करें"
          },
          "fillAllFields": "कृपया सभी लिस्टिंग विवरण भरें।",
          "listingPosted": "लिस्टिंग सफलतापूर्वक पोस्ट की गई",
          "listingLive": "मार्केट लिस्टिंग लाइव!",
          "listingLiveMsg": "आपकी {{crop}} लिस्टिंग अब खरीदारों को ₹{{price}}/Q पर दिखाई दे रही है।",
          "listingError": "लिस्टिंग पोस्ट करने में विफल।",
          "negotiate": {
            "title": "{{crop}} के लिए बातचीत",
            "desc": "{{seller}} को काउंटर-ऑफर भेजें। किसान आपकी मांग की समीक्षा करेंगे।",
            "send": "काउंटर-ऑफर भेजें"
          },
          "negotiations": {
            "myOffers": "मेरे द्वारा भेजे गए ऑफर",
            "receivedOffers": "खरीदारों से प्राप्त ऑफर",
            "accept": "ऑफर स्वीकार करें",
            "reject": "अस्वीकार करें",
            "statusUpdated": "बातचीत की स्थिति अपडेट की गई।",
            "newOffer": "नया काउंटर-ऑफर प्राप्त हुआ!"
          }
        },
        "alerts": {
          "seasonality": "Seasonality Warning"
        },
        "states": {
          "bihar": "बिहार",
          "uttarPradesh": "उत्तर प्रदेश",
          "punjab": "पंजाब",
          "haryana": "हरियाणा",
          "madhyaPradesh": "मध्य प्रदेश"
        },
        "langEn": "अंग्रेजी",
        "langHi": "हिंदी",
        "langBn": "बंगाली",
        "langAs": "असमिया",
        "langKn": "कन्नड़"
      },
      "advisoryHub": {
        "title": "एग्रीस्फेयर सलाहकार केंद्र",
        "subtitle": "स्मार्ट खेती के लिए वास्तविक समय योजनाएं, समाचार और वीडियो।",
        "tabs": {
          "schemes": "योजनाएं और सब्सिडी",
          "calculator": "उर्वरक कैलकुलेटर",
          "news": "खेती के समाचार",
          "videos": "वीडियो ट्यूटोरियल"
        },
        "refresh": "Refresh Content",
        "eligibility": {
          "title": "पात्रता जांचें",
          "desc": "प्रासंगिक सरकारी योजनाओं को देखने के लिए अपनी प्रोफ़ाइल अपडेट करें।",
          "state": "राज्य",
          "landSize": "भूमि का आकार (एकड़)",
          "farmerType": "किसान का प्रकार"
        },
        "offline": {
          "loadedCache": "Offline: Loaded schemes from cache."
        },
        "success": {
          "addedSchemes": "Added {{count}} new schemes."
        },
        "info": {
          "noNewSchemes": "AI couldn't find any new unique schemes right now."
        },
        "error": {
          "loadSchemes": "Failed to load more schemes."
        },
        "loading": {
          "askingAi": "Asking AI for more schemes...",
          "findingSchemes": "Finding New Schemes...",
          "loadingNews": "Loading News...",
          "loadingVideos": "Loading Videos...",
          "loadingCalc": "Loading Calculator..."
        },
        "buttons": {
          "loadMore": "Load More",
          "findAi": "Find More from AI",
          "refresh": "Refresh Content",
          "calculate": "Calculate Nutrients"
        },
        "noData": {
          "noSchemes": "No eligible schemes found for this profile in {{state}}.",
          "allIndiaBtn": "View All India Schemes",
          "noNews": "No news available at the moment.",
          "noVideos": "No videos available at the moment."
        },
        "toasts": {
          "videosRefreshed": "Videos refreshed!",
          "newsRefreshed": "News refreshed!",
          "schemesRefreshed": "Schemes refreshed!"
        },
        "configNeeded": {
          "title": "Configuration Needed",
          "desc": "Please add {{key}} to your .env file to see {{feature}}."
        }
      },
      "yield": {
        "title": "अनुकूलित उपज पूर्वानुमान",
        "desc": "मौसम डेटा पर प्रशिक्षित उन्नत ML मॉडल का उपयोग करके फसल उपज का पूर्वानुमान।",
        "supportedCrops": "समर्थित फसलें",
        "inputTitle": "इनपुट पैरामीटर",
        "selectCrop": "फसल चुनें",
        "area": "क्षेत्र (एकड़)",
        "areaNote": "1 Acre ≈ 0.4 Hectares",
        "rainfall": "वर्षा (मिमी)",
        "temp": "Avg Temp (°C)",
        "humidity": "Humidity (%)",
        "fertilizer": "Fertilizer (kg)",
        "pesticide": "Pesticide (kg)",
        "soilPh": "Soil pH",
        "soilN": "Soil N (kg/ha)",
        "soilP": "Soil P (kg/ha)",
        "soilK": "Soil K (kg/ha)",
        "predictBtn": "पूर्वानुमान उत्पन्न करें",
        "analyzing": "विश्लेषण हो रहा है...",
        "resultsTitle": "पूर्वानुमान परिणाम",
        "totalProduction": "कुल अनुमानित उत्पादन",
        "revenue": "राजस्व",
        "yieldEfficiency": "उपज दक्षता",
        "models": {
          "rf": "Random Forest",
          "lstm": "LSTM Networks",
          "gb": "Gradient Boosting",
          "xgb": "XGBoost"
        },
        "potentialRevenue": "संभावित राजस्व",
        "perHectare": "प्रति हेक्टेयर",
        "approx": "लगभग",
        "confidence": "विश्वसनीयता",
        "modelUsed": "उपयोग किया गया मॉडल",
        "trainingData": "प्रशिक्षण डेटा",
        "accuracyNote": "Note: Rice predictions are now highly accurate (~99.7%) thanks to the integration of Soil Health Card data (pH, N, P, K).",
        "kharifSeason": "Kharif Season",
        "tonsPerHa": "t/ha",
        "confidenceRange": "Confidence Range",
        "fiveYearAvg": "5-Year Average",
        "trend": "Historical Trend",
        "regionalPerformance": "Regional Performance",
        "readyDesc": "पैरामीटर दर्ज करें और क्लिक करें।",
        "predictionSuccess": "पूर्वानुमान सफल",
        "estimatedProduction": "Estimated Production",
        "tonsUnit": "टन",
        "summary": {
          "report": "{{crop}} के लिए आपकी अनुमानित उपज {{total}} टन है। प्रति हेक्टेयर {{efficiency}} टन की इस दक्षता को बनाए रखने के लिए, मौसम के पूर्वानुमान के अनुसार इष्टतम NPK स्तर और समय पर सिंचाई सुनिश्चित करें।"
        },
        "avgTemp": "औसत तापमान (°C)"
      },
      "pest": {
        "title": "कीट आक्रमण पूर्वानुमान",
        "inputTitle": "खेत की स्थितियां",
        "inputDesc": "वर्तमान मौसम की जानकारी दर्ज करें",
        "selectCrop": "फसल चुनें",
        "temp": "तापमान",
        "humidity": "आर्द्रता",
        "rainfall": "वर्षा",
        "predictBtn": "जोखिम का पूर्वानुमान करें",
        "analyzing": "विश्लेषण हो रहा है...",
        "resultsTitle": "पूर्वानुमान परिणाम",
        "probability": "हमले की संभावना",
        "riskLevel": "{{level}} जोखिम",
        "primaryThreat": "प्राथमिक खतरा",
        "recommendation": "सिफारिश",
        "forecast7Days": "7 दिनों का पूर्वानुमान",
        "readyDesc": "स्लाइडर सेट करें और पूर्वानुमान पाने के लिए क्लिक करें",
        "advisorTitle": "AI कृषि सलाहकार",
        "advisorDesc": "हिंदी या अंग्रेजी में विस्तृत विवरण सुनें",
        "stopBtn": "रोकें",
        "summary": {
          "prediction": "पूर्वानुमान: {{level}} जोखिम ({{score}}%) के साथ {{name}}।",
          "recommendation": "सिफारिश: {{recommendation}}",
          "weather": "मौसम: {{temp}}°C, {{humidity}}% आर्द्रता, {{rainfall}}mm वर्षा।",
          "crop": "फसल: {{crop}}।"
        }
      },
      "fertilizer": {
        "title": "स्मार्ट उर्वरक और सिंचाई",
        "subtitle": "इष्टतम फसल पोषण और जल प्रबंधन के लिए AI सिफारिशें",
        "inputTitle": "पैरामीटर",
        "cropType": "फसल प्रकार",
        "selectCrop": "फसल चुनें",
        "nitrogen": "नाइट्रोजन (N)",
        "phosphorus": "फास्फोरस (P)",
        "potassium": "पोटाशियम (K)",
        "moisture": "मिट्टी की नमी (%)",
        "moistureDry": "सूखी",
        "moistureWet": "गीली",
        "rainfall": "वर्षा पूर्वानुमान (मिमी)",
        "soilPh": "मिट्टी का pH",
        "growthStage": "विकास अवस्था",
        "selectStage": "अवस्था चुनें",
        "stages": {
          "sowing": "बुवाई",
          "vegetative": "वानस्पतिक",
          "flowering": "फूलों की अवस्था",
          "harvest": "कटाई"
        },
        "getBtn": "सिफारिश प्राप्त करें",
        "analyzing": "विश्लेषण हो रहा है...",
        "results": {
          "noDataTitle": "कोई सिफारिश नहीं",
          "noDataDesc": "पैरामीटर भरें और क्लिक करें।",
          "planTitle": "उर्वरक योजना",
          "adjustments": "स्मार्ट समायोजन",
          "irrigationTitle": "सिंचाई अनुसूची",
          "phAlert": "pH चेतावनी",
          "waterAmount": "पानी की मात्रा",
          "applyWater": "{{amount}} पानी लगाएं।",
          "rainNote": "अगले 3 दिनों में बारिश की संभावना।",
          "moistureNote": "नमी इष्टतम बनाए रखें।",
          "temperature": "तापमान",
          "windSpeed": "हवा की गति",
          "normal": "सामान्य"
        }
      },
      "community": {
        "title": "किसान सारथी समुदाय",
        "subtitle": "साथी किसानों से जुड़ें, ज्ञान साझा करें और साथ मिलकर बढ़ें।",
        "searchPlaceholder": "चर्चाओं, प्रश्नों या विशेषज्ञों को खोजें...",
        "askBtn": "प्रश्न पूछें",
        "tabs": {
          "feed": "सामुदायिक फीड",
          "experts": "विशेषज्ञ सलाह",
          "myPosts": "मेरी गतिविधि"
        },
        "stats": {
          "members": "Members",
          "discussions": "Discussions",
          "experts": "Experts Online"
        },
        "chatWith": "चैट करें",
        "globalChat": "वैश्विक चैट",
        "onlineFarmers": "ऑनलाइन किसान",
        "you": "आप",
        "deleteMessageConfirm": "Are you sure you want to delete this message?",
        "replyTitle": "एक उत्तर लिखें...",
        "replyBtn": "उत्तर",
        "noReplies": "अभी तक कोई उत्तर नहीं। पहले बनें!",
        "translatingToast": "AI is translating this post...",
        "aiTranslating": "AI इस पोस्ट का अनुवाद कर रहा है।",
        "translatePost": "पोस्ट का अनुवाद करें",
        "deleteMessage": "Delete Message",
        "errorPost": "प्रश्न पोस्ट करने में विफल",
        "errorSend": "Failed to send message"
      },
      "common": {
        "today": "आज",
        "yesterday": "कल",
        "messages": "नए संदेश",
        "clickToChat": "Click to chat",
        "active": "active",
        "loading": "लोड हो रहा है...",
        "localizing": "स्थानीयकरण किया जा रहा है...",
        "localized": "Analysis localized to {{lang}} in {{dialect}} dialect.",
        "dialectTransform": "{{dialect}} बोली में बदला जा रहा है...",
        "listening": "Listening...",
        "voiceError": "Voice input failed. Please try again.",
        "error": "त्रुटि",
        "success": "सफलता",
        "generatedOn": "पर जेनरेट किया गया",
        "crops": {
          "rice": "चावल",
          "wheat": "गेहूं",
          "maize": "मक्का",
          "sugarcane": "गन्ना",
          "potato": "आलू",
          "tomato": "टमाटर",
          "ginger": "अदरक",
          "cotton": "कपास"
        },
        "playEnglish": "अंग्रेजी में सुनें",
        "playHindi": "हिंदी में सुनें",
        "soldBy": "द्वारा बेचा गया",
        "other": "अन्य",
        "farmerTypes": {
          "small": "Small Farmer",
          "marginal": "Marginal Farmer",
          "large": "Large Farmer",
          "landless": "Landless Laborer"
        },
        "voiceUnsupported": "Voice search not supported in this browser.",
        "offline": "ऑफलाइन",
        "tryAgain": "पुनः प्रयास करें",
        "ready": "Ready",
        "in": "में",
        "unit": {
          "acres": "एकड़",
          "hectares": "हेक्टेयर",
          "tons": "टन",
          "quintals": "क्विंटल",
          "kilograms": "किलोग्राम"
        },
        "all": "All States",
        "optional": "वैकल्पिक",
        "requiredBy": "की आवश्यकता है"
      },
      "digitalTwin": {
        "title": "GIS स्मार्ट खेती डिजिटल ट्विन",
        "subtitle": "परिशुद्ध खेती के लिए उन्नत GIS मैपिंग, मल्टी-लेयर विज़ुअलाइज़ेशन और रीयल-टाइम मॉनिटरिंग के साथ अपने खेत की एक पूर्ण डिजिटल प्रतिकृति बनाएं।",
        "featuring": "✨ विशेषता: खेत की सीमाएं • मिट्टी क्षेत्र • सिंचाई योजना • कीट जोखिम मानचित्र • NDVI फसल स्वास्थ्य • मौसम विश्लेषण",
        "setupTitle": "खेत सेटअप",
        "setupDesc": "अपना डिजिटल ट्विन उत्पन्न करने के लिए अपने खेत का विवरण या निर्देशांक दर्ज करें।",
        "farmName": "खेत का नाम",
        "ownerName": "मालिक का नाम",
        "state": "राज्य",
        "district": "जिला",
        "town": "कस्बा/गाँव",
        "coordinates": "निर्देशांक",
        "latitude": "अक्षांश",
        "longitude": "देशांतर",
        "useCurrent": "वर्तमान स्थान का उपयोग करें",
        "size": "खेत का आकार (एकड़)",
        "generateBtn": "डिजिटल ट्विन उत्पन्न करें",
        "generating": "डिजिटल ट्वিন उत्पन्न हो रहा है...",
        "quickDemo": "क्विक डेमो",
        "drawMap": "मानचित्र पर ड्रा करें",
        "capabilities": "डिजिटल ट्विन क्षमताएं",
        "visualization": "मल्टी-लेयर GIS विज़ुअलाइज़ेशन",
        "interactiveMap": "इंटरएक्टिव GIS मानचित्र: {{name}}",
        "liveData": "लाइव फार्म इंटेलिजेंस",
        "explainBtn": "खेत की स्थिति समझाएं",
        "stopBtn": "रोकें",
        "accuracy": "Accuracy",
        "update": "डिजिटल ट्विन अपडेट करें",
        "hectares": "हेक्टेयर",
        "area": "खेत का क्षेत्र",
        "features": {
          "soil": {
            "title": "मिट्टी क्षेत्र वर्गीकरण",
            "desc": "बनावट, pH और पोषक तत्व मैपिंग के साथ मल्टी-लेयर मिट्टी विश्लेषण",
            "f1": "मिट्टी की बनावट",
            "f2": "pH क्षेत्र",
            "f3": "पोषक तत्व मानचित्र",
            "f4": "उर्वरता सूचकांक"
          },
          "irrigation": {
            "title": "सिंचाई क्षेत्र योजना",
            "desc": "फसल की जरूरतों और मिट्टी की स्थितियों के आधार पर स्मार्ट सिंचाई क्षेत्र डिजाइन",
            "f1": "जल क्षेत्र",
            "f2": "ड्रिप योजना",
            "f3": "स्प्रिंकलर लेआउट",
            "f4": "दक्षता मानचित्र"
          },
          "pest": {
            "title": "कीट-प्रवण क्षेत्र पहचान",
            "desc": "उच्च जोखिम वाले क्षेत्रों की पहचान करने के लिए ऐतिहासिक कीट डेटा का विश्लेषण",
            "f1": "जोखिम क्षेत्र",
            "f2": "कीट इतिहास",
            "f3": "रोकथाम क्षेत्र",
            "f4": "उपचार मानचित्र"
          },
          "growth": {
            "title": "फसल वृद्धि चरण",
            "desc": "विभिन्न क्षेत्रों में रीयल-टाइम फसल विकास चरण की निगरानी",
            "f1": "वृद्धि चरण",
            "f2": "परिपक्वता मानचित्र",
            "f3": "कटाई क्षेत्र",
            "f4": "उपज पूर्वानुमान"
          },
          "weather": {
            "title": "मौसम सूक्ष्म जलवायु",
            "desc": "खेत-विशिष्ट सूक्ष्म जलवायु विश्लेषण और मौसम पैटर्न मैपिंग",
            "f1": "तापमान क्षेत्र",
            "f2": "आर्द्रता मानचित्र",
            "f3": "हवा के पैटर्न",
            "f4": "पाला जोखिम"
          }
        },
        "layers": {
          "satellite": "सैटेलाइट इमेजरी",
          "soilHealth": "मिट्टी स्वास्थ्य",
          "cropHealth": "फसल स्वास्थ्य",
          "weather": "मौसम डेटा",
          "pests": "कीट अलर्ट",
          "base": "बेस लेयर",
          "analysis": "विश्लेषण परत",
          "monitoring": "निगरानी परत",
          "environmental": "पर्यावरणीय परत",
          "alert": "अलर्ट लेयर",
          "daily": "दैनिक",
          "weekly": "साप्ताहिक",
          "realtime": "रीयल-टाइम",
          "hourly": "प्रति घंटा",
          "asneeded": "आवश्यकतानुसार"
        },
        "drawDesc": "अपना स्थान चुनें और अपनी जमीन के सटीक आकार को ड्रा करें।",
        "exploreNote": "मल्टी-लेयर GIS विज़ुअलाइज़ेशन के साथ {{owner}} के खेत को एक्सप्लोर करें। विस्तृत जानकारी के लिए क्षेत्रों पर क्लिक करें।",
        "initializing": {
          "status": "डिजिटल ट्विन इंजन शुरू हो रहा है...",
          "mapping": "के लिए सीमाओं का मानचित्रण",
          "soil": "मिट्टी सेंसर डेटा परतों का विश्लेषण किया जा रहा है...",
          "irrigation": "सिंचाई ग्रिड डिजाइन किया जा रहा है",
          "pests": "ऐतिहासिक कीट जोखिम क्षेत्रों की गणना की जा रही है..."
        },
        "insights": {
          "mappedZones": "मैप किए गए मिट्टी क्षेत्र",
          "activeZones": "सक्रिय सिंचाई क्षेत्र",
          "growthStages": "औसत वृद्धि चरण",
          "health": "स्वास्थ्य स्कोर"
        },
        "summary": {
          "prefix": "{{area}} हेक्टेयर के लिए फार्म स्टेटस रिपोर्ट।",
          "zones": "हमने {{soil}} मिट्टी क्षेत्र और {{irrigation}} सिंचाई क्षेत्र की पहचान की है।",
          "health": "कुल फसल स्वास्थ्य {{health}}% है।",
          "pestWarning": "चेतावनी: उच्च कीट जोखिम का पता चला है। तत्काल कार्रवाई करने की सलाह दी जाती है।",
          "pestLow": "कीट जोखिम वर्तमान में कम है।"
        },
        "shapeAnalysis": "खेत आकार विश्लेषण"
      },
      "iot": {
        "title": "IoT स्मार्ट फार्म मॉनिटरिंग",
        "subtitle": "कम लागत वाले सेंसर नोड्स का उपयोग करके वास्तविक समय में मिट्टी के स्वास्थ्य और पर्यावरण की निगरानी।",
        "liveMonitoring": "लाइव मॉनिटरिंग",
        "viewAnalytics": "एनालिटिक्स देखें",
        "liveDataHeader": "लाइव सेंसर डेटा",
        "moisture": "नमी",
        "ph": "pH स्तर",
        "temp": "तापमान",
        "nitrogen": "नाइट्रोजन",
        "phosphorus": "फास्फोरस",
        "potassium": "पोटेशियम",
        "alertsTitle": "सक्रिय अलर्ट",
        "recsTitle": "सिंचाई की सिफारिशें",
        "alertsCount": "सक्रिय अलर्ट ({{count}})",
        "recsCount": "सिंचाई की सिफारिशें ({{count}})",
        "noAlerts": "कोई सक्रिय अलर्ट नहीं। आपके खेत की स्थिति अनुकूल है।",
        "noRecs": "इस समय कोई सिंचाई सिफारिश नहीं है।",
        "startIrrigation": "सिंचाई शुरू करें",
        "irrigationFor": "{{duration}} मिनट के लिए",
        "features": {
          "title": "सिस्टम विशेषताएं",
          "f1": {
            "title": "वास्तविक समय की निगरानी",
            "desc": "24/7 मिट्टी के मापदंडों की निरंतर निगरानी",
            "items": [
              "मिट्टी की नमी",
              "pH स्तर",
              "तापमान",
              "चालकता"
            ]
          },
          "f2": {
            "title": "स्मार्ट अलर्ट",
            "desc": "महत्वपूर्ण स्थितियों के लिए AI-संचालित अलर्ट सिस्टम",
            "items": [
              "थ्रेशोल्ड अलर्ट",
              "भविष्यवाणी चेतावनी",
              "मोबाइल सूचनाएं",
              "ईमेल रिपोर्ट"
            ]
          },
          "f3": {
            "title": "स्वचालित सिंचाई",
            "desc": "मिट्टी की स्थिति के आधार पर स्वचालित सिंचाई",
            "items": [
              "स्मार्ट शेड्यूलिंग",
              "ज़ोन कंट्रोल",
              "जल अनुकूलन",
              "रिमोट कंट्रोल"
            ]
          },
          "f4": {
            "title": "डेटा एनालिटिक्स",
            "desc": "ऐतिहासिक डेटा विश्लेषण और रुझान निगरानी",
            "items": [
              "रुझान विश्लेषण",
              "प्रदर्शन रिपोर्ट",
              "उपज सहसंबंध",
              "ROI ट्रैकिंग"
            ]
          }
        },
        "benefits": {
          "title": "स्मार्ट खेती के लाभ",
          "b1": {
            "title": "40% पानी की बचत",
            "desc": "सटीक सिंचाई नियंत्रण"
          },
          "b2": {
            "title": "25% उपज में वृद्धि",
            "desc": "इष्टतम बढ़ती स्थिति"
          },
          "b3": {
            "title": "60% श्रम की कमी",
            "desc": "स्वचालित निगरानी"
          },
          "b4": {
            "title": "वास्तविक समय की जानकारी",
            "desc": "त्वरित निर्णय लेना"
          }
        }
      },
      "weather": {
        "title": "स्मार्ट मौसम जोखिम और अलर्ट",
        "subtitle": "आपके विशिष्ट खेत स्थान के लिए उन्नत GIS-आधारित मौसम जोखिम का पता लगाना।",
        "locationTitle": "जोखिम स्कैनिंग नियंत्रण",
        "locationDesc": "स्थानीय मौसम के खतरों की जांच करने और स्वचालित अलर्ट प्राप्त करने के लिए अपना स्थान चुनें।",
        "selectState": "राज्य चुनें",
        "selectDistrict": "ज़िला चुनें",
        "phoneLabel": "फ़ोन नंबर (SMS अलर्ट के लिए)",
        "phoneVerify": "सत्यापित करें",
        "phoneCalling": "कॉल आ रही है...",
        "scanBtn": "जोखिम जांचें",
        "scanning": "GIS डेटा स्कैन किया जा रहा है...",
        "systemSafe": "सिस्टम सुरक्षित",
        "alert": "सतर्क",
        "riskDetected": "जोखिम का पता चला",
        "standby": "सिस्टम स्टैंडबाय",
        "placeholder": "खतरों के लिए अपने क्षेत्र को स्कैन करना शुरू करने के लिए अपना स्थान चुनें और 'जोखिम जांचें' पर क्लिक करें।",
        "temp": "तापमान",
        "humidity": "आर्द्रता",
        "toasts": {
          "verifyTitle": "📞 Incoming Call from Twilio",
          "verifyDesc": "Answer the call and enter code: {{code}}",
          "verifyFailed": "Verification Failed",
          "riskTitle": "⚠️ Risk Detected",
          "smsSent": "🚨 SMS Alert sent to {{phone}}",
          "safeTitle": "✅ Conditions Safe",
          "safeDesc": "No severe weather threats detected."
        }
      },
      "voiceAssistant": {
        "hero": {
          "title": "किसानों के लिए वॉयस असिस्टेंट",
          "desc": "हिंदी या अपनी स्थानीय भाषा में स्वाभाविक रूप से बोलें। ग्रामीण किसानों के लिए डिज़ाइन की गई आवाज़ प्रतिक्रियाओं के साथ तत्काल एआई कृषि सलाह प्राप्त करें।",
          "startBtn": "बोलना शुरू करें",
          "chooseLangBtn": "भाषा चुनें"
        },
        "features": {
          "sectionTitle": "आवाज़ सहायक की विशेषताएँ",
          "f1": {
            "title": "हिंदी ध्वनि पहचान",
            "desc": "हिंदी में स्वाभाविक रूप से बोलें और तत्काल प्रतिक्रियाएं प्राप्त करें",
            "example": "गेहूं में रोग आ गया है, क्या करें?",
            "response": "गेहूं के रोग का पता चला। फफूंदनाशक स्प्रे लागू करें।"
          },
          "f2": {
            "title": "स्थानीय भाषा समर्थन",
            "desc": "पूरे भारत में क्षेत्रीय भाषाओं का समर्थन"
          },
          "f3": {
            "title": "ऑडियो प्रतिक्रियाएं",
            "desc": "अपनी पसंदीदा भाषा में विस्तृत ऑडियो प्रतिक्रियाएं प्राप्त करें",
            "item1": "स्पष्ट उच्चारण",
            "item2": "धीमी/तेज़ गति",
            "item3": "दोहराने का विकल्प",
            "item4": "ऑडियो सेव करें"
          },
          "f4": {
            "title": "ऑफ़लाइन वॉयस कमांड",
            "desc": "बुनियादी वॉयस कमांड बिना इंटरनेट के भी काम करते हैं",
            "item1": "मौसम की जानकारी",
            "item2": "फसल कैलेंडर",
            "item3": "बुनियादी निदान",
            "item4": "आपातकालीन मदद"
          }
        },
        "examples": {
          "sectionTitle": "वास्तविक बातचीत के उदाहरण",
          "solutionPrefix": "समाधान",
          "e1": {
            "farmer": "टमाटर में पत्ते पीले हो रहे हैं",
            "farmerTrans": "Tomato leaves are turning yellow",
            "ai": "यह नाइट्रोजन की कमी हो सकती है। यूरिया का छिड़काव करें।",
            "aiTrans": "This could be nitrogen deficiency. Apply urea spray.",
            "solution": "पानी के छिड़काव के साथ 2 किलोग्राम यूरिया प्रति एकड़ फैलाएं"
          },
          "e2": {
            "farmer": "क्या आज पानी देना चाहिए?",
            "farmerTrans": "Should I water today?",
            "ai": "मिट्टी में नमी 40% है। 2 दिन बाद पानी दें।",
            "aiTrans": "Soil moisture is 40%. Water after 2 days.",
            "solution": "2 दिन रुकें, फिर 25 मिमी सिंचाई करें"
          },
          "e3": {
            "farmer": "फसल कब काटनी चाहिए?",
            "farmerTrans": "When should I harvest the crop?",
            "ai": "आपकी गेहूं 15 दिन में तैयार होगी। दाने सुनहरे होने का इंतज़ार करें।",
            "aiTrans": "Your wheat will be ready in 15 days. Wait for golden grains.",
            "solution": "जब नमी की मात्रा 12-14% हो तब कटाई करें"
          }
        },
        "demo": {
          "sectionTitle": "वॉयस असिस्टेंट को आजमाएं",
          "selectLang": "भाषा चुनें",
          "listening": "सुन रहा हूँ...",
          "pressToSpeak": "बोलने के लिए दबाएं",
          "processing": "प्रोसेसिंग...",
          "youSaid": "आपने कहा:",
          "aiResponse": "🤖 एआई का जवाब:",
          "exampleQuestionsTitle": "उदाहरण प्रश्न:",
          "noteTitle": "नोट",
          "noteDesc": "वॉयस रिकग्निशन के लिए आधुनिक ब्राउज़र और माइक्रोफ़ोन अनुमति की आवश्यकता होती है। क्रोम/एज में सबसे अच्छा काम करता है।",
          "noteHindiDesc": "नोट: आवाज़ पहचान के लिए आधुनिक ब्राउज़र और माइक्रोफ़ोन की अनुमति चाहिए।"
        },
        "langs": {
          "sectionTitle": "समर्थित भाषाएं",
          "hindi": "हिंदी",
          "english": "अंग्रेज़ी (भारत)",
          "fullSupport": "पूर्ण समर्थन"
        },
        "howItWorks": {
          "sectionTitle": "वॉयस असिस्टेंट कैसे काम करता है",
          "s1": {
            "title": "सवाल पूछें",
            "desc": "हिंदी या स्थानीय भाषा में पूछें"
          },
          "s2": {
            "title": "एआई प्रसंस्करण",
            "desc": "आवाज़ पहचान और समझ"
          },
          "s3": {
            "title": "प्रतिक्रिया उत्पन्न करें",
            "desc": "व्यक्तिगत उत्तर बनाता है"
          },
          "s4": {
            "title": "ऑडियो उत्तर",
            "desc": "अपनी भाषा में प्रतिक्रिया सुनें"
          }
        },
        "benefits": {
          "sectionTitle": "वॉयस असिस्टेंट के लाभ",
          "b1": {
            "title": "उपयोग में आसान",
            "desc": "टाइपिंग नहीं चाहिए, बस बोलें"
          },
          "b2": {
            "title": "ग्रामीण अनुकूल",
            "desc": "निरक्षर किसानों के लिए काम करता है"
          },
          "b3": {
            "title": "तत्काल मदद",
            "desc": "कुछ ही सेकंड में उत्तर प्राप्त करें"
          },
          "b4": {
            "title": "स्थानीय भाषा",
            "desc": "हिंदी में समझें और जवाब दें"
          }
        },
        "digitalTwin": {
          "title": "Farm Digital Twin",
          "subtitle": "Visualize your farm with GIS, IoT, and AI-driven spatial analysis.",
          "initializing": {
            "status": "Creating your digital farm twin...",
            "mapping": "Mapping field boundaries for",
            "soil": "Analyzing soil zones based on location",
            "irrigation": "Planning irrigation systems for",
            "pests": "Detecting pest-prone areas"
          },
          "capabilities": "Digital Twin Capabilities",
          "features": {
            "gis": {
              "title": "GIS Plot Mapping",
              "desc": "Satellite-based boundary mapping with sub-meter accuracy",
              "f1": "Boundary Detection",
              "f2": "Area Calculation",
              "f3": "Elevation Mapping",
              "f4": "Geo-fencing"
            },
            "soil": {
              "title": "Soil Health Mapping",
              "desc": "Spatial distribution of nutrients and soil types",
              "f1": "NPK Gradients",
              "f2": "pH Variation",
              "f3": "Texture Analysis",
              "f4": "Carbon Seq."
            },
            "irrigation": {
              "title": "Smart Irrigation",
              "desc": "VRT-based irrigation planning and moisture tracking",
              "f1": "Hydraulic Zones",
              "f2": "Moisture Flux",
              "f3": "Drip Planning",
              "f4": "Runoff Predict."
            }
          },
          "insights": {
            "pestRisk": "Pest Risk Areas",
            "growthStages": "Crop Growth Stages",
            "health": "Health",
            "risk": "risk",
            "mappedZones": "Mapped zones",
            "activeZones": "Active zones",
            "avgHealth": "Average %"
          },
          "areaNote": "acres"
        },
        "farmerDashboard": {
          "title": "Smart Farmer Dashboard",
          "subtitle": "Your centralized hub for AI operations and farm management.",
          "metrics": {
            "models": "AI Models",
            "activeModels": "active models",
            "area": "Mapped Area",
            "hectares": "hectares",
            "detections": "Detections",
            "types": "distinct types",
            "accuracy": "Avg. Accuracy"
          },
          "tabs": {
            "overview": "Overview",
            "disease": "Disease AI",
            "twin": "Digital Twin",
            "yield": "Yield Predict",
            "pest": "Pest Forecast",
            "marketplace": "Marketplace"
          }
        },
        "status": {
          "listening": "सुन रहा हूँ...",
          "processing": "AI प्रतिक्रिया तैयार की जा रही है...",
          "speaking": "असिस्टेंट बोल रहा है..."
        }
      },
      "gov": {
        "title": "कृषि मंत्रालय डैशबोर्ड",
        "subtitle": "राष्ट्रीय कमान एवं नियंत्रण केंद्र",
        "operational": "सिस्टम चालू है",
        "genReport": "रिपोर्ट तैयार करें",
        "stats": {
          "regFarmers": "पंजीकृत किसान",
          "activeAlerts": "सक्रिय अलर्ट",
          "cropLossCases": "फसल नुकसान के मामले",
          "estDisbursement": "अनुमानित संवितरण"
        },
        "tabs": {
          "overview": "Overview & Analytics",
          "cropLoss": "Crop Loss Compensation",
          "market": "Market Intelligence"
        },
        "charts": {
          "diseaseTrend": "Disease Detection Trend",
          "communityIssues": "Community Issues",
          "prices": "State-wise Avg Prices",
          "listings": "Live Listings Overview"
        },
        "cases": {
          "title": "Compensation Case Management",
          "search": "Search case ID...",
          "noCases": "No active cases found.",
          "eligible": "Eligible",
          "reviewRequired": "Review Required",
          "verify": "Verify",
          "reject": "Reject",
          "approve": "Approve",
          "status": {
            "approved": "Approved",
            "rejected": "Rejected",
            "underVerification": "Under Verification",
            "pending": "Approval Pending"
          }
        },
        "report": {
          "generated": "Report Generated",
          "downloaded": "The report has been downloaded to your device.",
          "totalVolume": "Total Volume Traded"
        },
        "caseActions": {
          "approved": "Case Approved",
          "rejected": "Case Rejected",
          "verified": "Verification Requested",
          "updated": "Case {{id}} has been updated.",
          "errorUpdate": "Failed to update case status",
          "errorFetch": "Failed to fetch government dashboard data"
        },
        "labels": {
          "replies": "Replies",
          "loss": "Loss",
          "cause": "Cause",
          "damage": "Damage",
          "estLoss": "Est. Loss",
          "scheme": "Scheme"
        }
      },
      "buyer": {
        "title": "Verified Buyer Dashboard",
        "welcome": "Welcome, {{name}}",
        "subtitle": "Sourcing fresh produce directly from farmers.",
        "panIndia": "Pan India",
        "postDemand": "Post Demand",
        "tabs": {
          "listings": "Listing Feed",
          "intelligence": "Market Intelligence",
          "deals": "My Deals"
        },
        "filters": {
          "search": "Search wheat, rice, Punjab...",
          "allCrops": "All Crops",
          "allStates": "All States"
        },
        "card": {
          "quantity": "Quantity",
          "price": "Price",
          "farmer": "Farmer",
          "harvest": "Harvest",
          "callFarmer": "Call Farmer",
          "grade": "Grade"
        },
        "intelligence": {
          "title": "Market Demand Analysis",
          "scope": "Market Scope",
          "config": "Configure AI analysis target",
          "forecast": "Trend Forecast",
          "demand": "Demand Level",
          "vsMsp": "Vs MSP",
          "avgPrice": "Avg. Market Price",
          "genBtn": "Generate AI Insights",
          "analyzing": "Analyzing...",
          "strategicAnalysis": "AI Strategic Analysis",
          "mspComparison": "MSP vs Market Price",
          "brief": "Intelligence Brief"
        },
        "contact": {
          "title": "Contact Farmer",
          "desc": "Connect with {{name}} directly.",
          "phone": "Phone Number",
          "whatsapp": "WhatsApp",
          "call": "Call Now",
          "close": "Close"
        },
        "demand": {
          "title": "Post Buying Requirement",
          "desc": "Farmers matching these criteria will be alerted.",
          "crop": "Target Crop",
          "quantity": "Quantity (Quintals)",
          "price": "Target Price/Qtl",
          "location": "Preferred Location (Optional)",
          "postBtn": "Post Demand",
          "cancel": "Cancel"
        },
        "contactFarmer": "Contact Farmer",
        "saveListing": "Save for later",
        "errorInsights": "Failed to fetch market insights",
        "loginRequired": "Login Required",
        "loginRequiredDesc": "Please login as a buyer to contact farmers.",
        "fillFields": "Please fill in required fields.",
        "errorPostDemand": "Failed to post demand.",
        "recordedNote": "Interactions are recorded in your 'My Deals' tab.",
        "trader": "Trader",
        "loading": "Loading live marketplace...",
        "noListings": "No listings found matching your criteria.",
        "gradeA": "Grade A",
        "ready": "Ready",
        "targetCrop": "Target Crop",
        "targetState": "Target State",
        "unknown": "Unknown",
        "noDeals": "No active deals yet.",
        "dealLabel": "{{crop}} Deal",
        "withLabel": "with {{name}}",
        "toast": {
          "saved": "Listing saved for later",
          "unsaved": "Listing removed from saved"
        }
      },
      "cropLoss": {
        "title": "Crop Loss Compensation Claim",
        "subtitle": "Government of India - Ministry of Agriculture",
        "sections": {
          "farmer": "Farmer Details",
          "crop": "Crop Details",
          "loss": "Loss Details",
          "evidence": "Evidence Upload",
          "compliance": "Advisory Compliance",
          "declaration": "Final Declaration"
        },
        "fields": {
          "name": "Farmer Name",
          "mobile": "Mobile Number",
          "state": "State",
          "district": "District",
          "village": "Village",
          "area": "Total Farm Area (Acres)",
          "insurance": "PMFBY Insurance Status",
          "cropName": "Crop Name",
          "season": "Season",
          "sowingDate": "Sowing Date",
          "harvestDate": "Expected Harvest Date",
          "affectedArea": "Affected Area (Acres)",
          "cause": "Cause of Loss",
          "damageDate": "Date Damage Observed",
          "damagePercent": "Estimated Damage Percentage (%)",
          "minDamageNote": "Minimum 33% required",
          "complianceFert": "Applied fertilizers as recommended",
          "complianceIrri": "Followed irrigation schedule",
          "compliancePest": "Reported pests early via tool"
        },
        "placeholders": {
          "name": "Full Name",
          "mobile": "+91...",
          "insurance": "Select Status",
          "insYes": "Enrolled (Yes)",
          "insNo": "Not Enrolled",
          "selectCrop": "Select Crop",
          "selectCause": "Select Cause",
          "village": "Village Name"
        },
        "seasons": {
          "kharif": "Kharif",
          "rabi": "Rabi",
          "zaid": "Zaid"
        },
        "advisory": {
          "title": "Confirm your adherence to AgriSphere advisories. This impacts claim approval.",
          "verifiedNote": "Will be verified against AI usage logs."
        },
        "causes": {
          "flood": "Flood / Heavy Rain",
          "drought": "Drought",
          "pest": "Pest Attack",
          "disease": "Crop Disease",
          "hailstorm": "Hailstorm",
          "heatwave": "Heatwave"
        },
        "ai": {
          "title": "AI Assistant Tips",
          "uploadPhotos": "Please upload photos of affected leaves/stems for AI verification.",
          "specifyPest": "Mention specific pest name if known (e.g., Pink Bollworm).",
          "gpsEnable": "Ensure GPS location is enabled while taking photos."
        },
        "evidence": {
          "uploadBtn": "Click to upload photos/video",
          "note": "Upload at least 2 photos (Close-up & Wide angle). GPS metadata will be extracted."
        },
        "declaration": {
          "check": "I hereby declare that the information provided above is true.",
          "note": "I understand that any false claim will lead to rejection and legal action."
        },
        "submitBtn": "Submit Claim",
        "success": "Claim submitted successfully!",
        "error": "Failed to submit claim. Please try again.",
        "agreeError": "You must agree to the declaration."
      },
      "farmerDashboard": {
        "title": "Comprehensive AI Agriculture Dashboard",
        "subtitle": "Advanced AI-powered agriculture management system combining disease detection, GIS digital twin, and yield prediction for precision farming.",
        "tabs": {
          "overview": "Overview",
          "disease": "AI Disease Detection",
          "twin": "GIS Digital Twin",
          "yield": "Yield Prediction",
          "pest": "Pest Forecast",
          "marketplace": "Marketplace"
        },
        "metrics": {
          "models": "AI Models",
          "area": "Farm Area",
          "detections": "Detection Classes",
          "accuracy": "Accuracy",
          "activeModels": "Active Models",
          "hectares": "Hectares",
          "types": "Disease/Pest Types",
          "precision": "AI Precision"
        },
        "status": {
          "active": "Active",
          "live": "Live",
          "types": "Types"
        },
        "yield": {
          "title": "Crop Yield Predictions (2025)",
          "perHectare": "per hectare",
          "advancedTitle": "Advanced AI Yield Prediction",
          "modelPerformance": "ML Model Performance"
        },
        "twin": {
          "title": "GIS-Based Smart Farm Digital Twin",
          "activeZones": "Active Zones",
          "monitored": "Monitored",
          "average": "Average",
          "spatialFeatures": "Spatial Analysis Features",
          "precisionBenefits": "Precision Agriculture Benefits"
        }
      },
      "seeds": {
        "title": "स्मार्ट बीज",
        "titleProcurement": "खरीद",
        "heroBadge": "ब्लॉकचेन स्मार्ट खरीद प्रणाली (बीटा)",
        "heroDescription": "हम केवल बीजों की सिफारिश नहीं करते हैं—हम आपको मूल्य बुद्धिमत्ता और वास्तविक समय की पहुंच के साथ सत्यापित नजदीकी आपूर्तिकर्ताओं से जोड़ते हैं।",
        "verifySeedNet": "SeedNet पर सत्यापित करें",
        "locateShops": "दुकानें खोजें",
        "searchPlaceholder": "बीज या दुकानों के लिए खोजें...",
        "all": "सभी",
        "govtSubsidized": "सरकारी सब्सिडी",
        "private": "निजी",
        "inStock": "स्टॉक में",
        "outOfStock": "स्टॉक में नहीं",
        "subsidyAvailable": "सब्सिडी उपलब्ध",
        "call": "कॉल करें",
        "docsNeeded": "दस्तावेजों की आवश्यकता",
        "requiredDocs": "आवश्यक दस्तावेज",
        "carryDocs": "सब्सिडी का लाभ उठाने के लिए कृपया इन दस्तावेजों को {{shopName}} ले जाएं।",
        "advisorTitle": "AI बीज सलाहकार",
        "advisorDesc": "अपने मौसम और फसल के आधार पर व्यक्तिगत बीज सिफारिशें प्राप्त करें।",
        "selectSeason": "मौसम चुनें",
        "seasonRabi": "रबी",
        "seasonKharif": "खरीफ",
        "aiTip": "AI इन रैंकिंग के लिए आपकी वर्तमान मिट्टी की बनावट और सूक्ष्म जलवायु पर विचार करता है।",
        "selectSeasonPrompt": "AI सिफारिशें देखने के लिए एक मौसम चुनें",
        "checkAvailability": "उपलब्धता की जांच करें",
        "tags": {
          "lowestPrice": "सबसे कम कीमत",
          "nearest": "निकटतम",
          "blockchainVerified": "ब्लॉकचेन सत्यापित"
        },
        "currentPrice": "वर्तमान मूल्य",
        "marketRate": "बाजार दर",
        "rating": "रेटिंग",
        "viewRoute": "मार्ग देखें",
        "checkWithStore": "स्टोर से जांचें",
        "unit": {
          "km": "किमी"
        },
        "tabs": {
          "findShops": "दुकानें खोजें",
          "advisor": "बीज सलाहकार"
        },
        "toasts": {
          "locating": "आपकी स्थिति खोज रहे हैं...",
          "locatingDesc": "नजदीकी दुकानों के लिए आपके जीपीएस निर्देशांक प्राप्त कर रहे हैं।",
          "found": "स्थान मिल गया",
          "foundDesc": "{{city}}, {{state}} के पास सत्यापित बीज आपूर्तिकर्ता दिखा रहा है।",
          "errorLoc": "नजदीकी दुकानें प्राप्त करने में विफल।",
          "permDenied": "जियोलोकेशन अस्वीकार कर दिया गया",
          "permDeniedDesc": "नजदीकी दुकानें खोजने के लिए कृपया स्थान सक्षम करें।"
        }
      },
      "trace": {
        "title": "Web3 ट्रैसेबिलिटी",
        "subtitle": "स्मार्ट कॉन्ट्रैक्ट्स द्वारा संचालित एंड-टु-एंड फसल ट्रैकिंग।",
        "connectBtn": "वॉलेट कनेक्ट करें",
        "connected": "कनेक्टेड: {{account}}",
        "walletConnected": "वॉलेट कनेक्ट हो गया",
        "simulatedWallet": "सिमुलेटेड वॉलेट कनेक्टेड",
        "simulatedWalletDesc": "कोई Web3 प्रदाता नहीं मिला। डेमो एकाउंट का उपयोग कर रहे हैं।",
        "connectionFailed": "कनेक्शन विफल",
        "trackTab": "फसल ट्रैक करें",
        "registerTab": "बैच रजिस्टर करें",
        "searchHint": "बैच आईडी दर्ज करें (जैसे BATCH-7241) या क्यूआर स्कैन करें",
        "traceBtn": "डेटा ट्रैक करें",
        "recordFound": "रिकॉर्ड मिला",
        "recordFoundDesc": "Web3 रिकॉर्ड सफलतापूर्वक प्राप्त किए गए।",
        "recordNotFound": "रिकॉर्ड नहीं मिला",
        "recordNotFoundDesc": "बैच आईडी {{id}} लेज़र पर मौजूद नहीं है।",
        "verifiedBatchTrace": "सत्यापित बैच ट्रैक",
        "authentic": "प्रामाणिक",
        "signedBy": "द्वारा हस्ताक्षरित:",
        "queryHint": "ब्लॉकचेन को क्वेरी करने के लिए बैच आईडी दर्ज करें।",
        "ledgerInfo": "डेटा Web3 अपरिवर्तनीय लेज़र के माध्यम से सत्यापित है।",
        "mintTitle": "नया फसल रिकॉर्ड मिंट करें",
        "mintDesc": "ब्लॉकचेन पर अपनी फसल रिकॉर्ड करें। एक बार सबमिट करने के बाद इसे बदला नहीं जा सकता।",
        "batchIdLabel": "जनरेट किया गया बैच आईडी",
        "cropLabel": "फसल / उत्पाद प्रकार",
        "cropPlaceholder": "जैसे बासमती चावल, जैविक सेब",
        "originLabel": "मूल स्थान",
        "originPlaceholder": "फार्म का पता या जीपीएस निर्देशांक",
        "qualityLabel": "गुणवत्ता / प्रमाणीकरण",
        "signingNotice": "इस लेनदेन को सबमिट करके, आप एक हस्ताक्षर कर रहे हैं। आपको अपने वॉलेट में पुष्टि करनी होगी।",
        "mintingBtn": "ब्लॉकचेन पर मिंट हो रहा है...",
        "signRegisterBtn": "साइन और रजिस्टर करें",
        "mintSuccess": "मिंटिंग सफल",
        "mintSuccessDesc": "बैच {{id}} स्थायी रूप से ब्लॉकचेन पर मिंट हो गया।",
        "actions": {
          "harvested": "कटा हुआ और पंजीकृत",
          "quality": "गुणवत्ता की जाँच की गई",
          "transit": "पारगमन में",
          "retailer": "खुदरा विक्रेता के पास पहुँचा"
        }
      }
    }
  },
  "bn": {
    "translation": {
      "nav": {
        "home": "হোম",
        "marketplace": "মার্কেটপ্লেস",
        "communityForum": "কমিউনিটি ফোরাম",
        "advisoryHub": "পরামর্শ কেন্দ্র",
        "voiceAssistant": "ভয়েস সহকারী",
        "fertilizerAi": "সার এআই",
        "pestForecast": "কীটপতঙ্গের পূর্বাভাস",
        "adminDashboard": "অ্যাডমিন ড্যাশবোর্ড",
        "buyerDashboard": "ক্রেতার ড্যাশবোর্ড",
        "farmerDashboard": "কৃষক ড্যাশবোর্ড",
        "diseaseDetection": "রোগ চিহ্নিতকরণ",
        "yieldPrediction": "ফলন পূর্বাভাস",
        "digitalTwin": "ডিজিটাল টুইন",
        "login": "লগইন",
        "getStarted": "শুরু করুন",
        "logout": "Logout",
        "saveProfile": "Save Profile",
        "aiTools": "স্মার্ট ফার্মিং টুলস",
        "seedFinder": "বীজ অনুসন্ধান",
        "traceability": "Web3 ট্রেসেবিলিটি"
      },
      "home": {
        "heroTitle1": "ভারতের প্রথম",
        "heroTitle2": "AI + GIS স্মার্ট ফার্মিং",
        "heroSubtitle": "ইন্টেলিজেন্স প্ল্যাটফর্ম",
        "heroDescription": "কীটপতঙ্গ, পুষ্টির ঘাটতি এবং ছত্রাক সংক্রমণ সনাক্ত করুন। 30% ফলন বৃদ্ধি করুন এবং 40% খরচ বাঁচান।",
        "exploreFeatures": "ডেমো দেখুন",
        "floatingAlert": "আবহাওয়া ঝুঁকি পরীক্ষা করুন",
        "featuresTitle": "আধুনিক কৃষির জন্য",
        "featuresSubtitle": "ইন্টেলিজেন্ট ফিটচার",
        "featuresDesc": "কৃষি উদ্ভাবনী প্রযুক্তি",
        "aboutTitle": "AgriSphere AI হলো ভারতের প্রথম প্রযুক্তি নির্ভর প্ল্যাটফর্ম।",
        "aboutDesc": "কীটপতঙ্গ, পুষ্টির ঘাটতি সনাক্ত করুন এবং ফলন বৃদ্ধি করুন।",
        "howItWorks": "যেভাবে কাজ করে",
        "howItWorksSubtitle": "৪টি ধাপ",
        "ctaTitle": "আপনার কৃষি ব্যবসা পরিবর্তন করতে প্রস্তুত?",
        "ctaSubtitle": "আজই শুরু করুন!",
        "ctaDesc": "AgriSphere AI ব্যবহার করে লাভ বাড়ান।",
        "ctaFreeTrial": "বিনামূল্যে ট্রায়াল",
        "ctaDemo": "ডেমো",
        "features": {
          "f1": {
            "title": "AI Disease Detection",
            "desc": "Advanced ML models analyze images to detect diseases & pests with 95% accuracy",
            "b1": "Pest Detection",
            "b2": "Nutrient Deficiency",
            "b3": "Fungal Infections",
            "b4": "Soil Texture Analysis"
          },
          "f2": {
            "title": "GIS Digital Twin",
            "desc": "Complete farm replica with mapping & growth tracking",
            "b1": "Field Boundaries",
            "b2": "Soil Zones",
            "b3": "Irrigation Zones",
            "b4": "Growth Stages"
          },
          "f3": {
            "title": "Yield Prediction",
            "desc": "ML-powered yields forecasting using weather & soil data",
            "b1": "Weather Analysis",
            "b2": "Soil Type Mapping",
            "b3": "Historical Data",
            "b4": "ML Forecasting"
          },
          "f4": {
            "title": "Weather Risk Engine",
            "desc": "Real-time alerts for floods, drought, and heatwaves",
            "b1": "Flood Alerts",
            "b2": "Drought Warning",
            "b3": "Heatwave Detection",
            "b4": "SMS Alerts"
          },
          "f5": {
            "title": "Fertilizer & Irrigation AI",
            "desc": "Smart NPK & water scheduling for optimal nutrition",
            "b1": "NPK Analysis",
            "b2": "Water Prediction",
            "b3": "Smart Scheduling",
            "b4": "Nutrition Optimization"
          }
        },
        "stats": {
          "activeFarmers": "সক্রিয় কৃষক",
          "accuracyRate": "নির্ভুলতা",
          "fieldsMapped": "ম্যাপ করা জমি",
          "yieldIncrease": "ফলন বৃদ্ধি"
        },
        "advanced": {
          "title": "Advanced AI Intelligence",
          "desc": "Cutting-edge features that set AgriSphere AI apart",
          "pests": {
            "title": "Pest Attack Prediction",
            "desc": "AI forecasts pest attack probability (0-100%) for next 7 days",
            "b1": "Climate Analysis",
            "b2": "7-Day Risk Forecast",
            "b3": "Prevention Alerts",
            "b4": "Treatment Recommendations"
          },
          "seedToMarket": {
            "title": "Seed-to-Market Advisory",
            "desc": "Complete guidance from seed selection to market pricing",
            "b1": "Seed Selection",
            "b2": "Sowing Time",
            "b3": "Harvest Prediction",
            "b4": "Market Pricing"
          },
          "voice": {
            "title": "Voice Assistant (Hindi)",
            "desc": "Farmers speak in local language, AI responds with advice",
            "b1": "Hindi Support",
            "b2": "Voice Recognition",
            "b3": "Local Languages",
            "b4": "Audio Responses"
          },
          "schemes": {
            "title": "Government Schemes AI",
            "desc": "Auto-identifies subsidies, loans, and PM-KISAN benefits",
            "b1": "Subsidy Matching",
            "b2": "Loan Eligibility",
            "b3": "Insurance Plans",
            "b4": "PM-KISAN"
          },
          "marketplace": {
            "title": "Farmer-Buyer Marketplace",
            "desc": "Direct selling platform with AI pricing and logistics",
            "b1": "Direct Selling",
            "b2": "AI Pricing",
            "b3": "Logistics",
            "b4": "Income Boost"
          },
          "blockchain": {
            "title": "Blockchain Traceability",
            "desc": "Track crop origin and supply chain for quality assurance",
            "b1": "Origin Tracking",
            "b2": "Supply Chain",
            "b3": "Authenticity",
            "b4": "Quality Assurance"
          }
        },
        "rural": {
          "title": "গ্রামীণ ভারতের জন্য তৈরি",
          "subtitle": "গ্রামের কৃষকদের জন্য"
        },
        "women": {
          "title": "গ্রামীণ মহিলা কৃষি উদ্যোক্তা",
          "subtitle": "নারীদের ক্ষমতায়ন"
        },
        "testimonials": {
          "title": "What Farmers Say",
          "subtitle": "Real stories from farmers transforming their operations",
          "t1": {
            "name": "Rajesh Kumar",
            "loc": "Punjab, India",
            "text": "AgriSphere's multi-class AI detected stem borer in my wheat early. The pest prediction saved my entire 10-acre crop and increased yield by 35%!",
            "benefit": "35% yield increase"
          },
          "t2": {
            "name": "Anita Sharma",
            "loc": "Maharashtra, India",
            "text": "The GIS digital twin mapped my field perfectly. AI-powered management cut water usage by 45%. Marketplace got me ₹2000/quintal extra!",
            "benefit": "45% water savings"
          },
          "t3": {
            "name": "Vikram Patel",
            "loc": "Gujarat, India",
            "text": "Voice assistant in Hindi is amazing! 'Tamatar mein rog hai' - instantly got disease type, treatment cost. Offline mode works perfectly in my village.",
            "benefit": "Hindi voice support"
          }
        },
        "tech": {
          "title": "Built on Cutting-Edge Technology",
          "subtitle": "Enterprise-grade tech stack powering your farm",
          "t1": "Yield prediction",
          "t2": "Time series analysis",
          "t3": "Advanced regression",
          "t4": "Digital twin mapping",
          "t5": "Disease detection",
          "t6": "Supply traceability",
          "t7": "Hindi commands",
          "t8": "Village accessibility",
          "t9": "Alert fallback",
          "t10": "Instant notifications",
          "t11": "Data security"
        },
        "learnMore": "Learn more",
        "footer": {
          "tagline": "Empowering farmers with AI and GIS technology for sustainable, profitable agriculture.",
          "col1": "Features",
          "col2": "Platform",
          "col3": "Support",
          "iot": "IoT Monitoring",
          "weather": "Weather Alerts",
          "community": "Community",
          "help": "Help Center",
          "docs": "Documentation",
          "api": "API Guide",
          "contact": "Contact",
          "copyright": "© 2025 AgriSphere AI. All rights reserved."
        },
        "heroBadge": "AI-Powered Smart Agriculture"
      },
      "disease": {
        "title": "AI শস্য রোগ নির্ণয়",
        "backHome": "হোমে ফিরে যান",
        "desc": "আধুনিক এআই সিস্টেমের সাহায্যে পাতা, কান্ড, ফল এবং মাটির ছবি থেকে রোগ, পোকামাকড় এবং পুষ্টির ঘাটতি সঠিকভাবে নির্ণয় করুন।",
        "startBtn": "নির্ণয় শুরু করুন",
        "uploadBtn": "ছবি আপলোড করুন",
        "saveBtn": "সংরক্ষিত রিপোর্ট",
        "hideBtn": "লুকান",
        "reportsTitle": "অফলাইন রিপোর্ট",
        "noReports": "কোন রিপোর্ট নেই।",
        "capTitle": "নানাবিধ রোগ নির্ণয়ের ক্ষমতা",
        "pestTitle": "কীটপতঙ্গ নির্ণয় ও চিকিৎসা",
        "aiTitle": "উন্নত এআই সনাক্তকরণ",
        "howTitle": "কিভাবে কাজ করে",
        "accuracy": "সঠিকতা",
        "types": {
          "leaf": {
            "title": "পাতার রোগ",
            "desc": "ছত্রাক এবং ভাইরাস সংক্রমণ",
            "d1": "ব্লাইট",
            "d2": "মরিচা",
            "d3": "ভাইরাস",
            "d4": "ব্যাকটেরিয়া"
          },
          "stem": {
            "title": "কান্ডের বিশ্লেষণ",
            "desc": "কান্ডের ক্ষতি নির্ণয়",
            "d1": "পোকা",
            "d2": "পচন",
            "d3": "ক্যান্সার",
            "d4": "শুকনো"
          },
          "fruit": {
            "title": "ফল পরিদর্শন",
            "desc": "ফলের রোগ এবং কীটের ক্ষতি",
            "d1": "পচন",
            "d2": "কীটের ক্ষতি",
            "d3": "ফাটা",
            "d4": "রঙ পরিবর্তন"
          },
          "soil": {
            "title": "মাটির স্বাস্থ্য",
            "desc": "মাটির পুষ্টির ঘাটতি",
            "d1": "পুষ্টির ঘাটতি",
            "d2": "pH ভারসাম্যহীনতা",
            "d3": "লবণাক্ততা",
            "d4": "চাপ"
          }
        },
        "pests": {
          "p1": {
            "name": "Aphids",
            "damage": "Sap sucking",
            "treatment": "Neem oil spray"
          },
          "p2": {
            "name": "Thrips",
            "damage": "Leaf damage",
            "treatment": "Blue sticky traps"
          },
          "p3": {
            "name": "Whitefly",
            "damage": "Virus transmission",
            "treatment": "Yellow traps"
          },
          "p4": {
            "name": "Caterpillars",
            "damage": "Leaf eating",
            "treatment": "Bt spray"
          }
        },
        "how": {
          "s1": {
            "title": "ছবি তুলুন",
            "desc": "উদ্ভিদের ছবি নিন"
          },
          "s2": {
            "title": "AI বিশ্লেষণ",
            "desc": "তথ্য প্রক্রিয়া করে"
          },
          "s3": {
            "title": "শ্রেণীবিভাগ",
            "desc": "ফলাফল প্রদর্শন"
          },
          "s4": {
            "title": "চিকিৎসা পরিকল্পনা",
            "desc": "সুপারিশ প্রদান"
          }
        },
        "stats": {
          "disease": "রোগের প্রাদুর্ভাব",
          "diseaseDesc": "আবহাওয়া ভিত্তিক",
          "pest": "কীটপতঙ্গ",
          "pests": "কীটপতঙ্গের চাপ",
          "pestDesc": "৭ দিনের পূর্বভাস",
          "soil": "মাটির স্বাস্থ্য",
          "soilDesc": "সাম্প্রতিক চেক"
        },
        "score": "স্কোর",
        "issues": "সমস্যাগুলি",
        "diseasesCount": "নজরদারি করা রোগ",
        "pestsCount": "সক্রিয় কীটের হুমকি",
        "viewSummary": "সারাংশ দেখুন"
      },
      "marketplace": {
        "title": "স্মার্ট মার্কেটপ্লেস এবং পরামর্শ",
        "subtitle": "AI থেকে শস্য নিয়ে পরামর্শ নিন এবং সরাসরি ক্রেতা/বিক্রেতার সাথে যোগাযোগ করুন।",
        "tabs": {
          "advisory": "পরামর্শ",
          "listings": "তালিকা",
          "trends": "প্রবণতা",
          "demands": "ক্রেতার চাহিদা"
        },
        "demands": {
          "title": "লাইভ ক্রেতার চাহিদা",
          "noDemands": "কোনো ক্রেতার চাহিদা নেই।",
          "verified": "ভেরিফাইড ক্রেতা",
          "targetPrice": "টার্গেট মূল্য",
          "contactBtn": "যোগাযোগ করুন"
        },
        "advisory": {
          "title": "AgriSphere স্মার্ট পরামর্শ",
          "desc": "ব্যক্তিগতকৃত AI পরামর্শ।",
          "selectCrop": "ফসল নির্বাচন করুন",
          "chooseCrop": "নির্বাচন করুন...",
          "state": "রাজ্য",
          "selectState": "રાજ্য নির্বাচন করুন",
          "sowingDate": "বপন তারিখ",
          "pickDate": "তারিখ নির্বাচন করুন",
          "fieldSize": "আকার (একর)",
          "analyzeBtn": "রিপোর্ট তৈরি করুন",
          "analyzing": "তৈরি হচ্ছে...",
          "missingInfo": "উপস্থিত নয়",
          "selectPrompt": "দয়া করে ফসল, রাজ্য এবং বপনের তারিখ টিপুন।",
          "readyTitle": "কৃষি পরামর্শ রিপোর্ট:"
        },
        "trends": {
          "title": "AI বাজার বিশ্লেষণ",
          "livePrices": "বাজার মূল্য",
          "forecast": "মূল্য পূর্বাভাস",
          "fetched": "দর পাওয়া গেছে।",
          "fetchError": "সমস্যা হয়েছে।",
          "detailsMissing": "অবস্থান অনুপস্থিত",
          "enterStateDistrict": "রাজ্য এবং জেলা লিখুন।",
          "findMandiRates": "দামের খোঁজ",
          "selectState": "রাজ্য নির্বাচন করুন",
          "enterDistrict": "জেলার নাম লিখুন",
          "typeDistrict": "টাইপ করুন...",
          "category": "বিভাগ",
          "checkRates": "বাজার দর চেক করুন",
          "forecastTitle": "৭ দিনের পূর্বাভাস",
          "noRates": "কোন তথ্য নেই।",
          "low": "নিম্ন",
          "medium": "মাঝারি",
          "high": "উচ্চ"
        },
        "listings": {
          "filters": "ফিল্টার",
          "search": "খুঁজুন...",
          "contactFarmer": "কৃষকের সাথে যোগাযোগ",
          "noListings": "কোন তালিকা নেই।",
          "form": {
            "postTitle": "ফসল বিক্রি করুন",
            "postSubtitle": "তালিকা পোস্ট করুন।",
            "name": "আপনার নাম",
            "contact": "ফোন",
            "crop": "ফসল",
            "qty": "পরিমাণ",
            "price": "দাম",
            "selectState": "আপনার রাজ্য বেছে নিন",
            "submit": "পোস্ট করুন"
          },
          "fillAllFields": "বিবরণ পূরণ করুন।",
          "listingPosted": "সফলভাবে পোস্ট করা হয়েছে!"
        },
        "alerts": {
          "seasonality": "Seasonality Warning"
        },
        "states": {
          "bihar": "Bihar",
          "uttarPradesh": "Uttar Pradesh",
          "punjab": "Punjab",
          "haryana": "Haryana",
          "madhyaPradesh": "Madhya Pradesh"
        },
        "langEn": "English",
        "langHi": "Hindi",
        "langBn": "Bengali",
        "langAs": "Assamese",
        "langKn": "Kannada"
      },
      "advisoryHub": {
        "title": "AgriSphere Advisory Hub",
        "subtitle": "Real-time schemes, news, and expert videos for smart farming.",
        "tabs": {
          "schemes": "Schemes & Subsidies",
          "calculator": "Fertilizer Calculator",
          "news": "Farming News",
          "videos": "Video Tutorials"
        },
        "refresh": "Refresh Content",
        "eligibility": {
          "title": "Check Eligibility",
          "desc": "Update your profile to see relevant government schemes.",
          "state": "State",
          "landSize": "Land Size (Acres)",
          "farmerType": "Farmer Type",
          "profileUpdated": "Profile updated! Checking eligibility..."
        },
        "offline": {
          "loadedCache": "Offline: Loaded schemes from cache."
        },
        "success": {
          "addedSchemes": "Added {{count}} new schemes."
        },
        "info": {
          "noNewSchemes": "AI couldn't find any new unique schemes right now."
        },
        "error": {
          "loadSchemes": "Failed to load more schemes."
        },
        "loading": {
          "askingAi": "Asking AI for more schemes...",
          "findingSchemes": "Finding New Schemes...",
          "loadingNews": "Loading News...",
          "loadingVideos": "Loading Videos...",
          "loadingCalc": "Loading Calculator..."
        },
        "buttons": {
          "loadMore": "Load More",
          "findAi": "Find More from AI",
          "refresh": "Refresh Content",
          "calculate": "Calculate Nutrients"
        },
        "noData": {
          "noSchemes": "No eligible schemes found for this profile in {{state}}.",
          "allIndiaBtn": "View All India Schemes",
          "noNews": "No news available at the moment.",
          "noVideos": "No videos available at the moment."
        },
        "toasts": {
          "videosRefreshed": "Videos refreshed!",
          "newsRefreshed": "News refreshed!",
          "schemesRefreshed": "Schemes refreshed!"
        },
        "configNeeded": {
          "title": "Configuration Needed",
          "desc": "Please add {{key}} to your .env file to see {{feature}}."
        }
      },
      "yield": {
        "title": "অপ্টিমাইজড ফলন পূর্বাভাস",
        "desc": "উন্নত এআই ব্যবহার করে ফসলের ফলনের পূর্বাভাস পান।",
        "supportedCrops": "সমর্থিত ফসল",
        "inputTitle": "ইনপুট প্যারামিটার",
        "selectCrop": "ফসল নির্বাচন করুন",
        "area": "এলাকা (একর)",
        "areaNote": "1 Acre ≈ 0.4 Hectares",
        "rainfall": "বৃষ্টিপাত (মিমি)",
        "temp": "Avg Temp (°C)",
        "humidity": "Humidity (%)",
        "fertilizer": "Fertilizer (kg)",
        "pesticide": "Pesticide (kg)",
        "soilPh": "Soil pH",
        "soilN": "Soil N (kg/ha)",
        "soilP": "Soil P (kg/ha)",
        "soilK": "Soil K (kg/ha)",
        "predictBtn": "পূর্বাভাস তৈরি করুন",
        "analyzing": "বিশ্লেষণ করা হচ্ছে...",
        "resultsTitle": "ফলাফল",
        "totalProduction": "মোট উৎপাদন",
        "revenue": "আয়",
        "yieldEfficiency": "ফলন দক্ষতা",
        "models": {
          "rf": "Random Forest",
          "lstm": "LSTM Networks",
          "gb": "Gradient Boosting",
          "xgb": "XGBoost"
        },
        "potentialRevenue": "সম্ভাব্য আয়",
        "perHectare": "প্রতি হেক্টর",
        "approx": "আনুমানিক",
        "confidence": "নির্ভুলতা হার",
        "modelUsed": "ব্যবহৃত মডেল",
        "trainingData": "ডেটা",
        "accuracyNote": "Note: Rice predictions are now highly accurate (~99.7%) thanks to the integration of Soil Health Card data (pH, N, P, K).",
        "kharifSeason": "Kharif Season",
        "tonsPerHa": "t/ha",
        "confidenceRange": "Confidence Range",
        "fiveYearAvg": "5-Year Average",
        "trend": "Historical Trend",
        "regionalPerformance": "Regional Performance",
        "readyDesc": "প্যারামিটার দিন এবং বাটনে ক্লিক করুন।",
        "predictionSuccess": "ফলাফল সফল",
        "estimatedProduction": "Estimated Production",
        "tonsUnit": "টন",
        "summary": {
          "report": "{{crop}}-এর জন্য আপনার আনুমানিক ফলন হল {{total}} টন। এই দক্ষতা বজায় রাখতে আবহাওয়ার পূর্বাভাস অনুযায়ী সার এবং সেচ নিশ্চিত করুন।"
        },
        "avgTemp": "গড় তাপমাত্রা (°C)"
      },
      "pest": {
        "title": "কীটপতঙ্গের আক্রমণের পূর্বাভাস",
        "inputTitle": "মাঠের অবস্থা",
        "inputDesc": "আবহাওয়ার বিবরণ দিন",
        "selectCrop": "ফসল নির্বাচন করুন",
        "temp": "তাপমাত্রা",
        "humidity": "আর্দ্রতা",
        "rainfall": "বৃষ্টিপাত",
        "predictBtn": "ঝুঁকি অনুমান করুন",
        "analyzing": "বিশ্লেষণ করা হচ্ছে...",
        "resultsTitle": "ফলাফল",
        "probability": "আক্রমণের সম্ভাবনা",
        "riskLevel": "{{level}} ঝুঁকি",
        "primaryThreat": "প্রাথমিক হুমকি",
        "recommendation": "সুপারিশ",
        "forecast7Days": "৭ দিনের পূর্বাভাস",
        "readyDesc": "স্লাইডার গুছিয়ে ক্লিক করুন",
        "advisorTitle": "AI Agro-Advisor",
        "advisorDesc": "Hear this analysis in your language",
        "stopBtn": "Stop",
        "summary": {
          "prediction": "পূর্বাভাস: {{level}} ঝুঁকি ({{score}}%) সহ {{name}}।",
          "recommendation": "সুপারিশ: {{recommendation}}",
          "weather": "আবহাওয়া: {{temp}}°C, {{humidity}}% আর্দ্রতা, {{rainfall}}mm বৃষ্টিপাত।",
          "crop": "ফসল: {{crop}}।"
        }
      },
      "fertilizer": {
        "title": "স্মার্ট সার এবং সেচ",
        "subtitle": "উন্নত ফসলের পুষ্টির জন্য আদর্শ সার ব্যবস্থা",
        "inputTitle": "প্যারামিটার",
        "cropType": "ফসলের ধরন",
        "selectCrop": "নির্বাচন করুন",
        "nitrogen": "নাইট্রোজেন (N)",
        "phosphorus": "ফসফরাস (P)",
        "potassium": "পটাশিয়াম (K)",
        "moisture": "মাটির আর্দ্রতা (%)",
        "moistureDry": "শুষ্ক",
        "moistureWet": "ভিজে",
        "rainfall": "বৃষ্টিপাতের পূর্বাভাস (মিমি)",
        "soilPh": "মাটির পিএইচ (pH)",
        "growthStage": "বৃদ্ধির স্তর",
        "selectStage": "স্তর নির্বাচন করুন",
        "stages": {
          "sowing": "বপন",
          "vegetative": "উদ্ভিজ্জ",
          "flowering": "ফুল ফোটার সময়",
          "harvest": "ফসল কাটার সময়"
        },
        "getBtn": "সুপারিশ পান",
        "analyzing": "বিশ্লেষণ চলছে...",
        "results": {
          "noDataTitle": "কোনো সুপারিশ নেই",
          "noDataDesc": "উপরে তথ্য দিন।",
          "planTitle": "সার পরিকল্পনা",
          "adjustments": "স্মার্ট অ্যাডজাস্টমেন্ট",
          "irrigationTitle": "সেচের সময়সূচী",
          "phAlert": "pH সতর্কতা",
          "waterAmount": "জলের পরিমাণ",
          "applyWater": "{{amount}} জল দিন।",
          "rainNote": "পরবর্তী ৩ দিন বৃষ্টির সম্ভাবনা।",
          "moistureNote": "আর্দ্রতা ঠিক রাখুন।",
          "temperature": "তাপমাত্রা",
          "windSpeed": "বাতাসের গতি",
          "normal": "স্বাভাবিক"
        }
      },
      "community": {
        "title": "Kisan Sarathi Community",
        "subtitle": "Connect with fellow farmers, share knowledge, and grow together.",
        "searchPlaceholder": "Search discussions, questions, or experts...",
        "askBtn": "Ask a Question",
        "tabs": {
          "feed": "Community Feed",
          "experts": "Expert Advice",
          "myPosts": "My Activity"
        },
        "stats": {
          "members": "Members",
          "discussions": "Discussions",
          "experts": "Experts Online"
        },
        "chatWith": "Chat with",
        "globalChat": "Global Chat",
        "onlineFarmers": "Online Farmers",
        "you": "You",
        "deleteMessageConfirm": "Are you sure you want to delete this message?",
        "replyTitle": "Write a reply...",
        "replyBtn": "Reply",
        "noReplies": "No replies yet. Be the first!",
        "translatingToast": "AI is translating this post...",
        "aiTranslating": "AI is translating this post.",
        "translatePost": "Translate Post",
        "deleteMessage": "Delete Message",
        "errorPost": "Failed to post question",
        "errorSend": "Failed to send message"
      },
      "common": {
        "today": "Today",
        "yesterday": "Yesterday",
        "messages": "New Messages",
        "clickToChat": "Click to chat",
        "active": "active",
        "loading": "Loading...",
        "localizing": "Localizing...",
        "localized": "Analysis localized to {{lang}} in {{dialect}} dialect.",
        "dialectTransform": "Transforming advice into {{dialect}} dialect...",
        "listening": "Listening...",
        "voiceError": "Voice input failed. Please try again.",
        "error": "Error",
        "success": "Success",
        "generatedOn": "Generated on",
        "crops": {
          "rice": "Rice",
          "wheat": "Wheat",
          "maize": "Maize",
          "sugarcane": "Sugarcane",
          "potato": "Potato",
          "tomato": "Tomato",
          "ginger": "Ginger"
        },
        "playEnglish": "Play English (Full)",
        "playHindi": "Play Hindi (हिंदी)",
        "soldBy": "Sold by",
        "other": "Other",
        "farmerTypes": {
          "small": "Small Farmer",
          "marginal": "Marginal Farmer",
          "large": "Large Farmer",
          "landless": "Landless Laborer"
        },
        "voiceUnsupported": "Voice search not supported in this browser.",
        "offline": "Offline",
        "tryAgain": "Try Again",
        "ready": "Ready",
        "in": "in",
        "unit": {
          "acres": "একর",
          "hectares": "হেক্টর",
          "tons": "টন",
          "quintals": "Quintals",
          "kilograms": "kg"
        },
        "all": "All States"
      },
      "digitalTwin": {
        "title": "GIS Smart Farm Digital Twin",
        "subtitle": "Create a complete digital replica of your farm with advanced GIS mapping, multi-layer visualization, and real-time monitoring for precision agriculture.",
        "featuring": "✨ Featuring: Farm Boundaries • Soil Zones • Irrigation Planning • Pest Risk Maps • NDVI Crop Health • Weather Analysis",
        "setupTitle": "Farm Setup",
        "setupDesc": "Enter your farm details or coordinates to generate your digital twin.",
        "farmName": "Farm Name",
        "ownerName": "Owner Name",
        "state": "State",
        "district": "District",
        "town": "Town/Village",
        "coordinates": "Coordinates",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "useCurrent": "Use Current Location",
        "size": "Farm Size (Acres)",
        "generateBtn": "Generate Digital Twin",
        "generating": "Generating Digital Twin...",
        "quickDemo": "Quick Demo",
        "drawMap": "Draw on Map",
        "capabilities": "Digital Twin Capabilities",
        "visualization": "Multi-Layer GIS Visualization",
        "interactiveMap": "Interactive GIS Map: {{name}}",
        "liveData": "Live Farm Intelligence",
        "explainBtn": "Explain Farm Status",
        "stopBtn": "Stop",
        "accuracy": "Accuracy",
        "update": "Update Digital Twin",
        "hectares": "Hectares",
        "area": "Farm Area",
        "features": {
          "soil": {
            "title": "Soil Zone Classification",
            "desc": "Multi-layer soil analysis with texture, pH, and nutrient mapping",
            "f1": "Soil Texture",
            "f2": "pH Zones",
            "f3": "Nutrient Maps",
            "f4": "Fertility Index"
          },
          "irrigation": {
            "title": "Irrigation Zone Planning",
            "desc": "Smart irrigation zone design based on crop needs and soil conditions",
            "f1": "Water Zones",
            "f2": "Drip Planning",
            "f3": "Sprinkler Layout",
            "f4": "Efficiency Maps"
          },
          "pest": {
            "title": "Pest-Prone Area Detection",
            "desc": "Historical pest data analysis to identify high-risk zones",
            "f1": "Risk Zones",
            "f2": "Pest History",
            "f3": "Prevention Areas",
            "f4": "Treatment Maps"
          },
          "growth": {
            "title": "Crop Growth Staging",
            "desc": "Real-time crop growth stage monitoring across different field zones",
            "f1": "Growth Stages",
            "f2": "Maturity Maps",
            "f3": "Harvest Zones",
            "f4": "Yield Prediction"
          },
          "weather": {
            "title": "Weather Microclimate",
            "desc": "Field-specific microclimate analysis and weather pattern mapping",
            "f1": "Temperature Zones",
            "f2": "Humidity Maps",
            "f3": "Wind Patterns",
            "f4": "Frost Risk"
          }
        },
        "layers": {
          "satellite": "Satellite Imagery",
          "soilHealth": "Soil Health",
          "cropHealth": "Crop Health",
          "weather": "Weather Data",
          "pests": "Pest Alerts",
          "base": "Base Layer",
          "analysis": "Analysis Layer",
          "monitoring": "Monitoring Layer",
          "environmental": "Environmental Layer",
          "alert": "Alert Layer",
          "daily": "Daily",
          "weekly": "Weekly",
          "realtime": "Real-time",
          "hourly": "Hourly",
          "asneeded": "As needed"
        },
        "drawDesc": "Pinpoint your location and trace the exact shape of your land.",
        "exploreNote": "Explore {{owner}}'s farm with multi-layer GIS visualization. Click on zones for detailed information.",
        "initializing": {
          "status": "Initializing Digital Twin Engine...",
          "mapping": "Mapping boundaries for",
          "soil": "Analyzing soil sensor data layers...",
          "irrigation": "Designing irrigation grid for",
          "pests": "Calculating historical pest risk zones..."
        },
        "insights": {
          "mappedZones": "Mapped Soil Zones",
          "activeZones": "Active Irrigation Zones",
          "growthStages": "Avg Growth Stage",
          "health": "Health Score"
        },
        "summary": {
          "prefix": "Farm Status Report for {{area}} hectares.",
          "zones": "We have identified {{soil}} distinct soil zones and {{irrigation}} irrigation zones.",
          "health": "Overall crop health is {{health}}%.",
          "pestWarning": "Warning: High pest risk detected. Immediate action recommended.",
          "pestLow": "Pest risk is currently low."
        }
      },
      "iot": {
        "title": "IoT Smart Farm Monitoring",
        "subtitle": "Real-time soil health and environment monitoring using low-cost sensor nodes.",
        "liveMonitoring": "Live Monitoring",
        "viewAnalytics": "View Analytics",
        "liveDataHeader": "Live Sensor Data",
        "moisture": "Moisture",
        "ph": "pH Level",
        "temp": "Temp",
        "nitrogen": "Nitrogen",
        "phosphorus": "Phosphorus",
        "potassium": "Potassium",
        "alertsTitle": "Active Alerts",
        "recsTitle": "Irrigation Recommendations",
        "alertsCount": "Active Alerts ({{count}})",
        "recsCount": "Irrigation Recommendations ({{count}})",
        "noAlerts": "No active alerts. Your field conditions are optimal.",
        "noRecs": "No irrigation recommendations at this time.",
        "startIrrigation": "Start Irrigation",
        "irrigationFor": "for {{duration}} mins",
        "features": {
          "title": "System Features",
          "f1": {
            "title": "Real-time Monitoring",
            "desc": "24/7 continuous soil parameter monitoring",
            "items": [
              "Soil Moisture",
              "pH Levels",
              "Temperature",
              "Conductivity"
            ]
          },
          "f2": {
            "title": "Smart Alerts",
            "desc": "AI-powered alert system for critical conditions",
            "items": [
              "Threshold Alerts",
              "Predictive Warnings",
              "Mobile Notifications",
              "Email Reports"
            ]
          },
          "f3": {
            "title": "Auto Irrigation",
            "desc": "Automated irrigation based on soil conditions",
            "items": [
              "Smart Scheduling",
              "Zone Control",
              "Water Optimization",
              "Remote Control"
            ]
          },
          "f4": {
            "title": "Data Analytics",
            "desc": "Historical data analysis and trend monitoring",
            "items": [
              "Trend Analysis",
              "Performance Reports",
              "Yield Correlation",
              "ROI Tracking"
            ]
          }
        },
        "benefits": {
          "title": "Smart Farming Benefits",
          "b1": {
            "title": "40% Water Savings",
            "desc": "Precision irrigation control"
          },
          "b2": {
            "title": "25% Yield Increase",
            "desc": "Optimal growing conditions"
          },
          "b3": {
            "title": "60% Labor Reduction",
            "desc": "Automated monitoring"
          },
          "b4": {
            "title": "Real-time Insights",
            "desc": "Instant decision making"
          }
        }
      },
      "weather": {
        "title": "Smart Weather Risks & Alerts",
        "subtitle": "Advanced GIS-based weather risk detection for your specific farm location.",
        "locationTitle": "Risk Scanning Control",
        "locationDesc": "Select your location to check for local weather hazards and receive automated alerts.",
        "selectState": "Select State",
        "selectDistrict": "Select District",
        "phoneLabel": "Phone Number (for SMS Alerts)",
        "phoneVerify": "Verify",
        "phoneCalling": "Calling...",
        "scanBtn": "Check Risks",
        "scanning": "Scanning GIS Data...",
        "systemSafe": "System Safe",
        "alert": "Alert",
        "riskDetected": "Risk Detected",
        "standby": "System Standby",
        "placeholder": "Select your location and click 'Check Risks' to start scanning your area for hazards.",
        "temp": "Temperature",
        "humidity": "Humidity",
        "toasts": {
          "verifyTitle": "📞 Incoming Call from Twilio",
          "verifyDesc": "Answer the call and enter code: {{code}}",
          "verifyFailed": "Verification Failed",
          "riskTitle": "⚠️ Risk Detected",
          "smsSent": "🚨 SMS Alert sent to {{phone}}",
          "safeTitle": "✅ Conditions Safe",
          "safeDesc": "No severe weather threats detected."
        }
      },
      "voiceAssistant": {
        "hero": {
          "title": "কৃষকদের জন্য ভয়েস সহকারী",
          "desc": "আপনার আঞ্চলিক ভাষায় কথা বলুন। এআই এর মাধ্যমে তাত্ক্ষণিক কৃষি পরামর্শ পান।",
          "startBtn": "কথা বলা শুরু করুন",
          "chooseLangBtn": "ভাষা নির্বাচন করুন"
        },
        "features": {
          "sectionTitle": "Voice Assistant Features",
          "f1": {
            "title": "Hindi Voice Recognition",
            "desc": "Speak naturally in Hindi and get instant responses",
            "example": "Gehun mein rog a gaya hai, kya karein?",
            "response": "Wheat disease detected. Apply fungicide spray."
          },
          "f2": {
            "title": "Local Language Support",
            "desc": "Support for regional languages across India"
          },
          "f3": {
            "title": "Audio Responses",
            "desc": "Get detailed audio responses in your preferred language",
            "item1": "Clear pronunciation",
            "item2": "Slow/Fast speed",
            "item3": "Repeat option",
            "item4": "Save audio"
          },
          "f4": {
            "title": "Offline Voice Commands",
            "desc": "Basic voice commands work even without internet",
            "item1": "Weather check",
            "item2": "Crop calendar",
            "item3": "Basic diagnosis",
            "item4": "Emergency help"
          }
        },
        "examples": {
          "sectionTitle": "Real Conversation Examples",
          "solutionPrefix": "Solution",
          "e1": {
            "farmer": "Tomato mein patte peelay ho rahe hain",
            "farmerTrans": "Tomato leaves are turning yellow",
            "ai": "यह नाइट्रोजन की कमी हो सकती है। यूरिया का छिड़काव करें।",
            "aiTrans": "This could be nitrogen deficiency. Apply urea spray.",
            "solution": "Apply 2kg urea per acre with water spray"
          },
          "e2": {
            "farmer": "Kya aaj pani dena chahiye?",
            "farmerTrans": "Should I water today?",
            "ai": "मिट्टी में नमी 40% है। 2 दिन बाद पानी दें।",
            "aiTrans": "Soil moisture is 40%. Water after 2 days.",
            "solution": "Wait 2 days, then apply 25mm irrigation"
          },
          "e3": {
            "farmer": "Fasal kab kaatni chahiye?",
            "farmerTrans": "When should I harvest the crop?",
            "ai": "आपकी गेहूं 15 दिन में तैयार होगी। दाने सुनहरे होने का इंतज़ार करें।",
            "aiTrans": "Your wheat will be ready in 15 days. Wait for golden grains.",
            "solution": "Harvest when moisture content is 12-14%"
          }
        },
        "demo": {
          "sectionTitle": "Try Voice Assistant Live",
          "selectLang": "Select Language / भाषा चुनें",
          "listening": "सुन रहा हूं... / Listening...",
          "pressToSpeak": "बोलने के लिए दबाएं / Press to Speak",
          "processing": "प्रोसेसिंग... / Processing...",
          "youSaid": "आपने कहा / You said:",
          "aiResponse": "🤖 AgriSphere AI का जवाब / Response:",
          "exampleQuestionsTitle": "उदाहरण प्रश्न / Example Questions:",
          "noteTitle": "Note",
          "noteDesc": "Voice recognition requires a modern browser with microphone permissions. Works best in Chrome/Edge.",
          "noteHindiDesc": "नोट: आवाज़ पहचान के लिए आधुनिक ब्राउज़र और माइक्रोफ़ोन की अनुमति चाहिए।"
        },
        "langs": {
          "sectionTitle": "Supported Languages",
          "hindi": "Hindi",
          "english": "English (India)",
          "fullSupport": "Full Support"
        },
        "howItWorks": {
          "sectionTitle": "How Voice Assistant Works",
          "s1": {
            "title": "Speak Question",
            "desc": "Ask in Hindi or local language"
          },
          "s2": {
            "title": "AI Processing",
            "desc": "Voice recognition & understanding"
          },
          "s3": {
            "title": "Generate Response",
            "desc": "AI creates personalized answer"
          },
          "s4": {
            "title": "Audio Reply",
            "desc": "Hear response in your language"
          }
        },
        "benefits": {
          "sectionTitle": "Voice Assistant Benefits",
          "b1": {
            "title": "Easy to Use",
            "desc": "No typing required, just speak"
          },
          "b2": {
            "title": "Rural Friendly",
            "desc": "Works for illiterate farmers"
          },
          "b3": {
            "title": "Instant Help",
            "desc": "Get answers in seconds"
          },
          "b4": {
            "title": "Local Language",
            "desc": "Understand & respond in Hindi"
          }
        },
        "digitalTwin": {
          "title": "Farm Digital Twin",
          "subtitle": "Visualize your farm with GIS, IoT, and AI-driven spatial analysis.",
          "initializing": {
            "status": "Creating your digital farm twin...",
            "mapping": "Mapping field boundaries for",
            "soil": "Analyzing soil zones based on location",
            "irrigation": "Planning irrigation systems for",
            "pests": "Detecting pest-prone areas"
          },
          "capabilities": "Digital Twin Capabilities",
          "features": {
            "gis": {
              "title": "GIS Plot Mapping",
              "desc": "Satellite-based boundary mapping with sub-meter accuracy",
              "f1": "Boundary Detection",
              "f2": "Area Calculation",
              "f3": "Elevation Mapping",
              "f4": "Geo-fencing"
            },
            "soil": {
              "title": "Soil Health Mapping",
              "desc": "Spatial distribution of nutrients and soil types",
              "f1": "NPK Gradients",
              "f2": "pH Variation",
              "f3": "Texture Analysis",
              "f4": "Carbon Seq."
            },
            "irrigation": {
              "title": "Smart Irrigation",
              "desc": "VRT-based irrigation planning and moisture tracking",
              "f1": "Hydraulic Zones",
              "f2": "Moisture Flux",
              "f3": "Drip Planning",
              "f4": "Runoff Predict."
            }
          },
          "insights": {
            "pestRisk": "Pest Risk Areas",
            "growthStages": "Crop Growth Stages",
            "health": "Health",
            "risk": "risk",
            "mappedZones": "Mapped zones",
            "activeZones": "Active zones",
            "avgHealth": "Average %"
          },
          "areaNote": "acres"
        },
        "farmerDashboard": {
          "title": "Smart Farmer Dashboard",
          "subtitle": "Your centralized hub for AI operations and farm management.",
          "metrics": {
            "models": "AI Models",
            "activeModels": "active models",
            "area": "Mapped Area",
            "hectares": "hectares",
            "detections": "Detections",
            "types": "distinct types",
            "accuracy": "Avg. Accuracy"
          },
          "tabs": {
            "overview": "Overview",
            "disease": "Disease AI",
            "twin": "Digital Twin",
            "yield": "Yield Predict",
            "pest": "Pest Forecast",
            "marketplace": "Marketplace"
          }
        }
      },
      "gov": {
        "title": "Ministry of Agriculture Dashboard",
        "subtitle": "National Command & Control Centre",
        "operational": "System Operational",
        "genReport": "Generate Report",
        "stats": {
          "regFarmers": "Registered Farmers",
          "activeAlerts": "Active Alerts",
          "cropLossCases": "Crop Loss Cases",
          "estDisbursement": "Est. Disbursement"
        },
        "tabs": {
          "overview": "Overview & Analytics",
          "cropLoss": "Crop Loss Compensation",
          "market": "Market Intelligence"
        },
        "charts": {
          "diseaseTrend": "Disease Detection Trend",
          "communityIssues": "Community Issues",
          "prices": "State-wise Avg Prices",
          "listings": "Live Listings Overview"
        },
        "cases": {
          "title": "Compensation Case Management",
          "search": "Search case ID...",
          "noCases": "No active cases found.",
          "eligible": "Eligible",
          "reviewRequired": "Review Required",
          "verify": "Verify",
          "reject": "Reject",
          "approve": "Approve",
          "status": {
            "approved": "Approved",
            "rejected": "Rejected",
            "underVerification": "Under Verification",
            "pending": "Approval Pending"
          }
        },
        "report": {
          "generated": "Report Generated",
          "downloaded": "The report has been downloaded to your device.",
          "totalVolume": "Total Volume Traded"
        },
        "caseActions": {
          "approved": "Case Approved",
          "rejected": "Case Rejected",
          "verified": "Verification Requested",
          "updated": "Case {{id}} has been updated.",
          "errorUpdate": "Failed to update case status",
          "errorFetch": "Failed to fetch government dashboard data"
        },
        "labels": {
          "replies": "Replies",
          "loss": "Loss",
          "cause": "Cause",
          "damage": "Damage",
          "estLoss": "Est. Loss",
          "scheme": "Scheme"
        }
      },
      "buyer": {
        "title": "Verified Buyer Dashboard",
        "welcome": "Welcome, {{name}}",
        "subtitle": "Sourcing fresh produce directly from farmers.",
        "panIndia": "Pan India",
        "postDemand": "Post Demand",
        "tabs": {
          "listings": "Listing Feed",
          "intelligence": "Market Intelligence",
          "deals": "My Deals"
        },
        "filters": {
          "search": "Search wheat, rice, Punjab...",
          "allCrops": "All Crops",
          "allStates": "All States"
        },
        "card": {
          "quantity": "Quantity",
          "price": "Price",
          "farmer": "Farmer",
          "harvest": "Harvest",
          "callFarmer": "Call Farmer",
          "grade": "Grade"
        },
        "intelligence": {
          "title": "Market Demand Analysis",
          "scope": "Market Scope",
          "config": "Configure AI analysis target",
          "forecast": "Trend Forecast",
          "demand": "Demand Level",
          "vsMsp": "Vs MSP",
          "avgPrice": "Avg. Market Price",
          "genBtn": "Generate AI Insights",
          "analyzing": "Analyzing...",
          "strategicAnalysis": "AI Strategic Analysis",
          "mspComparison": "MSP vs Market Price",
          "brief": "Intelligence Brief"
        },
        "contact": {
          "title": "Contact Farmer",
          "desc": "Connect with {{name}} directly.",
          "phone": "Phone Number",
          "whatsapp": "WhatsApp",
          "call": "Call Now",
          "close": "Close"
        },
        "demand": {
          "title": "Post Buying Requirement",
          "desc": "Farmers matching these criteria will be alerted.",
          "crop": "Target Crop",
          "quantity": "Quantity (Quintals)",
          "price": "Target Price/Qtl",
          "location": "Preferred Location (Optional)",
          "postBtn": "Post Demand",
          "cancel": "Cancel"
        },
        "contactFarmer": "Contact Farmer",
        "saveListing": "Save for later",
        "errorInsights": "Failed to fetch market insights",
        "loginRequired": "Login Required",
        "loginRequiredDesc": "Please login as a buyer to contact farmers.",
        "fillFields": "Please fill in required fields.",
        "errorPostDemand": "Failed to post demand.",
        "recordedNote": "Interactions are recorded in your 'My Deals' tab.",
        "trader": "Trader",
        "loading": "Loading live marketplace...",
        "noListings": "No listings found matching your criteria.",
        "gradeA": "Grade A",
        "ready": "Ready",
        "targetCrop": "Target Crop",
        "targetState": "Target State",
        "unknown": "Unknown",
        "noDeals": "No active deals yet.",
        "dealLabel": "{{crop}} Deal",
        "withLabel": "with {{name}}",
        "toast": {
          "saved": "Listing saved for later",
          "unsaved": "Listing removed from saved"
        }
      },
      "cropLoss": {
        "title": "Crop Loss Compensation Claim",
        "subtitle": "Government of India - Ministry of Agriculture",
        "sections": {
          "farmer": "Farmer Details",
          "crop": "Crop Details",
          "loss": "Loss Details",
          "evidence": "Evidence Upload",
          "compliance": "Advisory Compliance",
          "declaration": "Final Declaration"
        },
        "fields": {
          "name": "Farmer Name",
          "mobile": "Mobile Number",
          "state": "State",
          "district": "District",
          "village": "Village",
          "area": "Total Farm Area (Acres)",
          "insurance": "PMFBY Insurance Status",
          "cropName": "Crop Name",
          "season": "Season",
          "sowingDate": "Sowing Date",
          "harvestDate": "Expected Harvest Date",
          "affectedArea": "Affected Area (Acres)",
          "cause": "Cause of Loss",
          "damageDate": "Date Damage Observed",
          "damagePercent": "Estimated Damage Percentage (%)",
          "minDamageNote": "Minimum 33% required",
          "complianceFert": "Applied fertilizers as recommended",
          "complianceIrri": "Followed irrigation schedule",
          "compliancePest": "Reported pests early via tool"
        },
        "placeholders": {
          "name": "Full Name",
          "mobile": "+91...",
          "insurance": "Select Status",
          "insYes": "Enrolled (Yes)",
          "insNo": "Not Enrolled",
          "selectCrop": "Select Crop",
          "selectCause": "Select Cause",
          "village": "Village Name"
        },
        "seasons": {
          "kharif": "Kharif",
          "rabi": "Rabi",
          "zaid": "Zaid"
        },
        "advisory": {
          "title": "Confirm your adherence to AgriSphere advisories. This impacts claim approval.",
          "verifiedNote": "Will be verified against AI usage logs."
        },
        "causes": {
          "flood": "Flood / Heavy Rain",
          "drought": "Drought",
          "pest": "Pest Attack",
          "disease": "Crop Disease",
          "hailstorm": "Hailstorm",
          "heatwave": "Heatwave"
        },
        "ai": {
          "title": "AI Assistant Tips",
          "uploadPhotos": "Please upload photos of affected leaves/stems for AI verification.",
          "specifyPest": "Mention specific pest name if known (e.g., Pink Bollworm).",
          "gpsEnable": "Ensure GPS location is enabled while taking photos."
        },
        "evidence": {
          "uploadBtn": "Click to upload photos/video",
          "note": "Upload at least 2 photos (Close-up & Wide angle). GPS metadata will be extracted."
        },
        "declaration": {
          "check": "I hereby declare that the information provided above is true.",
          "note": "I understand that any false claim will lead to rejection and legal action."
        },
        "submitBtn": "Submit Claim",
        "success": "Claim submitted successfully!",
        "error": "Failed to submit claim. Please try again.",
        "agreeError": "You must agree to the declaration."
      },
      "farmerDashboard": {
        "title": "Comprehensive AI Agriculture Dashboard",
        "subtitle": "Advanced AI-powered agriculture management system combining disease detection, GIS digital twin, and yield prediction for precision farming.",
        "tabs": {
          "overview": "Overview",
          "disease": "AI Disease Detection",
          "twin": "GIS Digital Twin",
          "yield": "Yield Prediction",
          "pest": "Pest Forecast",
          "marketplace": "Marketplace"
        },
        "metrics": {
          "models": "AI Models",
          "area": "Farm Area",
          "detections": "Detection Classes",
          "accuracy": "Accuracy",
          "activeModels": "Active Models",
          "hectares": "Hectares",
          "types": "Disease/Pest Types",
          "precision": "AI Precision"
        },
        "status": {
          "active": "Active",
          "live": "Live",
          "types": "Types"
        },
        "yield": {
          "title": "Crop Yield Predictions (2025)",
          "perHectare": "per hectare",
          "advancedTitle": "Advanced AI Yield Prediction",
          "modelPerformance": "ML Model Performance"
        },
        "twin": {
          "title": "GIS-Based Smart Farm Digital Twin",
          "activeZones": "Active Zones",
          "monitored": "Monitored",
          "average": "Average",
          "spatialFeatures": "Spatial Analysis Features",
          "precisionBenefits": "Precision Agriculture Benefits"
        }
      },
      "seeds": {
        "title": "স্মার্ট বীজ",
        "titleProcurement": "সংগ্ৰহ",
        "heroBadge": "ব্লকচেইন স্মার্ট সংগ্ৰহ প্ৰণালী (বিটা)",
        "heroDescription": "আমরা শুধু বীজের সুপারিশ করি না—আমরা আপনাকে মূল্য বুদ্ধিমত্তা এবং রিয়েল-টাইম অ্যাক্সেসযোগ্যতার সাথে যাচাইকৃত নিকটস্থ সরবরাহকারীদের সাথে সংযুক্ত করি।",
        "verifySeedNet": "SeedNet-এ যাচাই করুন",
        "locateShops": "দোকান খুঁজুন",
        "searchPlaceholder": "বীজ বা দোকানের জন্য অনুসন্ধান করুন...",
        "all": "সব",
        "govtSubsidized": "সরকারি ভর্তুকি",
        "private": "বেসরকারি",
        "inStock": "স্টক আছে",
        "outOfStock": "স্টক নেই",
        "subsidyAvailable": "ভর্তুকি উপলব্ধ",
        "call": "কল করুন",
        "docsNeeded": "নথিপত্র প্রয়োজন",
        "requiredDocs": "প্রয়োজনীয় নথিপত্র",
        "carryDocs": "ভর্তুকি পেতে দয়া করে এই নথিপত্রগুলি {{shopName}}-এ নিয়ে যান।",
        "advisorTitle": "AI বীজ উপদেষ্টা",
        "advisorDesc": "আপনার মরসুম এবং ফসলের উপর ভিত্তি করে ব্যক্তিগতকৃত বীজের সুপারিশ পান।",
        "selectSeason": "মরসুম নির্বাচন করুন",
        "seasonRabi": "রবি",
        "seasonKharif": "খরিফ",
        "aiTip": "AI এই র‍্যাঙ্কিংয়ের জন্য আপনার বর্তমান মাটির গঠন এবং মাইক্রো-ক্লাইমেট বিবেচনা করে।",
        "selectSeasonPrompt": "AI সুপারিশ দেখতে একটি মরসুম নির্বাচন করুন",
        "checkAvailability": "উপলব্ধতা পরীক্ষা করুন",
        "tags": {
          "lowestPrice": "সর্বনিম্ন মূল্য",
          "nearest": "নিকটতম",
          "blockchainVerified": "ব্লকচেইন যাচাইকৃত"
        },
        "currentPrice": "বর্তমান মূল্য",
        "marketRate": "বাজার দর",
        "rating": "রেটিং",
        "viewRoute": "রুট দেখুন",
        "checkWithStore": "দোকানে পরীক্ষা করুন",
        "unit": {
          "km": "কিমি"
        },
        "tabs": {
          "findShops": "দোকান খুঁজুন",
          "advisor": "বীজ উপদেষ্টা"
        },
        "toasts": {
          "locating": "আপনার অবস্থান খুঁজছি...",
          "locatingDesc": "নিকটস্থ দোকানের জন্য আপনার GPS স্থানাঙ্ক সংগ্রহ করছি।",
          "found": "অবস্থান পাওয়া গেছে",
          "foundDesc": "{{city}}, {{state}}-এর কাছে যাচাইকৃত বীজ সরবরাহকারী দেখানো হচ্ছে।",
          "errorLoc": "নিকটস্থ দোকান পেতে ব্যর্থ।",
          "permDenied": "জিওলোকেশন অস্বীকার করা হয়েছে",
          "permDeniedDesc": "নিকটস্থ দোকান খুঁজে পেতে দয়া করে অবস্থান সক্ষম করুন।"
        }
      },
      "trace": {
        "title": "Web3 ট্রেসেবিলিটি",
        "subtitle": "স্মার্ট কন্ট্রাক্ট দ্বারা পরিচালিত এন্ড-টু-এন্ড ফসল ট্র্যাকিং।",
        "connectBtn": "ওয়ালেট সংযুক্ত করুন",
        "connected": "সংযুক্ত: {{account}}",
        "walletConnected": "ওয়ালেট সংযুক্ত হয়েছে",
        "simulatedWallet": "সিমুলেটেড ওয়ালেট সংযুক্ত",
        "simulatedWalletDesc": "কোনো Web3 প্রদানকারী পাওয়া যায়নি। ডেমো অ্যাকাউন্ট ব্যবহার করা হচ্ছে।",
        "connectionFailed": "সংযোগ ব্যর্থ হয়েছে",
        "trackTab": "ফসল ট্র্যাক করুন",
        "registerTab": "ব্যাচ রেজিস্টার করুন",
        "searchHint": "ব্যাচ আইডি দিন (যেমন BATCH-7241) বা কিউআর স্ক্যান করুন",
        "traceBtn": "ডেটা ট্র্যাক করুন",
        "recordFound": "রেকর্ড পাওয়া গেছে",
        "recordFoundDesc": "Web3 রেকর্ড সফলভাবে উদ্ধার করা হয়েছে।",
        "recordNotFound": "রেকর্ড পাওয়া যায়নি",
        "recordNotFoundDesc": "ব্যাচ আইডি {{id}} লেজারে নেই।",
        "verifiedBatchTrace": "যাচাইকৃত ব্যাচ ট্রেস",
        "authentic": "প্রামাণিক",
        "signedBy": "দ্বারা স্বাক্ষরিত:",
        "queryHint": "ব্লকচেইন কুয়েরি করতে ব্যাচ আইডি দিন।",
        "ledgerInfo": "ডেটা Web3 অপরিবর্তনীয় লেজারের মাধ্যমে যাচাই করা হয়েছে।",
        "mintTitle": "নতুন শস্য রেকর্ড তৈরি করুন",
        "mintDesc": "ব্লকচেইনে আপনার ফসল রেকর্ড করুন। একবার জমা দিলে এটি পরিবর্তন করা যাবে না।",
        "batchIdLabel": "তৈরি করা ব্যাচ আইডি",
        "cropLabel": "ফসলের প্রকার",
        "cropPlaceholder": "যেমন বাসমতি চাল, জৈব আপেল",
        "originLabel": "উৎপত্তিস্থল",
        "originPlaceholder": "খামারের ঠিকানা বা GPS স্থানাঙ্ক",
        "qualityLabel": "গুণমান / শংসাপত্র",
        "signingNotice": "এই লেনদেনটি জমা দিয়ে, আপনি একটি স্বাক্ষর করছেন। আপনাকে ওয়ালেটে নিশ্চিত করতে হবে।",
        "mintingBtn": "ব্লকচেইনে তৈরি হচ্ছে...",
        "signRegisterBtn": "সাইন এবং রেজিস্টার করুন",
        "mintSuccess": "তৈরি সফল",
        "mintSuccessDesc": "ব্যাচ {{id}} স্থায়ীভাবে ব্লকচেইনে নথিভুক্ত করা হয়েছে।"
      }
    }
  },
  "as": {
    "translation": {
      "nav": {
        "home": "হোম",
        "marketplace": "বজাৰ",
        "communityForum": "কৃষক সমাজ",
        "advisoryHub": "পৰামৰ্শ কেন্দ্ৰ",
        "voiceAssistant": "ভইচ সহায়ক",
        "fertilizerAi": "সাৰ এআই",
        "pestForecast": "কীট-পতংগৰ পূৰ্বানুমান",
        "adminDashboard": "প্ৰশাসন ডেশ্ববৰ্ড",
        "buyerDashboard": "ক্ৰেতাৰ ডেশ্ববৰ্ড",
        "farmerDashboard": "কৃষক ডেশ্ববৰ্ড",
        "diseaseDetection": "ৰোগ চিনাক্তকৰণ",
        "yieldPrediction": "উৎপাদনৰ পূৰ্বানুমান",
        "digitalTwin": "ডিজিটেল টুইন",
        "login": "লগইন",
        "getStarted": "আৰম্ভ কৰক",
        "logout": "Logout",
        "saveProfile": "Save Profile",
        "aiTools": "স্মাৰ্ট ফাৰ্মিং টুলছ",
        "seedFinder": "বীজ অনুসন্ধান",
        "traceability": "Web3 ট্রেসেবিলিটি"
      },
      "home": {
        "heroTitle1": "ভাৰতৰ প্ৰথম",
        "heroTitle2": "AI + GIS স্মাৰ্ট কৃষি",
        "heroSubtitle": "ইণ্টেলিজেন্স প্লেটফৰ্ম",
        "heroDescription": "কীট-পতংগ, পুষ্টিৰ অভাৱ আৰু ভেঁকুৰৰ সংক্ৰমণ চিনাক্ত কৰক। উৎপাদন ৩০% লৈ বৃদ্ধি কৰক আৰু খৰচ ৪০% লৈ হ্ৰাস কৰক।",
        "exploreFeatures": "ডেমো চাওক",
        "floatingAlert": "বতৰৰ আশংকা পৰীক্ষা কৰক",
        "featuresTitle": "আধুনিক কৃষিৰ বাবে",
        "featuresSubtitle": "স্মাৰ্ট ফিচাৰ",
        "featuresDesc": "নতুন প্ৰযুক্তি",
        "aboutTitle": "AgriSphere AI হৈছে ভাৰতৰ প্ৰথম AI + GIS প্লেটফৰ্ম।",
        "aboutDesc": "শস্য বৃদ্ধি আৰু ৰোগৰ ঔষধ বাছনি কৰাত সহায় কৰে।",
        "howItWorks": "কেনেদৰে কাম কৰে",
        "howItWorksSubtitle": "৪টা সহজ পদক্ষেপ",
        "ctaTitle": "আপোনাৰ ব্যৱসায় সলনি কৰিবলৈ প্ৰস্তুত নে?",
        "ctaSubtitle": "আৰম্ভ কৰক!",
        "ctaDesc": "AgriSphere AI ব্যৱহাৰ কৰক।",
        "ctaFreeTrial": "বিনামূল্যে ট্ৰায়েল",
        "ctaDemo": "ডেমো",
        "features": {
          "f1": {
            "title": "AI Disease Detection",
            "desc": "Advanced ML models analyze images to detect diseases & pests with 95% accuracy",
            "b1": "Pest Detection",
            "b2": "Nutrient Deficiency",
            "b3": "Fungal Infections",
            "b4": "Soil Texture Analysis"
          },
          "f2": {
            "title": "GIS Digital Twin",
            "desc": "Complete farm replica with mapping & growth tracking",
            "b1": "Field Boundaries",
            "b2": "Soil Zones",
            "b3": "Irrigation Zones",
            "b4": "Growth Stages"
          },
          "f3": {
            "title": "Yield Prediction",
            "desc": "ML-powered yields forecasting using weather & soil data",
            "b1": "Weather Analysis",
            "b2": "Soil Type Mapping",
            "b3": "Historical Data",
            "b4": "ML Forecasting"
          },
          "f4": {
            "title": "Weather Risk Engine",
            "desc": "Real-time alerts for floods, drought, and heatwaves",
            "b1": "Flood Alerts",
            "b2": "Drought Warning",
            "b3": "Heatwave Detection",
            "b4": "SMS Alerts"
          },
          "f5": {
            "title": "Fertilizer & Irrigation AI",
            "desc": "Smart NPK & water scheduling for optimal nutrition",
            "b1": "NPK Analysis",
            "b2": "Water Prediction",
            "b3": "Smart Scheduling",
            "b4": "Nutrition Optimization"
          }
        },
        "stats": {
          "activeFarmers": "সক্ৰিয় কৃষক",
          "accuracyRate": "সঠিকতা",
          "fieldsMapped": "মাটিৰ মেপিং",
          "yieldIncrease": "উৎপাদন বৃদ্ধি"
        },
        "advanced": {
          "title": "Advanced AI Intelligence",
          "desc": "Cutting-edge features that set AgriSphere AI apart",
          "pests": {
            "title": "Pest Attack Prediction",
            "desc": "AI forecasts pest attack probability (0-100%) for next 7 days",
            "b1": "Climate Analysis",
            "b2": "7-Day Risk Forecast",
            "b3": "Prevention Alerts",
            "b4": "Treatment Recommendations"
          },
          "seedToMarket": {
            "title": "Seed-to-Market Advisory",
            "desc": "Complete guidance from seed selection to market pricing",
            "b1": "Seed Selection",
            "b2": "Sowing Time",
            "b3": "Harvest Prediction",
            "b4": "Market Pricing"
          },
          "voice": {
            "title": "Voice Assistant (Hindi)",
            "desc": "Farmers speak in local language, AI responds with advice",
            "b1": "Hindi Support",
            "b2": "Voice Recognition",
            "b3": "Local Languages",
            "b4": "Audio Responses"
          },
          "schemes": {
            "title": "Government Schemes AI",
            "desc": "Auto-identifies subsidies, loans, and PM-KISAN benefits",
            "b1": "Subsidy Matching",
            "b2": "Loan Eligibility",
            "b3": "Insurance Plans",
            "b4": "PM-KISAN"
          },
          "marketplace": {
            "title": "Farmer-Buyer Marketplace",
            "desc": "Direct selling platform with AI pricing and logistics",
            "b1": "Direct Selling",
            "b2": "AI Pricing",
            "b3": "Logistics",
            "b4": "Income Boost"
          },
          "blockchain": {
            "title": "Blockchain Traceability",
            "desc": "Track crop origin and supply chain for quality assurance",
            "b1": "Origin Tracking",
            "b2": "Supply Chain",
            "b3": "Authenticity",
            "b4": "Quality Assurance"
          }
        },
        "rural": {
          "title": "গ্ৰাম্য ভাৰতৰ বাবে",
          "subtitle": "কৃষকৰ বাবে"
        },
        "women": {
          "title": "গ্ৰাম্য মহিলা কৃষি উদ্যোগী",
          "subtitle": "নাৰী সবলীকৰণ"
        },
        "testimonials": {
          "title": "What Farmers Say",
          "subtitle": "Real stories from farmers transforming their operations",
          "t1": {
            "name": "Rajesh Kumar",
            "loc": "Punjab, India",
            "text": "AgriSphere's multi-class AI detected stem borer in my wheat early. The pest prediction saved my entire 10-acre crop and increased yield by 35%!",
            "benefit": "35% yield increase"
          },
          "t2": {
            "name": "Anita Sharma",
            "loc": "Maharashtra, India",
            "text": "The GIS digital twin mapped my field perfectly. AI-powered management cut water usage by 45%. Marketplace got me ₹2000/quintal extra!",
            "benefit": "45% water savings"
          },
          "t3": {
            "name": "Vikram Patel",
            "loc": "Gujarat, India",
            "text": "Voice assistant in Hindi is amazing! 'Tamatar mein rog hai' - instantly got disease type, treatment cost. Offline mode works perfectly in my village.",
            "benefit": "Hindi voice support"
          }
        },
        "tech": {
          "title": "Built on Cutting-Edge Technology",
          "subtitle": "Enterprise-grade tech stack powering your farm",
          "t1": "Yield prediction",
          "t2": "Time series analysis",
          "t3": "Advanced regression",
          "t4": "Digital twin mapping",
          "t5": "Disease detection",
          "t6": "Supply traceability",
          "t7": "Hindi commands",
          "t8": "Village accessibility",
          "t9": "Alert fallback",
          "t10": "Instant notifications",
          "t11": "Data security"
        },
        "learnMore": "Learn more",
        "footer": {
          "tagline": "Empowering farmers with AI and GIS technology for sustainable, profitable agriculture.",
          "col1": "Features",
          "col2": "Platform",
          "col3": "Support",
          "iot": "IoT Monitoring",
          "weather": "Weather Alerts",
          "community": "Community",
          "help": "Help Center",
          "docs": "Documentation",
          "api": "API Guide",
          "contact": "Contact",
          "copyright": "© 2025 AgriSphere AI. All rights reserved."
        },
        "heroBadge": "AI-Powered Smart Agriculture"
      },
      "disease": {
        "title": "AI শস্য ৰোগ চিনাক্তকৰণ",
        "backHome": "হোমলৈ ঘূৰি যাওক",
        "desc": "উন্নত এআইৰ দ্বাৰা পাত, কাঁচ আৰু ফলৰ পৰা ৰোগ, পোক আৰু পুষ্টিৰ অভাৱ সঠিকভাৱে চিনাক্ত কৰক।",
        "startBtn": "চিনাক্তকৰণ আৰম্ভ কৰক",
        "uploadBtn": "ছবি আপলোড কৰক",
        "saveBtn": "সংৰক্ষিত ৰিপোৰ্ট",
        "hideBtn": "লুকাওক",
        "reportsTitle": "অফলাইন ৰিপোৰ্ট",
        "noReports": "কোনো ৰিপোৰ্ট নাই।",
        "capTitle": "বহু-শ্ৰেণীৰ চিনাক্তকৰণ",
        "pestTitle": "পোক চিনাক্তকৰণ",
        "aiTitle": "উন্নত এআই বিশ্লেষণ",
        "howTitle": "কেনেকৈ কাম কৰে",
        "accuracy": "সঠিকতা",
        "types": {
          "leaf": {
            "title": "পাতৰ ৰোগ",
            "desc": "ভাইৰাছ সংক্ৰমণ",
            "d1": "ব্লাইট",
            "d2": "মৰিচা",
            "d3": "ভাইৰাছ",
            "d4": "বেক্টেৰিয়া"
          },
          "stem": {
            "title": "কাঁচৰ বিশ্লেষণ",
            "desc": "কাঁচৰ ক্ষতি চিনাক্ত কৰক",
            "d1": "পোক",
            "d2": "পচন",
            "d3": "ক্ষতি",
            "d4": "শুকান"
          },
          "fruit": {
            "title": "ফলৰ পৰীক্ষা",
            "desc": "ফলৰ ৰোগ নিৰ্ণয়",
            "d1": "পচন",
            "d2": "পোকৰ ক্ষতি",
            "d3": "ফাঁট",
            "d4": "ৰঙৰ সালসলনি"
          },
          "soil": {
            "title": "মাটিৰ স্বাস্থ্য",
            "desc": "মাটিৰ পৰীক্ষা",
            "d1": "পুষ্টিৰ অভাৱ",
            "d2": "pH সন্তুলন",
            "d3": "লৱণতা",
            "d4": "চাপ"
          }
        },
        "pests": {
          "p1": {
            "name": "Aphids",
            "damage": "Sap sucking",
            "treatment": "Neem oil spray"
          },
          "p2": {
            "name": "Thrips",
            "damage": "Leaf damage",
            "treatment": "Blue sticky traps"
          },
          "p3": {
            "name": "Whitefly",
            "damage": "Virus transmission",
            "treatment": "Yellow traps"
          },
          "p4": {
            "name": "Caterpillars",
            "damage": "Leaf eating",
            "treatment": "Bt spray"
          }
        },
        "how": {
          "s1": {
            "title": "ছবি তোলক",
            "desc": "গছৰ ছবি তোলক"
          },
          "s2": {
            "title": "AI বিশ্লেষণ",
            "desc": "তথ্য প্ৰক্ৰিয়া কৰা"
          },
          "s3": {
            "title": "শ্ৰেণীবিভাজন",
            "desc": "ফলাফল দৰ্শন"
          },
          "s4": {
            "title": "চিকিৎসাৰ পৰিকল্পনা",
            "desc": "পৰামৰ্শ"
          }
        },
        "stats": {
          "disease": "ৰোগৰ সক্ৰিয়তা",
          "diseaseDesc": "বতাহৰ ওপৰত আধাৰিত",
          "pest": "পোক নিৰ্ণয়",
          "pests": "পোকৰ চাপ",
          "pestDesc": "৭ দিনৰ পূৰ্বানুমান",
          "soil": "মাটিৰ স্বাস্থ্য",
          "soilDesc": "শেহতীয়া পৰীক্ষা"
        },
        "score": "স্কোৰ",
        "issues": "সমস্যা",
        "diseasesCount": "নিৰীক্ষণ কৰা ৰোগ",
        "pestsCount": "সক্ৰিয় পোকৰ ভাবুকি",
        "viewSummary": "সাৰাংশ চাওক"
      },
      "marketplace": {
        "title": "স্মাৰ্ট বজাৰ আৰু পৰামৰ্শ",
        "subtitle": "এআই পৰামৰ্শ লাভ কৰক আৰু ক্ৰেতা/বিক্ৰেতাৰ সৈতে যোগাযোগ কৰক।",
        "tabs": {
          "advisory": "পৰামৰ্শ",
          "listings": "তালিকাভুক্ত কৰক",
          "trends": "প্ৰৱণতা",
          "demands": "ক্ৰেতাৰ চাহিদা"
        },
        "demands": {
          "title": "ক্ৰেতাৰ লাইভ চাহিদা",
          "noDemands": "কোনো চাহিদা নাই।",
          "verified": "প্ৰমাণিত ক্ৰেতা",
          "targetPrice": "লক্ষ্য মূল্য",
          "contactBtn": "যোগাযোগ কৰক"
        },
        "advisory": {
          "title": "AgriSphere স্মাৰ্ট পৰামৰ্শ",
          "desc": "ব্যক্তিগত এআই পৰামৰ্শ।",
          "selectCrop": "শস্য বাছনি কৰক",
          "chooseCrop": "বাছক...",
          "state": "ৰাজ্য",
          "selectState": "ৰাজ্য বাছনি কৰক",
          "sowingDate": "ৰোপণৰ তাৰিখ",
          "pickDate": "তাৰিখ বাছনি কৰক",
          "fieldSize": "ভূমি (একৰ)",
          "analyzeBtn": "ৰিপোৰ্ট প্ৰস্তুত কৰক",
          "analyzing": "প্ৰস্তুত কৰা হৈছে...",
          "missingInfo": "উপস্থিত নাই",
          "selectPrompt": "অনুগ্ৰহ কৰি নিৰ্বাচন কৰক।",
          "readyTitle": "কৃষি পৰামৰ্শ ৰিপোৰ্ট:"
        },
        "trends": {
          "title": "এআই বজাৰ দৰ্শন",
          "livePrices": "বজাৰ মূল্য",
          "forecast": "মূল্যৰ পূৰ্বানুমান",
          "fetched": "দৰ পোৱা গৈছে।",
          "fetchError": "লাভ কৰাত বিফল।",
          "detailsMissing": "স্থান নাই",
          "enterStateDistrict": "ৰাজ্য আৰু জিলা উল্লেখ কৰক।",
          "findMandiRates": "দৰ বিচাৰক",
          "selectState": "ৰাজ্য বাছনি কৰক",
          "enterDistrict": "জিলাৰ নাম লিখক",
          "typeDistrict": "টাইপ কৰক...",
          "category": "বিভাগ",
          "checkRates": "দৰ পৰীক্ষা কৰক",
          "forecastTitle": "পূৰ্বানুমান",
          "noRates": "তথ্য পোৱা নগ'ল।",
          "low": "নিম্ন",
          "medium": "মধ্যম",
          "high": "উচ্চ"
        },
        "listings": {
          "filters": "বজাৰ ফিল্টাৰ",
          "search": "বিচাৰক...",
          "contactFarmer": "কৃষকৰ সৈতে যোগাযোগ",
          "noListings": "কোনো তালিকা পোৱা নগ'ল।",
          "form": {
            "postTitle": "বিক্ৰী কৰক",
            "postSubtitle": "তালিকা এটা প'ষ্ট কৰক।",
            "name": "আপোনাৰ নাম",
            "contact": "ফোন নম্বৰ",
            "crop": "শস্যৰ নাম",
            "qty": "পৰিমাণ",
            "price": "মূল্য",
            "selectState": "ৰাজ্য বাছনি কৰক",
            "submit": "প'ষ্ট কৰক"
          },
          "fillAllFields": "বিৱৰণ পূৰণ কৰক।",
          "listingPosted": "সফলতাৰে প'ষ্ট কৰা হ'ল!"
        },
        "alerts": {
          "seasonality": "Seasonality Warning"
        },
        "states": {
          "bihar": "Bihar",
          "uttarPradesh": "Uttar Pradesh",
          "punjab": "Punjab",
          "haryana": "Haryana",
          "madhyaPradesh": "Madhya Pradesh"
        },
        "langEn": "English",
        "langHi": "Hindi",
        "langBn": "Bengali",
        "langAs": "Assamese",
        "langKn": "Kannada"
      },
      "advisoryHub": {
        "title": "AgriSphere Advisory Hub",
        "subtitle": "Real-time schemes, news, and expert videos for smart farming.",
        "tabs": {
          "schemes": "Schemes & Subsidies",
          "calculator": "Fertilizer Calculator",
          "news": "Farming News",
          "videos": "Video Tutorials"
        },
        "refresh": "Refresh Content",
        "eligibility": {
          "title": "Check Eligibility",
          "desc": "Update your profile to see relevant government schemes.",
          "state": "State",
          "landSize": "Land Size (Acres)",
          "farmerType": "Farmer Type",
          "profileUpdated": "Profile updated! Checking eligibility..."
        },
        "offline": {
          "loadedCache": "Offline: Loaded schemes from cache."
        },
        "success": {
          "addedSchemes": "Added {{count}} new schemes."
        },
        "info": {
          "noNewSchemes": "AI couldn't find any new unique schemes right now."
        },
        "error": {
          "loadSchemes": "Failed to load more schemes."
        },
        "loading": {
          "askingAi": "Asking AI for more schemes...",
          "findingSchemes": "Finding New Schemes...",
          "loadingNews": "Loading News...",
          "loadingVideos": "Loading Videos...",
          "loadingCalc": "Loading Calculator..."
        },
        "buttons": {
          "loadMore": "Load More",
          "findAi": "Find More from AI",
          "refresh": "Refresh Content",
          "calculate": "Calculate Nutrients"
        },
        "noData": {
          "noSchemes": "No eligible schemes found for this profile in {{state}}.",
          "allIndiaBtn": "View All India Schemes",
          "noNews": "No news available at the moment.",
          "noVideos": "No videos available at the moment."
        },
        "toasts": {
          "videosRefreshed": "Videos refreshed!",
          "newsRefreshed": "News refreshed!",
          "schemesRefreshed": "Schemes refreshed!"
        },
        "configNeeded": {
          "title": "Configuration Needed",
          "desc": "Please add {{key}} to your .env file to see {{feature}}."
        }
      },
      "yield": {
        "title": "উন্নত উৎপাদনৰ পূৰ্বানুমান",
        "desc": "এআই ব্যৱহাৰ কৰি শস্যৰ উৎপাদনৰ পূৰ্বানুমান জানক।",
        "supportedCrops": "সমৰ্থিত শস্য",
        "inputTitle": "ইনপুট পাৰামিটাৰ",
        "selectCrop": "শস্য বাছনি কৰক",
        "area": "মাটি (একৰ)",
        "areaNote": "1 Acre ≈ 0.4 Hectares",
        "rainfall": "বৰষুণ (মিমি)",
        "temp": "Avg Temp (°C)",
        "humidity": "Humidity (%)",
        "fertilizer": "Fertilizer (kg)",
        "pesticide": "Pesticide (kg)",
        "soilPh": "Soil pH",
        "soilN": "Soil N (kg/ha)",
        "soilP": "Soil P (kg/ha)",
        "soilK": "Soil K (kg/ha)",
        "predictBtn": "পূৰ্বানুমান কৰক",
        "analyzing": "বিশ্লেষণ কৰি থকা হৈছে...",
        "resultsTitle": "ফলাফল",
        "totalProduction": "মুঠ উৎপাদন",
        "revenue": "ৰাজহ",
        "yieldEfficiency": "উৎপাদন দক্ষতা",
        "models": {
          "rf": "Random Forest",
          "lstm": "LSTM Networks",
          "gb": "Gradient Boosting",
          "xgb": "XGBoost"
        },
        "potentialRevenue": "সম্ভাব্য ৰাজহ",
        "perHectare": "প্ৰতি হেক্টৰ",
        "approx": "প্ৰায়",
        "confidence": "সঠিকতা",
        "modelUsed": "ব্যৱহৃত মডেল",
        "trainingData": "ডেটা",
        "accuracyNote": "Note: Rice predictions are now highly accurate (~99.7%) thanks to the integration of Soil Health Card data (pH, N, P, K).",
        "kharifSeason": "Kharif Season",
        "tonsPerHa": "t/ha",
        "confidenceRange": "Confidence Range",
        "fiveYearAvg": "5-Year Average",
        "trend": "Historical Trend",
        "regionalPerformance": "Regional Performance",
        "readyDesc": "তথ্য দিয়ক আৰু ক্লিক কৰক।",
        "predictionSuccess": "ফলাফল সফল",
        "estimatedProduction": "Estimated Production",
        "tonsUnit": "টন",
        "summary": {
          "report": "{{crop}}-ৰ বাবে আপোনাৰ আনুমানিক উৎপাদন {{total}} টন।"
        },
        "avgTemp": "গড় তাপমাত্ৰা (°C)"
      },
      "pest": {
        "title": "পোকৰ আক্ৰমণৰ পূৰ্বানুমান",
        "inputTitle": "মাটিৰ অৱস্থা",
        "inputDesc": "বতৰৰ বিৱৰণ দিয়ক",
        "selectCrop": "শস্য বাছনি",
        "temp": "তাপমাত্ৰা",
        "humidity": "আৰ্দ্ৰতা",
        "rainfall": "বৰষুণ",
        "predictBtn": "খতৰা পূৰ্বানুমান",
        "analyzing": "বিশ্লেষণ...",
        "resultsTitle": "ফলাফল",
        "probability": "আক্ৰমণৰ সম্ভাৱনা",
        "riskLevel": "{{level}} বিপদ",
        "primaryThreat": "প্ৰাথমিক ভাবুকি",
        "recommendation": "পৰামৰ্শ",
        "forecast7Days": "৭ দিনৰ পূৰ্বানুমান",
        "readyDesc": "স্লাইডাৰ মিলাই ক্লিক কৰক",
        "advisorTitle": "AI Agro-Advisor",
        "advisorDesc": "Hear this analysis in your language",
        "stopBtn": "Stop",
        "summary": {
          "prediction": "পূৰ্বানুমান: {{level}} বিপদাশংকা ({{score}}%) সৈতে {{name}}।",
          "recommendation": "পৰামৰ্শ: {{recommendation}}",
          "weather": "বতৰ: {{temp}}°C, {{humidity}}% আৰ্দ্ৰতা, {{rainfall}}mm বৰষুণ।",
          "crop": "শস্য: {{crop}}।"
        }
      },
      "fertilizer": {
        "title": "স্মাৰ্ট সাৰ আৰু জলসিঞ্চন",
        "subtitle": "উন্নত শস্যৰ বাবে এআইৰ পৰামৰ্শ",
        "inputTitle": "পাৰামিটাৰ",
        "cropType": "শস্যৰ প্ৰকাৰ",
        "selectCrop": "নিৰ্বাচন কৰক",
        "nitrogen": "নাইট্ৰ'জেন (N)",
        "phosphorus": "ফছফৰাছ (P)",
        "potassium": "পটাছিয়াম (K)",
        "moisture": "মাটিৰ আৰ্দ্ৰতা (%)",
        "moistureDry": "শুকান",
        "moistureWet": "সেমেকা",
        "rainfall": "বৰষুণৰ পূৰ্বানুমান (মিমি)",
        "soilPh": "মাটিৰ pH",
        "growthStage": "বৃদ্ধিৰ স্তৰ",
        "selectStage": "স্তৰ বাছনি কৰক",
        "stages": {
          "sowing": "বীজ ৰোপণ",
          "vegetative": "উদ্ভিদীয়",
          "flowering": "ফুল ফুলাৰ সময়",
          "harvest": "শস্য চপোৱাৰ সময়"
        },
        "getBtn": "পৰামৰ্শ লাভ কৰক",
        "analyzing": "বিশ্লেষণ...",
        "results": {
          "noDataTitle": "কোনো পৰামৰ্শ নাই",
          "noDataDesc": "তপৰত তথ্য দিয়ক।",
          "planTitle": "সাৰৰ পৰিকল্পনা",
          "adjustments": "অ্যাডজাস্টমেন্ট",
          "irrigationTitle": "জলসিঞ্চনৰ সময়সূচী",
          "phAlert": "pH সতৰ্কতা",
          "waterAmount": "পানীৰ পৰিমাণ",
          "applyWater": "{{amount}} পানী দিয়ক।",
          "rainNote": "অহা ৩ দিন বৰষুণৰ সম্ভাৱনা।",
          "moistureNote": "আৰ্দ্ৰতা সঠিক ৰাখক।",
          "temperature": "তাপমাত্ৰা",
          "windSpeed": "বতাহৰ গতি",
          "normal": "স্বাভাৱিক"
        }
      },
      "community": {
        "title": "Kisan Sarathi Community",
        "subtitle": "Connect with fellow farmers, share knowledge, and grow together.",
        "searchPlaceholder": "Search discussions, questions, or experts...",
        "askBtn": "Ask a Question",
        "tabs": {
          "feed": "Community Feed",
          "experts": "Expert Advice",
          "myPosts": "My Activity"
        },
        "stats": {
          "members": "Members",
          "discussions": "Discussions",
          "experts": "Experts Online"
        },
        "chatWith": "Chat with",
        "globalChat": "Global Chat",
        "onlineFarmers": "Online Farmers",
        "you": "You",
        "deleteMessageConfirm": "Are you sure you want to delete this message?",
        "replyTitle": "Write a reply...",
        "replyBtn": "Reply",
        "noReplies": "No replies yet. Be the first!",
        "translatingToast": "AI is translating this post...",
        "aiTranslating": "AI is translating this post.",
        "translatePost": "Translate Post",
        "deleteMessage": "Delete Message",
        "errorPost": "Failed to post question",
        "errorSend": "Failed to send message"
      },
      "common": {
        "today": "Today",
        "yesterday": "Yesterday",
        "messages": "New Messages",
        "clickToChat": "Click to chat",
        "active": "active",
        "loading": "Loading...",
        "localizing": "Localizing...",
        "localized": "Analysis localized to {{lang}} in {{dialect}} dialect.",
        "dialectTransform": "Transforming advice into {{dialect}} dialect...",
        "listening": "Listening...",
        "voiceError": "Voice input failed. Please try again.",
        "error": "Error",
        "success": "Success",
        "generatedOn": "Generated on",
        "crops": {
          "rice": "Rice",
          "wheat": "Wheat",
          "maize": "Maize",
          "sugarcane": "Sugarcane",
          "potato": "Potato",
          "tomato": "Tomato",
          "ginger": "Ginger"
        },
        "playEnglish": "Play English (Full)",
        "playHindi": "Play Hindi (हिंदी)",
        "soldBy": "Sold by",
        "other": "Other",
        "farmerTypes": {
          "small": "Small Farmer",
          "marginal": "Marginal Farmer",
          "large": "Large Farmer",
          "landless": "Landless Laborer"
        },
        "voiceUnsupported": "Voice search not supported in this browser.",
        "offline": "Offline",
        "tryAgain": "Try Again",
        "ready": "Ready",
        "in": "in",
        "unit": {
          "acres": "একৰ",
          "hectares": "হেক্টৰ",
          "tons": "টন",
          "quintals": "Quintals",
          "kilograms": "kg"
        },
        "all": "All States"
      },
      "digitalTwin": {
        "title": "GIS Smart Farm Digital Twin",
        "subtitle": "Create a complete digital replica of your farm with advanced GIS mapping, multi-layer visualization, and real-time monitoring for precision agriculture.",
        "featuring": "✨ Featuring: Farm Boundaries • Soil Zones • Irrigation Planning • Pest Risk Maps • NDVI Crop Health • Weather Analysis",
        "setupTitle": "Farm Setup",
        "setupDesc": "Enter your farm details or coordinates to generate your digital twin.",
        "farmName": "Farm Name",
        "ownerName": "Owner Name",
        "state": "State",
        "district": "District",
        "town": "Town/Village",
        "coordinates": "Coordinates",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "useCurrent": "Use Current Location",
        "size": "Farm Size (Acres)",
        "generateBtn": "Generate Digital Twin",
        "generating": "Generating Digital Twin...",
        "quickDemo": "Quick Demo",
        "drawMap": "Draw on Map",
        "capabilities": "Digital Twin Capabilities",
        "visualization": "Multi-Layer GIS Visualization",
        "interactiveMap": "Interactive GIS Map: {{name}}",
        "liveData": "Live Farm Intelligence",
        "explainBtn": "Explain Farm Status",
        "stopBtn": "Stop",
        "accuracy": "Accuracy",
        "update": "Update Digital Twin",
        "hectares": "Hectares",
        "area": "Farm Area",
        "features": {
          "soil": {
            "title": "Soil Zone Classification",
            "desc": "Multi-layer soil analysis with texture, pH, and nutrient mapping",
            "f1": "Soil Texture",
            "f2": "pH Zones",
            "f3": "Nutrient Maps",
            "f4": "Fertility Index"
          },
          "irrigation": {
            "title": "Irrigation Zone Planning",
            "desc": "Smart irrigation zone design based on crop needs and soil conditions",
            "f1": "Water Zones",
            "f2": "Drip Planning",
            "f3": "Sprinkler Layout",
            "f4": "Efficiency Maps"
          },
          "pest": {
            "title": "Pest-Prone Area Detection",
            "desc": "Historical pest data analysis to identify high-risk zones",
            "f1": "Risk Zones",
            "f2": "Pest History",
            "f3": "Prevention Areas",
            "f4": "Treatment Maps"
          },
          "growth": {
            "title": "Crop Growth Staging",
            "desc": "Real-time crop growth stage monitoring across different field zones",
            "f1": "Growth Stages",
            "f2": "Maturity Maps",
            "f3": "Harvest Zones",
            "f4": "Yield Prediction"
          },
          "weather": {
            "title": "Weather Microclimate",
            "desc": "Field-specific microclimate analysis and weather pattern mapping",
            "f1": "Temperature Zones",
            "f2": "Humidity Maps",
            "f3": "Wind Patterns",
            "f4": "Frost Risk"
          }
        },
        "layers": {
          "satellite": "Satellite Imagery",
          "soilHealth": "Soil Health",
          "cropHealth": "Crop Health",
          "weather": "Weather Data",
          "pests": "Pest Alerts",
          "base": "Base Layer",
          "analysis": "Analysis Layer",
          "monitoring": "Monitoring Layer",
          "environmental": "Environmental Layer",
          "alert": "Alert Layer",
          "daily": "Daily",
          "weekly": "Weekly",
          "realtime": "Real-time",
          "hourly": "Hourly",
          "asneeded": "As needed"
        },
        "drawDesc": "Pinpoint your location and trace the exact shape of your land.",
        "exploreNote": "Explore {{owner}}'s farm with multi-layer GIS visualization. Click on zones for detailed information.",
        "initializing": {
          "status": "Initializing Digital Twin Engine...",
          "mapping": "Mapping boundaries for",
          "soil": "Analyzing soil sensor data layers...",
          "irrigation": "Designing irrigation grid for",
          "pests": "Calculating historical pest risk zones..."
        },
        "insights": {
          "mappedZones": "Mapped Soil Zones",
          "activeZones": "Active Irrigation Zones",
          "growthStages": "Avg Growth Stage",
          "health": "Health Score"
        },
        "summary": {
          "prefix": "Farm Status Report for {{area}} hectares.",
          "zones": "We have identified {{soil}} distinct soil zones and {{irrigation}} irrigation zones.",
          "health": "Overall crop health is {{health}}%.",
          "pestWarning": "Warning: High pest risk detected. Immediate action recommended.",
          "pestLow": "Pest risk is currently low."
        }
      },
      "iot": {
        "title": "IoT Smart Farm Monitoring",
        "subtitle": "Real-time soil health and environment monitoring using low-cost sensor nodes.",
        "liveMonitoring": "Live Monitoring",
        "viewAnalytics": "View Analytics",
        "liveDataHeader": "Live Sensor Data",
        "moisture": "Moisture",
        "ph": "pH Level",
        "temp": "Temp",
        "nitrogen": "Nitrogen",
        "phosphorus": "Phosphorus",
        "potassium": "Potassium",
        "alertsTitle": "Active Alerts",
        "recsTitle": "Irrigation Recommendations",
        "alertsCount": "Active Alerts ({{count}})",
        "recsCount": "Irrigation Recommendations ({{count}})",
        "noAlerts": "No active alerts. Your field conditions are optimal.",
        "noRecs": "No irrigation recommendations at this time.",
        "startIrrigation": "Start Irrigation",
        "irrigationFor": "for {{duration}} mins",
        "features": {
          "title": "System Features",
          "f1": {
            "title": "Real-time Monitoring",
            "desc": "24/7 continuous soil parameter monitoring",
            "items": [
              "Soil Moisture",
              "pH Levels",
              "Temperature",
              "Conductivity"
            ]
          },
          "f2": {
            "title": "Smart Alerts",
            "desc": "AI-powered alert system for critical conditions",
            "items": [
              "Threshold Alerts",
              "Predictive Warnings",
              "Mobile Notifications",
              "Email Reports"
            ]
          },
          "f3": {
            "title": "Auto Irrigation",
            "desc": "Automated irrigation based on soil conditions",
            "items": [
              "Smart Scheduling",
              "Zone Control",
              "Water Optimization",
              "Remote Control"
            ]
          },
          "f4": {
            "title": "Data Analytics",
            "desc": "Historical data analysis and trend monitoring",
            "items": [
              "Trend Analysis",
              "Performance Reports",
              "Yield Correlation",
              "ROI Tracking"
            ]
          }
        },
        "benefits": {
          "title": "Smart Farming Benefits",
          "b1": {
            "title": "40% Water Savings",
            "desc": "Precision irrigation control"
          },
          "b2": {
            "title": "25% Yield Increase",
            "desc": "Optimal growing conditions"
          },
          "b3": {
            "title": "60% Labor Reduction",
            "desc": "Automated monitoring"
          },
          "b4": {
            "title": "Real-time Insights",
            "desc": "Instant decision making"
          }
        }
      },
      "weather": {
        "title": "Smart Weather Risks & Alerts",
        "subtitle": "Advanced GIS-based weather risk detection for your specific farm location.",
        "locationTitle": "Risk Scanning Control",
        "locationDesc": "Select your location to check for local weather hazards and receive automated alerts.",
        "selectState": "Select State",
        "selectDistrict": "Select District",
        "phoneLabel": "Phone Number (for SMS Alerts)",
        "phoneVerify": "Verify",
        "phoneCalling": "Calling...",
        "scanBtn": "Check Risks",
        "scanning": "Scanning GIS Data...",
        "systemSafe": "System Safe",
        "alert": "Alert",
        "riskDetected": "Risk Detected",
        "standby": "System Standby",
        "placeholder": "Select your location and click 'Check Risks' to start scanning your area for hazards.",
        "temp": "Temperature",
        "humidity": "Humidity",
        "toasts": {
          "verifyTitle": "📞 Incoming Call from Twilio",
          "verifyDesc": "Answer the call and enter code: {{code}}",
          "verifyFailed": "Verification Failed",
          "riskTitle": "⚠️ Risk Detected",
          "smsSent": "🚨 SMS Alert sent to {{phone}}",
          "safeTitle": "✅ Conditions Safe",
          "safeDesc": "No severe weather threats detected."
        }
      },
      "voiceAssistant": {
        "hero": {
          "title": "কৃষকৰ বাবে ভইচ সহায়ক",
          "desc": "আপোনাৰ নিজৰ ভাষাত কথা কওক। গাঁৱলীয়া কৃষকৰ বাবে বিশেষভাৱে প্ৰস্তুত কৰা এআই সহায়কৰ পৰা ততালিকে কৃষি পৰামৰ্শ পাওক।",
          "startBtn": "কথা ক'বলৈ আৰম্ভ কৰক",
          "chooseLangBtn": "ভাষা বাছনি কৰক"
        },
        "features": {
          "sectionTitle": "Voice Assistant Features",
          "f1": {
            "title": "Hindi Voice Recognition",
            "desc": "Speak naturally in Hindi and get instant responses",
            "example": "Gehun mein rog a gaya hai, kya karein?",
            "response": "Wheat disease detected. Apply fungicide spray."
          },
          "f2": {
            "title": "Local Language Support",
            "desc": "Support for regional languages across India"
          },
          "f3": {
            "title": "Audio Responses",
            "desc": "Get detailed audio responses in your preferred language",
            "item1": "Clear pronunciation",
            "item2": "Slow/Fast speed",
            "item3": "Repeat option",
            "item4": "Save audio"
          },
          "f4": {
            "title": "Offline Voice Commands",
            "desc": "Basic voice commands work even without internet",
            "item1": "Weather check",
            "item2": "Crop calendar",
            "item3": "Basic diagnosis",
            "item4": "Emergency help"
          }
        },
        "examples": {
          "sectionTitle": "Real Conversation Examples",
          "solutionPrefix": "Solution",
          "e1": {
            "farmer": "Tomato mein patte peelay ho rahe hain",
            "farmerTrans": "Tomato leaves are turning yellow",
            "ai": "यह नाइट्रोजन की कमी हो सकती है। यूरिया का छिड़काव करें।",
            "aiTrans": "This could be nitrogen deficiency. Apply urea spray.",
            "solution": "Apply 2kg urea per acre with water spray"
          },
          "e2": {
            "farmer": "Kya aaj pani dena chahiye?",
            "farmerTrans": "Should I water today?",
            "ai": "मिट्टी में नमी 40% है। 2 दिन बाद पानी दें।",
            "aiTrans": "Soil moisture is 40%. Water after 2 days.",
            "solution": "Wait 2 days, then apply 25mm irrigation"
          },
          "e3": {
            "farmer": "Fasal kab kaatni chahiye?",
            "farmerTrans": "When should I harvest the crop?",
            "ai": "आपकी गेहूं 15 दिन में तैयार होगी। दाने सुनहरे होने का इंतज़ार करें।",
            "aiTrans": "Your wheat will be ready in 15 days. Wait for golden grains.",
            "solution": "Harvest when moisture content is 12-14%"
          }
        },
        "demo": {
          "sectionTitle": "Try Voice Assistant Live",
          "selectLang": "Select Language / भाषा चुनें",
          "listening": "सुन रहा हूं... / Listening...",
          "pressToSpeak": "बोलने के लिए दबाएं / Press to Speak",
          "processing": "प्रोसेसिंग... / Processing...",
          "youSaid": "आपने कहा / You said:",
          "aiResponse": "🤖 AgriSphere AI का जवाब / Response:",
          "exampleQuestionsTitle": "उदाहरण प्रश्न / Example Questions:",
          "noteTitle": "Note",
          "noteDesc": "Voice recognition requires a modern browser with microphone permissions. Works best in Chrome/Edge.",
          "noteHindiDesc": "नोट: आवाज़ पहचान के लिए आधुनिक ब्राउज़र और माइक्रोफ़ोन की अनुमति चाहिए।"
        },
        "langs": {
          "sectionTitle": "Supported Languages",
          "hindi": "Hindi",
          "english": "English (India)",
          "fullSupport": "Full Support"
        },
        "howItWorks": {
          "sectionTitle": "How Voice Assistant Works",
          "s1": {
            "title": "Speak Question",
            "desc": "Ask in Hindi or local language"
          },
          "s2": {
            "title": "AI Processing",
            "desc": "Voice recognition & understanding"
          },
          "s3": {
            "title": "Generate Response",
            "desc": "AI creates personalized answer"
          },
          "s4": {
            "title": "Audio Reply",
            "desc": "Hear response in your language"
          }
        },
        "benefits": {
          "sectionTitle": "Voice Assistant Benefits",
          "b1": {
            "title": "Easy to Use",
            "desc": "No typing required, just speak"
          },
          "b2": {
            "title": "Rural Friendly",
            "desc": "Works for illiterate farmers"
          },
          "b3": {
            "title": "Instant Help",
            "desc": "Get answers in seconds"
          },
          "b4": {
            "title": "Local Language",
            "desc": "Understand & respond in Hindi"
          }
        },
        "digitalTwin": {
          "title": "Farm Digital Twin",
          "subtitle": "Visualize your farm with GIS, IoT, and AI-driven spatial analysis.",
          "initializing": {
            "status": "Creating your digital farm twin...",
            "mapping": "Mapping field boundaries for",
            "soil": "Analyzing soil zones based on location",
            "irrigation": "Planning irrigation systems for",
            "pests": "Detecting pest-prone areas"
          },
          "capabilities": "Digital Twin Capabilities",
          "features": {
            "gis": {
              "title": "GIS Plot Mapping",
              "desc": "Satellite-based boundary mapping with sub-meter accuracy",
              "f1": "Boundary Detection",
              "f2": "Area Calculation",
              "f3": "Elevation Mapping",
              "f4": "Geo-fencing"
            },
            "soil": {
              "title": "Soil Health Mapping",
              "desc": "Spatial distribution of nutrients and soil types",
              "f1": "NPK Gradients",
              "f2": "pH Variation",
              "f3": "Texture Analysis",
              "f4": "Carbon Seq."
            },
            "irrigation": {
              "title": "Smart Irrigation",
              "desc": "VRT-based irrigation planning and moisture tracking",
              "f1": "Hydraulic Zones",
              "f2": "Moisture Flux",
              "f3": "Drip Planning",
              "f4": "Runoff Predict."
            }
          },
          "insights": {
            "pestRisk": "Pest Risk Areas",
            "growthStages": "Crop Growth Stages",
            "health": "Health",
            "risk": "risk",
            "mappedZones": "Mapped zones",
            "activeZones": "Active zones",
            "avgHealth": "Average %"
          },
          "areaNote": "acres"
        },
        "farmerDashboard": {
          "title": "Smart Farmer Dashboard",
          "subtitle": "Your centralized hub for AI operations and farm management.",
          "metrics": {
            "models": "AI Models",
            "activeModels": "active models",
            "area": "Mapped Area",
            "hectares": "hectares",
            "detections": "Detections",
            "types": "distinct types",
            "accuracy": "Avg. Accuracy"
          },
          "tabs": {
            "overview": "Overview",
            "disease": "Disease AI",
            "twin": "Digital Twin",
            "yield": "Yield Predict",
            "pest": "Pest Forecast",
            "marketplace": "Marketplace"
          }
        }
      },
      "gov": {
        "title": "Ministry of Agriculture Dashboard",
        "subtitle": "National Command & Control Centre",
        "operational": "System Operational",
        "genReport": "Generate Report",
        "stats": {
          "regFarmers": "Registered Farmers",
          "activeAlerts": "Active Alerts",
          "cropLossCases": "Crop Loss Cases",
          "estDisbursement": "Est. Disbursement"
        },
        "tabs": {
          "overview": "Overview & Analytics",
          "cropLoss": "Crop Loss Compensation",
          "market": "Market Intelligence"
        },
        "charts": {
          "diseaseTrend": "Disease Detection Trend",
          "communityIssues": "Community Issues",
          "prices": "State-wise Avg Prices",
          "listings": "Live Listings Overview"
        },
        "cases": {
          "title": "Compensation Case Management",
          "search": "Search case ID...",
          "noCases": "No active cases found.",
          "eligible": "Eligible",
          "reviewRequired": "Review Required",
          "verify": "Verify",
          "reject": "Reject",
          "approve": "Approve",
          "status": {
            "approved": "Approved",
            "rejected": "Rejected",
            "underVerification": "Under Verification",
            "pending": "Approval Pending"
          }
        },
        "report": {
          "generated": "Report Generated",
          "downloaded": "The report has been downloaded to your device.",
          "totalVolume": "Total Volume Traded"
        },
        "caseActions": {
          "approved": "Case Approved",
          "rejected": "Case Rejected",
          "verified": "Verification Requested",
          "updated": "Case {{id}} has been updated.",
          "errorUpdate": "Failed to update case status",
          "errorFetch": "Failed to fetch government dashboard data"
        },
        "labels": {
          "replies": "Replies",
          "loss": "Loss",
          "cause": "Cause",
          "damage": "Damage",
          "estLoss": "Est. Loss",
          "scheme": "Scheme"
        }
      },
      "buyer": {
        "title": "Verified Buyer Dashboard",
        "welcome": "Welcome, {{name}}",
        "subtitle": "Sourcing fresh produce directly from farmers.",
        "panIndia": "Pan India",
        "postDemand": "Post Demand",
        "tabs": {
          "listings": "Listing Feed",
          "intelligence": "Market Intelligence",
          "deals": "My Deals"
        },
        "filters": {
          "search": "Search wheat, rice, Punjab...",
          "allCrops": "All Crops",
          "allStates": "All States"
        },
        "card": {
          "quantity": "Quantity",
          "price": "Price",
          "farmer": "Farmer",
          "harvest": "Harvest",
          "callFarmer": "Call Farmer",
          "grade": "Grade"
        },
        "intelligence": {
          "title": "Market Demand Analysis",
          "scope": "Market Scope",
          "config": "Configure AI analysis target",
          "forecast": "Trend Forecast",
          "demand": "Demand Level",
          "vsMsp": "Vs MSP",
          "avgPrice": "Avg. Market Price",
          "genBtn": "Generate AI Insights",
          "analyzing": "Analyzing...",
          "strategicAnalysis": "AI Strategic Analysis",
          "mspComparison": "MSP vs Market Price",
          "brief": "Intelligence Brief"
        },
        "contact": {
          "title": "Contact Farmer",
          "desc": "Connect with {{name}} directly.",
          "phone": "Phone Number",
          "whatsapp": "WhatsApp",
          "call": "Call Now",
          "close": "Close"
        },
        "demand": {
          "title": "Post Buying Requirement",
          "desc": "Farmers matching these criteria will be alerted.",
          "crop": "Target Crop",
          "quantity": "Quantity (Quintals)",
          "price": "Target Price/Qtl",
          "location": "Preferred Location (Optional)",
          "postBtn": "Post Demand",
          "cancel": "Cancel"
        },
        "contactFarmer": "Contact Farmer",
        "saveListing": "Save for later",
        "errorInsights": "Failed to fetch market insights",
        "loginRequired": "Login Required",
        "loginRequiredDesc": "Please login as a buyer to contact farmers.",
        "fillFields": "Please fill in required fields.",
        "errorPostDemand": "Failed to post demand.",
        "recordedNote": "Interactions are recorded in your 'My Deals' tab.",
        "trader": "Trader",
        "loading": "Loading live marketplace...",
        "noListings": "No listings found matching your criteria.",
        "gradeA": "Grade A",
        "ready": "Ready",
        "targetCrop": "Target Crop",
        "targetState": "Target State",
        "unknown": "Unknown",
        "noDeals": "No active deals yet.",
        "dealLabel": "{{crop}} Deal",
        "withLabel": "with {{name}}",
        "toast": {
          "saved": "Listing saved for later",
          "unsaved": "Listing removed from saved"
        }
      },
      "cropLoss": {
        "title": "Crop Loss Compensation Claim",
        "subtitle": "Government of India - Ministry of Agriculture",
        "sections": {
          "farmer": "Farmer Details",
          "crop": "Crop Details",
          "loss": "Loss Details",
          "evidence": "Evidence Upload",
          "compliance": "Advisory Compliance",
          "declaration": "Final Declaration"
        },
        "fields": {
          "name": "Farmer Name",
          "mobile": "Mobile Number",
          "state": "State",
          "district": "District",
          "village": "Village",
          "area": "Total Farm Area (Acres)",
          "insurance": "PMFBY Insurance Status",
          "cropName": "Crop Name",
          "season": "Season",
          "sowingDate": "Sowing Date",
          "harvestDate": "Expected Harvest Date",
          "affectedArea": "Affected Area (Acres)",
          "cause": "Cause of Loss",
          "damageDate": "Date Damage Observed",
          "damagePercent": "Estimated Damage Percentage (%)",
          "minDamageNote": "Minimum 33% required",
          "complianceFert": "Applied fertilizers as recommended",
          "complianceIrri": "Followed irrigation schedule",
          "compliancePest": "Reported pests early via tool"
        },
        "placeholders": {
          "name": "Full Name",
          "mobile": "+91...",
          "insurance": "Select Status",
          "insYes": "Enrolled (Yes)",
          "insNo": "Not Enrolled",
          "selectCrop": "Select Crop",
          "selectCause": "Select Cause",
          "village": "Village Name"
        },
        "seasons": {
          "kharif": "Kharif",
          "rabi": "Rabi",
          "zaid": "Zaid"
        },
        "advisory": {
          "title": "Confirm your adherence to AgriSphere advisories. This impacts claim approval.",
          "verifiedNote": "Will be verified against AI usage logs."
        },
        "causes": {
          "flood": "Flood / Heavy Rain",
          "drought": "Drought",
          "pest": "Pest Attack",
          "disease": "Crop Disease",
          "hailstorm": "Hailstorm",
          "heatwave": "Heatwave"
        },
        "ai": {
          "title": "AI Assistant Tips",
          "uploadPhotos": "Please upload photos of affected leaves/stems for AI verification.",
          "specifyPest": "Mention specific pest name if known (e.g., Pink Bollworm).",
          "gpsEnable": "Ensure GPS location is enabled while taking photos."
        },
        "evidence": {
          "uploadBtn": "Click to upload photos/video",
          "note": "Upload at least 2 photos (Close-up & Wide angle). GPS metadata will be extracted."
        },
        "declaration": {
          "check": "I hereby declare that the information provided above is true.",
          "note": "I understand that any false claim will lead to rejection and legal action."
        },
        "submitBtn": "Submit Claim",
        "success": "Claim submitted successfully!",
        "error": "Failed to submit claim. Please try again.",
        "agreeError": "You must agree to the declaration."
      },
      "farmerDashboard": {
        "title": "Comprehensive AI Agriculture Dashboard",
        "subtitle": "Advanced AI-powered agriculture management system combining disease detection, GIS digital twin, and yield prediction for precision farming.",
        "tabs": {
          "overview": "Overview",
          "disease": "AI Disease Detection",
          "twin": "GIS Digital Twin",
          "yield": "Yield Prediction",
          "pest": "Pest Forecast",
          "marketplace": "Marketplace"
        },
        "metrics": {
          "models": "AI Models",
          "area": "Farm Area",
          "detections": "Detection Classes",
          "accuracy": "Accuracy",
          "activeModels": "Active Models",
          "hectares": "Hectares",
          "types": "Disease/Pest Types",
          "precision": "AI Precision"
        },
        "status": {
          "active": "Active",
          "live": "Live",
          "types": "Types"
        },
        "yield": {
          "title": "Crop Yield Predictions (2025)",
          "perHectare": "per hectare",
          "advancedTitle": "Advanced AI Yield Prediction",
          "modelPerformance": "ML Model Performance"
        },
        "twin": {
          "title": "GIS-Based Smart Farm Digital Twin",
          "activeZones": "Active Zones",
          "monitored": "Monitored",
          "average": "Average",
          "spatialFeatures": "Spatial Analysis Features",
          "precisionBenefits": "Precision Agriculture Benefits"
        }
      },
      "seeds": {
        "title": "স্মাৰ্ট বীজ",
        "titleProcurement": "সংগ্ৰহ",
        "heroBadge": "ব্লকচেইন স্মাৰ্ট সংগ্ৰহ প্ৰণালী (বিটা)",
        "heroDescription": "আমি কেৱল বীজৰ পৰামৰ্শ নিদিওঁ—আমি আপোনাক মূল্য বুদ্ধিমত্তা আৰু ৰিয়েল-টাইম প্ৰৱেশযোগ্যতাৰ সৈতে সত্যাপন কৰা ওচৰৰ যোগানধৰোতাৰ সৈতে সংযোগ কৰো।",
        "verifySeedNet": "SeedNetত পৰীক্ষা কৰক",
        "locateShops": "দোকান বিচাৰক",
        "searchPlaceholder": "বীজ বা দোকানৰ বাবে অনুসন্ধান কৰক...",
        "all": "সকলো",
        "govtSubsidized": "চৰকাৰী ৰাজসাহায্য",
        "private": "ব্যক্তিগত",
        "inStock": "ষ্টকত আছে",
        "outOfStock": "ষ্টকত নাই",
        "subsidyAvailable": "ৰাজসাহায্য উপলব্ধ",
        "call": "কল কৰক",
        "docsNeeded": "নথিৰ প্ৰয়োজন",
        "requiredDocs": "প্ৰয়োজনীয় নথিপত্ৰ",
        "carryDocs": "ৰাজসাহায্য লাভ কৰিবলৈ অনুগ্ৰহ কৰি এই নথিপত্ৰসমূহ {{shopName}}লৈ লৈ যাওক।",
        "advisorTitle": "AI বীজ উপদেষ্টা",
        "advisorDesc": "আপোনাৰ বতৰ আৰু শস্যৰ ওপৰত আধাৰিত কৰি ব্যক্তিগতকৃত বীজৰ পৰামৰ্শ লাভ কৰক।",
        "selectSeason": "বতৰ বাছনি কৰক",
        "seasonRabi": "ৰবি",
        "seasonKharif": "খাৰিফ",
        "aiTip": "AIয়ে এই ৰেংকিংৰ বাবে আপোনাৰ বৰ্তমানৰ মাটিৰ গঠন আৰু সূক্ষ্ম জলবায়ু বিবেচনা কৰে।",
        "selectSeasonPrompt": "AI পৰামৰ্শ চাবলৈ এটা বতৰ বাছনি কৰক",
        "checkAvailability": "উপলভ্যতা পৰীক্ষা কৰক",
        "tags": {
          "lowestPrice": "সৰ্বনিম্ন মূল্য",
          "nearest": "ওচৰৰ",
          "blockchainVerified": "ব্লকচেইন সত্যাপিত"
        },
        "currentPrice": "বৰ্তমানৰ মূল্য",
        "marketRate": "বজাৰ দৰ",
        "rating": "ৰেটিং",
        "viewRoute": "ৰাস্তা চাওক",
        "checkWithStore": "দোকানত পৰীক্ষা কৰক",
        "unit": {
          "km": "কিমি"
        },
        "tabs": {
          "findShops": "দোকান বিচাৰক",
          "advisor": "বীজ উপদেষ্টা"
        },
        "toasts": {
          "locating": "আপোনাৰ অৱস্থিতি বিচাৰি থকা হৈছে...",
          "locatingDesc": "ওচৰৰ দোকানৰ বাবে আপোনাৰ GPS স্থানাংক সংগ্ৰহ কৰি থকা হৈছে।",
          "found": "স্থান পোৱা গৈছে",
          "foundDesc": "{{city}}, {{state}}ৰ ওচৰৰ সত্যাপিত বীজ যোগানধৰোতা দেখুওৱা হৈছে।",
          "errorLoc": "ওচৰৰ দোকান বিচাৰি পোৱাত ব্যৰ্থ।",
          "permDenied": "জিঅ’লকেচন অস্বীকাৰ কৰা হৈছে",
          "permDeniedDesc": "ওচৰৰ দোকান বিচাৰিবলৈ অনুগ্ৰহ কৰি স্থান সক্ষম কৰক।"
        }
      },
      "trace": {
        "title": "Web3 ট্ৰেছেবিলিটি",
        "subtitle": "স্মাৰ্ট কনট্ৰেক্টৰ দ্বাৰা পৰিচালিত এণ্ড-টু-এণ্ড শস্য ট্ৰেকিং।",
        "connectBtn": "ৱালেট সংযোগ কৰক",
        "connected": "সংযোগ কৰা হৈছে: {{account}}",
        "walletConnected": "ৱালেট সংযোগ কৰা হৈছে",
        "simulatedWallet": "চিমুলেটেড ৱালেট সংযোগ কৰা হৈছে",
        "simulatedWalletDesc": "কোনো Web3 প্ৰদানকাৰী পোৱা নগ’ল। ডেম’ একাউণ্ট ব্যৱহাৰ কৰা হৈছে।",
        "connectionFailed": "সংযোগ ব্যৰ্থ হৈছে",
        "trackTab": "শস্য ট্ৰেক কৰক",
        "registerTab": "বেচ পঞ্জীয়ন কৰক",
        "searchHint": "বেচ আইডি দিয়ক (যেনে BATCH-7241) বা কিউআৰ স্কেন কৰক",
        "traceBtn": "ডেটা ট্ৰেক কৰক",
        "recordFound": "ৰেকৰ্ড পোৱা গৈছে",
        "recordFoundDesc": "Web3 ৰেকৰ্ড সফলতাৰে উদ্ধাৰ কৰা হৈছে।",
        "recordNotFound": "ৰেকৰ্ড পোৱা নগ’ল",
        "recordNotFoundDesc": "বেচ আইডি {{id}} লেজাৰত নাই।",
        "verifiedBatchTrace": "সত্যাপিত বেচ ট্ৰেচ",
        "authentic": "প্ৰামাণিক",
        "signedBy": "দ্বাৰা স্বাক্ষৰিত:",
        "queryHint": "ব্লকচেইন কুৱেৰী কৰিবলৈ বেচ আইডি দিয়ক।",
        "ledgerInfo": "ডেটা Web3 অপৰিৱৰ্তনীয় লেজাৰৰ জৰিয়তে সত্যাপন কৰা হৈছে।",
        "mintTitle": "নতুন শস্যৰ ৰেকৰ্ড সৃষ্টি কৰক",
        "mintDesc": "ব্লকচেইনত আপোনাৰ শস্য ৰেকৰ্ড কৰক। এবাৰ জমা দিয়াৰ পিছত ইয়াক সলনি কৰিব নোৱাৰি।",
        "batchIdLabel": "সৃষ্টি কৰা বেচ আইডি",
        "cropLabel": "শস্যৰ প্ৰকাৰ",
        "cropPlaceholder": "যেনে বাচমতী চাউল, জৈৱিক আপেল",
        "originLabel": "উৎপত্তিৰ স্থান",
        "originPlaceholder": "ফাৰ্মৰ ঠিকনা বা GPS স্থানাংক",
        "qualityLabel": "গুণমান / প্ৰমাণপত্ৰ",
        "signingNotice": "এই লেনদেনটো জমা দি আপুনি এটা স্বাক্ষৰ কৰিছে। আপুনি ৱালেটত নিশ্চিত কৰিব লাগিব।",
        "mintingBtn": "ব্লকচেইনত সৃষ্টি কৰি থকা হৈছে...",
        "signRegisterBtn": "চাইন আৰু পঞ্জীয়ন কৰক",
        "mintSuccess": "সৃষ্টি সফল হৈছে",
        "mintSuccessDesc": "বেচ {{id}} স্থায়ীভাৱে ব্লকচেইনত পঞ্জীয়ন কৰা হৈছে।"
      }
    }
  },
  "kn": {
    "translation": {
      "nav": {
        "home": "ಮುಖಪುಟ",
        "marketplace": "ಮಾರುಕಟ್ಟೆ",
        "communityForum": "ರೈತ ಸಮುದಾಯ",
        "advisoryHub": "ಸಲಹಾ ಕೇಂದ್ರ",
        "voiceAssistant": "ಧ್ವನಿ ಸಹಾಯಕ",
        "fertilizerAi": "ಗೊಬ್ಬರ ಎಐ",
        "pestForecast": "ಕೀಟ ಮುನ್ಸೂಚನೆ",
        "adminDashboard": "ಆಡಳಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "buyerDashboard": "ಖರೀದಿದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "farmerDashboard": "ರೈತರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "diseaseDetection": "ರೋಗ ಪತ್ತೆ",
        "yieldPrediction": "ಇಳುವರಿ ಮುನ್ಸೂಚನೆ",
        "digitalTwin": "ಡಿಜಿಟಲ್ ಟ್ವಿನ್",
        "login": "ಲಾಗಿನ್",
        "getStarted": "ಪ್ರಾರಂಭಿಸಿ",
        "logout": "Logout",
        "saveProfile": "Save Profile",
        "aiTools": "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಉಪಕರಣಗಳು",
        "seedFinder": "ಬೀಜ ಹುಡುಕುವವನು",
        "traceability": "Web3 ಟ್ರೇಸಿಬಿಲಿಟಿ"
      },
      "home": {
        "heroTitle1": "ಭಾರತದ ಮೊದಲ",
        "heroTitle2": "AI + GIS ಸ್ಮಾರ್ಟ್ ಕೃಷಿ",
        "heroSubtitle": "ಇಂಟೆಲಿಜೆನ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
        "heroDescription": "ಕೀಟಗಳು, ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ ಮತ್ತು ಶಿಲೀಂಧ್ರ ಸೋಂಕುಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ. ಇಳುವರಿಯನ್ನು 30% ಹೆಚ್ಚಿಸಿ, ವೆಚ್ಚವನ್ನು 40% ಕಡಿಮೆ ಮಾಡಿ.",
        "exploreFeatures": "ಡೆಮೋ ವೀಕ್ಷಿಸಿ",
        "floatingAlert": "ಹವಾಮಾನ ಅಪಾಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
        "featuresTitle": "ಆಧುನಿಕ ಕೃಷಿಗಾಗಿ",
        "featuresSubtitle": "ಬುದ್ಧಿವಂತ ವೈಶಿಷ್ಟ್ಯಗಳು",
        "featuresDesc": "ನಿಮ್ಮ ಕೃಷಿಯನ್ನು ಕ್ರಾಂತಿಗೊಳಿಸುವ ತಂತ್ರಜ್ಞಾನ",
        "aboutTitle": "AgriSphere AI ಭಾರತದ ಮೊದಲ AI + GIS ಕೃಷಿ ವೇದಿಕೆಯಾಗಿದೆ.",
        "aboutDesc": "ರೋಗ ಪತ್ತೆ, ಇಳುವರಿ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.",
        "howItWorks": "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
        "howItWorksSubtitle": "4 ಸುಲಭ ಹಂತಗಳಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿ",
        "ctaTitle": "ನಿಮ್ಮ ಕೃಷಿ ವ್ಯವಹಾರವನ್ನು ಬದಲಾಯಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
        "ctaSubtitle": "ಇಂದು ಸೇರಿಕೊಳ್ಳಿ!",
        "ctaDesc": "AgriSphere AI ಅನ್ನು ಬಳಸಿ ಲಾಭ ಪಡೆಯಿರಿ.",
        "ctaFreeTrial": "ಉಚಿತ ಪ್ರಯೋಗ ಪ್ರಾರಂಭಿಸಿ",
        "ctaDemo": "ಡೆಮೊ ವೀಕ್ಷಿಸಿ",
        "features": {
          "f1": {
            "title": "AI Disease Detection",
            "desc": "Advanced ML models analyze images to detect diseases & pests with 95% accuracy",
            "b1": "Pest Detection",
            "b2": "Nutrient Deficiency",
            "b3": "Fungal Infections",
            "b4": "Soil Texture Analysis"
          },
          "f2": {
            "title": "GIS Digital Twin",
            "desc": "Complete farm replica with mapping & growth tracking",
            "b1": "Field Boundaries",
            "b2": "Soil Zones",
            "b3": "Irrigation Zones",
            "b4": "Growth Stages"
          },
          "f3": {
            "title": "Yield Prediction",
            "desc": "ML-powered yields forecasting using weather & soil data",
            "b1": "Weather Analysis",
            "b2": "Soil Type Mapping",
            "b3": "Historical Data",
            "b4": "ML Forecasting"
          },
          "f4": {
            "title": "Weather Risk Engine",
            "desc": "Real-time alerts for floods, drought, and heatwaves",
            "b1": "Flood Alerts",
            "b2": "Drought Warning",
            "b3": "Heatwave Detection",
            "b4": "SMS Alerts"
          },
          "f5": {
            "title": "Fertilizer & Irrigation AI",
            "desc": "Smart NPK & water scheduling for optimal nutrition",
            "b1": "NPK Analysis",
            "b2": "Water Prediction",
            "b3": "Smart Scheduling",
            "b4": "Nutrition Optimization"
          }
        },
        "stats": {
          "activeFarmers": "ಸಕ್ರಿಯ ರೈತರು",
          "accuracyRate": "ನಿಖರತೆ",
          "fieldsMapped": "ಕ್ಷೇತ್ರಗಳ ಮ್ಯಾಪಿಂಗ್",
          "yieldIncrease": "ಇಳುವರಿ ಹೆಚ್ಚಳ"
        },
        "advanced": {
          "title": "Advanced AI Intelligence",
          "desc": "Cutting-edge features that set AgriSphere AI apart",
          "pests": {
            "title": "Pest Attack Prediction",
            "desc": "AI forecasts pest attack probability (0-100%) for next 7 days",
            "b1": "Climate Analysis",
            "b2": "7-Day Risk Forecast",
            "b3": "Prevention Alerts",
            "b4": "Treatment Recommendations"
          },
          "seedToMarket": {
            "title": "Seed-to-Market Advisory",
            "desc": "Complete guidance from seed selection to market pricing",
            "b1": "Seed Selection",
            "b2": "Sowing Time",
            "b3": "Harvest Prediction",
            "b4": "Market Pricing"
          },
          "voice": {
            "title": "Voice Assistant (Hindi)",
            "desc": "Farmers speak in local language, AI responds with advice",
            "b1": "Hindi Support",
            "b2": "Voice Recognition",
            "b3": "Local Languages",
            "b4": "Audio Responses"
          },
          "schemes": {
            "title": "Government Schemes AI",
            "desc": "Auto-identifies subsidies, loans, and PM-KISAN benefits",
            "b1": "Subsidy Matching",
            "b2": "Loan Eligibility",
            "b3": "Insurance Plans",
            "b4": "PM-KISAN"
          },
          "marketplace": {
            "title": "Farmer-Buyer Marketplace",
            "desc": "Direct selling platform with AI pricing and logistics",
            "b1": "Direct Selling",
            "b2": "AI Pricing",
            "b3": "Logistics",
            "b4": "Income Boost"
          },
          "blockchain": {
            "title": "Blockchain Traceability",
            "desc": "Track crop origin and supply chain for quality assurance",
            "b1": "Origin Tracking",
            "b2": "Supply Chain",
            "b3": "Authenticity",
            "b4": "Quality Assurance"
          }
        },
        "rural": {
          "title": "ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
          "subtitle": "ಗ್ರಾಮದ ರೈತರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ"
        },
        "women": {
          "title": "ಗ್ರಾಮೀಣ ಮಹಿಳಾ ಕೃಷಿ ಉದ್ಯಮಿ",
          "subtitle": "ಮಹಿಳೆಯರ ವ್ಯವಹಾರಗಳ ಸಬಲೀಕರಣ"
        },
        "testimonials": {
          "title": "What Farmers Say",
          "subtitle": "Real stories from farmers transforming their operations",
          "t1": {
            "name": "Rajesh Kumar",
            "loc": "Punjab, India",
            "text": "AgriSphere's multi-class AI detected stem borer in my wheat early. The pest prediction saved my entire 10-acre crop and increased yield by 35%!",
            "benefit": "35% yield increase"
          },
          "t2": {
            "name": "Anita Sharma",
            "loc": "Maharashtra, India",
            "text": "The GIS digital twin mapped my field perfectly. AI-powered management cut water usage by 45%. Marketplace got me ₹2000/quintal extra!",
            "benefit": "45% water savings"
          },
          "t3": {
            "name": "Vikram Patel",
            "loc": "Gujarat, India",
            "text": "Voice assistant in Hindi is amazing! 'Tamatar mein rog hai' - instantly got disease type, treatment cost. Offline mode works perfectly in my village.",
            "benefit": "Hindi voice support"
          }
        },
        "tech": {
          "title": "Built on Cutting-Edge Technology",
          "subtitle": "Enterprise-grade tech stack powering your farm",
          "t1": "Yield prediction",
          "t2": "Time series analysis",
          "t3": "Advanced regression",
          "t4": "Digital twin mapping",
          "t5": "Disease detection",
          "t6": "Supply traceability",
          "t7": "Hindi commands",
          "t8": "Village accessibility",
          "t9": "Alert fallback",
          "t10": "Instant notifications",
          "t11": "Data security"
        },
        "learnMore": "Learn more",
        "footer": {
          "tagline": "Empowering farmers with AI and GIS technology for sustainable, profitable agriculture.",
          "col1": "Features",
          "col2": "Platform",
          "col3": "Support",
          "iot": "IoT Monitoring",
          "weather": "Weather Alerts",
          "community": "Community",
          "help": "Help Center",
          "docs": "Documentation",
          "api": "API Guide",
          "contact": "Contact",
          "copyright": "© 2025 AgriSphere AI. All rights reserved."
        },
        "heroBadge": "AI-Powered Smart Agriculture"
      },
      "disease": {
        "title": "AI ಬೆಳೆ ರೋಗ ಪತ್ತೆ",
        "backHome": "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
        "desc": "ಉನ್ನತ ಮಟ್ಟದ AI ವ್ಯವಸ್ಥೆಯನ್ನು ಬಳಸಿಕೊಂಡು ಎಲೆ, ಕಾಂಡ, ಹಣ್ಣು ಮತ್ತು ಮಣ್ಣಿನ ಚಿತ್ರಗಳಿಂದ ರೋಗಗಳು, ಕೀಟಗಳು, ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ಕೊರತೆಗಳನ್ನು 95%+ ನಿಖರತೆಯೊಂದಿಗೆ ಪತ್ತೆಹಚ್ಚಿ.",
        "startBtn": "ಪತ್ತೆಹಚ್ಚುವಿಕೆ ಪ್ರಾರಂಭಿಸಿ",
        "uploadBtn": "ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        "saveBtn": "ಉಳಿಸಿದ ವರದಿಗಳು",
        "hideBtn": "ಮರೆಮಾಡಿ",
        "reportsTitle": "ಆಫ್‌ಲೈನ್ ರೋಗ ವರದಿಗಳು",
        "noReports": "ಯಾವುದೇ ವರದಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
        "capTitle": "ಮಲ್ಟಿ-ಕ್ಲಾಸ್ ಪತ್ತೆ ಸಾಮರ್ಥ್ಯಗಳು",
        "pestTitle": "ಕೀಟ ಪತ್ತೆ ಮತ್ತು ಚಿಕಿತ್ಸೆ",
        "aiTitle": "ಹೆಚ್ಚಿದ AI ಪತ್ತೆ",
        "howTitle": "ನಾವು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತೇವೆ",
        "accuracy": "ನಿಖರತೆ",
        "types": {
          "leaf": {
            "title": "ಎಲೆ ರೋಗ ಪತ್ತೆ",
            "desc": "ಶಿಲೀಂಧ್ರ ಮತ್ತು ವೈರಲ್ ಸೋಂಕುಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
            "d1": "ರೋಗ",
            "d2": "ತುಕ್ಕು",
            "d3": "ವೈರಸ್",
            "d4": "ಬ್ಯಾಕ್ಟೀರಿಯಾ"
          },
          "stem": {
            "title": "ಕಾಂಡದ ವಿಶ್ಲೇಷಣೆ",
            "desc": "ಕಾಂಡದ ಕೊಳೆತ ಮತ್ತು ಹಾನಿಯನ್ನು ಪತ್ತೆಹಚ್ಚಿ",
            "d1": "ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು",
            "d2": "ಕೊಳೆತ",
            "d3": "ಹಾನಿ",
            "d4": "ಒಣಗುವಿಕೆ"
          },
          "fruit": {
            "title": "ಹಣ್ಣಿನ ತಪಾಸಣೆ",
            "desc": "ಹಣ್ಣಿನ ರೋಗಗಳು ಮತ್ತು ಕೀಟಗಳ ಹಾನಿ ಗುರುತಿಸಿ",
            "d1": "ಕೊಳೆತ ಹಣ್ಣು",
            "d2": "ಕೀಟ ಹಾನಿ",
            "d3": "ಬಿರುಕು",
            "d4": "ಬಣ್ಣ ಬದಲಾವಣೆ"
          },
          "soil": {
            "title": "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
            "desc": "ಮಣ್ಣಿನ ರಚನೆ ಮತ್ತು ಪೋಷಕಾಂಶ ಕೊರತೆ",
            "d1": "ಪೋಷಕಾಂಶ ಕೊರತೆ",
            "d2": "pH ಅಸಮತೋಲನ",
            "d3": "ಲವಣಾಂಶ",
            "d4": "ಒತ್ತಡ"
          }
        },
        "pests": {
          "p1": {
            "name": "Aphids",
            "damage": "Sap sucking",
            "treatment": "Neem oil spray"
          },
          "p2": {
            "name": "Thrips",
            "damage": "Leaf damage",
            "treatment": "Blue sticky traps"
          },
          "p3": {
            "name": "Whitefly",
            "damage": "Virus transmission",
            "treatment": "Yellow traps"
          },
          "p4": {
            "name": "Caterpillars",
            "damage": "Leaf eating",
            "treatment": "Bt spray"
          }
        },
        "how": {
          "s1": {
            "title": "ಚಿತ್ರ ಸೆರೆಹಿಡಿಯಿರಿ",
            "desc": "ಸಸ್ಯದ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ"
          },
          "s2": {
            "title": "AI ವಿಶ್ಲೇಷಣೆ",
            "desc": "ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ"
          },
          "s3": {
            "title": "ವರ್ಗೀಕರಣ",
            "desc": "ರೋಗದ ಫಲಿತಾಂಶಗಳು"
          },
          "s4": {
            "title": "ಚಿಕಿತ್ಸಾ ಯೋಜನೆ",
            "desc": "ಶಿಫಾರಸುಗಳು"
          }
        },
        "stats": {
          "disease": "ರೋಗದ ಚಟುವಟಿಕೆ",
          "diseaseDesc": "ಹವಾಮಾನ ಆಧಾರಿತ",
          "pest": "ಕೀಟಗಳು",
          "pests": "ಕೀಟಗಳ ಒತ್ತಡ",
          "pestDesc": "7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
          "soil": "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
          "soilDesc": "ಇತ್ತೀಚಿನ ತಪಾಸಣೆಗಳು"
        },
        "score": "ಸ್ಕೋರ್",
        "issues": "ಸಮಸ್ಯೆಗಳು",
        "diseasesCount": "ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ರೋಗಗಳು",
        "pestsCount": "ಸಕ್ರಿಯ ಕೀಟ ಬೆದರಿಕೆಗಳು",
        "viewSummary": "ಸಾರಾಂಶ ವೀಕ್ಷಿಸಿ"
      },
      "marketplace": {
        "title": "ಸ್ಮಾರ್ಟ್ ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಸಲಹೆ",
        "subtitle": "AI ಆಧರಿತ ಬೆಳೆ ಸಲಹೆ ಪಡೆಯಿರಿ ಮತ್ತು ಸ್ಥಳೀಯ ಖರೀದಿದಾರರು/ಮಾರಾಟಗಾರರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.",
        "tabs": {
          "advisory": "ಸಲಹೆ",
          "listings": "ಪಟ್ಟಿಗಳು",
          "trends": "ಟ್ರೆಂಡ್ಸ್",
          "demands": "ಖರೀದಿದಾರರ ಬೇಡಿಕೆಗಳು"
        },
        "demands": {
          "title": "ಪ್ರಸ್ತುತ ಖರೀದಿದಾರರ ಬೇಡಿಕೆಗಳು",
          "noDemands": "ಯಾವುದೇ ಬೇಡಿಕೆಗಳಿಲ್ಲ.",
          "verified": "ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರ",
          "targetPrice": "ಗಮ್ಯ ಬೆಲೆ",
          "contactBtn": "ಸಂಪರ್ಕಿಸಿ"
        },
        "advisory": {
          "title": "AgriSphere ಸ್ಮಾರ್ಟ್ ಸಲಹೆ",
          "desc": "ವೈಯಕ್ತಿಕ AI ಸಲಹೆ.",
          "selectCrop": "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
          "chooseCrop": "ಆಯ್ಕೆಮಾಡಿ...",
          "state": "ರಾಜ್ಯ",
          "selectState": "ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ",
          "sowingDate": "ಬಿತ್ತನೆ ದಿನಾಂಕ",
          "pickDate": "ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ",
          "fieldSize": "ಕ್ಷೇತ್ರದ ಗಾತ್ರ",
          "analyzeBtn": "AI ವರದಿ ರಚಿಸಿ",
          "analyzing": "ರಚಿಸಲಾಗುತ್ತಿದೆ...",
          "missingInfo": "ಮಾಹಿತಿ ಕಾಣೆಯಾಗಿದೆ",
          "selectPrompt": "ದಯವಿಟ್ಟು ಬಿತ್ತನೆ ದಿನಾಂಕ, ರಾಜ್ಯ ಮತ್ತು ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ.",
          "readyTitle": "ಕೃಷಿ ಸಲಹಾ ವರದಿ:"
        },
        "trends": {
          "title": "AI ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು",
          "livePrices": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
          "forecast": "ಬೆಲೆ ಮುನ್ಸೂಚನೆ",
          "fetched": "ದರಗಳನ್ನು ಪಡೆಯಲಾಗಿದೆ.",
          "fetchError": "ವಿಫಲವಾಗಿದೆ.",
          "detailsMissing": "ಸ್ಥಳ ಕಾಣೆಯಾಗಿದೆ",
          "enterStateDistrict": "ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ನಮೂದಿಸಿ.",
          "findMandiRates": "ಇಂದಿನ ಮಂಡಿ ದರಗಳನ್ನು ಹುಡುಕಿ",
          "selectState": "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
          "enterDistrict": "ಜಿಲ್ಲೆಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
          "typeDistrict": "ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...",
          "category": "ವರ್ಗ",
          "checkRates": "ದರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
          "forecastTitle": "7 ದಿನಗಳ ಬೆಲೆ ಮುನ್ಸೂಚನೆ",
          "noRates": "ಯಾವುದೇ ಡೇಟಾ ಕಂಡುಬಂದಿಲ್ಲ.",
          "low": "ಕಡಿಮೆ",
          "medium": "ಮಧ್ಯಮ",
          "high": "ಹೆಚ್ಚು"
        },
        "listings": {
          "filters": "ಮಾರುಕಟ್ಟೆ ಫಿಲ್ಟರ್‌ಗಳು",
          "search": "ಹುಡುಕಿ...",
          "contactFarmer": "ರೈತರನ್ನು ಸಂಪರ್ಕಿಸಿ",
          "noListings": "ಯಾವುದೇ ಪಟ್ಟಿಗಳಿಲ್ಲ.",
          "form": {
            "postTitle": "ಬೆಳೆಯನ್ನು ಮಾರಿ",
            "postSubtitle": "ಉಚಿತ ಪಟ್ಟಿಯನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ.",
            "name": "ಹೆಸರು",
            "contact": "ಫೋನ್ ಸಂಖ್ಯೆ",
            "crop": "ಬೆಳೆ",
            "qty": "ಪ್ರಮಾಣ",
            "price": "ಬೆಲೆ",
            "selectState": "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
            "submit": "ಪೋಸ್ಟ್ ಮಾಡಿ"
          },
          "fillAllFields": "ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿಮಾಡಿ.",
          "listingPosted": "ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿದೆ!"
        },
        "alerts": {
          "seasonality": "Seasonality Warning"
        },
        "states": {
          "bihar": "Bihar",
          "uttarPradesh": "Uttar Pradesh",
          "punjab": "Punjab",
          "haryana": "Haryana",
          "madhyaPradesh": "Madhya Pradesh"
        },
        "langEn": "English",
        "langHi": "Hindi",
        "langBn": "Bengali",
        "langAs": "Assamese",
        "langKn": "Kannada"
      },
      "advisoryHub": {
        "title": "AgriSphere Advisory Hub",
        "subtitle": "Real-time schemes, news, and expert videos for smart farming.",
        "tabs": {
          "schemes": "Schemes & Subsidies",
          "calculator": "Fertilizer Calculator",
          "news": "Farming News",
          "videos": "Video Tutorials"
        },
        "refresh": "Refresh Content",
        "eligibility": {
          "title": "Check Eligibility",
          "desc": "Update your profile to see relevant government schemes.",
          "state": "State",
          "landSize": "Land Size (Acres)",
          "farmerType": "Farmer Type",
          "profileUpdated": "Profile updated! Checking eligibility..."
        },
        "offline": {
          "loadedCache": "Offline: Loaded schemes from cache."
        },
        "success": {
          "addedSchemes": "Added {{count}} new schemes."
        },
        "info": {
          "noNewSchemes": "AI couldn't find any new unique schemes right now."
        },
        "error": {
          "loadSchemes": "Failed to load more schemes."
        },
        "loading": {
          "askingAi": "Asking AI for more schemes...",
          "findingSchemes": "Finding New Schemes...",
          "loadingNews": "Loading News...",
          "loadingVideos": "Loading Videos...",
          "loadingCalc": "Loading Calculator..."
        },
        "buttons": {
          "loadMore": "Load More",
          "findAi": "Find More from AI",
          "refresh": "Refresh Content",
          "calculate": "Calculate Nutrients"
        },
        "noData": {
          "noSchemes": "No eligible schemes found for this profile in {{state}}.",
          "allIndiaBtn": "View All India Schemes",
          "noNews": "No news available at the moment.",
          "noVideos": "No videos available at the moment."
        },
        "toasts": {
          "videosRefreshed": "Videos refreshed!",
          "newsRefreshed": "News refreshed!",
          "schemesRefreshed": "Schemes refreshed!"
        },
        "configNeeded": {
          "title": "Configuration Needed",
          "desc": "Please add {{key}} to your .env file to see {{feature}}."
        }
      },
      "yield": {
        "title": "ಆಪ್ಟಿಮೈಸ್ಡ್ ಇಳುವರಿ ಮುನ್ಸೂಚನೆ",
        "desc": "ಹವಾಮಾನ ದತ್ತಾಂಶದಲ್ಲಿ ತರಬೇತಿ ಪಡೆದ ಸುಧಾರಿತ ಮಾದರಿಗಳನ್ನು ಬಳಸಿಕೊಂಡು ಬೆಳೆ ಇಳುವರಿಯನ್ನು ಊಹಿಸಿ.",
        "supportedCrops": "ಬெಂಬಲಿತ ಬೆಳೆಗಳು",
        "inputTitle": "ಇನ್ಪುಟ್ ನಿಯತಾಂಕಗಳು",
        "selectCrop": "ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        "area": "ವಿಸ್ತೀರ್ಣ (ಎಕರೆಗಳು)",
        "areaNote": "1 Acre ≈ 0.4 Hectares",
        "rainfall": "ಮಳೆ (ಮಿಮೀ)",
        "temp": "Avg Temp (°C)",
        "humidity": "Humidity (%)",
        "fertilizer": "Fertilizer (kg)",
        "pesticide": "Pesticide (kg)",
        "soilPh": "Soil pH",
        "soilN": "Soil N (kg/ha)",
        "soilP": "Soil P (kg/ha)",
        "soilK": "Soil K (kg/ha)",
        "predictBtn": "ಮುನ್ಸೂಚನೆ ರಚಿಸಿ",
        "analyzing": "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "resultsTitle": "ಮುನ್ಸೂಚನೆ ಫಲಿತಾಂಶಗಳು",
        "totalProduction": "ಒಟ್ಟು ಅಂದಾಜು ಉತ್ಪಾದನೆ",
        "revenue": "ಆದಾಯ",
        "yieldEfficiency": "ಇಳುವರಿ ದಕ್ಷತೆ",
        "models": {
          "rf": "Random Forest",
          "lstm": "LSTM Networks",
          "gb": "Gradient Boosting",
          "xgb": "XGBoost"
        },
        "potentialRevenue": "ಸಂಭಾವ್ಯ ಆದಾಯ",
        "perHectare": "ಹೆಕ್ಟೇರ್‌ಗೆ",
        "approx": "ಅಂದಾಜು",
        "confidence": "ವಿಶ್ವಾಸಾರ್ಹತೆ",
        "modelUsed": "ಬಳಸಿದ ಮಾದರಿ",
        "trainingData": "ತರಬೇತಿ ಡೇಟಾ",
        "accuracyNote": "Note: Rice predictions are now highly accurate (~99.7%) thanks to the integration of Soil Health Card data (pH, N, P, K).",
        "kharifSeason": "Kharif Season",
        "tonsPerHa": "t/ha",
        "confidenceRange": "Confidence Range",
        "fiveYearAvg": "5-Year Average",
        "trend": "Historical Trend",
        "regionalPerformance": "Regional Performance",
        "readyDesc": "ನಿಯತಾಂಕಗಳನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಕ್ಲಿಕ್ ಮಾಡಿ.",
        "predictionSuccess": "ಫಲಿತಾಂಶ ಯಶಸ್ವಿ",
        "estimatedProduction": "Estimated Production",
        "tonsUnit": "ಟನ್",
        "summary": {
          "report": "{{crop}} ಗಾಗಿ ನಿಮ್ಮ ಅಂದಾಜು ಇಳುವರಿ {{total}} ಟನ್ ಆಗಿದೆ."
        },
        "avgTemp": "ಸರಾಸರಿ ತಾಪಮಾನ (°C)"
      },
      "pest": {
        "title": "ಕೀಟ ದಾಳಿಯ ಮುನ್ಸೂಚನೆ",
        "inputTitle": "ಕ್ಷೇತ್ರದ ಸ್ಥಿತಿಗಳು",
        "inputDesc": "ಪ್ರಸ್ತುತ ಹವಾಮಾನವನ್ನು ನಮೂದಿಸಿ",
        "selectCrop": "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
        "temp": "ತಾಪಮಾನ",
        "humidity": "ತೇವಾಂಶ",
        "rainfall": "ಮಳೆ",
        "predictBtn": "ಅಪಾಯ ಊಹಿಸಿ",
        "analyzing": "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "resultsTitle": "ಮುನ್ಸೂಚನೆ ಫಲಿತಾಂಶ",
        "probability": "ದಾಳಿಯ ಸಂಭವನೀಯತೆ",
        "riskLevel": "{{level}} ಅಪಾಯ",
        "primaryThreat": "ಪ್ರಾಥಮಿಕ ಬೆದರಿಕೆ",
        "recommendation": "ಶಿಫಾರಸು",
        "forecast7Days": "7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
        "readyDesc": "ಸ್ಲೈಡರ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ ಮತ್ತು ಮುನ್ಸೂಚನೆ ಪಡೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
        "advisorTitle": "AI Agro-Advisor",
        "advisorDesc": "Hear this analysis in your language",
        "stopBtn": "Stop",
        "summary": {
          "prediction": "ಮುನ್ಸೂಚನೆ: {{level}} ಅಪಾಯ ({{score}}%) ಜೊತೆಗೆ {{name}}.",
          "recommendation": "ಶಿಫಾರಸು: {{recommendation}}",
          "weather": "ಹವಾಮಾನ: {{temp}}°C, {{humidity}}% ಆರ್ದ್ರತೆ, {{rainfall}}mm ಮಳೆ.",
          "crop": "ಬೆಳೆ: {{crop}}."
        }
      },
      "fertilizer": {
        "title": "ಸ್ಮಾರ್ಟ್ ಗೊಬ್ಬರ ಮತ್ತು ನೀರಾವರಿ",
        "subtitle": "ಉತ್ತಮ ಬೆಳೆ ಪೋಷಣೆ ಮತ್ತು ನೀರು ನಿರ್ವಹಣೆಗಾಗಿ AI ಶಿಫಾರಸುಗಳು",
        "inputTitle": "ನಿಯತಾಂಕಗಳು",
        "cropType": "ಬೆಳೆ ಪ್ರಕಾರ",
        "selectCrop": "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
        "nitrogen": "ಸಾರಜನಕ (N)",
        "phosphorus": "ರಂಜಕ (P)",
        "potassium": "ಪೊಟ್ಯಾಸಿಯಮ್ (K)",
        "moisture": "ಮಣ್ಣಿನ ತೇವಾಂಶ (%)",
        "moistureDry": "ಒಣಗಿದ",
        "moistureWet": "ಒದ್ದೆಯಾದ",
        "rainfall": "ಮಳೆಯ ಮುನ್ಸೂಚನೆ (ಮಿಮೀ)",
        "soilPh": "ಮಣ್ಣಿನ pH",
        "growthStage": "ಬೆಳವಣಿಗೆ ಹಂತ",
        "selectStage": "ಹಂತವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        "stages": {
          "sowing": "ಬಿತ್ತನೆ",
          "vegetative": "ಸಸ್ಯಕ",
          "flowering": "ಹೂಬಿಡುವ",
          "harvest": "ಕೊಯ್ಲು"
        },
        "getBtn": "ಶಿಫಾರಸು ಪಡೆಯಿರಿ",
        "analyzing": "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "results": {
          "noDataTitle": "ಯಾವುದೇ ಶಿಫಾರಸುಗಳಿಲ್ಲ",
          "noDataDesc": "ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ.",
          "planTitle": "ಗೊಬ್ಬರ ಯೋಜನೆ",
          "adjustments": "ಸ್ಮಾರ್ಟ್ ಹೊಂದಾಣಿಕೆಗಳು",
          "irrigationTitle": "ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ",
          "phAlert": "pH ಎಚ್ಚರಿಕೆ",
          "waterAmount": "ನೀರಿನ ಪ್ರಮಾಣ",
          "applyWater": "{{amount}} ನೀರು ಬಳಸಿ.",
          "rainNote": "ಮುಂದಿನ 3 ದಿನಗಳಲ್ಲಿ ಮಳೆ ನಿರೀಕ್ಷೆಯಿದೆ.",
          "moistureNote": "ತೇವಾಂಶವನ್ನು ಉತ್ತಮವಾಗಿರಿಸಿ.",
          "temperature": "ತಾಪಮಾನ",
          "windSpeed": "ಗಾಳಿಯ ವೇಗ",
          "normal": "ಸಾಮಾನ್ಯ"
        }
      },
      "community": {
        "title": "Kisan Sarathi Community",
        "subtitle": "Connect with fellow farmers, share knowledge, and grow together.",
        "searchPlaceholder": "Search discussions, questions, or experts...",
        "askBtn": "Ask a Question",
        "tabs": {
          "feed": "Community Feed",
          "experts": "Expert Advice",
          "myPosts": "My Activity"
        },
        "stats": {
          "members": "Members",
          "discussions": "Discussions",
          "experts": "Experts Online"
        },
        "chatWith": "Chat with",
        "globalChat": "Global Chat",
        "onlineFarmers": "Online Farmers",
        "you": "You",
        "deleteMessageConfirm": "Are you sure you want to delete this message?",
        "replyTitle": "Write a reply...",
        "replyBtn": "Reply",
        "noReplies": "No replies yet. Be the first!",
        "translatingToast": "AI is translating this post...",
        "aiTranslating": "AI is translating this post.",
        "translatePost": "Translate Post",
        "deleteMessage": "Delete Message",
        "errorPost": "Failed to post question",
        "errorSend": "Failed to send message"
      },
      "common": {
        "today": "Today",
        "yesterday": "Yesterday",
        "messages": "New Messages",
        "clickToChat": "Click to chat",
        "active": "active",
        "loading": "Loading...",
        "localizing": "Localizing...",
        "localized": "Analysis localized to {{lang}} in {{dialect}} dialect.",
        "dialectTransform": "Transforming advice into {{dialect}} dialect...",
        "listening": "Listening...",
        "voiceError": "Voice input failed. Please try again.",
        "error": "Error",
        "success": "Success",
        "generatedOn": "Generated on",
        "crops": {
          "rice": "Rice",
          "wheat": "Wheat",
          "maize": "Maize",
          "sugarcane": "Sugarcane",
          "potato": "Potato",
          "tomato": "Tomato",
          "ginger": "Ginger"
        },
        "playEnglish": "Play English (Full)",
        "playHindi": "Play Hindi (हिंदी)",
        "soldBy": "Sold by",
        "other": "Other",
        "farmerTypes": {
          "small": "Small Farmer",
          "marginal": "Marginal Farmer",
          "large": "Large Farmer",
          "landless": "Landless Laborer"
        },
        "voiceUnsupported": "Voice search not supported in this browser.",
        "offline": "Offline",
        "tryAgain": "Try Again",
        "ready": "Ready",
        "in": "in",
        "unit": {
          "acres": "ಎಕರೆ",
          "hectares": "ಹೆಕ್ಟೇರ್",
          "tons": "ಟನ್",
          "quintals": "Quintals",
          "kilograms": "kg"
        },
        "all": "All States"
      },
      "digitalTwin": {
        "title": "GIS Smart Farm Digital Twin",
        "subtitle": "Create a complete digital replica of your farm with advanced GIS mapping, multi-layer visualization, and real-time monitoring for precision agriculture.",
        "featuring": "✨ Featuring: Farm Boundaries • Soil Zones • Irrigation Planning • Pest Risk Maps • NDVI Crop Health • Weather Analysis",
        "setupTitle": "Farm Setup",
        "setupDesc": "Enter your farm details or coordinates to generate your digital twin.",
        "farmName": "Farm Name",
        "ownerName": "Owner Name",
        "state": "State",
        "district": "District",
        "town": "Town/Village",
        "coordinates": "Coordinates",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "useCurrent": "Use Current Location",
        "size": "Farm Size (Acres)",
        "generateBtn": "Generate Digital Twin",
        "generating": "Generating Digital Twin...",
        "quickDemo": "Quick Demo",
        "drawMap": "Draw on Map",
        "capabilities": "Digital Twin Capabilities",
        "visualization": "Multi-Layer GIS Visualization",
        "interactiveMap": "Interactive GIS Map: {{name}}",
        "liveData": "Live Farm Intelligence",
        "explainBtn": "Explain Farm Status",
        "stopBtn": "Stop",
        "accuracy": "Accuracy",
        "update": "Update Digital Twin",
        "hectares": "Hectares",
        "area": "Farm Area",
        "features": {
          "soil": {
            "title": "Soil Zone Classification",
            "desc": "Multi-layer soil analysis with texture, pH, and nutrient mapping",
            "f1": "Soil Texture",
            "f2": "pH Zones",
            "f3": "Nutrient Maps",
            "f4": "Fertility Index"
          },
          "irrigation": {
            "title": "Irrigation Zone Planning",
            "desc": "Smart irrigation zone design based on crop needs and soil conditions",
            "f1": "Water Zones",
            "f2": "Drip Planning",
            "f3": "Sprinkler Layout",
            "f4": "Efficiency Maps"
          },
          "pest": {
            "title": "Pest-Prone Area Detection",
            "desc": "Historical pest data analysis to identify high-risk zones",
            "f1": "Risk Zones",
            "f2": "Pest History",
            "f3": "Prevention Areas",
            "f4": "Treatment Maps"
          },
          "growth": {
            "title": "Crop Growth Staging",
            "desc": "Real-time crop growth stage monitoring across different field zones",
            "f1": "Growth Stages",
            "f2": "Maturity Maps",
            "f3": "Harvest Zones",
            "f4": "Yield Prediction"
          },
          "weather": {
            "title": "Weather Microclimate",
            "desc": "Field-specific microclimate analysis and weather pattern mapping",
            "f1": "Temperature Zones",
            "f2": "Humidity Maps",
            "f3": "Wind Patterns",
            "f4": "Frost Risk"
          }
        },
        "layers": {
          "satellite": "Satellite Imagery",
          "soilHealth": "Soil Health",
          "cropHealth": "Crop Health",
          "weather": "Weather Data",
          "pests": "Pest Alerts",
          "base": "Base Layer",
          "analysis": "Analysis Layer",
          "monitoring": "Monitoring Layer",
          "environmental": "Environmental Layer",
          "alert": "Alert Layer",
          "daily": "Daily",
          "weekly": "Weekly",
          "realtime": "Real-time",
          "hourly": "Hourly",
          "asneeded": "As needed"
        },
        "drawDesc": "Pinpoint your location and trace the exact shape of your land.",
        "exploreNote": "Explore {{owner}}'s farm with multi-layer GIS visualization. Click on zones for detailed information.",
        "initializing": {
          "status": "Initializing Digital Twin Engine...",
          "mapping": "Mapping boundaries for",
          "soil": "Analyzing soil sensor data layers...",
          "irrigation": "Designing irrigation grid for",
          "pests": "Calculating historical pest risk zones..."
        },
        "insights": {
          "mappedZones": "Mapped Soil Zones",
          "activeZones": "Active Irrigation Zones",
          "growthStages": "Avg Growth Stage",
          "health": "Health Score"
        },
        "summary": {
          "prefix": "Farm Status Report for {{area}} hectares.",
          "zones": "We have identified {{soil}} distinct soil zones and {{irrigation}} irrigation zones.",
          "health": "Overall crop health is {{health}}%.",
          "pestWarning": "Warning: High pest risk detected. Immediate action recommended.",
          "pestLow": "Pest risk is currently low."
        }
      },
      "iot": {
        "title": "IoT Smart Farm Monitoring",
        "subtitle": "Real-time soil health and environment monitoring using low-cost sensor nodes.",
        "liveMonitoring": "Live Monitoring",
        "viewAnalytics": "View Analytics",
        "liveDataHeader": "Live Sensor Data",
        "moisture": "Moisture",
        "ph": "pH Level",
        "temp": "Temp",
        "nitrogen": "Nitrogen",
        "phosphorus": "Phosphorus",
        "potassium": "Potassium",
        "alertsTitle": "Active Alerts",
        "recsTitle": "Irrigation Recommendations",
        "alertsCount": "Active Alerts ({{count}})",
        "recsCount": "Irrigation Recommendations ({{count}})",
        "noAlerts": "No active alerts. Your field conditions are optimal.",
        "noRecs": "No irrigation recommendations at this time.",
        "startIrrigation": "Start Irrigation",
        "irrigationFor": "for {{duration}} mins",
        "features": {
          "title": "System Features",
          "f1": {
            "title": "Real-time Monitoring",
            "desc": "24/7 continuous soil parameter monitoring",
            "items": [
              "Soil Moisture",
              "pH Levels",
              "Temperature",
              "Conductivity"
            ]
          },
          "f2": {
            "title": "Smart Alerts",
            "desc": "AI-powered alert system for critical conditions",
            "items": [
              "Threshold Alerts",
              "Predictive Warnings",
              "Mobile Notifications",
              "Email Reports"
            ]
          },
          "f3": {
            "title": "Auto Irrigation",
            "desc": "Automated irrigation based on soil conditions",
            "items": [
              "Smart Scheduling",
              "Zone Control",
              "Water Optimization",
              "Remote Control"
            ]
          },
          "f4": {
            "title": "Data Analytics",
            "desc": "Historical data analysis and trend monitoring",
            "items": [
              "Trend Analysis",
              "Performance Reports",
              "Yield Correlation",
              "ROI Tracking"
            ]
          }
        },
        "benefits": {
          "title": "Smart Farming Benefits",
          "b1": {
            "title": "40% Water Savings",
            "desc": "Precision irrigation control"
          },
          "b2": {
            "title": "25% Yield Increase",
            "desc": "Optimal growing conditions"
          },
          "b3": {
            "title": "60% Labor Reduction",
            "desc": "Automated monitoring"
          },
          "b4": {
            "title": "Real-time Insights",
            "desc": "Instant decision making"
          }
        }
      },
      "weather": {
        "title": "Smart Weather Risks & Alerts",
        "subtitle": "Advanced GIS-based weather risk detection for your specific farm location.",
        "locationTitle": "Risk Scanning Control",
        "locationDesc": "Select your location to check for local weather hazards and receive automated alerts.",
        "selectState": "Select State",
        "selectDistrict": "Select District",
        "phoneLabel": "Phone Number (for SMS Alerts)",
        "phoneVerify": "Verify",
        "phoneCalling": "Calling...",
        "scanBtn": "Check Risks",
        "scanning": "Scanning GIS Data...",
        "systemSafe": "System Safe",
        "alert": "Alert",
        "riskDetected": "Risk Detected",
        "standby": "System Standby",
        "placeholder": "Select your location and click 'Check Risks' to start scanning your area for hazards.",
        "temp": "Temperature",
        "humidity": "Humidity",
        "toasts": {
          "verifyTitle": "📞 Incoming Call from Twilio",
          "verifyDesc": "Answer the call and enter code: {{code}}",
          "verifyFailed": "Verification Failed",
          "riskTitle": "⚠️ Risk Detected",
          "smsSent": "🚨 SMS Alert sent to {{phone}}",
          "safeTitle": "✅ Conditions Safe",
          "safeDesc": "No severe weather threats detected."
        }
      },
      "voiceAssistant": {
        "hero": {
          "title": "ರೈತರಿಗಾಗಿ ಧ್ವನಿ ಸಹಾಯಕ",
          "desc": "ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ಸ್ವಾಭಾವಿಕವಾಗಿ ಮಾತನಾಡಿ. ತಕ್ಷಣದ ಎಐ ಕೃಷಿ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
          "startBtn": "ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ",
          "chooseLangBtn": "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ"
        },
        "features": {
          "sectionTitle": "Voice Assistant Features",
          "f1": {
            "title": "Hindi Voice Recognition",
            "desc": "Speak naturally in Hindi and get instant responses",
            "example": "Gehun mein rog a gaya hai, kya karein?",
            "response": "Wheat disease detected. Apply fungicide spray."
          },
          "f2": {
            "title": "Local Language Support",
            "desc": "Support for regional languages across India"
          },
          "f3": {
            "title": "Audio Responses",
            "desc": "Get detailed audio responses in your preferred language",
            "item1": "Clear pronunciation",
            "item2": "Slow/Fast speed",
            "item3": "Repeat option",
            "item4": "Save audio"
          },
          "f4": {
            "title": "Offline Voice Commands",
            "desc": "Basic voice commands work even without internet",
            "item1": "Weather check",
            "item2": "Crop calendar",
            "item3": "Basic diagnosis",
            "item4": "Emergency help"
          }
        },
        "examples": {
          "sectionTitle": "Real Conversation Examples",
          "solutionPrefix": "Solution",
          "e1": {
            "farmer": "Tomato mein patte peelay ho rahe hain",
            "farmerTrans": "Tomato leaves are turning yellow",
            "ai": "यह नाइट्रोजन की कमी हो सकती है। यूरिया का छिड़काव करें।",
            "aiTrans": "This could be nitrogen deficiency. Apply urea spray.",
            "solution": "Apply 2kg urea per acre with water spray"
          },
          "e2": {
            "farmer": "Kya aaj pani dena chahiye?",
            "farmerTrans": "Should I water today?",
            "ai": "मिट्टी में नमी 40% है। 2 दिन बाद पानी दें।",
            "aiTrans": "Soil moisture is 40%. Water after 2 days.",
            "solution": "Wait 2 days, then apply 25mm irrigation"
          },
          "e3": {
            "farmer": "Fasal kab kaatni chahiye?",
            "farmerTrans": "When should I harvest the crop?",
            "ai": "आपकी गेहूं 15 दिन में तैयार होगी। दाने सुनहरे होने का इंतज़ार करें।",
            "aiTrans": "Your wheat will be ready in 15 days. Wait for golden grains.",
            "solution": "Harvest when moisture content is 12-14%"
          }
        },
        "demo": {
          "sectionTitle": "Try Voice Assistant Live",
          "selectLang": "Select Language / भाषा चुनें",
          "listening": "सुन रहा हूं... / Listening...",
          "pressToSpeak": "बोलने के लिए दबाएं / Press to Speak",
          "processing": "प्रोसेसिंग... / Processing...",
          "youSaid": "आपने कहा / You said:",
          "aiResponse": "🤖 AgriSphere AI का जवाब / Response:",
          "exampleQuestionsTitle": "उदाहरण प्रश्न / Example Questions:",
          "noteTitle": "Note",
          "noteDesc": "Voice recognition requires a modern browser with microphone permissions. Works best in Chrome/Edge.",
          "noteHindiDesc": "नोट: आवाज़ पहचान के लिए आधुनिक ब्राउज़र और माइक्रोफ़ोन की अनुमति चाहिए।"
        },
        "langs": {
          "sectionTitle": "Supported Languages",
          "hindi": "Hindi",
          "english": "English (India)",
          "fullSupport": "Full Support"
        },
        "howItWorks": {
          "sectionTitle": "How Voice Assistant Works",
          "s1": {
            "title": "Speak Question",
            "desc": "Ask in Hindi or local language"
          },
          "s2": {
            "title": "AI Processing",
            "desc": "Voice recognition & understanding"
          },
          "s3": {
            "title": "Generate Response",
            "desc": "AI creates personalized answer"
          },
          "s4": {
            "title": "Audio Reply",
            "desc": "Hear response in your language"
          }
        },
        "benefits": {
          "sectionTitle": "Voice Assistant Benefits",
          "b1": {
            "title": "Easy to Use",
            "desc": "No typing required, just speak"
          },
          "b2": {
            "title": "Rural Friendly",
            "desc": "Works for illiterate farmers"
          },
          "b3": {
            "title": "Instant Help",
            "desc": "Get answers in seconds"
          },
          "b4": {
            "title": "Local Language",
            "desc": "Understand & respond in Hindi"
          }
        },
        "digitalTwin": {
          "title": "Farm Digital Twin",
          "subtitle": "Visualize your farm with GIS, IoT, and AI-driven spatial analysis.",
          "initializing": {
            "status": "Creating your digital farm twin...",
            "mapping": "Mapping field boundaries for",
            "soil": "Analyzing soil zones based on location",
            "irrigation": "Planning irrigation systems for",
            "pests": "Detecting pest-prone areas"
          },
          "capabilities": "Digital Twin Capabilities",
          "features": {
            "gis": {
              "title": "GIS Plot Mapping",
              "desc": "Satellite-based boundary mapping with sub-meter accuracy",
              "f1": "Boundary Detection",
              "f2": "Area Calculation",
              "f3": "Elevation Mapping",
              "f4": "Geo-fencing"
            },
            "soil": {
              "title": "Soil Health Mapping",
              "desc": "Spatial distribution of nutrients and soil types",
              "f1": "NPK Gradients",
              "f2": "pH Variation",
              "f3": "Texture Analysis",
              "f4": "Carbon Seq."
            },
            "irrigation": {
              "title": "Smart Irrigation",
              "desc": "VRT-based irrigation planning and moisture tracking",
              "f1": "Hydraulic Zones",
              "f2": "Moisture Flux",
              "f3": "Drip Planning",
              "f4": "Runoff Predict."
            }
          },
          "insights": {
            "pestRisk": "Pest Risk Areas",
            "growthStages": "Crop Growth Stages",
            "health": "Health",
            "risk": "risk",
            "mappedZones": "Mapped zones",
            "activeZones": "Active zones",
            "avgHealth": "Average %"
          },
          "areaNote": "acres"
        },
        "farmerDashboard": {
          "title": "Smart Farmer Dashboard",
          "subtitle": "Your centralized hub for AI operations and farm management.",
          "metrics": {
            "models": "AI Models",
            "activeModels": "active models",
            "area": "Mapped Area",
            "hectares": "hectares",
            "detections": "Detections",
            "types": "distinct types",
            "accuracy": "Avg. Accuracy"
          },
          "tabs": {
            "overview": "Overview",
            "disease": "Disease AI",
            "twin": "Digital Twin",
            "yield": "Yield Predict",
            "pest": "Pest Forecast",
            "marketplace": "Marketplace"
          }
        }
      },
      "gov": {
        "title": "Ministry of Agriculture Dashboard",
        "subtitle": "National Command & Control Centre",
        "operational": "System Operational",
        "genReport": "Generate Report",
        "stats": {
          "regFarmers": "Registered Farmers",
          "activeAlerts": "Active Alerts",
          "cropLossCases": "Crop Loss Cases",
          "estDisbursement": "Est. Disbursement"
        },
        "tabs": {
          "overview": "Overview & Analytics",
          "cropLoss": "Crop Loss Compensation",
          "market": "Market Intelligence"
        },
        "charts": {
          "diseaseTrend": "Disease Detection Trend",
          "communityIssues": "Community Issues",
          "prices": "State-wise Avg Prices",
          "listings": "Live Listings Overview"
        },
        "cases": {
          "title": "Compensation Case Management",
          "search": "Search case ID...",
          "noCases": "No active cases found.",
          "eligible": "Eligible",
          "reviewRequired": "Review Required",
          "verify": "Verify",
          "reject": "Reject",
          "approve": "Approve",
          "status": {
            "approved": "Approved",
            "rejected": "Rejected",
            "underVerification": "Under Verification",
            "pending": "Approval Pending"
          }
        },
        "report": {
          "generated": "Report Generated",
          "downloaded": "The report has been downloaded to your device.",
          "totalVolume": "Total Volume Traded"
        },
        "caseActions": {
          "approved": "Case Approved",
          "rejected": "Case Rejected",
          "verified": "Verification Requested",
          "updated": "Case {{id}} has been updated.",
          "errorUpdate": "Failed to update case status",
          "errorFetch": "Failed to fetch government dashboard data"
        },
        "labels": {
          "replies": "Replies",
          "loss": "Loss",
          "cause": "Cause",
          "damage": "Damage",
          "estLoss": "Est. Loss",
          "scheme": "Scheme"
        }
      },
      "buyer": {
        "title": "Verified Buyer Dashboard",
        "welcome": "Welcome, {{name}}",
        "subtitle": "Sourcing fresh produce directly from farmers.",
        "panIndia": "Pan India",
        "postDemand": "Post Demand",
        "tabs": {
          "listings": "Listing Feed",
          "intelligence": "Market Intelligence",
          "deals": "My Deals"
        },
        "filters": {
          "search": "Search wheat, rice, Punjab...",
          "allCrops": "All Crops",
          "allStates": "All States"
        },
        "card": {
          "quantity": "Quantity",
          "price": "Price",
          "farmer": "Farmer",
          "harvest": "Harvest",
          "callFarmer": "Call Farmer",
          "grade": "Grade"
        },
        "intelligence": {
          "title": "Market Demand Analysis",
          "scope": "Market Scope",
          "config": "Configure AI analysis target",
          "forecast": "Trend Forecast",
          "demand": "Demand Level",
          "vsMsp": "Vs MSP",
          "avgPrice": "Avg. Market Price",
          "genBtn": "Generate AI Insights",
          "analyzing": "Analyzing...",
          "strategicAnalysis": "AI Strategic Analysis",
          "mspComparison": "MSP vs Market Price",
          "brief": "Intelligence Brief"
        },
        "contact": {
          "title": "Contact Farmer",
          "desc": "Connect with {{name}} directly.",
          "phone": "Phone Number",
          "whatsapp": "WhatsApp",
          "call": "Call Now",
          "close": "Close"
        },
        "demand": {
          "title": "Post Buying Requirement",
          "desc": "Farmers matching these criteria will be alerted.",
          "crop": "Target Crop",
          "quantity": "Quantity (Quintals)",
          "price": "Target Price/Qtl",
          "location": "Preferred Location (Optional)",
          "postBtn": "Post Demand",
          "cancel": "Cancel"
        },
        "contactFarmer": "Contact Farmer",
        "saveListing": "Save for later",
        "errorInsights": "Failed to fetch market insights",
        "loginRequired": "Login Required",
        "loginRequiredDesc": "Please login as a buyer to contact farmers.",
        "fillFields": "Please fill in required fields.",
        "errorPostDemand": "Failed to post demand.",
        "recordedNote": "Interactions are recorded in your 'My Deals' tab.",
        "trader": "Trader",
        "loading": "Loading live marketplace...",
        "noListings": "No listings found matching your criteria.",
        "gradeA": "Grade A",
        "ready": "Ready",
        "targetCrop": "Target Crop",
        "targetState": "Target State",
        "unknown": "Unknown",
        "noDeals": "No active deals yet.",
        "dealLabel": "{{crop}} Deal",
        "withLabel": "with {{name}}",
        "toast": {
          "saved": "Listing saved for later",
          "unsaved": "Listing removed from saved"
        }
      },
      "cropLoss": {
        "title": "Crop Loss Compensation Claim",
        "subtitle": "Government of India - Ministry of Agriculture",
        "sections": {
          "farmer": "Farmer Details",
          "crop": "Crop Details",
          "loss": "Loss Details",
          "evidence": "Evidence Upload",
          "compliance": "Advisory Compliance",
          "declaration": "Final Declaration"
        },
        "fields": {
          "name": "Farmer Name",
          "mobile": "Mobile Number",
          "state": "State",
          "district": "District",
          "village": "Village",
          "area": "Total Farm Area (Acres)",
          "insurance": "PMFBY Insurance Status",
          "cropName": "Crop Name",
          "season": "Season",
          "sowingDate": "Sowing Date",
          "harvestDate": "Expected Harvest Date",
          "affectedArea": "Affected Area (Acres)",
          "cause": "Cause of Loss",
          "damageDate": "Date Damage Observed",
          "damagePercent": "Estimated Damage Percentage (%)",
          "minDamageNote": "Minimum 33% required",
          "complianceFert": "Applied fertilizers as recommended",
          "complianceIrri": "Followed irrigation schedule",
          "compliancePest": "Reported pests early via tool"
        },
        "placeholders": {
          "name": "Full Name",
          "mobile": "+91...",
          "insurance": "Select Status",
          "insYes": "Enrolled (Yes)",
          "insNo": "Not Enrolled",
          "selectCrop": "Select Crop",
          "selectCause": "Select Cause",
          "village": "Village Name"
        },
        "seasons": {
          "kharif": "Kharif",
          "rabi": "Rabi",
          "zaid": "Zaid"
        },
        "advisory": {
          "title": "Confirm your adherence to AgriSphere advisories. This impacts claim approval.",
          "verifiedNote": "Will be verified against AI usage logs."
        },
        "causes": {
          "flood": "Flood / Heavy Rain",
          "drought": "Drought",
          "pest": "Pest Attack",
          "disease": "Crop Disease",
          "hailstorm": "Hailstorm",
          "heatwave": "Heatwave"
        },
        "ai": {
          "title": "AI Assistant Tips",
          "uploadPhotos": "Please upload photos of affected leaves/stems for AI verification.",
          "specifyPest": "Mention specific pest name if known (e.g., Pink Bollworm).",
          "gpsEnable": "Ensure GPS location is enabled while taking photos."
        },
        "evidence": {
          "uploadBtn": "Click to upload photos/video",
          "note": "Upload at least 2 photos (Close-up & Wide angle). GPS metadata will be extracted."
        },
        "declaration": {
          "check": "I hereby declare that the information provided above is true.",
          "note": "I understand that any false claim will lead to rejection and legal action."
        },
        "submitBtn": "Submit Claim",
        "success": "Claim submitted successfully!",
        "error": "Failed to submit claim. Please try again.",
        "agreeError": "You must agree to the declaration."
      },
      "farmerDashboard": {
        "title": "Comprehensive AI Agriculture Dashboard",
        "subtitle": "Advanced AI-powered agriculture management system combining disease detection, GIS digital twin, and yield prediction for precision farming.",
        "tabs": {
          "overview": "Overview",
          "disease": "AI Disease Detection",
          "twin": "GIS Digital Twin",
          "yield": "Yield Prediction",
          "pest": "Pest Forecast",
          "marketplace": "Marketplace"
        },
        "metrics": {
          "models": "AI Models",
          "area": "Farm Area",
          "detections": "Detection Classes",
          "accuracy": "Accuracy",
          "activeModels": "Active Models",
          "hectares": "Hectares",
          "types": "Disease/Pest Types",
          "precision": "AI Precision"
        },
        "status": {
          "active": "Active",
          "live": "Live",
          "types": "Types"
        },
        "yield": {
          "title": "Crop Yield Predictions (2025)",
          "perHectare": "per hectare",
          "advancedTitle": "Advanced AI Yield Prediction",
          "modelPerformance": "ML Model Performance"
        },
        "twin": {
          "title": "GIS-Based Smart Farm Digital Twin",
          "activeZones": "Active Zones",
          "monitored": "Monitored",
          "average": "Average",
          "spatialFeatures": "Spatial Analysis Features",
          "precisionBenefits": "Precision Agriculture Benefits"
        }
      },
      "seeds": {
        "title": "ಸ್ಮಾರ್ಟ್ ಬೀಜ",
        "titleProcurement": "ಖರೀದಿ",
        "heroBadge": "ಬ್ಲಾಕ್‌ಚೈನ್ ಸ್ಮಾರ್ಟ್ ಖರೀದಿ ವ್ಯವಸ್ಥೆ (ಬೀಟಾ)",
        "heroDescription": "ನಾವು ಕೇವಲ ಬೀಜಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡುವುದಿಲ್ಲ—ನಾವು ನಿಮ್ಮನ್ನು ಬೆಲೆ ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ನೈಜ-ಸಮಯದ ಪ್ರವೇಶದೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿದ ಹತ್ತಿರದ ಪೂರೈಕೆದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.",
        "verifySeedNet": "SeedNet ನಲ್ಲಿ ಪತ್ತೆಹಚ್ಚಿ",
        "locateShops": "ಅಂಗಡಿಗಳನ್ನು ಹುಡುಕಿ",
        "searchPlaceholder": "ಬೀಜಗಳು ಅಥವಾ ಅಂಗಡಿಗಳಿಗಾಗಿ ಹುಡುಕಿ...",
        "all": "ಎಲ್ಲಾ",
        "govtSubsidized": "ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ",
        "private": "ಖಾಸಗಿ",
        "inStock": "ದಾಸ್ತಾನು ಇದೆ",
        "outOfStock": "ದಾಸ್ತಾನು ಇಲ್ಲ",
        "subsidyAvailable": "ಸಬ್ಸಿಡಿ ಲಭ್ಯವಿದೆ",
        "call": "ಕರೆ ಮಾಡಿ",
        "docsNeeded": "ದಾಖಲೆಗಳ ಅಗತ್ಯವಿದೆ",
        "requiredDocs": "ಅಗತ್ಯ ದಾಖಲೆಗಳು",
        "carryDocs": "ಸಬ್ಸಿಡಿ ಪಡೆಯಲು ದಯವಿಟ್ಟು ಈ ದಾಖಲೆಗಳನ್ನು {{shopName}} ಗೆ ತೆಗೆದುಕೊಂಡು ಹೋಗಿ.",
        "advisorTitle": "AI ಬೀಜ ಸಲಹೆಗಾರ",
        "advisorDesc": "ನಿಮ್ಮ ಹವಾಮಾನ ಮತ್ತು ಬೆಳೆಯ ಆಧಾರದ ಮೇಲೆ ವೈಯಕ್ತೀಕರಿಸಿದ ಬೀಜ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ.",
        "selectSeason": "ಹವಾಮಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        "seasonRabi": "ರಬಿ",
        "seasonKharif": "ಖಾರಿಫ್",
        "aiTip": "AI ಈ ಶ್ರೇಯಾಂಕಗಳಿಗಾಗಿ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ ವಿನ್ಯಾಸ ಮತ್ತು ಕಿರು-ಹವಾಮಾನವನ್ನು ಪರಿಗಣಿಸುತ್ತದೆ.",
        "selectSeasonPrompt": "AI ಶಿಫಾರಸುಗಳನ್ನು ನೋಡಲು ಹವಾಮಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        "checkAvailability": "ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",
        "tags": {
          "lowestPrice": "ಕಡಿಮೆ ಬೆಲೆ",
          "nearest": "ಹತ್ತಿರದ",
          "blockchainVerified": "ಬ್ಲಾಕ್‌ಚೈನ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ"
        },
        "currentPrice": "ಪ್ರಸ್ತುತ ಬೆಲೆ",
        "marketRate": "ಮಾರುಕಟ್ಟೆ ದರ",
        "rating": "ರೇಟಿಂಗ್",
        "viewRoute": "ದಾರಿ ನೋಡಿ",
        "checkWithStore": "ಅಂಗಡಿಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿ",
        "unit": {
          "km": "ಕಿಮೀ"
        },
        "tabs": {
          "findShops": "ಅಂಗಡಿಗಳನ್ನು ಹುಡುಕಿ",
          "advisor": "ಬೀಜ ಸಲಹೆಗಾರ"
        },
        "toasts": {
          "locating": "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
          "locatingDesc": "ಹತ್ತಿರದ ಅಂಗಡಿಗಳಿಗಾಗಿ ನಿಮ್ಮ ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ.",
          "found": "ಸ್ಥಳ ಸಿಕ್ಕಿದೆ",
          "foundDesc": "{{city}}, {{state}} ಹತ್ತಿರ ಪರಿಶೀಲಿಸಿದ ಬೀಜ ಪೂರೈಕೆದಾರರನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
          "errorLoc": "ಹತ್ತಿರದ ಅಂಗಡಿಗಳನ್ನು ಪಡೆಯುವಲ್ಲಿ ವಿಫಲವಾಗಿದೆ.",
          "permDenied": "ಜಿಯೋಲೋಕೇಶನ್ ನಿರಾಕರಿಸಲಾಗಿದೆ",
          "permDeniedDesc": "ಹತ್ತಿರದ ಅಂಗಡಿಗಳನ್ನು ಹುಡುಕಲು ದಯವಿಟ್ಟು ಸ್ಥಳವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ."
        }
      },
      "trace": {
        "title": "Web3 ಟ್ರೇಸೆಬಿಲಿಟಿ",
        "subtitle": "ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಗಳಿಂದ ನಡೆಸಲ್ಪಡುವ ಎಂಡ್-ಟು-ಎಂಡ್ ಬೆಳೆ ಟ್ರ್ಯಾಕಿಂಗ್.",
        "connectBtn": "ವಾಲೆಟ್ ಸಂಪರ್ಕಿಸಿ",
        "connected": "ಸಂಪರ್ಕಿಸಲಾಗಿದೆ: {{account}}",
        "walletConnected": "ವಾಲೆಟ್ ಸಂಪರ್ಕಗೊಂಡಿದೆ",
        "simulatedWallet": "ಸಿಮ್ಯುಲೇಟೆಡ್ ವಾಲೆಟ್ ಸಂಪರ್ಕಗೊಂಡಿದೆ",
        "simulatedWalletDesc": "ಯಾವುದೇ Web3 ಪೂರೈಕೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ. ಡೆಮೊ ಖಕ್ಕಿಯನ್ನು ಬಳಸಲಾಗುತ್ತಿದೆ.",
        "connectionFailed": "ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ",
        "trackTab": "ಬೆಳೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        "registerTab": "ಬ್ಯಾಚ್ ನೋಂದಾಯಿಸಿ",
        "searchHint": "ಬ್ಯಾಚ್ ಐಡಿ ನಮೂದಿಸಿ (ಉದಾ. BATCH-7241) ಅಥವಾ ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
        "traceBtn": "ಡೇಟಾ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        "recordFound": "ದಾಖಲೆ ಕಂಡುಬಂದಿದೆ",
        "recordFoundDesc": "Web3 ದಾಖಲೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪಡೆಯಲಾಗಿದೆ.",
        "recordNotFound": "ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ",
        "recordNotFoundDesc": "ಬ್ಯಾಚ್ ಐಡಿ {{id}} ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಇಲ್ಲ.",
        "verifiedBatchTrace": "ಪರಿಶೀಲಿಸಿದ ಬ್ಯಾಚ್ ಟ್ರೇಸ್",
        "authentic": "ಅಧಿಕೃತ",
        "signedBy": "ಇವರಿಂದ ಸಹಿ ಮಾಡಲಾಗಿದೆ:",
        "queryHint": "ಬ್ಲಾಕ್‌ಚೈನ್ ವಿಚಾರಣೆಗಾಗಿ ಬ್ಯಾಚ್ ಐಡಿ ನಮೂದಿಸಿ.",
        "ledgerInfo": "ಡೇಟಾವನ್ನು Web3 ಬದಲಾಯಿಸಲಾಗದ ಲೆಡ್ಜರ್ ಮೂಲಕ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
        "mintTitle": "ಹೊಸ ಬೆಳೆ ದಾಖಲೆ ರಚಿಸಿ",
        "mintDesc": "ಬ್ಲಾಕ್‌ಚೈನ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ದಾಖಲಿಸಿ. ಒಮ್ಮೆ ಸಲ್ಲಿಸಿದ ನಂತರ ಇದನ್ನು ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
        "batchIdLabel": "ರಚಿಸಲಾದ ಬ್ಯಾಚ್ ಐಡಿ",
        "cropLabel": "ಬೆಳೆ / ಉತ್ಪನ್ನದ ಪ್ರಕಾರ",
        "cropPlaceholder": "ಉದಾ. ಬಾಸ್ಮತಿ ಅಕ್ಕಿ, ಸಾವಯವ ಸೇಬುಗಳು",
        "originLabel": "ಮೂಲ ಸ್ಥಳ",
        "originPlaceholder": "ಫಾರ್ಮ್ ವಿಳಾಸ ಅಥವಾ ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳು",
        "qualityLabel": "ಗುಣಮಟ್ಟ / ಪ್ರಮಾಣೀಕರಣ",
        "signingNotice": "ಈ ವಹಿವಾಟನ್ನು ಸಲ್ಲಿಸುವ ಮೂಲಕ ನೀವು ಸಹಿ ಮಾಡುತ್ತಿದ್ದೀರಿ. ವಾಲೆಟ್‌ನಲ್ಲಿ ದೃಢೀಕರಿಸಬೇಕಾಗುತ್ತದೆ.",
        "mintingBtn": "ಬ್ಲಾಕ್‌ಚೈನ್‌ನಲ್ಲಿ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
        "signRegisterBtn": "ಸಹಿ ಮಾಡಿ ಮತ್ತು ನೋಂದಾಯಿಸಿ",
        "mintSuccess": "ರಚನೆ ಯಶಸ್ವಿಯಾಗಿದೆ",
        "mintSuccessDesc": "ಬ್ಯಾಚ್ {{id}} ಶಾಶ್ವತವಾಗಿ ಬ್ಲಾಕ್‌ಚೈನ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದೆ."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
