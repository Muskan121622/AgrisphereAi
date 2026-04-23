import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Volume2,
  ShieldAlert,
  Loader2,
  VolumeX,
  Sun,
  CloudRain,
  Thermometer,
  MapPin,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { speakText, stopSpeech } from "@/services/voiceService";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "@/config/api.ts";

interface BulletinData {
  greeting: string;
  weather_summary: string;
  market_summary: string;
  voice_script: string;
  weather_risk: string;
  temp: number | string;
  location_display?: string;
}


const BulletinCard = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<BulletinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [resolvedGeo, setResolvedGeo] = useState<{ city: string; state: string } | null>(null);
  // Ref so catch block always reads the latest geo without needing it in useCallback deps
  const geoRef = useRef<{ city: string; state: string } | null>(null);

  const isHindi =
    i18n.resolvedLanguage?.startsWith("hi") || i18n.language.startsWith("hi");

  const fetchBulletin = useCallback(async () => {
    setIsLoading(true);

    // Get GPS coordinates from browser
    const getPos = (): Promise<GeolocationPosition | null> =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          () => resolve(null),
          { timeout: 8000, enableHighAccuracy: true },
        );
      });

    // Reverse geocode using Nominatim (free, browser-side, no API key needed)
    const reverseGeocode = async (
      lat: number,
      lon: number,
    ): Promise<{ city: string; state: string } | null> => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          { headers: { "Accept-Language": "en" } },
        );
        if (!res.ok) return null;
        const json = await res.json();
        const addr = json.address || {};
        // Nominatim field priority for Indian locations
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.county ||
          addr.district ||
          addr.state_district ||
          null;
        const state = addr.state || null;
        return city ? { city, state } : null;
      } catch {
        return null;
      }
    };

    try {
      const pos = await getPos();
      const lang = isHindi ? "Hindi" : "English";

      const payload: Record<string, string | number | null> = {
        language: lang,
        crop: selectedCrop,
      };

      if (pos) {
        const { latitude: lat, longitude: lon } = pos.coords;
        payload.lat = lat;
        payload.lon = lon;

        // Also resolve city/state in the browser so backend always gets real location
        const geo = await reverseGeocode(lat, lon);
        if (geo) {
          payload.city = geo.city;
          payload.state = geo.state;
          geoRef.current = geo;
          setResolvedGeo(geo);
          console.log(`📍 Bulletin location resolved: ${geo.city}, ${geo.state}`);
        }
      }

      const response = await axios.post(
        `${API_BASE_URL}/daily-bulletin`,
        payload,
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching bulletin:", error);
      // Use real detected location even in fallback (read from ref to avoid stale closure)
      const fallbackLocation = geoRef.current
        ? `${geoRef.current.city}, ${geoRef.current.state}`
        : undefined;
      setData({
        greeting: isHindi ? "नमस्ते, किसान दोस्त!" : "Greetings, Farmer!",
        weather_summary: isHindi
          ? "मौसम स्थिर है। बुवाई के लिए अच्छा समय है।"
          : "Skies are clear. Ideal conditions for harvesting.",
        market_summary: isHindi
          ? "मंडी भाव ₹2250 के आसपास है।"
          : "Local Mandi rate is around ₹2250/Qtl.",
        voice_script: isHindi
          ? "नमस्ते, मौसम आज स्थिर रहेगा और मंडी के भाव आपके पक्ष में हैं।"
          : "Hello, weather will remain stable today and market rates are in your favor.",
        weather_risk: "Optimal",
        temp: 28,
        location_display: fallbackLocation,
      });
      toast.error(
        t("home.bulletin.fetchError", "Failed to update bulletin (Using cached data)"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [isHindi, selectedCrop, t]);

  useEffect(() => {
    fetchBulletin();
    return () => stopSpeech();
  }, [fetchBulletin]);

  const toggleVoice = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else if (data?.voice_script) {
      setIsPlaying(true);
      const lang = isHindi ? "hi-IN" : "en-IN";

      speakText(data.voice_script, lang, () => {
        setIsPlaying(false);
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden bg-background/40 backdrop-blur-xl border-primary/20 p-8 min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="absolute inset-0 blur-sm bg-primary/20 animate-pulse rounded-full" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60 animate-pulse">
            {t("home.bulletin.generating", "Synchronizing Agri-Vision...")}
          </p>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const isWarning =
    data.weather_risk === "Warning" || data.weather_risk === "Critical";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full mb-12"
    >
      <Card
        className={`relative overflow-hidden group border-2 transition-all duration-700 ${
          isWarning
            ? "border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
            : "border-primary/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
        } bg-background/30 backdrop-blur-2xl p-8 rounded-3xl`}
      >
        {/* Animated Background Orbs */}
        <div
          className={`absolute -right-20 -top-20 w-80 h-80 blur-[100px] rounded-full opacity-20 transition-colors duration-1000 ${
            isWarning ? "bg-red-500 animate-pulse" : "bg-primary animate-float"
          }`}
        />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 blur-[80px] rounded-full opacity-10 bg-accent" />

        <div className="relative z-10">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-10">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.15em] uppercase ${
                    isWarning
                      ? "bg-red-500/20 text-red-500 border border-red-500/30"
                      : "bg-primary/10 text-primary border border-primary/20"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isWarning ? "bg-red-500" : "bg-primary"
                      }`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isWarning ? "bg-red-400" : "bg-primary/80"
                      }`}
                    ></span>
                  </span>
                  {isWarning
                    ? t("home.bulletin.highAlert", "High Alert")
                    : t("home.bulletin.todayUpdate", "Agri-Bulletin Live")}
                </div>

                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <MapPin className="w-3 h-3 text-accent" />
                  {data.location_display ||
                    (resolvedGeo ? `${resolvedGeo.city}, ${resolvedGeo.state}` : (isHindi ? "भारत" : "India"))}
                </div>


                <div className="ml-auto text-xs font-medium text-muted-foreground/60 tracking-widest uppercase">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2 mb-8"
              >
                <div className="flex items-center gap-2 group/title">
                  <h3 className="text-4xl md:text-5xl font-black gradient-text tracking-tighter">
                    {data.greeting}
                  </h3>
                  <ChevronRight className="w-8 h-4 text-primary opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-2 transition-all" />
                </div>
                <p className="text-muted-foreground font-medium flex items-center gap-2 tracking-wide uppercase text-xs">
                  <Leaf className="w-3 h-3 text-primary/60" />
                  Optimizing Strategy for <span className="text-primary font-black underline underline-offset-4">{selectedCrop}</span>
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Weather Insight */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-3xl border transition-all duration-300 ${
                    isWarning
                      ? "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isWarning ? 'bg-red-500 text-white' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {isWarning ? <ShieldAlert className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
                        {t("home.bulletin.weather", "Environment")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-black text-xl">
                      <Thermometer className="w-4 h-4 text-accent" />
                       {data.temp}°
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed font-semibold text-foreground/80">
                    {data.weather_summary}
                  </p>
                </motion.div>

                {/* Market Insight */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-3xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-accent text-white shadow-lg shadow-accent/20">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
                      {t("home.bulletin.marketplace", "Harvest Value")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed font-semibold text-foreground/80">
                    {data.market_summary}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Premium Audio Control */}
            <div className="flex flex-col items-center justify-center p-6 bg-primary/5 border border-primary/20 rounded-[2.5rem] min-w-[200px] group/audio">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer"
                onClick={toggleVoice}
              >
                <div className={`absolute inset-0 rounded-[2rem] blur-2xl transition-opacity duration-500 ${isPlaying ? 'bg-red-500 opacity-40' : 'bg-primary opacity-30'}`} />
                <Button
                  size="icon"
                  className={`w-28 h-28 rounded-[2.5rem] transition-all duration-500 border-4 border-background/50 ${
                    isPlaying
                      ? "bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]"
                      : "bg-gradient-to-br from-primary to-primary-dark shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:shadow-primary/50"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="stop"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <VolumeX className="w-12 h-12 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Volume2 className="w-12 h-12 text-white group-hover/audio:scale-110 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              <div className="mt-8 text-center space-y-1">
                <span className="block text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                  {isPlaying ? t("home.bulletin.stopAudio", "Interrupt") : t("home.bulletin.playBulletin", "Audio Brief")}
                </span>
                <span className="block text-[8px] text-muted-foreground uppercase font-bold tracking-widest opacity-40">
                  {isPlaying ? "Voices: Neural Engine" : "Powered by Agri-AI"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BulletinCard;
