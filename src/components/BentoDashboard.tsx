import React from "react";
import { motion } from "framer-motion";
import { 
  CloudSun, 
  Sprout, 
  TrendingUp, 
  AlertTriangle, 
  Brain, 
  Map as MapIcon, 
  Droplets,
  Zap,
  ArrowRight,
  ShieldCheck,
  PhoneCall
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface BentoDashboardProps {
  userProfile: any;
  weatherData: any;
  farmData: any;
  yieldData: any[];
}

const BentoDashboard: React.FC<BentoDashboardProps> = ({ 
  userProfile, 
  weatherData, 
  farmData, 
  yieldData 
}) => {
  const { t } = useTranslation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-auto gap-4 p-4 lg:p-6"
    >
      {/* 1. Profile Welcome - Double Wide */}
      <motion.div variants={item} className="md:col-span-2 lg:col-span-3 row-span-1">
        <Card className="h-full bg-gradient-to-br from-green-600 to-green-800 text-white p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <Badge className="bg-white/20 text-white border-none mb-4 backdrop-blur-md">
              <Zap className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" /> {t("common.live", "Live Monitoring")}
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Namaste, {userProfile?.name || "Kisan Bhai"}!</h2>
            <p className="text-green-50 opacity-90 text-sm max-w-[80%]">
              Everything is looking good on your <span className="font-bold underline">{farmData?.totalArea.toFixed(1) || "2.5"} Hectare</span> farm in <span className="font-bold">{userProfile?.state || "Bihar"}</span>.
            </p>
          </div>
          <div className="mt-6 flex gap-3 relative z-10">
            <Link to="/ai-advisory">
                <Button variant="secondary" size="sm" className="bg-white text-green-800 hover:bg-green-50">
                    {t("nav.advisory", "Speak to AI Expert")}
                </Button>
            </Link>
          </div>
          <Sprout className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 rotate-12" />
        </Card>
      </motion.div>

      {/* 2. Weather Grid - Single */}
      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className="h-full p-6 flex flex-col items-center justify-center text-center bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50">
          <CloudSun className="w-10 h-10 text-blue-500 mb-2" />
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">32°C</div>
          <div className="text-xs font-medium text-blue-600/70 uppercase tracking-wider uppercase">{t("weather.temp", "Partly Cloudy")}</div>
          <div className="mt-4 text-[10px] text-blue-800/50 dark:text-blue-200/50">
            {t("weather.toasts.safeDesc", "No rain expected for 48h")}
          </div>
        </Card>
      </motion.div>

      {/* 3. Daily AI Recommendation - Single/Double */}
      <motion.div variants={item} className="md:col-span-1 lg:col-span-2 row-span-1">
        <Card className="h-full p-6 bg-slate-950 border-slate-800 text-slate-200 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-bold text-sm tracking-tight">{t("common.aiTip", "AI Advisory Tooltip")}</h3>
            </div>
            <p className="text-sm italic text-slate-400 leading-relaxed">
              "Based on high humidity and your {userProfile?.primaryCrop || "Rice"} crop, apply a preventive Neem-oil spray to avoid fungal growth over the next 3 days."
            </p>
            <div className="mt-4 border-t border-slate-800 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Updated 5m ago</span>
                <Link to="/ai-advisory" className="text-purple-400 text-xs font-bold hover:underline">Read Detail →</Link>
            </div>
        </Card>
      </motion.div>

      {/* 4. Market Trends - Single */}
      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className="h-full p-4 flex flex-col justify-between border-orange-100 bg-orange-50 dark:bg-orange-950/10">
          <div className="flex justify-between items-start">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <Badge variant="outline" className="text-[10px] bg-orange-200 text-orange-700 border-none">Live</Badge>
          </div>
          <div>
            <div className="text-xs text-orange-800/70 mb-1">{userProfile?.primaryCrop || "Wheat"} Market</div>
            <div className="text-xl font-bold text-orange-900 dark:text-orange-300">₹2,450 <span className="text-[10px] font-normal text-green-600">▲+2%</span></div>
            <div className="text-[10px] text-orange-700/50 uppercase mt-1">Per Quintal</div>
          </div>
          <Link to="/marketplace" className="mt-4">
            <Button variant="ghost" size="sm" className="w-full text-[10px] h-7 bg-orange-200/50 hover:bg-orange-200 text-orange-800">
              View Mandis
            </Button>
          </Link>
        </Card>
      </motion.div>

      {/* 5. GIS Farm View - Triple Wide */}
      <motion.div variants={item} className="md:col-span-3 lg:col-span-4 row-span-2 min-h-[300px]">
        <Card className="h-full p-0 overflow-hidden relative group">
           <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                {/* Mock Map Background */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                {/* Simulated Polygon Overlay */}
                <svg className="absolute w-[80%] h-[80%] opacity-70" viewBox="0 0 100 100">
                    <polygon points="20,30 80,20 90,80 10,70" className="fill-green-500/30 stroke-green-400 stroke-2" />
                    <circle cx="50" cy="50" r="2" fill="white" className="animate-ping" />
                    <circle cx="50" cy="50" r="1" fill="white" />
                </svg>

                <div className="relative z-10 text-center p-8">
                    <MapIcon className="w-12 h-12 text-green-400 mx-auto mb-4 drop-shadow-lg" />
                    <h3 className="text-white font-bold text-lg mb-2">Digital Twin Active</h3>
                    <p className="text-slate-300 text-xs mb-4">Precision boundary mapped in {userProfile?.district || 'Patna'}, {userProfile?.state || 'Bihar'}</p>
                    <div className="flex gap-2 justify-center">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Soil Health: Good</Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Moisture: 42%</Badge>
                    </div>
                </div>
           </div>
           
           <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20">
                <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white flex gap-4">
                    <div className="text-center px-2 border-r border-white/10">
                        <div className="text-[10px] opacity-60">Temperature</div>
                        <div className="text-sm font-bold">28°C</div>
                    </div>
                    <div className="text-center px-2">
                        <div className="text-[10px] opacity-60">Soil NPK</div>
                        <div className="text-sm font-bold text-green-400">Optimal</div>
                    </div>
                </div>
                <Link to="/digital-twin">
                    <Button size="sm" className="bg-green-600 hover:bg-green-500 text-xs">
                        Enter GIS Control <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                </Link>
           </div>
        </Card>
      </motion.div>

      {/* 6. Crop Health Card - Single */}
      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className="h-full p-4 bg-green-50 dark:bg-green-950/10 border-green-100 flex flex-col justify-between">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="text-[10px] font-bold text-green-800 uppercase tracking-widest uppercase">Safe</span>
            </div>
            <div className="my-4">
                <div className="text-xs text-green-800/70 mb-1">Recent Scans</div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-300">Healthy</div>
            </div>
            <Link to="/disease-detection">
                <Button size="sm" variant="outline" className="w-full text-[10px] h-7 border-green-300 text-green-800 hover:bg-green-100">
                    New Scan
                </Button>
            </Link>
        </Card>
      </motion.div>

      {/* 7. Quick Action Hub - Single */}
      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className="h-full p-4 flex flex-col gap-2 bg-slate-50 dark:bg-slate-900 border-none">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">Quick Tools</h4>
            <Button variant="ghost" className="justify-start text-xs h-9 hover:bg-white shadow-sm" asChild>
                <Link to="/marketplace">
                    <TrendingUp className="w-4 h-4 mr-2 text-orange-500" /> Market Intelligence
                </Link>
            </Button>
            <Button variant="ghost" className="justify-start text-xs h-9 hover:bg-white shadow-sm" asChild>
                <Link to="/advisory-hub">
                    <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" /> Govt Schemes
                </Link>
            </Button>
            <Button variant="ghost" className="justify-start text-xs h-9 hover:bg-white shadow-sm text-red-600 hover:text-red-700" asChild>
                <Link to="/private-chat">
                   <PhoneCall className="w-4 h-4 mr-2" /> Kisan Call Centre
                </Link>
            </Button>
        </Card>
      </motion.div>

    </motion.div>
  );
};

export default BentoDashboard;
