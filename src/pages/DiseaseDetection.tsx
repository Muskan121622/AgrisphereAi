import { motion } from "framer-motion";
import {
  Brain,
  Camera,
  Upload,
  Zap,
  Target,
  Activity,
  ArrowLeft,
  Bug,
  Leaf,
  Apple,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EnhancedImageAnalysis from "@/components/EnhancedImageAnalysis";
import { EnhancedDiseaseDetector } from "@/lib/enhanced-disease-detection";
import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getAiReports } from "@/services/firebaseService";
import { useAuthStore } from "@/store/authStore";

const DiseaseDetection = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [detector] = useState(() => new EnhancedDiseaseDetector());
  const [isLoading, setIsLoading] = useState(true);
  const analysisRef = useRef<HTMLDivElement>(null);
  const locale = i18n.language === "hi" ? "hi-IN" : "en-IN";

  useEffect(() => {
    const initializeDetector = async () => {
      await detector.loadModels();
      setIsLoading(false);
    };
    initializeDetector();
  }, [detector]);

  const [showSaved, setShowSaved] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      if (showSaved && user?.email) {
        try {
          const reports = await getAiReports(user.email, "disease-scan");
          // Map Firestore format to the expected UI format
          const formattedReports = reports.map(r => ({
            id: r.id,
            timestamp: r.createdAt?.toDate?.()?.toISOString() || r.createdAt || new Date().toISOString(),
            results: r.data.results,
            imageName: r.data.imageName
          }));
          setSavedReports(formattedReports);
        } catch (error) {
          console.error("Failed to fetch reports:", error);
        }
      }
    };
    fetchReports();
  }, [showSaved, user]);

  const handleStartDetection = () => {
    analysisRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUploadImages = () => {
    analysisRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const detectionTypes = [
    {
      title: t("disease.types.leaf.title"),
      description: t("disease.types.leaf.desc"),
      accuracy: "95%",
      icon: "🍃",
      diseases: [
        t("disease.types.leaf.d1"),
        t("disease.types.leaf.d2"),
        t("disease.types.leaf.d3"),
        t("disease.types.leaf.d4"),
      ],
    },
    {
      title: t("disease.types.stem.title"),
      description: t("disease.types.stem.desc"),
      accuracy: "92%",
      icon: "🌿",
      diseases: [
        t("disease.types.stem.d1"),
        t("disease.types.stem.d2"),
        t("disease.types.stem.d3"),
        t("disease.types.stem.d4"),
      ],
    },
    {
      title: t("disease.types.fruit.title"),
      description: t("disease.types.fruit.desc"),
      accuracy: "94%",
      icon: "🍅",
      diseases: [
        t("disease.types.fruit.d1"),
        t("disease.types.fruit.d2"),
        t("disease.types.fruit.d3"),
        t("disease.types.fruit.d4"),
      ],
    },
    {
      title: t("disease.types.soil.title"),
      description: t("disease.types.soil.desc"),
      accuracy: "89%",
      icon: "🌱",
      diseases: [
        t("disease.types.soil.d1"),
        t("disease.types.soil.d2"),
        t("disease.types.soil.d3"),
        t("disease.types.soil.d4"),
      ],
    },
  ];

  const pestTypes = [
    {
      name: t("disease.pests.p1.name"),
      damage: t("disease.pests.p1.damage"),
      treatment: t("disease.pests.p1.treatment"),
    },
    {
      name: t("disease.pests.p2.name"),
      damage: t("disease.pests.p2.damage"),
      treatment: t("disease.pests.p2.treatment"),
    },
    {
      name: t("disease.pests.p3.name"),
      damage: t("disease.pests.p3.damage"),
      treatment: t("disease.pests.p3.treatment"),
    },
    {
      name: t("disease.pests.p4.name"),
      damage: t("disease.pests.p4.damage"),
      treatment: t("disease.pests.p4.treatment"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🔬</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t("disease.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t("disease.desc")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-primary"
                onClick={handleStartDetection}
              >
                <Camera className="mr-2 w-5 h-5" />
                {t("disease.startBtn")}
              </Button>
              <Button size="lg" variant="outline" onClick={handleUploadImages}>
                <Upload className="mr-2 w-5 h-5" />
                {t("disease.uploadBtn")}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="border-primary/20"
                onClick={() => setShowSaved(!showSaved)}
              >
                <span className="mr-2">💾</span>
                {showSaved ? t("disease.hideBtn") : t("disease.saveBtn")}
              </Button>
            </div>

            {showSaved && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8 text-left max-w-4xl mx-auto bg-card border border-border rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>📂</span> {t("disease.reportsTitle")}
                </h3>
                {savedReports.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {t("disease.noReports")}
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedReports.map((report: any) => (
                      <Card
                        key={report.id}
                        className="p-4 border-l-4 border-l-primary cursor-pointer hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg">
                              {new Date(report.timestamp).toLocaleDateString(
                                locale,
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(report.timestamp).toLocaleTimeString(
                                locale,
                              )}
                            </p>
                          </div>

                          <div
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              report.results.overallHealth.status ===
                              "excellent"
                                ? "bg-green-100 text-green-700"
                                : report.results.overallHealth.status === "good"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {t(
                              `disease.status.${report.results.overallHealth.status.toLowerCase()}`,
                              {
                                defaultValue:
                                  report.results.overallHealth.status.toUpperCase(),
                              },
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <p>
                            <strong>{t("disease.score")}:</strong>{" "}
                            {report.results.overallHealth.score}/100
                          </p>
                          <p>
                            <strong>{t("disease.issues")}:</strong>{" "}
                            {report.results.diseases.length}{" "}
                            {t("disease.diseasesCount")},{" "}
                            {report.results.pests.length}{" "}
                            {t("disease.pestsCount")}
                          </p>
                        </div>
                        <Button
                          variant="link"
                          className="px-0 mt-2 text-primary"
                          onClick={() => {
                            alert(
                              JSON.stringify(
                                report.results.overallHealth.recommendations,
                                null,
                                2,
                              ),
                            );
                          }}
                        >
                          {t("disease.viewSummary")}
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("disease.capTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {detectionTypes.map((type, i) => (
              <Card
                key={i}
                className="p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{type.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{type.title}</h3>
                      <div className="bg-primary/20 px-3 py-1 rounded-full text-primary font-bold text-sm">
                        {type.accuracy}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {type.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {type.diseases.map((disease, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-muted px-2 py-1 rounded text-center"
                        >
                          {disease}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("disease.pestTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pestTypes.map((pest, i) => (
              <Card
                key={i}
                className="p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-3">🐛</div>
                <h3 className="font-bold mb-2">{pest.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {pest.damage}
                </p>
                <div className="text-xs bg-primary/20 px-2 py-1 rounded-full text-primary">
                  {pest.treatment}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section ref={analysisRef} className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("disease.aiTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <Leaf className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-bold mb-2">
                {t("disease.stats.disease")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("disease.stats.diseaseDesc")}
              </p>
              <div className="text-2xl font-bold text-green-500">95.2%</div>
              <div className="text-sm text-muted-foreground">
                {t("disease.accuracy")}
              </div>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <Bug className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-bold mb-2">
                {t("disease.stats.pest")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("disease.stats.pestDesc")}
              </p>
              <div className="text-2xl font-bold text-red-500">92.8%</div>
              <div className="text-sm text-muted-foreground">
                {t("disease.accuracy")}
              </div>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <Apple className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-bold mb-2">
                {t("disease.stats.soil")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("disease.stats.soilDesc")}
              </p>
              <div className="text-2xl font-bold text-orange-500">89.4%</div>
              <div className="text-sm text-muted-foreground">
                {t("disease.accuracy")}
              </div>
            </Card>
          </div>
          <div className="max-w-4xl mx-auto">
            <EnhancedImageAnalysis analysisType="comprehensive" />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("disease.howTitle")}
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: t("disease.how.s1.title"),
                desc: t("disease.how.s1.desc"),
                icon: Camera,
              },
              {
                step: "2",
                title: t("disease.how.s2.title"),
                desc: t("disease.how.s2.desc"),
                icon: Brain,
              },
              {
                step: "3",
                title: t("disease.how.s3.title"),
                desc: t("disease.how.s3.desc"),
                icon: Target,
              },
              {
                step: "4",
                title: t("disease.how.s4.title"),
                desc: t("disease.how.s4.desc"),
                icon: Zap,
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                  {item.step}
                </div>
                <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiseaseDetection;
