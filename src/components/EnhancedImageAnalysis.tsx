import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Camera,
  Zap,
  Bug,
  Leaf,
  Apple,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Droplets,
  Thermometer,
  Activity,
  MapPin,
  BarChart3,
  Target,
  Brain,
  Volume2,
  Play,
  Pause,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import {
  EnhancedDiseaseDetector,
  MultiClassResult,
  DetectionResult,
  PestDetectionResult,
  NutrientDeficiencyResult,
} from "@/lib/enhanced-disease-detection";
import { weatherIntegration } from "@/lib/advanced-weather-integration";
import { translateToHindi } from "@/lib/voice-translation";
import {
  speakText,
  stopSpeech as stopServiceSpeech,
} from "@/services/voiceService";
import { saveAiReport } from "@/services/firebaseService";
import { useAuthStore } from "@/store/authStore";

interface EnhancedImageAnalysisProps {
  analysisType?: "disease" | "pest" | "nutrient" | "soil" | "comprehensive";
  onResultsChange?: (results: MultiClassResult | null) => void;
}

const AgriVisionHUD = () => {
  const { t } = useTranslation();
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-20"
  >
    {/* Scanning Line */}
    <motion.div 
      className="absolute left-0 w-full h-[2px] bg-[#00ff99] shadow-[0_0_15px_#00ff99] z-10"
      initial={{ top: "0%" }}
      animate={{ top: "100%" }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
    
    {/* Radar Pulse */}
    <motion.div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#00ff99] rounded-full"
      animate={{ scale: [1, 10], opacity: [1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
    />

    {/* Ghost Bounding Boxes */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute border border-[#00ff99]/40 bg-[#00ff99]/5"
        initial={{ 
          top: `${20 + Math.random() * 40}%`, 
          left: `${20 + Math.random() * 40}%`,
          width: "30%",
          height: "20%",
          opacity: 0
        }}
        animate={{ 
          opacity: [0, 0.4, 0],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          delay: i * 0.3,
          ease: "easeInOut"
        }}
      >
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff99]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff99]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff99]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff99]" />
      </motion.div>
    ))}

    {/* HUD markers */}
    <div className="absolute top-2 left-2 text-[10px] font-mono text-[#00ff99] flex flex-col bg-black/20 p-1 rounded">
      <span>{t("digitalTwin.visionStatus", { defaultValue: "VISION: ONLINE" })}</span>
      <span>{t("digitalTwin.scanActive", { defaultValue: "SCAN: ACTIVE" })}</span>
    </div>
  </motion.div>
  );
};

