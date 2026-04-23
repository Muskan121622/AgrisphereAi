import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import englishTranslation from "./en";
import hindiTranslation from "./hindi";
import bengaliTranslation from "./bn";
import marathiTranslation from "./mr";
import teluguTranslation from "./te";
import tamilTranslation from "./ta";
import kannadaTranslation from "./kn";

const resources = {
  en: {
    translation: englishTranslation,
  },
  hi: {
    translation: hindiTranslation,
  },
  bn: {
    translation: bengaliTranslation,
  },
  mr: {
    translation: marathiTranslation,
  },
  te: {
    translation: teluguTranslation,
  },
  ta: {
    translation: tamilTranslation,
  },
  kn: {
    translation: kannadaTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
