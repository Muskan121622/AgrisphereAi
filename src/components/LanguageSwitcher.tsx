import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", label: "English" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳", label: "Hindi" },
  { code: "bn", name: "বাংলা", flag: "🇮🇳", label: "Bengali" },
  { code: "mr", name: "मराठी", flag: "🇮🇳", label: "Marathi" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳", label: "Telugu" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳", label: "Tamil" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳", label: "Kannada" },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  };

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 px-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all gap-2 group"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
          </motion.div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {currentLang.code}
            </span>
          </div>
          <span className="text-lg leading-none">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 p-2 bg-slate-950/95 backdrop-blur-xl border-slate-800 text-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-2 py-1.5 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {t("nav.selectLanguage", "Select Language")}
          </p>
        </div>

        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-1
              ${
                i18n.language === lang.code
                  ? "bg-primary/20 text-primary border border-primary/20"
                  : "hover:bg-white/5 border border-transparent"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl leading-none">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold">{lang.name}</span>
                <span className="text-[10px] opacity-50 uppercase">
                  {lang.label}
                </span>
              </div>
            </div>
            {i18n.language === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
