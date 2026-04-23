import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { NewsArticle } from "../../types/advisory";
import { Calendar, User } from "lucide-react";

import { VoiceExplainButton } from "./VoiceExplainButton";
import { SupportedNewsLanguage } from "../../services/newsService";

interface NewsCardProps {
    article: NewsArticle;
    language?: SupportedNewsLanguage;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, language = "English" }) => {
    const localeMap: Record<string, string> = {
        "Hindi": "hi-IN",
        "Marathi": "mr-IN",
        "Telugu": "te-IN",
        "Tamil": "ta-IN",
        "Odia": "or-IN",
        "Bengali": "bn-IN",
        "Kannada": "kn-IN",
        "English": "en-IN"
    };

    const formattedDate = new Date(article.publishedAt).toLocaleDateString(localeMap[language] || "en-IN", {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
        <Card className="overflow-hidden hover:shadow-md transition-all h-full flex flex-col border-gray-200">
            <div className="relative h-48 w-full">
                <img
                    src={article.urlToImage || "https://images.unsplash.com/photo-1625246333195-58ad9acf4256?q=80&w=2070&auto=format&fit=crop"}
                    alt={article.title}
                    className="object-cover w-full h-full"
                    onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop")}
                />
            </div>
            <CardContent className="flex-1 pt-4">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {article.source.name}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formattedDate}</span>
                </div>
                <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 hover:text-green-700 transition-colors">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center">
                <VoiceExplainButton
                    textToExplain={`News Headline: ${article.title}. Summary: ${article.description}`}
                    language={language}
                />
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-green-600 hover:underline"
                >
                    {language === "Hindi" ? "पूरा लेख पढ़ें" : 
                     language === "Telugu" ? "పూర్తి కథనం చదవండి" :
                     language === "Marathi" ? "पूर्ण लेख वाचा" :
                     language === "Bengali" ? "সম্পূর্ণ নিবন্ধ পড়ুন" :
                     language === "Kannada" ? "ಪೂರ್ಣ ಲೇಖನವನ್ನು ಓದಿ" :
                     language === "Tamil" ? "முழு உரையையும் படிக்கவும்" :
                     language === "Odia" ? "ପୁରା ପଢନ୍ତୁ" :
                     "Read Full Article"} &rarr;
                </a>
            </CardFooter>
        </Card>
    );
};
