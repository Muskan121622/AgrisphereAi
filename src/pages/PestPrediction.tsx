
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Leaf, Droplets, CloudRain, Thermometer, Volume2, Mic, StopCircle, ArrowLeft } from "lucide-react";
import { simplifyTextForFarmer, speakText, stopSpeech } from "@/services/voiceService";
import axios from 'axios';

import { useTranslation } from "react-i18next";
import { translateAnalysisResults } from "@/lib/ai-translation";
import { useDialect } from "@/lib/use-dialect";

const PestPrediction = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { dialect, localize } = useDialect();
    const [crop, setCrop] = useState("rice");
    const [temp, setTemp] = useState(30);
    const [humidity, setHumidity] = useState(70);
    const [rainfall, setRainfall] = useState(50);
    const [loading, setLoading] = useState(false);
    const [rawResult, setRawResult] = useState<any>(null);
    const [result, setResult] = useState<any>(null);
    const [explanation, setExplanation] = useState<string>("");
    const [isExplaining, setIsExplaining] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    React.useEffect(() => {
        const translateData = async () => {
            if (!rawResult) return;
            
            // Map the frontend language tag to the backend expectation for the analyzer
            const langMap: Record<string, string> = {
                'en': 'English',
                'hi': 'Hindi',
                'bn': 'Bengali',
                'as': 'Assamese',
                'kn': 'Kannada'
            };
            const targetLang = langMap[i18n.language] || 'English';
            
            // The AI only needs to translate if the target isn't English, 
            // but the translation utility handles that conditionally
            setLoading(true);
            try {
                // translateAnalysisResults is smart enough to skip translation if lang is English
                const translated = await translateAnalysisResults(rawResult, targetLang);
                setResult(translated);
            } catch (error) {
                console.error("Translation error:", error);
                setResult(rawResult); // fallback to English
            } finally {
                setLoading(false);
            }
        };

        translateData();
    }, [rawResult, i18n.language]);

    const handlePredict = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/predict-pest', {
                crop,
                temp,
                humidity,
                rainfall
            });
            setRawResult(response.data);
        } catch (error) {
            console.error("Prediction failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExplain = async () => {
        if (!result) return;

        // Stop if already speaking
        if (isSpeaking) {
            stopSpeech();
            setIsSpeaking(false);
            return;
        }

        setIsExplaining(true);
        setExplanation(""); // Clear previous

        try {
            // Map the frontend language tag
            const langMap: Record<string, string> = {
                'en': 'English',
                'hi': 'Hindi',
                'bn': 'Bengali',
                'as': 'Assamese',
                'kn': 'Kannada'
            };
            const lang = langMap[i18n.language] || 'English';
            
            const voiceMap: Record<string, string> = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'bn': 'bn-IN',
                'as': 'en-US', // Fallback, web speech synthesis rarely has pure Assamese code
                'kn': 'kn-IN'
            };
            const voiceLang = voiceMap[i18n.language] || 'en-US';

            // Construct a data summary for the AI using i18n
            const dataSummary = t('pest.summary.crop', { crop }) + " " +
                t('pest.summary.weather', { temp, humidity, rainfall }) + " " +
                t('pest.summary.prediction', { name: result.primary_pest.pest_name, level: result.primary_pest.risk_level, score: result.primary_pest.risk_score }) + " " +
                t('pest.summary.recommendation', { recommendation: result.primary_pest.recommendation });

            let text = await simplifyTextForFarmer(dataSummary, lang);
            
            // Apply Dialect Localization if needed
            if (dialect !== 'Standard') {
                text = await localize(text);
            }
            
            setExplanation(text);

            setIsSpeaking(true);
            speakText(text, voiceLang, () => {
                setIsSpeaking(false);
            });

        } catch (error) {
            console.error(error);
        } finally {
            setIsExplaining(false);
        }
    };

    const getRiskColor = (level: string) => {
        if (level === 'High') return 'text-red-600';
        if (level === 'Medium') return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <Button variant="ghost" className="mb-4 hover:bg-primary/10 px-0 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4" /> {t('disease.backHome')}
            </Button>

            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                {t('pest.title')}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('pest.inputTitle')}</CardTitle>
                        <CardDescription>{t('pest.inputDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>{t('pest.selectCrop')}</Label>
                            <Select onValueChange={setCrop} defaultValue={crop}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('pest.selectCrop')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rice">{t('common.crops.rice')}</SelectItem>
                                    <SelectItem value="wheat">{t('common.crops.wheat')}</SelectItem>
                                    <SelectItem value="cotton">{t('common.crops.cotton')}</SelectItem>
                                    <SelectItem value="maize">{t('common.crops.maize')}</SelectItem>
                                    <SelectItem value="tomato">{t('common.crops.tomato')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label className="flex items-center gap-2"><Thermometer className="h-4 w-4" /> {t('pest.temp')}</Label>
                                <span className="font-bold">{temp}°C</span>
                            </div>
                            <Slider value={[temp]} min={0} max={50} step={1} onValueChange={(v) => setTemp(v[0])} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label className="flex items-center gap-2"><Droplets className="h-4 w-4" /> {t('pest.humidity')}</Label>
                                <span className="font-bold">{humidity}%</span>
                            </div>
                            <Slider value={[humidity]} min={0} max={100} step={1} onValueChange={(v) => setHumidity(v[0])} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label className="flex items-center gap-2"><CloudRain className="h-4 w-4" /> {t('pest.rainfall')}</Label>
                                <span className="font-bold">{rainfall} mm</span>
                            </div>
                            <Slider value={[rainfall]} min={0} max={200} step={5} onValueChange={(v) => setRainfall(v[0])} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handlePredict} disabled={loading}>
                            {loading ? t('pest.analyzing') : t('pest.predictBtn')}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 backdrop-blur-md"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-400">
                                                <Mic className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-indigo-300">{t('pest.advisorTitle')}</h3>
                                                <p className="text-xs text-muted-foreground">{t('pest.advisorDesc')}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant={isSpeaking ? "destructive" : "outline"}
                                                className={isSpeaking ? "" : "border-indigo-500/30 hover:bg-indigo-500/10"}
                                                onClick={() => handleExplain()}
                                                disabled={isExplaining}
                                            >
                                                {isExplaining ? (
                                                    <span className="animate-spin mr-2">⏳</span>
                                                ) : isSpeaking ? (
                                                    <StopCircle className="h-4 w-4 mr-1" />
                                                ) : (
                                                    <Volume2 className="h-4 w-4 mr-1" />
                                                )}
                                                {isSpeaking ? t('pest.stopBtn') : t('pest.advisorDesc')}
                                            </Button>
                                        </div>
                                    </div>

                                    {explanation && (
                                        <div className="p-3 bg-background/40 rounded-lg text-sm leading-relaxed border border-white/5 animate-in fade-in slide-in-from-top-2">
                                            <p>"{explanation}"</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                            <Card className="border-l-4 border-l-blue-500 shadow-md">
                                <CardHeader>
                                    <CardTitle>{t('pest.resultsTitle')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center mb-6">
                                        <h3 className="text-lg text-gray-500">{t('pest.probability')}</h3>
                                        <div className={`text-5xl font-extrabold ${getRiskColor(result.primary_pest.risk_level)}`}>
                                            {result.primary_pest.risk_score}%
                                        </div>
                                        <div className={`text-xl font-bold mt-2 ${getRiskColor(result.primary_pest.risk_level)}`}>
                                            {t('pest.riskLevel', { level: result.primary_pest.risk_level })}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-700 mb-2">{t('pest.primaryThreat')}: {result.primary_pest.pest_name}</h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <strong>{t('pest.recommendation')}:</strong> {result.primary_pest.recommendation}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('pest.forecast7Days')}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={result.forecast_7_days}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" fontSize={12} tickMargin={5} />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="risk_score" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <Card className="h-full flex items-center justify-center bg-gray-50 border-dashed">
                            <CardContent className="text-center text-gray-500">
                                <Leaf className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p>{t('pest.readyDesc')}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PestPrediction;
