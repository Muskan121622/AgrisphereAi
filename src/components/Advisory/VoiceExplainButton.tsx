import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Volume2, StopCircle } from "lucide-react";
import {
  simplifyTextForFarmer,
  speakText,
  stopSpeech,
} from "../../services/voiceService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { SupportedNewsLanguage } from "../../services/newsService";

interface VoiceExplainButtonProps {
  textToExplain: string;
  context?: string; // e.g., "Scheme Details"
  language?: SupportedNewsLanguage;
}

export const VoiceExplainButton: React.FC<VoiceExplainButtonProps> = ({
  textToExplain,
  context,
  language = "Hindi",
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleExplain = async () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsLoading(true);
      toast.info(
        t(
          "voiceExplain.simplifying",
          "AI is simplifying the explanation in {{language}}...",
          { language },
        ),
      );

      const simplifiedText = await simplifyTextForFarmer(
        textToExplain,
        language,
      );

      setIsLoading(false);
      setIsSpeaking(true);
      toast.success(
        t("voiceExplain.playing", "Playing explanation in {{language}}", {
          language,
        }),
      );

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

      speakText(simplifiedText, localeMap[language] || "en-IN");

      // Reset state when speech ends (approximate or via event listener if we moved logic here)
      // Note: Since we can't easily attach onend to the exact utterance created in service without refactoring,
      // we'll rely on user manually stopping or just letting it finish.
      // For better UX, we could auto-reset after estimated time, but manual stop is fine.
      const utterance = new SpeechSynthesisUtterance(simplifiedText);
      utterance.onend = () => setIsSpeaking(false);
    } catch (error) {
      console.error("Voice Explain Error", error);
      setIsLoading(false);
      setIsSpeaking(false);
      toast.error(t("voiceExplain.failed", "Failed to explain details."));
    }
  };

  return (
    <Button
      variant={isSpeaking ? "destructive" : "outline"}
      size="sm"
      onClick={handleExplain}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSpeaking ? (
        <StopCircle className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      {isSpeaking
        ? t("voiceExplain.stop", "Stop")
        : t("voiceExplain.explain", "Explain (Voice)")}
    </Button>
  );
};
