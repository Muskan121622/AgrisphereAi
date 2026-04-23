import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic,
  Volume2,
  MessageCircle,
  Languages,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import VoiceRecognition from "@/components/VoiceRecognition";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";

const VoiceAssistant = () => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const voiceFeatures = [
    {
      title: t("voiceAssistant.features.f1.title"),
      description: t("voiceAssistant.features.f1.desc"),
      icon: "🎤",
      example: t("voiceAssistant.features.f1.example"),
      response: t("voiceAssistant.features.f1.response"),
    },
    {
      title: t("voiceAssistant.features.f2.title"),
      description: t("voiceAssistant.features.f2.desc"),
      icon: "🗣️",
      languages: [
        t("voiceAssistant.langs.hindi"),
        t("voiceAssistant.langs.english"),
      ],
      coverage: "2 languages",
    },
    {
      title: t("voiceAssistant.features.f3.title"),
      description: t("voiceAssistant.features.f3.desc"),
      icon: "🔊",
      features: [
        t("voiceAssistant.features.f3.item1"),
        t("voiceAssistant.features.f3.item2"),
        t("voiceAssistant.features.f3.item3"),
        t("voiceAssistant.features.f3.item4"),
      ],
    },
    {
      title: t("voiceAssistant.features.f4.title"),
      description: t("voiceAssistant.features.f4.desc"),
      icon: "📱",
      commands: [
        t("voiceAssistant.features.f4.item1"),
        t("voiceAssistant.features.f4.item2"),
        t("voiceAssistant.features.f4.item3"),
        t("voiceAssistant.features.f4.item4"),
      ],
    },
  ];

  const conversationExamples = [
    {
      farmer: t("voiceAssistant.examples.e1.farmer"),
      translation: t("voiceAssistant.examples.e1.farmerTrans"),
      ai: t("voiceAssistant.examples.e1.ai"),
      aiTranslation: t("voiceAssistant.examples.e1.aiTrans"),
      solution: t("voiceAssistant.examples.e1.solution"),
    },
    {
      farmer: t("voiceAssistant.examples.e2.farmer"),
      translation: t("voiceAssistant.examples.e2.farmerTrans"),
      ai: t("voiceAssistant.examples.e2.ai"),
      aiTranslation: t("voiceAssistant.examples.e2.aiTrans"),
      solution: t("voiceAssistant.examples.e2.solution"),
    },
    {
      farmer: t("voiceAssistant.examples.e3.farmer"),
      translation: t("voiceAssistant.examples.e3.farmerTrans"),
      ai: t("voiceAssistant.examples.e3.ai"),
      aiTranslation: t("voiceAssistant.examples.e3.aiTrans"),
      solution: t("voiceAssistant.examples.e3.solution"),
    },
  ];

  const supportedLanguagesList = [
    {
      name: t("voiceAssistant.langs.hindi"),
      speakers: "600M+",
      status: t("voiceAssistant.langs.fullSupport"),
      flag: "🇮🇳",
    },
    {
      name: t("voiceAssistant.langs.english"),
      speakers: "125M+",
      status: t("voiceAssistant.langs.fullSupport"),
      flag: "🇮🇳",
    },
  ];

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
            <div className="text-6xl mb-6">🎙️</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t("voiceAssistant.hero.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t("voiceAssistant.hero.desc")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className={`bg-gradient-primary transition-all duration-300 ${isListening ? "animate-pulse" : ""}`}
                onClick={() => {
                  document
                    .getElementById("voice-demo")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Mic className="mr-2 w-5 h-5" />
                {t("voiceAssistant.hero.startBtn")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("voice-demo")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Languages className="mr-2 w-5 h-5" />
                {t("voiceAssistant.hero.chooseLangBtn")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voice Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("voiceAssistant.features.sectionTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {voiceFeatures.map((feature, i) => (
              <Card
                key={i}
                className="p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    {feature.example && (
                      <div className="bg-primary/10 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-primary">
                          "{feature.example}"
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {feature.response}
                        </p>
                      </div>
                    )}
                    {feature.languages && (
                      <div className="grid grid-cols-3 gap-2">
                        {feature.languages.map((lang, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-muted px-2 py-1 rounded text-center"
                          >
                            {lang}
                          </div>
                        ))}
                      </div>
                    )}
                    {feature.features && (
                      <div className="grid grid-cols-2 gap-2">
                        {feature.features.map((item, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-muted px-2 py-1 rounded text-center"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                    {feature.commands && (
                      <div className="grid grid-cols-2 gap-2">
                        {feature.commands.map((cmd, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-muted px-2 py-1 rounded text-center"
                          >
                            {cmd}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Conversation Examples */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("voiceAssistant.examples.sectionTitle")}
          </h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            {conversationExamples.map((conv, i) => (
              <Card
                key={i}
                className="p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Farmer Question */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg">👨‍🌾</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <p className="font-medium text-primary">
                          "{conv.farmer}"
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conv.translation}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-accent/10 p-3 rounded-lg">
                        <p className="font-medium text-accent">{conv.ai}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conv.aiTranslation}
                        </p>
                        <div className="mt-2 text-xs bg-secondary/20 px-2 py-1 rounded text-secondary">
                          {t("voiceAssistant.examples.solutionPrefix")}:{" "}
                          {conv.solution}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Voice Demo */}
      <section id="voice-demo" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("voiceAssistant.demo.sectionTitle")}
          </h2>
          <div className="max-w-4xl mx-auto">
            <VoiceRecognition />
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("voiceAssistant.langs.sectionTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {supportedLanguagesList.map((lang, i) => (
              <Card
                key={i}
                className="p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-3">{lang.flag}</div>
                <h3 className="font-bold mb-2">{lang.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {lang.speakers}
                </p>
                <div
                  className={`text-xs px-2 py-1 rounded-full font-medium ${lang.status === t("voiceAssistant.langs.fullSupport") ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {lang.status}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t("voiceAssistant.howItWorks.sectionTitle")}
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: t("voiceAssistant.howItWorks.s1.title"),
                desc: t("voiceAssistant.howItWorks.s1.desc"),
                icon: Mic,
              },
              {
                step: "2",
                title: t("voiceAssistant.howItWorks.s2.title"),
                desc: t("voiceAssistant.howItWorks.s2.desc"),
                icon: MessageCircle,
              },
              {
                step: "3",
                title: t("voiceAssistant.howItWorks.s3.title"),
                desc: t("voiceAssistant.howItWorks.s3.desc"),
                icon: Languages,
              },
              {
                step: "4",
                title: t("voiceAssistant.howItWorks.s4.title"),
                desc: t("voiceAssistant.howItWorks.s4.desc"),
                icon: Volume2,
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

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">
            {t("voiceAssistant.benefits.sectionTitle")}
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: t("voiceAssistant.benefits.b1.title"),
                desc: t("voiceAssistant.benefits.b1.desc"),
                icon: "👄",
              },
              {
                title: t("voiceAssistant.benefits.b2.title"),
                desc: t("voiceAssistant.benefits.b2.desc"),
                icon: "🏘️",
              },
              {
                title: t("voiceAssistant.benefits.b3.title"),
                desc: t("voiceAssistant.benefits.b3.desc"),
                icon: "⚡",
              },
              {
                title: t("voiceAssistant.benefits.b4.title"),
                desc: t("voiceAssistant.benefits.b4.desc"),
                icon: "🇮🇳",
              },
            ].map((benefit, i) => (
              <Card
                key={i}
                className="p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold mb-2 text-primary">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VoiceAssistant;
