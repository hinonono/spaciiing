import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files directly
// Import common translation files
import commonEN from "../public/locales/en/common.json";
import commonJA from "../public/locales/ja/common.json";

import settingsEN from "../public/locales/en/settings.json";
import settingsJA from "../public/locales/ja/settings.json";

const resources = {
  en: {
    common: commonEN,
    settings: settingsEN,
  },
  jp: {
    common: commonJA,
    settings: settingsJA,
  },
};

const languageDetector = new LanguageDetector(null, {
  order: ["localStorage", "navigator"],
  lookupLocalStorage: "i18nextLng",
  caches: ["localStorage"],
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    ns: ["common", "settings"],
    defaultNS: "common",
  });

export default i18n;