const EnhancedImageAnalysis: React.FC<EnhancedImageAnalysisProps> = ({
  onResultsChange,
  analysisType = "disease",
}) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<MultiClassResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [detector] = useState(() => new EnhancedDiseaseDetector());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [voiceLanguage, setVoiceLanguage] = useState<"en" | "hi">("en");

  /* New error state variable added here, ensure useState is imported or updated if needed */
  const [error, setError] = useState<string | null>(null);
  const [dialect, setDialect] = useState("Standard");
  const localize = useCallback(async (text: string) => text, []); // Placeholder for dialect localization logic
  const [speechState, setSpeechState] = useState<
    "idle" | "speaking" | "paused"
  >("idle");
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopSpeech = useCallback(() => {
    stopServiceSpeech();
    setSpeechState("idle");
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopServiceSpeech();
    };
  }, []);

  const translateResults = useCallback(async (lang: string) => {
    if (!results) return;

    setIsAnalyzing(true);
    setProgress(50);
    try {
      // 1. Static Language Translation (Standard)
      let translated = { ...results };
      if (lang !== "en") {
        const { translateAnalysisResults } =
          await import("@/lib/ai-translation");
        translated = await translateAnalysisResults(results, lang);
      }

      // 2. Dialect Localization Mapping
      if (dialect !== "Standard") {
        toast.info(t("common.dialectTransform", { dialect }));

        // Localize priority recommendations
        if (translated.overallHealth.recommendations) {
          translated.overallHealth.recommendations = await Promise.all(
            translated.overallHealth.recommendations.map((rec: string) =>
              localize(rec),
            ),
          );
        }

        // Localize disease treatments
        if (translated.diseases) {
          for (const d of translated.diseases) {
            if (d.treatment) d.treatment = await localize(d.treatment);
          }
        }

        // Localize pest controls
        if (translated.pests) {
          for (const p of translated.pests) {
            if (p.damage) p.damage = await localize(p.damage);
            if (p.chemicalControl)
              p.chemicalControl = await Promise.all(
                p.chemicalControl.map((c: string) => localize(c)),
              );
            if (p.biologicalControl)
              p.biologicalControl = await Promise.all(
                p.biologicalControl.map((c: string) => localize(c)),
              );
          }
        }
      }
      setResults(translated);
      toast.success(t("common.analysisComplete"));
    } catch (err) {
      console.error("Translation failed", err);
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  }, [results, dialect, localize, t]);

  // Listen for global language changes
  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const newLang = customEvent.detail;
      if (results && newLang !== 'en') {
        translateResults(newLang);
      }
    };
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, [results, translateResults]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setSelectedFile(file);
        setResults(null);
        setError(null);
      }
    },
    [],
  );

  /* Store interval ref to clear it on error */
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress(0);
    setResults(null);
    setError(null);

    try {
      // Initialize detector
      await detector.loadModels();
      setProgress(20);

      // Simulate progressive analysis
      progressInterval.current = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 80));
      }, 300);

      // Perform multi-class analysis
      const analysisResults = await detector.detectMultiClass(selectedFile);

      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(100);

      // Apply initial translation if needed
      const currentLang = i18n.language;
      if (currentLang !== "en") {
        const { translateAnalysisResults } =
          await import("@/lib/ai-translation");
        const translated = await translateAnalysisResults(
          analysisResults,
          currentLang,
        );
        setResults(translated);
      } else {
        setResults(analysisResults);
      }

      // AUTO-PERSIST TO FIRESTORE
      if (user?.email) {
        saveAiReport(user.email, "disease-scan", {
          imageName: selectedFile.name,
          results: analysisResults,
          analysisType
        }).catch(err => console.error("Failed to auto-save report:", err));
      }

      onResultsChange?.(analysisResults);
    } catch (error) {
      console.error("Analysis failed:", error);
      if (progressInterval.current) clearInterval(progressInterval.current);

      const errorMessage =
        error instanceof Error ? error.message : "Analysis failed";
      // Set the error state instead of using toast
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [selectedFile, detector, onResultsChange, i18n.language]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "fair":
        return "text-yellow-600";
      case "poor":
        return "text-orange-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6">
        <div className="text-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-4 relative inline-block mx-auto">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                  className="max-w-xs max-h-48 rounded-lg shadow-md"
                />
                <AnimatePresence>
                  {isAnalyzing && <AgriVisionHUD />}
                </AnimatePresence>
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {t("imageAnalysis.uploadPlantImage", "Upload Plant Image")}
                  </p>
                  <p className="text-muted-foreground">
                    {t(
                      "imageAnalysis.supportImages",
                      "Support for leaf, stem, fruit, and soil images",
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center mt-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {t("imageAnalysis.chooseImage", "Choose Image")}
              </Button>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className="flex items-center gap-2 bg-gradient-primary"
              >
                <Brain className="w-4 h-4" />
                {isAnalyzing
                  ? results
                    ? t("imageAnalysis.translating", "Translating...")
                    : t("imageAnalysis.analyzing", "Analyzing...")
                  : t("imageAnalysis.analyzeWithAI", "Analyze with AI")}
              </Button>
            </div>

            {/* Inline Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center gap-2 justify-center animate-in fade-in slide-in-from-top-1">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {results
                  ? t("imageAnalysis.translationProgress")
                  : t("imageAnalysis.analysisProgress")}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground text-center">
              {results
                ? t("imageAnalysis.localizingResults")
                : t("imageAnalysis.processingModels")}
            </p>
          </div>
        )}
      </Card>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Overall Health Score */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {t("imageAnalysis.overallPlantHealth")}
              </h3>
              <div className="flex gap-2 items-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 text-primary border-primary/20 hover:bg-primary/5"
                  onClick={() => {
                    // CLOUD SAVE
                    if (user?.email) {
                      const reportData = {
                        results: results,
                        imageName: selectedFile?.name || "Unknown",
                        analysisType
                      };
                      
                      saveAiReport(user.email, "disease-scan", reportData)
                        .then(() => toast.success(t("imageAnalysis.resultSaved", "Result saved to your cloud profile!")))
                        .catch(() => toast.error("Failed to save to cloud."));
                    } else {
                      // Fallback to local
                      const savedData = {
                        id: Date.now(),
                        timestamp: new Date().toISOString(),
                        results: results,
                        imageName: selectedFile?.name || "Unknown",
                      };

                      const existing = JSON.parse(
                        localStorage.getItem("offlineDiseaseReports") || "[]",
                      );
                      localStorage.setItem(
                        "offlineDiseaseReports",
                        JSON.stringify([savedData, ...existing]),
                      );
                      toast.success(
                        t(
                          "imageAnalysis.resultSaved",
                          "Result saved locally for offline access!",
                        ),
                      );
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-save"
                    >
                      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                      <path d="M17 21v-8H7v8" />
                      <path d="M7 3v5h8" />
                    </svg>
                    {t("common.save", "Save")}
                  </div>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 text-primary border-primary/20 hover:bg-primary/5"
                  onClick={async () => {
                    if (speechState === "speaking") {
                      stopSpeech();
                      return;
                    }

                    const {
                      overallHealth,
                      diseases,
                      pests,
                      nutrientDeficiency,
                      soilAnalysis,
                    } = results;

                    let text = `The overall plant health is ${overallHealth.status}. Score is ${overallHealth.score} out of 100. `;

                    // Diseases
                    if (diseases.length > 0) {
                      text += `I have detected ${diseases.length} disease issues. `;
                      diseases.forEach((d: DetectionResult) => {
                        text += `Found ${d.disease.replace("_", " ")} with ${(d.confidence * 100).toFixed(0)}% confidence. Treatment: ${d.treatment}. `;
                      });
                    } else {
                      text += "No diseases detected. ";
                    }

                    // Pests
                    if (pests.length > 0) {
                      text += `I also found ${pests.length} pest issues. `;
                      pests.forEach((p: PestDetectionResult) => {
                        text += `Identified ${p.pest.replace("_", " ")}. Control it using: ${p.chemicalControl[0] || "recommended pesticides"}. `;
                      });
                    }

                    // Nutrients
                    if (nutrientDeficiency.length > 0) {
                      text += `There are ${nutrientDeficiency.length} nutrient deficiencies. `;
                      nutrientDeficiency.forEach((n: NutrientDeficiencyResult) => {
                        text += `It seems to lack ${n.nutrient.replace("_", " ")}. Recommended fertilizer is ${n.fertilizer}. `;
                      });
                    }

                    // Soil
                    text += `Soil texture is ${soilAnalysis.texture}, and fertility is ${soilAnalysis.fertility}. `;
                    text += `Please check the detailed priority recommendations below.`;

                    // AI-powered translation for speech if not in English
                    const currentLang = i18n.language;
                    let speakLangCode = "en-IN";
                    if (currentLang !== "en") {
                      const { translateText } =
                        await import("@/lib/ai-translation");
                      text = await translateText(text, currentLang);

                      // Map language codes to regional voices if available
                      const voiceMap: Record<string, string> = {
                        hi: "hi-IN",
                        bn: "bn-IN",
                        as: "as-IN",
                        kn: "kn-IN",
                      };
                      speakLangCode = voiceMap[currentLang] || "en-IN";
                    }

                    setSpeechState("speaking");
                    speakText(text, speakLangCode, () => {
                      setSpeechState("idle");
                    });
                    toast.info(
                      t("imageAnalysis.explainingAnalysis"),
                    );
                  }}
                >
                  {speechState === "idle" ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      {voiceLanguage === "hi"
                        ? t("imageAnalysis.explainHindi", "Parinam Samjhayein")
                        : t("imageAnalysis.explainResults", "Explain Results")}
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      {voiceLanguage === "hi"
                        ? t("imageAnalysis.stopHindi", "Rokein")
                        : t("imageAnalysis.stop", "Stop")}
                    </>
                  )}
                </Button>

                {/* Stop Button - Only show when active */}
                {speechState !== "idle" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-2"
                    onClick={stopSpeech}
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </Button>
                )}
                <Badge
                  className={`${getHealthStatusColor(results.overallHealth.status)} text-lg px-3 py-1`}
                >
                  {results.overallHealth.score}/100
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {t("imageAnalysis.healthStatus")}
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold capitalize ${getHealthStatusColor(results.overallHealth.status)}`}
                >
                  {results.overallHealth.status}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {t("imageAnalysis.imageAnalysis")}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground mr-1">{t("imageAnalysis.plantPart")}:</span>
                    <span className="font-medium capitalize">{results.imageAnalysis.plantPart}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground mr-1">{t("imageAnalysis.quality")}:</span>
                    <span className="font-medium capitalize">{results.imageAnalysis.quality}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground mr-1">{t("imageAnalysis.processingTime")}:</span>
                    <span className="font-medium">{results.imageAnalysis.processingTime}ms</span>
                  </p>
                </div>
              </div>
            </div>

            {results.overallHealth.recommendations.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  {t(
                    "imageAnalysis.priorityRecommendations",
                    "Priority Recommendations",
                  )}
                </h4>
                <ul className="text-sm space-y-1">
                  {results.overallHealth.recommendations
                    .slice(0, 3)
                    .map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Detailed Analysis Tabs */}
          <Card className="p-6">
            <Tabs defaultValue="diseases" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="diseases"
                  className="flex items-center gap-2"
                >
                  <Leaf className="w-4 h-4" />
                  {t("imageAnalysis.diseasesTab")} (
                  {results.diseases.length})
                </TabsTrigger>
                <TabsTrigger value="pests" className="flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  {t("imageAnalysis.pestsTab")} ({results.pests.length}
                  )
                </TabsTrigger>
                <TabsTrigger
                  value="nutrients"
                  className="flex items-center gap-2"
                >
                  <Droplets className="w-4 h-4" />
                  {t("imageAnalysis.nutrientsTab")} (
                  {results.nutrientDeficiency.length})
                </TabsTrigger>
                <TabsTrigger value="soil" className="flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  {t("imageAnalysis.soilTab")}
                </TabsTrigger>
              </TabsList>

              {/* Disease Analysis */}
              <TabsContent value="diseases" className="space-y-4">
                {results.diseases.length > 0 ? (
                  results.diseases.map((disease, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg capitalize">
                            {disease.disease.replace("_", " ")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Affected: {disease.affectedPart} • Confidence:{" "}
                            {(disease.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                        <Badge className={getSeverityColor(disease.severity)}>
                          {disease.severity}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">{t("imageAnalysis.symptoms")}</h5>
                          <ul className="text-sm space-y-1">
                            {disease.symptoms.map((symptom, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">{t("imageAnalysis.treatment")}</h5>
                          <p className="text-sm bg-green-50 dark:bg-green-950/30 p-3 rounded">
                            {disease.treatment}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium mb-2">
                              {t("imageAnalysis.preventiveMeasures")}
                            </h5>
                            <ul className="text-xs space-y-1">
                              {disease.preventiveMeasures.map((measure, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5" />
                                  {measure}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">
                              {t("imageAnalysis.economicImpact")}
                            </h5>
                            <p className="text-xs bg-orange-50 dark:bg-orange-950/30 p-2 rounded">
                              {disease.economicImpact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p>
                      {t("imageAnalysis.noDiseasesDetected")}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Pest Analysis */}
              <TabsContent value="pests" className="space-y-4">
                {results.pests.length > 0 ? (
                  results.pests.map((pest, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg capitalize">
                            {pest.pest.replace("_", " ")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {(pest.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                        <Badge className={getSeverityColor(pest.severity)}>
                          {pest.severity}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Damage Type</h5>
                          <p className="text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded">
                            {pest.damage}
                          </p>

                          <h5 className="font-medium mb-2 mt-4">Lifecycle</h5>
                          <p className="text-sm">{pest.lifecycle}</p>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">
                            Biological Control
                          </h5>
                          <ul className="text-sm space-y-1 mb-4">
                            {pest.biologicalControl.map((control, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Bug className="w-3 h-3 text-green-500" />
                                {control}
                              </li>
                            ))}
                          </ul>

                          <h5 className="font-medium mb-2">Chemical Control</h5>
                          <ul className="text-sm space-y-1">
                            {pest.chemicalControl.map((control, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-orange-500" />
                                {control}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p>
                      {t(
                        "imageAnalysis.noPestsDetected",
                        "No pests detected. Plant is pest-free!",
                      )}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Nutrient Analysis */}
              <TabsContent value="nutrients" className="space-y-4">
                {results.nutrientDeficiency.length > 0 ? (
                  results.nutrientDeficiency.map((nutrient, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg capitalize">
                            {nutrient.nutrient.replace("_", " ")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {(nutrient.confidence * 100).toFixed(1)}
                            %
                          </p>
                        </div>
                        <Badge className={getSeverityColor(nutrient.severity)}>
                          {nutrient.severity}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Symptoms</h5>
                          <ul className="text-sm space-y-1">
                            {nutrient.symptoms.map((symptom, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertTriangle className="w-3 h-3 text-yellow-500 mt-1" />
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">
                            Recommended Fertilizer
                          </h5>
                          <p className="text-sm bg-blue-50 dark:bg-blue-950/30 p-3 rounded mb-3">
                            {nutrient.fertilizer}
                          </p>

                          <h5 className="font-medium mb-2">Soil Amendment</h5>
                          <p className="text-sm">{nutrient.soilAmendment}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-2">Growth Impact</h5>
                        <p className="text-sm bg-orange-50 dark:bg-orange-950/30 p-3 rounded">
                          {nutrient.affectedGrowth}
                        </p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p>
                      {t(
                        "imageAnalysis.noNutrientsDetected",
                        "No nutrient deficiencies detected. Nutrition levels are adequate!",
                      )}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Soil Analysis */}
              <TabsContent value="soil" className="space-y-4">
                <Card className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg">
                      {t(
                        "imageAnalysis.soilAnalysisResults",
                        "Soil Analysis Results",
                      )}
                    </h4>
                    <Badge className="bg-primary text-white">
                      {(results.soilAnalysis.confidence * 100).toFixed(1)}%{" "}
                      {t("imageAnalysis.confidence", "Confidence")}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-brown-50 dark:bg-brown-950/30 rounded-lg">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-brown-600" />
                      <div className="font-bold text-lg capitalize">
                        {results.soilAnalysis.texture}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("imageAnalysis.soilTexture", "Soil Texture")}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-bold text-lg">
                        {results.soilAnalysis.ph.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("imageAnalysis.phLevel", "pH Level")}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="font-bold text-lg capitalize">
                        {results.soilAnalysis.fertility}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("imageAnalysis.fertility", "Fertility")}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">Soil Properties</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Moisture:</span>
                          <span className="font-medium">
                            {results.soilAnalysis.moisture.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Organic Matter:</span>
                          <span className="font-medium">
                            {results.soilAnalysis.organicMatter.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Drainage:</span>
                          <span className="font-medium capitalize">
                            {results.soilAnalysis.drainage}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-3">Recommendations</h5>
                      <ul className="text-sm space-y-2">
                        {results.soilAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-1" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedImageAnalysis;
