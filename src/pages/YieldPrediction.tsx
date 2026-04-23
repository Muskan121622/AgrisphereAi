import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sprout, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { saveAiReport } from "@/services/firebaseService";
import { useAuthStore } from "@/store/authStore";

import Navbar from "@/components/Navbar";

interface YieldResult {
  predicted_yield: number;
  totalProduction: number;
  revenue: number;
  areaInAcres: number;
  areaInHectares: number;
  [key: string]: any; // Allow for extra backend data
}

const YieldPrediction = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<YieldResult | null>(null);
  const [advice, setAdvice] = useState("");
  const [dialect, setDialect] = useState(localStorage.getItem("preferredDialect") || "Standard");
  const [isLocalizing, setIsLocalizing] = useState(false);
  const [formData, setFormData] = useState({
    crop: "Rice",
    area: 5,
    temp: 22.0,
    humidity: 80.0,
    rainfall: 1800.0,
    fertilizer: 600.0,
    pesticide: 30.0,
    soil_ph: 5.2,
    soil_n: 300.0,
    soil_p: 35.0,
    soil_k: 200.0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, crop: value }));
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setAdvice("");

    try {
      const areaInAcres = parseFloat(formData.area.toString());
      const areaInHectares = areaInAcres * 0.4047;

      const payload = {
        ...formData,
        area: areaInHectares,
      };

      const response = await fetch(`${API_URL}/predict-yield-optimized`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Prediction failed");
      }

      const data = await response.json();
      const totalProduction = data.predicted_yield * areaInHectares;
      const prices: Record<string, number> = {
        Rice: 22000,
        Maize: 20000,
        Ginger: 40000,
      };
      const pricePerTon = prices[formData.crop] || 20000;
      const revenue = totalProduction * pricePerTon;

      const resultData = {
        ...data,
        totalProduction,
        revenue,
        areaInAcres,
        areaInHectares,
      };

      setResult(resultData);

      // PERSIST TO FIRESTORE
      if (user?.email) {
        saveAiReport(user.email, "yield-prediction", {
          inputs: formData,
          results: resultData,
          timestamp: new Date().toISOString()
        }).catch(err => console.error("Failed to persist yield report:", err));
      }

      toast({
        title: t("yield.predictionSuccess", "Prediction Success"),
        description: `${t("yield.estimatedProduction", "Estimated Production")}: ${totalProduction.toFixed(2)} ${t("yield.tonsUnit", "Tons")}`,
      });
    } catch (error: any) {
      console.error("Prediction Error:", error);
      toast({
        variant: "destructive",
        title: t("common.error", "Error"),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{t("yield.title")}</h1>
            <p className="text-muted-foreground">
              {t("yield.desc")}
              <br />
              {t("yield.supportedCrops")}:{" "}
              <span className="font-semibold text-green-500">
                {t("common.crops.rice")}, {t("common.crops.maize")},{" "}
                {t("common.crops.ginger")}
              </span>
              .
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                {t("yield.inputTitle", "Input Parameters")}
              </h2>
              <form onSubmit={handlePredict} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("yield.selectCrop")}</Label>
                  <Select
                    value={formData.crop}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("yield.selectCrop")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rice">
                        {t("common.crops.rice")}
                      </SelectItem>
                      <SelectItem value="Maize">
                        {t("common.crops.maize")}
                      </SelectItem>
                      <SelectItem value="Ginger">
                        {t("common.crops.ginger")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("yield.area")}</Label>
                    <Input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("yield.areaNote")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("yield.rainfall", "Rainfall (mm)")}</Label>
                    <Input
                      type="number"
                      name="rainfall"
                      value={formData.rainfall}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("yield.temp")}</Label>
                    <Input
                      type="number"
                      name="temp"
                      value={formData.temp}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("yield.humidity")}</Label>
                    <Input
                      type="number"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                  disabled={isLoading}
                >
                  {isLoading ? t("yield.analyzing") : t("yield.predictBtn")}
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="p-6 border-green-500/20 bg-green-500/5">
                    <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      {t("yield.resultsTitle")}
                    </h3>

                    <div className="text-center mb-6 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border/50">
                      <p className="text-muted-foreground mb-1 uppercase text-xs font-bold tracking-wider">
                        {t("yield.totalProduction")}
                      </p>
                      <div className="text-4xl font-bold text-green-600">
                        {result.totalProduction.toFixed(2)}
                        <span className="text-xl text-muted-foreground ml-2">
                          {t("yield.tonsUnit")}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg text-center border border-blue-500/20">
                        <p className="text-xs text-blue-600 font-semibold uppercase mb-1">
                          {t("yield.yieldEfficiency")}
                        </p>
                        <p className="text-xl font-bold">
                          {result.predicted_yield.toFixed(2)}{" "}
                          {t("yield.perHectare")}
                        </p>
                      </div>
                      <div className="p-3 bg-amber-500/10 rounded-lg text-center border border-amber-500/20">
                        <p className="text-xs text-amber-600 font-semibold uppercase mb-1">
                          {t("yield.revenue")}
                        </p>
                        <p className="text-xl font-bold">
                          ₹{(result.revenue / 100000).toFixed(2)} L
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20 text-sm text-blue-600 flex gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{t("yield.accuracyNote")}</p>
                    </div>

                    {dialect !== "Standard" && (
                      <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                        <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                          <span>🤖</span> {t("pest.advisorTitle", "AI Advisor")}{" "}
                          ({dialect})
                        </h4>
                        <p className="text-sm italic text-muted-foreground">
                          {isLocalizing
                            ? t("common.localizing", "Localizing...")
                            : advice}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 border-2 border-dashed rounded-xl">
                  <Sprout className="w-16 h-16 mb-4 opacity-20" />
                  <p>
                    {t("yield.readyDesc", "Enter parameters to predict yield.")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default YieldPrediction;
