import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scheme } from "../../types/advisory";
import { ExternalLink, FileText } from "lucide-react";
import { VoiceExplainButton } from "./VoiceExplainButton";

import { SupportedNewsLanguage } from "../../services/newsService";

interface SchemeCardProps {
    scheme: Scheme;
    language?: SupportedNewsLanguage;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, language = "English" }) => {
    const isHindi = language === "Hindi";
    const isTelugu = language === "Telugu";
    const isMarathi = language === "Marathi";
    const isBengali = language === "Bengali";
    const isKannada = language === "Kannada";
    const isTamil = language === "Tamil";
    const isOdia = language === "Odia";

    // Fallback to English if Hindi content is missing
    const name = (isHindi && scheme.nameHi) ? scheme.nameHi : scheme.name;
    const benefits = (isHindi && scheme.benefitsHi) ? scheme.benefitsHi : scheme.benefits;
    const description = (isHindi && scheme.descriptionHi) ? scheme.descriptionHi : scheme.description;
    const docs = (isHindi && scheme.docsRequiredHi) ? scheme.docsRequiredHi : scheme.docsRequired;

    return (
        <Card className="hover:shadow-lg transition-shadow border-green-100">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <Badge variant={scheme.central ? "default" : "secondary"} className="mb-2">
                        {scheme.central ? 
                            (isHindi ? "केंद्र सरकार" : isTelugu ? "కేంద్ర ప్రభుత్వం" : isMarathi ? "केंद्र सरकार" : isBengali ? "কেন্দ্রীয় সরকার" : isKannada ? "ಕೇಂದ್ರ ಸರ್ಕಾರ" : isTamil ? "மத்திய அரசு" : "Central Govt") 
                            : scheme.state}
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-700">{scheme.type}</Badge>
                </div>
                <CardTitle className="text-xl text-green-800">{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm text-gray-700">
                    <p className="font-medium text-gray-900"><span className="text-green-700 font-bold">
                        {isHindi ? "लाभ:" : isTelugu ? "ప్రయోజనాలు:" : isMarathi ? "फायदे:" : isBengali ? "সুবিধা:" : isKannada ? "ಲಾಭಗಳು:" : isTamil ? "பயன்கள்:" : "Benefits:"}
                    </span> <span className="text-green-600">{benefits}</span></p>
                    <p>{description}</p>
                    {docs && (
                        <div className="flex gap-2 flex-wrap mt-2">
                            <span className="text-xs font-semibold text-gray-500">
                                {isHindi ? "आवश्यक दस्तावेज:" : isTelugu ? "అవసరమైన పత్రాలు:" : isMarathi ? "आवश्यक कागदपत्रे:" : isBengali ? "প্রয়োজনীয় নথি:" : isKannada ? "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು:" : isTamil ? "தேவையான ஆவணங்கள்:" : "Docs Required:"}
                            </span>
                            {docs.map(doc => (
                                <Badge key={doc} variant="secondary" className="text-[10px]">{doc}</Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <VoiceExplainButton
                    textToExplain={`Scheme Name: ${name}. Benefits: ${benefits}. Eligibility: ${description}`}
                    language={language}
                />
                <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-800">
                    <a href={scheme.applyLink} target="_blank" rel="noopener noreferrer">
                        {isHindi ? "आवेदन करें" : isTelugu ? "దరఖాస్తు చేసుకోండి" : isMarathi ? "अर्ज करा" : isBengali ? "আবেদন করুন" : isKannada ? "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ" : isTamil ? "விண்ணப்பிக்கவும்" : "Apply"} <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
};
