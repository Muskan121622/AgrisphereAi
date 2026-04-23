import { API_BASE_URL } from '@/config/api';
import axios from "axios";
import { NewsArticle } from "../types/advisory";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2/everything";

export type SupportedNewsLanguage = "Hindi" | "English" | "Marathi" | "Telugu" | "Tamil" | "Odia" | "Bengali" | "Kannada";

interface NewsAPIArticle {
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    source: { name: string };
    publishedAt: string;
}

// Agriculture-specific keywords for post-fetch relevance filtering
const AGRI_KEYWORDS = [
    "farm", "farmer", "crop", "harvest", "agriculture", "agri", "kisan",
    "cultivation", "irrigation", "fertiliz", "pesticide", "paddy", "wheat",
    "rice", "soil", "seed", "sowing", "yield", "livestock", "dairy",
    "horticulture", "msp", "rabi", "kharif", "drought", "rural",
    "subsidy", "scheme", "ministry of agriculture", "rythu", "ryot",
    "sugarcane", "cotton", "maize", "soybean", "vegetable", "orchard",
    "organic", "greenhouse", "plantation", "agro", "crop insurance",
    "food grain", "foodgrain", "produce", "mandi", "apmc"
];

const isAgricultureArticle = (title: string, description: string): boolean => {
    const combined = (title + " " + description).toLowerCase();
    return AGRI_KEYWORDS.some(kw => combined.includes(kw));
};

/**
 * All queries strictly AND-combine agriculture terms with India context.
 * NewsAPI only reliably returns English content, so we always set language=en
 * and use region-specific English keywords to surface regionally relevant news.
 */
const getQueryForLanguage = (lang: SupportedNewsLanguage): string => {
    // Core agriculture requirement — MUST appear in every article
    const agriCore = '(agriculture OR farming OR "crop yield" OR "kisan" OR "farmer" OR "crop insurance" OR "MSP" OR horticulture OR irrigation OR fertilizer OR pesticide OR "food grain" OR livestock OR paddy OR soybean OR sugarcane OR cotton OR rabi OR kharif)';

    // Noise exclusions
    const exclude = '-"cricket" -"bollywood" -"movie" -"stock market" -"NASA" -"space" -"politics" -"election" -"opinion" -"editorial" -"advertising"';

    switch (lang) {
        case "Telugu":
            return `${agriCore} AND (India OR "Andhra Pradesh" OR Telangana OR "Rythu Bandhu" OR "AP farmer" OR "Telangana farmer") ${exclude}`;

        case "Marathi":
            return `${agriCore} AND (India OR Maharashtra OR "Vidarbha" OR "Mumbai farmer" OR "Maharashtra kisan") ${exclude}`;

        case "Tamil":
            return `${agriCore} AND (India OR "Tamil Nadu" OR "Cauvery" OR "TN farmer" OR "Tamil farmer") ${exclude}`;

        case "Bengali":
            return `${agriCore} AND (India OR "West Bengal" OR "Bengal farmer" OR "jute" OR "WB agriculture") ${exclude}`;

        case "Kannada":
            return `${agriCore} AND (India OR Karnataka OR "Karnataka farmer" OR "Ragi" OR "coffee plantation") ${exclude}`;

        case "Odia":
            return `${agriCore} AND (India OR Odisha OR "Odisha farmer" OR "Odia farmer" OR "Odisha crop") ${exclude}`;

        case "Hindi":
            return `${agriCore} AND (India OR "Uttar Pradesh" OR Bihar OR "Madhya Pradesh" OR Haryana OR Rajasthan OR "Hindi belt") ${exclude}`;

        default: // English + catch-all
            return `${agriCore} AND India ${exclude}`;
    }
};

export const fetchFarmingNews = async (language: SupportedNewsLanguage = "English", page: number = 1): Promise<NewsArticle[]> => {
    // Map internal languages to Google News language codes
    const localLangMap: Record<SupportedNewsLanguage, string> = {
        "Hindi": "hi",
        "Marathi": "mr",
        "Telugu": "te",
        "Tamil": "ta",
        "Bengali": "bn",
        "Kannada": "kn",
        "Odia": "or", // Not widely supported by google news but mapped for consistency
        "English": "en"
    };

    if (language !== "English") {
        try {
            const langCode = localLangMap[language] || "hi";
            const API_SERVER_URL = import.meta.env.VITE_API_URL || '${API_BASE_URL}';
            const response = await axios.get(`${API_SERVER_URL}/api/regional-news`, {
                params: { lang: langCode }
            });
            
            if (response.data.status === "ok") {
                return response.data.articles.map((article: Record<string, any>) => ({
                    title: article.title as string,
                    description: article.description as string,
                    url: article.url as string,
                    urlToImage: article.urlToImage as string,
                    source: article.source as { name: string },
                    publishedAt: article.publishedAt as string
                }));
            }
        } catch (error) {
            console.error("Local Regional News API Error:", error);
            // Fallback gracefully below
        }
    }

    // Default NewsAPI explicitly for English or on Fallback
    if (!NEWS_API_KEY) {
        console.error("News API Key is missing!");
        return [];
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: getQueryForLanguage(language),
                sortBy: "publishedAt",
                language: "en",   // NewsAPI free tier only has reliable English content
                apiKey: NEWS_API_KEY,
                pageSize: 40,     // Fetch extra — post-filter may reduce count
                page: page,
            },
        });

        if (response.data.status === "ok") {
            return (response.data.articles as NewsAPIArticle[])
                .filter((article) =>
                    article.title &&
                    article.title !== "[Removed]" &&
                    article.urlToImage &&
                    article.description &&
                    article.description !== "[Removed]" &&
                    article.description !== "No description available." &&
                    // Strict agriculture relevance check on the actual content
                    isAgricultureArticle(article.title, article.description || "")
                )
                .map((article) => ({
                    title: article.title,
                    description: article.description || "No description available.",
                    url: article.url,
                    urlToImage: article.urlToImage as string,
                    source: { name: article.source.name },
                    publishedAt: article.publishedAt
                }));
        }

        console.warn("NewsAPI returned non-ok status:", response.data);
        return [];
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};

