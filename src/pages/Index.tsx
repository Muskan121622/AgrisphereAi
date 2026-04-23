import { motion } from "framer-motion";
import {
  Brain,
  MapPin,
  TrendingUp,
  Users,
  Shield,
  ArrowRight,
  Cloud,
  Zap,
  Activity,
  ShoppingBag,
  Map,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BulletinCard from "@/components/BulletinCard";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  const features = [
    {
      icon: Brain,
      title: t("home.features.f1.title"),
      description: t("home.features.f1.desc"),
      gradient: "from-primary to-primary-glow",
      details: [
        t("home.features.f1.b1"),
        t("home.features.f1.b2"),
        t("home.features.f1.b3"),
        t("home.features.f1.b4"),
      ],
    },
    {
      icon: MapPin,
      title: t("home.features.f2.title"),
      description: t("home.features.f2.desc"),
      gradient: "from-accent to-accent-glow",
      details: [
        t("home.features.f2.b1"),
        t("home.features.f2.b2"),
        t("home.features.f2.b3"),
        t("home.features.f2.b4"),
      ],
    },
    {
      icon: TrendingUp,
      title: t("home.features.f3.title"),
      description: t("home.features.f3.desc"),
      gradient: "from-secondary to-secondary-glow",
      details: [
        t("home.features.f3.b1"),
        t("home.features.f3.b2"),
        t("home.features.f3.b3"),
        t("home.features.f3.b4"),
      ],
    },
    {
      icon: Cloud,
      title: t("home.features.f4.title"),
      description: t("home.features.f4.desc"),
      gradient: "from-accent to-secondary",
      details: [
        t("home.features.f4.b1"),
        t("home.features.f4.b2"),
        t("home.features.f4.b3"),
        t("home.features.f4.b4"),
      ],
    },
    {
      icon: Zap,
      title: t("home.features.f5.title"),
      description: t("home.features.f5.desc"),
      gradient: "from-secondary to-primary",
      details: [
        t("home.features.f5.b1"),
        t("home.features.f5.b2"),
        t("home.features.f5.b3"),
        t("home.features.f5.b4"),
      ],
    },
  ];

  const stats = [
    { value: "500K+", label: t("home.stats.activeFarmers") },
    { value: "98%", label: t("home.stats.accuracyRate") },
    { value: "2M+", label: t("home.stats.fieldsMapped") },
    { value: "40%", label: t("home.stats.yieldIncrease") },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Video Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{
            filter: "brightness(0.8) saturate(1.1)",
            opacity: 0.7,
          }}
        >
          <source src="/videos/hero-farm.mp4" type="video/mp4" />
          {/* Fallback pattern if video not found */}
        </video>
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-glow-pulse" />
      </div>

      {/* Floating Orbs (now with reduced opacity for video) */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float" />
      <div
        className="fixed bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="fixed top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-float"
        style={{ animationDelay: "4s" }}
      />

      {/* Floating Orbs (now with reduced opacity for video) */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float" />
      <div
        className="fixed bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="fixed top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-float"
        style={{ animationDelay: "4s" }}
      />

      {/* NEW: Floating Weather Alert Widget (Right Side, Above Chatbot) */}
      <motion.div
        className="fixed right-6 bottom-28 z-50 flex flex-col gap-4"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="group relative">
          {/* Ping Animation Ring */}
          <div className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping"></div>

          <Button
            className="relative w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 border-2 border-white/20 shadow-2xl shadow-red-500/50 transition-all duration-300 flex items-center justify-center"
            onClick={() => navigate("/weather-alerts")}
          >
            <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
          </Button>

          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/90 text-white text-sm font-bold px-3 py-1.5 rounded-lg border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
            ⚠️ {t("home.floatingAlert")}
          </div>
        </div>
      </motion.div>

      {/* Shared Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Daily Agri-Bulletin */}
            <BulletinCard />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary"
            >
              <span className="animate-pulse mr-2">●</span>
              {t("home.heroBadge", "AI-Powered Smart Agriculture")}
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="block"
              >
                {t("home.heroTitle1")}
              </motion.span>
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="block gradient-text drop-shadow-glow"
              >
                {t("home.heroTitle2")}
              </motion.span>
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="block"
              >
                {t("home.heroSubtitle")}
              </motion.span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t("home.heroDescription")}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group h-14 px-8 text-lg rounded-xl"
              >
                {t("nav.getStarted")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 hover:shadow-glow-accent transition-all duration-300 h-14 px-8 text-lg rounded-xl glass"
                  >
                    {t("home.exploreFeatures")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-slate-800">
                  <div className="relative w-full pb-[56.25%] h-0">
                    <iframe
                      src="https://drive.google.com/file/d/1VdNsdIxKx5EU5CS9kqfx7FldNteBv1NV/preview"
                      className="absolute top-0 left-0 w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square">
              {/* Central Core */}
              <motion.div
                className="absolute inset-0 m-auto w-48 h-48 bg-gradient-primary rounded-full shadow-glow-primary flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span className="text-6xl">🌱</span>
              </motion.div>

              {/* Orbiting Icons */}
              {[Brain, MapPin, TrendingUp, Cloud, Zap].map((Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 m-auto w-full h-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 30 + i * 5, // Varying speeds for depth
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5,
                  }}
                >
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 glass-morphism rounded-2xl flex items-center justify-center shadow-glow-primary group cursor-pointer"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    animate={{
                      y: [0, -15, 0],
                      boxShadow: [
                        "0 0 20px rgba(74, 222, 128, 0.2)",
                        "0 0 40px rgba(74, 222, 128, 0.6)",
                        "0 0 20px rgba(74, 222, 128, 0.2)",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                    style={{
                      transformOrigin: "50% 250px",
                    }}
                  >
                    <Icon className="w-8 h-8 text-primary drop-shadow-glow" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="relative z-10 container mx-auto px-4 py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("home.featuresTitle")}
            <span className="block gradient-text">
              {t("home.featuresSubtitle")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("home.featuresDesc")}
          </p>
          <div className="max-w-4xl mx-auto text-left space-y-4 mt-8 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
            <p className="text-muted-foreground">{t("home.aboutTitle")}</p>
            <p className="text-muted-foreground">{t("home.aboutDesc")}</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-glow-primary">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {feature.details && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {feature.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-primary/10 px-2 py-1 rounded-full text-primary font-medium"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                <motion.a
                  href={`/${feature.title.toLowerCase().replace(/\s+/g, "-").replace("ai-", "").replace("gis-", "digital-").replace("multi-class-", "")}`}
                  className="mt-4 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  {t("home.learnMore")} <ArrowRight className="ml-2 w-4 h-4" />
                </motion.a>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("home.howItWorks")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: t("marketplace.advisory.steps.s1.title"),
                desc: t("marketplace.advisory.steps.s1.subtitle"),
                icon: Users,
              },
              {
                step: "2",
                title: t("marketplace.advisory.steps.s2.title"),
                desc: t("marketplace.advisory.steps.s2.subtitle"),
                icon: Map,
              },
              {
                step: "3",
                title: t("marketplace.advisory.steps.s3.title"),
                desc: t("marketplace.advisory.steps.s3.subtitle"),
                icon: Brain,
              },
              {
                step: "4",
                title: t("marketplace.advisory.steps.s4.title"),
                desc: t("marketplace.advisory.steps.s4.subtitle"),
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="group relative card-gradient p-6 rounded-2xl text-center border-2 border-primary/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                  {/* Animated Border */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary opacity-50 animate-spin"
                    style={{ animationDuration: "3.5s" }}
                  ></div>
                  <div className="absolute inset-[2px] rounded-2xl bg-card"></div>

                  {/* Bloom Effect on Hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-accent opacity-60" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced AI Features Section */}
      <section id="ai-features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("home.advanced.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.advanced.desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: t("home.advanced.pests.title"),
                desc: t("home.advanced.pests.desc"),
                icon: "🐛",
                features: [
                  t("home.advanced.pests.b1"),
                  t("home.advanced.pests.b2"),
                  t("home.advanced.pests.b3"),
                  t("home.advanced.pests.b4"),
                ],
              },
              {
                title: t("home.advanced.seedToMarket.title"),
                desc: t("home.advanced.seedToMarket.desc"),
                icon: "🌾",
                features: [
                  t("home.advanced.seedToMarket.b1"),
                  t("home.advanced.seedToMarket.b2"),
                  t("home.advanced.seedToMarket.b3"),
                  t("home.advanced.seedToMarket.b4"),
                ],
              },
              {
                title: t("home.advanced.voice.title"),
                desc: t("home.advanced.voice.desc"),
                icon: "🎤",
                features: [
                  t("home.advanced.voice.b1"),
                  t("home.advanced.voice.b2"),
                  t("home.advanced.voice.b3"),
                  t("home.advanced.voice.b4"),
                ],
              },
              {
                title: t("home.advanced.schemes.title"),
                desc: t("home.advanced.schemes.desc"),
                icon: "🏛️",
                features: [
                  t("home.advanced.schemes.b1"),
                  t("home.advanced.schemes.b2"),
                  t("home.advanced.schemes.b3"),
                  t("home.advanced.schemes.b4"),
                ],
              },
              {
                title: t("home.advanced.marketplace.title"),
                desc: t("home.advanced.marketplace.desc"),
                icon: "🛒",
                features: [
                  t("home.advanced.marketplace.b1"),
                  t("home.advanced.marketplace.b2"),
                  t("home.advanced.marketplace.b3"),
                  t("home.advanced.marketplace.b4"),
                ],
              },
              {
                title: t("home.advanced.blockchain.title"),
                desc: t("home.advanced.blockchain.desc"),
                icon: "⛓️",
                features: [
                  t("home.advanced.blockchain.b1"),
                  t("home.advanced.blockchain.b2"),
                  t("home.advanced.blockchain.b3"),
                  t("home.advanced.blockchain.b4"),
                ],
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative card-gradient p-8 rounded-2xl border-2 border-primary/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
              >
                {/* Animated Border */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary opacity-50 animate-spin"
                  style={{ animationDuration: `${3 + i * 0.5}s` }}
                ></div>
                <div className="absolute inset-[2px] rounded-2xl bg-card"></div>

                {/* Bloom Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>

                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 group-hover:text-foreground/80 transition-colors">
                    {feature.desc}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.features.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-primary/10 px-2 py-1 rounded-full text-primary font-medium"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rural Accessibility Section */}
      <section id="rural-features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("home.rural.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.rural.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: t("home.rural.offline.title"),
                desc: t("home.rural.offline.desc"),
                icon: "📱",
              },
              {
                title: t("home.rural.languages.title"),
                desc: t("home.rural.languages.desc"),
                icon: "🗣️",
              },
              {
                title: t("home.rural.sms.title"),
                desc: t("home.rural.sms.desc"),
                icon: "📨",
              },
              {
                title: t("home.rural.community.title"),
                desc: t("home.rural.community.desc"),
                icon: "👥",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative text-center p-6 card-gradient rounded-xl border-2 border-primary/30 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                {/* Animated Border */}
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-accent to-secondary opacity-50 animate-spin"
                  style={{ animationDuration: "2.5s" }}
                ></div>
                <div className="absolute inset-[2px] rounded-xl bg-card"></div>

                {/* Bloom Effect on Hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700"></div>

                <div className="relative z-10">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Women Empowerment Section */}
      <section id="women-empowerment" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("home.women.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.women.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: t("home.women.microbusiness.title"),
                desc: t("home.women.microbusiness.desc"),
                icon: "🍯",
              },
              {
                title: t("home.women.training.title"),
                desc: t("home.women.training.desc"),
                icon: "📚",
              },
              {
                title: t("home.women.marketAccess.title"),
                desc: t("home.women.marketAccess.desc"),
                icon: "🛍️",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative card-gradient p-8 rounded-2xl border-2 border-primary/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
              >
                {/* Animated Border */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary opacity-50 animate-spin"
                  style={{ animationDuration: "3.5s" }}
                ></div>
                <div className="absolute inset-[2px] rounded-2xl bg-card"></div>

                {/* Bloom Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>

                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("home.testimonials.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.testimonials.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: t("home.testimonials.t1.name"),
                location: t("home.testimonials.t1.loc"),
                text: t("home.testimonials.t1.text"),
                rating: 5,
                crop: "Wheat",
                benefit: t("home.testimonials.t1.benefit"),
              },
              {
                name: t("home.testimonials.t2.name"),
                location: t("home.testimonials.t2.loc"),
                text: t("home.testimonials.t2.text"),
                rating: 5,
                crop: "Cotton",
                benefit: t("home.testimonials.t2.benefit"),
              },
              {
                name: t("home.testimonials.t3.name"),
                location: t("home.testimonials.t3.loc"),
                text: t("home.testimonials.t3.text"),
                rating: 5,
                crop: "Tomato",
                benefit: t("home.testimonials.t3.benefit"),
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="group relative card-gradient p-8 rounded-2xl border-2 border-primary/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
              >
                {/* Animated Border */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary opacity-50 animate-spin"
                  style={{ animationDuration: "4s" }}
                ></div>
                <div className="absolute inset-[2px] rounded-2xl bg-card"></div>

                {/* Bloom Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span
                          key={i}
                          className="text-yellow-500 text-xl group-hover:scale-110 transition-transform duration-300"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-xs bg-primary/20 px-2 py-1 rounded-full text-primary font-medium mb-1">
                        {testimonial.crop}
                      </div>
                      <div className="text-xs bg-accent/20 px-2 py-1 rounded-full text-accent font-medium">
                        {testimonial.benefit}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 italic group-hover:text-foreground/80 transition-colors">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-bold group-hover:text-primary transition-colors">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("home.tech.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.tech.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Random Forest ML", desc: t("home.tech.t1") },
              { name: "LSTM Networks", desc: t("home.tech.t2") },
              { name: "Gradient Boosting", desc: t("home.tech.t3") },
              { name: "Mapbox GIS", desc: t("home.tech.t4") },
              { name: "Multi-class CNN", desc: t("home.tech.t5") },
              { name: "Blockchain", desc: t("home.tech.t6") },
              { name: "Voice Recognition", desc: t("home.tech.t7") },
              { name: "Offline Caching", desc: t("home.tech.t8") },
              { name: "SMS Gateway", desc: t("home.tech.t9") },
              { name: "WhatsApp API", desc: t("home.tech.t10") },
              { name: "End-to-End Encryption", desc: t("home.tech.t11") },
            ].map((tech, i) => (
              <div
                key={i}
                className="group relative text-center p-6 card-gradient rounded-xl border-2 border-primary/30 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                {/* Animated Border */}
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-accent to-secondary opacity-50 animate-spin"
                  style={{ animationDuration: "2s" }}
                ></div>
                <div className="absolute inset-[2px] rounded-xl bg-card"></div>

                {/* Bloom Effect on Hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700"></div>

                <div className="relative z-10">
                  <p className="font-bold mb-2 group-hover:text-primary transition-colors">
                    {tech.name}
                  </p>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {tech.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 backdrop-blur-sm p-12 md:p-16 text-center shadow-glow-primary">
            <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

            <motion.div
              className="relative z-10"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("home.ctaTitle")}
                <span className="block gradient-text">
                  {t("home.ctaSubtitle")}
                </span>
              </h2>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("home.ctaDesc")}
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-lg px-8"
                >
                  {t("home.ctaFreeTrial")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 text-lg px-8"
                >
                  {t("home.ctaDemo")}
                </Button>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-lg">🌱</span>
                </div>
                <span className="text-xl font-bold gradient-text">
                  {t("home.footer.brand")}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {t("home.footer.tagline")}
              </p>
            </div>

            {[
              {
                title: t("home.footer.col1"),
                links: [
                  {
                    name: t("nav.diseaseDetection"),
                    path: "/disease-detection",
                  },
                  { name: t("nav.digitalTwin"), path: "/digital-twin" },
                  { name: t("nav.yieldPrediction"), path: "/yield-prediction" },
                  { name: t("nav.voiceAssistant"), path: "/voice-assistant" },
                ],
              },
              {
                title: t("home.footer.col2"),
                links: [
                  { name: t("nav.marketplace"), path: "/marketplace" },
                  { name: t("home.footer.iot"), path: "/iot-monitoring" },
                  { name: t("home.footer.weather"), path: "#" },
                  { name: t("home.footer.community"), path: "#" },
                ],
              },
              {
                title: t("home.footer.col3"),
                links: [
                  { name: t("home.footer.help"), path: "#" },
                  { name: t("home.footer.docs"), path: "#" },
                  { name: t("home.footer.api"), path: "#" },
                  { name: t("home.footer.contact"), path: "#" },
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-bold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.path}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {t("home.footer.copyright")}
            </p>
            <div className="flex gap-4">
              {[Users, Shield, Brain].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
