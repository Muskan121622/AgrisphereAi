import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Volume2, 
  ShieldAlert,
  Loader2,
  VolumeX,
  Sun
} from "lucide-react";
import { speakText, stopSpeech } from "@/services/voiceService";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface BulletinData {
  greeting: string;
  weather_summary: string;
  market_summary: string;
  voice_script: string;
  weather_risk: string;
  temp: number | string;
}

const BulletinCard = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<BulletinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchBulletin();
    return () => stopSpeech();
  }, [i18n.language]);

  const fetchBulletin = async () => {
    setIsLoading(true);

    const getPos = (): Promise<GeolocationPosition | null> =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          () => resolve(null),
          { timeout: 5000 }
        );
      });

    try {
      const pos = await getPos();
      const lang = i18n.language;

      const payload: any = {
        language: lang === 'hi' ? 'Hindi' : 'English',
        crop: "Wheat"
      };

      if (pos) {
        payload.lat = pos.coords.latitude;
        payload.lon = pos.coords.longitude;
        console.log(`Bulletin: Using coordinates ${payload.lat}, ${payload.lon}`);
      } else {
        // Fallback to demo location
        payload.state = "Punjab";
        payload.district = "Amritsar";
        console.log("Bulletin: Geolocation unavailable, using fallback Punjab.");
      }

      const response = await axios.post("http://localhost:5000/daily-bulletin", payload);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching bulletin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else if (data?.voice_script) {
      setIsPlaying(true);
      const lang = i18n.language === 'en' ? 'en-IN' : 'hi-IN';
      
      speakText(data.voice_script, lang, () => {
        setIsPlaying(false);
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="glass p-8 flex items-center justify-center border-primary/20 min-h-[180px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground animate-pulse">{t('home.bulletin.generating')}</p>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const isWarning = data.weather_risk === 'Warning' || data.weather_risk === 'Critical';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full mb-12"
    >
      <Card className={`relative overflow-hidden group border-2 transition-all duration-500 ${isWarning ? 'border-red-500/50 shadow-glow-error' : 'border-primary/30 shadow-glow-primary'} bg-background/40 backdrop-blur-xl p-8`}>
        {/* Animated Accent Background */}
        <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[80px] rounded-full opacity-20 transition-colors duration-500 ${isWarning ? 'bg-red-500' : 'bg-primary'}`} />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${isWarning ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                  {isWarning ? '⚠️ High Alert' : '✅ Today\'s Update'}
                </div>
                <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              
              <motion.h3 
                className="text-3xl md:text-4xl font-bold mb-3 gradient-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {data.greeting}
              </motion.h3>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className={`p-4 rounded-2xl border ${isWarning ? 'bg-red-500/5 border-red-500/20' : 'bg-primary/5 border-primary/20'}`}>
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    {isWarning ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                    <span className="text-xs font-bold uppercase tracking-wider">{t('nav.weather', 'Weather')}</span>
                  </div>
                  <p className="text-sm leading-relaxed font-medium">{data.weather_summary}</p>
                </div>

                <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('nav.marketplace', 'Market')}</span>
                  </div>
                  <p className="text-sm leading-relaxed font-medium">{data.market_summary}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button
                size="icon"
                className={`w-20 h-20 rounded-2xl transition-all duration-300 shadow-xl ${isPlaying ? 'bg-red-500 shadow-glow-error animate-pulse' : 'bg-gradient-primary shadow-glow-primary hover:scale-105'}`}
                onClick={toggleVoice}
              >
                {isPlaying ? <VolumeX className="w-8 h-8 text-white" /> : <Volume2 className="w-8 h-8 text-white" />}
              </Button>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {isPlaying ? t('home.bulletin.stopAudio') : t('home.bulletin.playBulletin')}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BulletinCard;
