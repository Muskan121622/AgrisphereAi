import axios from "axios";
import { Scheme } from "../types/advisory";
import { ALL_SCHEMES } from "./schemesData";
import { SupportedNewsLanguage } from "./newsService";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_CHATBOT_API_KEY;

export const fetchLatestSchemes = async (language: SupportedNewsLanguage = "English"): Promise<Scheme[]> => {
    if (!GROQ_API_KEY) {
        console.error("Groq API Key missing for Scheme Fetching");
        return [];
    }

    try {
        const langInstruction = language === "Hindi"
            ? "Provide the response in HINDI. Keys must remain in English, but values like name, benefits, description should be in Hindi."
            : "Provide the response in English.";

        const prompt = `You are an expert agricultural advisor. List 3 distinct, real, and currently active government schemes for Indian farmers that are NOT commonly known (avoid PM-KISAN if possible). 
        
        ${langInstruction}

        Return ONLY a valid JSON array of objects. Each object must match this structure:
        {
            "id": "unique_string_id",
            "name": "Scheme Name",
            "type": "Scheme Type (e.g., Subsidy, Insurance)",
            "state": "State Name or 'All'",
            "central": boolean,
            "benefits": "Short benefits summary",
            "description": "Short description (2 sentences)",
            "applyLink": "Official URL or search query",
            "docsRequired": ["Doc1", "Doc2"]
        }

        Do not generate markdown code blocks. Just the raw JSON string.`;

        // Temporarily bypassing Groq API to avoid 429 Rate Limit network errors
        // const response = await axios.post(
        //     "https://api.groq.com/openai/v1/chat/completions",
        //     ...
        
        throw new Error("Groq API rate limit reached, forcing fallback");
    } catch (error) {
        const fallbackSchemes = [...ALL_SCHEMES].sort(() => 0.5 - Math.random()).slice(0, 3);
        return fallbackSchemes.map(s => ({
            ...s,
            id: s.id || `AI_FB_${Math.random().toString(36).substring(2, 9)}`,
            nameHi: language === "Hindi" ? (s.nameHi || s.name) : undefined,
            benefitsHi: language === "Hindi" ? (s.benefitsHi || s.benefits) : undefined,
            descriptionHi: language === "Hindi" ? (s.descriptionHi || s.description) : undefined,
            docsRequiredHi: language === "Hindi" ? (s.docsRequiredHi || s.docsRequired) : undefined
        }));
    }
};
