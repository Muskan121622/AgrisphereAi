import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Map,
  TrendingUp,
  Activity,
  Leaf,
  Bug,
  Sprout,
  Target,
  BarChart3,
  Droplets,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Zap,
  ShoppingBag,
  TrendingDown,
  Clock,
  User,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { GISDigitalTwin } from "@/lib/gis-digital-twin";
import { yieldPredictor } from "@/lib/yield-prediction";
import { weatherIntegration } from "@/lib/advanced-weather-integration";
import Navbar from "@/components/Navbar";
import BentoDashboard from "@/components/BentoDashboard";
import { useAuthStore } from "@/store/authStore";
import { getProfileLocation } from "@/lib/profile-utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getNegotiations, updateNegotiationStatus } from "@/services/firebaseService";
import { useToast } from "@/hooks/use-toast";

interface FarmData {
  totalArea: number;
  irrigationZones?: unknown[];
  pestProneAreas?: unknown[];
  cropGrowthZones?: { health: number }[];
}

interface YieldPrediction {
  crop: string;
  predicted_yield: number;
  confidence?: number;
  confidence_interval: { lower: number; upper: number };
  historical_comparison: { avg_yield_5yr: number; trend: string };
  factors: {
    crop_suitability: number;
    regional_performance: number;
    seasonal_factors: number;
    area_efficiency: number;
  };
  [key: string]: unknown;
}

interface UserProfile {
  name?: string;
  email?: string;
  state?: string;
  district?: string;
  primaryCrop?: string | null;
}

interface Negotiation {
  id: string;
  crop: string;
  buyerName: string;
  originalPrice: number;
  offerPrice: number;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Countered';
  createdAt?: unknown;
}

const ComprehensiveDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [gisEngine] = useState(() => new GISDigitalTwin());
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [yieldPredictions, setYieldPredictions] = useState<YieldPrediction[]>([]);
  const [weatherData, setWeatherData] = useState<unknown[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      const profileLocation = getProfileLocation(user?.email || "");

      try {
        // Use user's real location or fallback to Patna
        const district = profileLocation?.district || "Patna";
        const state = profileLocation?.state || "Bihar";

        // Initialize farm with profile-based coordinates or fallback
        const demoCoordinates = [
          { lat: 26.144, lng: 91.736 },
          { lat: 26.144, lng: 91.737 },
          { lat: 26.145, lng: 91.737 },
          { lat: 26.145, lng: 91.736 },
        ];

        const farm = await gisEngine.initializeFarm(
          `${user?.name || "My"} Farm`,
          user?.name || "Farmer",
          demoCoordinates,
        );
        setFarmData(farm);

        // Generate yield predictions for profile location
        const crops = ["rice", "wheat", "maize", "sugarcane"];
        const predictions = await Promise.all(
          crops.map((crop) =>
            yieldPredictor.predictYield({
              crop,
              district,
              season: "kharif",
              area_hectares: Number(localStorage.getItem(`profile_${user?.email}_farmSize`)) || 2.5,
              year: 2025,
            }),
          ),
        );

        setYieldPredictions(
          crops.map((crop, i) => ({ crop, ...predictions[i] })),
        );

        // Load weather data
        const weather = await weatherIntegration.loadWeatherData(district);
        setWeatherData(weather.slice(0, 30));
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [gisEngine, user?.email, user?.name]);

  useEffect(() => {
    if (user?.name) {
      const fetchNegs = async () => {
        try {
          const data = await getNegotiations({ sellerName: user.name });
          setNegotiations(data as Negotiation[]);
        } catch (err) {
          console.error("Failed to fetch negotiations", err);
        }
      };
      fetchNegs();
    }
  }, [user?.name]);

  const handleNegotiationStatus = async (id: string, status: string) => {
    try {
      await updateNegotiationStatus(id, status);
      setNegotiations(prev => prev.map(n => n.id === id ? { ...n, status: status as 'Accepted' | 'Rejected' } : n));
      toast({
        title: `Offer ${status}`,
        description: `The buyer will be notified of your decision.`
      });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const getYieldColor = (yield_value: number, crop: string) => {
    const thresholds = {
      rice: { good: 3000, fair: 2000 },
      wheat: { good: 3500, fair: 2500 },
      maize: { good: 4000, fair: 3000 },
      sugarcane: { good: 60000, fair: 45000 },
    };

    const threshold = thresholds[crop as keyof typeof thresholds] || {
      good: 3000,
      fair: 2000,
    };

    if (yield_value >= threshold.good) return "text-green-600";
    if (yield_value >= threshold.fair) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t("farmerDashboard.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t("farmerDashboard.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary">
                <Brain className="mr-2 w-5 h-5" />
                {t("farmerDashboard.tabs.disease")}
              </Button>
              <Button size="lg" variant="outline">
                <Map className="mr-2 w-5 h-5" />
                {t("farmerDashboard.tabs.twin")}
              </Button>
              <Button size="lg" variant="outline">
                <TrendingUp className="mr-2 w-5 h-5" />
                {t("farmerDashboard.tabs.yield")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="space-y-12">
            
            {/* 1. Bento Dashboard Overview (Top section) */}
            <BentoDashboard 
              userProfile={{
                  name: user?.name,
                  state: getProfileLocation(user?.email || "")?.state,
                  district: getProfileLocation(user?.email || "")?.district,
                  primaryCrop: localStorage.getItem(`profile_${user?.email}_crop`)
              }}
              weatherData={weatherData}
              farmData={farmData}
              yieldData={yieldPredictions}
            />

            {/* 2. Recent Health Scans & Alerts (Mocked History) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6 px-4 lg:px-6">
                <Leaf className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                  Recent Crop Health History
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 px-4 lg:px-6">
                <Card className="p-5 border-l-4 border-l-green-500 bg-background/50 backdrop-blur">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-green-500 border-green-500">Healthy</Badge>
                    <span className="text-xs text-muted-foreground">Today, 08:30 AM</span>
                  </div>
                  <h3 className="font-bold mb-1">Wheat / Main Field</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">No diseases detected. Canopy color is optimal. Moisture levels stable.</p>
                </Card>

                <Card className="p-5 border-l-4 border-l-yellow-500 bg-background/50 backdrop-blur">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">Warning (Pest)</Badge>
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                  <h3 className="font-bold mb-1">Wheat / North Sector</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">Early signs of Aphid clusters detected. Recommend applying Neem extraction spray locally within 48 hrs.</p>
                </Card>

                <Card className="p-5 border-l-4 border-l-blue-500 bg-background/50 backdrop-blur">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-blue-500 border-blue-500">Nutrients</Badge>
                    <span className="text-xs text-muted-foreground">3 Days Ago</span>
                  </div>
                  <h3 className="font-bold mb-1">Rice / South Edge</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">Slight yellowing matched with Nitrogen deficiency patterns. Urea applied.</p>
                </Card>
              </div>
            </div>

            {/* Marketplace Negotiations */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6 px-4 lg:px-6">
                <ShoppingBag className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600">
                  Marketplace Negotiations
                </h2>
                <Badge className="ml-2 bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {negotiations.filter(n => n.status === 'Pending').length} New Offers
                </Badge>
              </div>
              
              <div className="px-4 lg:px-6">
                <Card className="bg-background/40 backdrop-blur-md border-primary/10 overflow-hidden shadow-xl">
                  {negotiations.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground italic">
                      No active buyer negotiations found.
                    </div>
                  ) : (
                    <div className="divide-y divide-primary/5">
                      {negotiations.map((neg) => (
                        <div key={neg.id} className="p-6 hover:bg-primary/5 transition-colors group">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Leaf className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-bold">{neg.crop}</h3>
                                  <Badge variant={neg.status === 'Pending' ? 'default' : 'secondary'}>
                                    {neg.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                  <User className="w-3.5 h-3.5" /> Buyer: {neg.buyerName}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-8 md:gap-12">
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Your Price</p>
                                <p className="text-xl font-bold line-through opacity-40">₹{neg.originalPrice}</p>
                              </div>
                              <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                                <p className="text-[10px] uppercase tracking-wider text-orange-500 mb-1">Buyer Offer</p>
                                <p className="text-2xl font-black text-orange-500">₹{neg.offerPrice}</p>
                              </div>
                              
                              {neg.status === 'Pending' && (
                                <div className="flex gap-2">
                                  <Button 
                                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                                    onClick={() => handleNegotiationStatus(neg.id, 'Accepted')}
                                  >
                                    Accept Offer
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleNegotiationStatus(neg.id, 'Rejected')}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {neg.message && (
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10 text-sm italic text-muted-foreground">
                              "{neg.message}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Digital Twin Insights */}
            <div>
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {t("farmerDashboard.twin.title")}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t("digitalTwin.subtitle")}
                  </p>
                </div>

                {farmData && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-3 text-green-500" />
                      <h3 className="font-bold mb-2">
                        {t("farmerDashboard.metrics.area")}
                      </h3>
                      <div className="text-2xl font-bold text-green-500">
                        {farmData.totalArea.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("farmerDashboard.metrics.hectares")}
                      </div>
                    </Card>

                    <Card className="p-6 text-center">
                      <Droplets className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                      <h3 className="font-bold mb-2">
                        {t("fertilizer.irrigationTitle")}
                      </h3>
                      <div className="text-2xl font-bold text-blue-500">
                        {farmData.irrigationZones?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("farmerDashboard.twin.activeZones")}
                      </div>
                    </Card>

                    <Card className="p-6 text-center">
                      <Bug className="w-8 h-8 mx-auto mb-3 text-red-500" />
                      <h3 className="font-bold mb-2">
                        {t("disease.pestsCount")}
                      </h3>
                      <div className="text-2xl font-bold text-red-500">
                        {farmData.pestProneAreas?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("farmerDashboard.twin.monitored")}
                      </div>
                    </Card>

                    <Card className="p-6 text-center">
                      <Activity className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                      <h3 className="font-bold mb-2">
                        {t("digitalTwin.accuracy")}
                      </h3>
                      <div className="text-2xl font-bold text-purple-500">
                        {farmData.cropGrowthZones?.length > 0
                          ? Math.round(
                              farmData.cropGrowthZones.reduce(
                                (sum, zone) => sum + zone.health,
                                0,
                              ) / farmData.cropGrowthZones.length,
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("farmerDashboard.twin.average")}
                      </div>
                    </Card>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Map className="w-5 h-5 text-primary" />
                      {t("farmerDashboard.twin.spatialFeatures")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{t("digitalTwin.visualization")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{t("disease.how.s1.title")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{t("fertilizer.irrigationTitle")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{t("pest.title")}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      {t("farmerDashboard.twin.precisionBenefits")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded">
                        <span>{t("home.heroTitle2")}</span>
                        <Badge className="bg-green-500 text-white">25%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded">
                        <span>
                          {t("farmerDashboard.tabs.yield")}{" "}
                          {t("home.stats.yieldIncrease")}
                        </span>
                        <Badge className="bg-blue-500 text-white">35%</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Yield Prediction Insights */}
            <div>
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {t("farmerDashboard.yield.advancedTitle")}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t("yield.desc")}
                  </p>
                </div>

                {yieldPredictions.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-8">
                    {yieldPredictions.map((pred, idx) => (
                      <Card key={idx} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold capitalize">
                              {t(`common.crops.${pred.crop}`)}
                            </h3>
                            <p className="text-muted-foreground">
                              {t("yield.kharifSeason")}
                            </p>
                          </div>
                          <Badge className="bg-primary text-white">
                            {pred.crop === "sugarcane"
                              ? (pred.predicted_yield / 1000).toFixed(1) +
                                " " +
                                t("yield.tonsPerHa")
                              : (pred.predicted_yield / 1000).toFixed(2) +
                                " " +
                                t("yield.tonsPerHa")}
                          </Badge>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between">
                            <span>{t("yield.confidenceRange")}:</span>
                            <span className="font-medium">
                              {(pred.confidence_interval.lower / 1000).toFixed(
                                1,
                              )}{" "}
                              -{" "}
                              {(pred.confidence_interval.upper / 1000).toFixed(
                                1,
                              )}{" "}
                              {t("yield.tonsPerHa")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("yield.fiveYearAvg")}:</span>
                            <span className="font-medium">
                              {(
                                pred.historical_comparison.avg_yield_5yr / 1000
                              ).toFixed(1)}{" "}
                              {t("yield.tonsPerHa")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("yield.trend")}:</span>
                            <Badge
                              className={`${
                                pred.historical_comparison.trend ===
                                "increasing"
                                  ? "bg-green-500"
                                  : pred.historical_comparison.trend ===
                                      "decreasing"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                              } text-white capitalize`}
                            >
                              {pred.historical_comparison.trend}
                            </Badge>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">
                            {t("yield.inputTitle")}
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span>
                                {t("marketplace.advisory.selectCrop")}:
                              </span>
                              <span>{pred.factors.crop_suitability}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t("yield.regionalPerformance")}:</span>
                              <span>{pred.factors.regional_performance}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t("fertilizer.growthStage")}:</span>
                              <span>{pred.factors.seasonal_factors}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t("farmerDashboard.metrics.area")}:</span>
                              <span>{pred.factors.area_efficiency}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {t("farmerDashboard.yield.modelPerformance")}
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("yield.models.rf")}
                      </h4>
                      <div className="text-2xl font-bold text-blue-600">
                        94%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("farmerDashboard.metrics.accuracy")}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("yield.models.lstm")}
                      </h4>
                      <div className="text-2xl font-bold text-green-600">
                        92%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("farmerDashboard.metrics.accuracy")}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("yield.models.gb")}
                      </h4>
                      <div className="text-2xl font-bold text-purple-600">
                        96%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("farmerDashboard.metrics.accuracy")}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("yield.models.xgb")}
                      </h4>
                      <div className="text-2xl font-bold text-orange-600">
                        95%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("farmerDashboard.metrics.accuracy")}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ComprehensiveDashboard;
