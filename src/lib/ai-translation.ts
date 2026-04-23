import { GoogleGenerativeAI } from "@google/generative-ai";
import openai from "@/lib/openai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_VISION_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!text || targetLanguage === 'en') {
    return text;
  }

  const prompt = `
    You are a professional agricultural translator. 
    Translate the following agricultural advice into ${targetLanguage}.
    - Target audience: Rural Indian farmers.
    - Style: Simple, clear, and actionable.
    - Instructions: Keep technical terms in English in brackets where helpful. 
    - Output: Provide ONLY the translated text.
    
    TEXT TO TRANSLATE:
    "${text}"
  `;

  // 1. Try Gemini first
  if (apiKey) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const translated = result.response.text().trim();
      if (translated) return translated;
    } catch (error) {
      console.error("AI Translation Error (Gemini):", error);
    }
  }

  // 2. Fallback to Groq
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];
  for (const model of models) {
    try {
      console.log(`🌐 Fallback AI Translation with Groq model: ${model}`);
      const response = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.3,
      });
      const translated = response.choices[0]?.message?.content?.trim();
      if (translated) return translated;
    } catch (error: unknown) {
      const apiError = error as { status?: number; message?: string };
      console.error(`AI Translation Error (Groq ${model}):`, error);
      if (apiError.status === 429 || apiError.message?.includes('429')) continue;
      break;
    }
  }

  return text; // Fallback to original text
};

/**
 * Specifically for disease analysis results which are often complex objects
 */
export const translateAnalysisResults = async (results: Record<string, unknown> | null, targetLanguage: string): Promise<Record<string, unknown> | null> => {
  if (targetLanguage === 'en' || !results) return results;

  const stringified = JSON.stringify(results);
  const prompt = `
    You are a professional agricultural data localization expert.
    Translate the following JSON object containing agricultural analysis entirely into ${targetLanguage}.
    - Target audience: Rural Indian farmers.
    - CRITICAL: You MUST translate ALL deeply nested string values (like recommendations, advice, names, or risk levels) into ${targetLanguage}. Do not leave any English text in the values!
    - CRITICAL: Keep all JSON keys exactly as they are in English. ONLY translate the values.
    - Return ONLY the exact structure as valid translated JSON.
    
    JSON TO TRANSLATE:
    ${stringified}
  `;

  // 1. Try Gemini
  if (apiKey && apiKey !== "") {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const res = await model.generateContent(prompt);
      const text = await res.response.text();
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("AI Analysis Translation Error (Gemini):", error);
    }
  }

  // 2. Fallback to Groq
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];
  for (const model of models) {
    try {
      console.log(`🌐 Fallback Analysis Translation with Groq model: ${model}`);
      const res = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.2,
        response_format: { type: "json_object" } // Enforce JSON
      });
      const text = res.choices[0]?.message?.content?.trim() || "{}";
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error: unknown) {
      const apiError = error as { status?: number; message?: string };
      console.error(`AI Analysis Translation Error (Groq ${model}):`, error);
      if (apiError.status === 429 || apiError.message?.includes('429')) continue;
      // If parsing fails or something, try next model
      // break;
    }
  }

  return results; // Fallback to original results
};
