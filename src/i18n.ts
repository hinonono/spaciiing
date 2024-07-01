import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files directly
// Import common translation files
import commonEN from "../public/locales/en/common.json";
import commonJA from "../public/locales/ja/common.json";
import commonZH from "../public/locales/zh/common.json";

import settingsEN from "../public/locales/en/settings.json";
import settingsJA from "../public/locales/ja/settings.json";
import settingsZH from "../public/locales/zh/settings.json";

import licenseEN from "../public/locales/en/license.json";
import licenseJA from "../public/locales/ja/license.json";
import licenseZH from "../public/locales/zh/license.json";

import moduleEN from "../public/locales/en/module.json";
import moduleJA from "../public/locales/ja/module.json";
import moduleZH from "../public/locales/zh/module.json";

const resources = {
  en: {
    common: commonEN,
    settings: settingsEN,
    license: licenseEN,
    module: moduleEN,
  },
  jp: {
    common: commonJA,
    settings: settingsJA,
    license: licenseJA,
    module: moduleJA,
  },
  zh: {
    common: commonZH,
    settings: settingsZH,
    license: licenseZH,
    module: moduleZH,
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
