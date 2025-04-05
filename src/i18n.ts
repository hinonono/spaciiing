import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files directly
// Import common translation files
import common_en_US from "../public/locales/en-US/common.json";
import common_ja_JP from "../public/locales/ja-JP/common.json";
import common_zh_TW from "../public/locales/zh-TW/common.json";
import common_zh_CN from "../public/locales/zh-CN/common.json";

import settings_en_US from "../public/locales/en-US/settings.json";
import settings_ja_JP from "../public/locales/ja-JP/settings.json";
import settings_zh_TW from "../public/locales/zh-TW/settings.json";
import settings_zh_CN from "../public/locales/zh-CN/settings.json";

import license_en_US from "../public/locales/en-US/license.json";
import license_ja_JP from "../public/locales/ja-JP/license.json";
import license_zh_TW from "../public/locales/zh-TW/license.json";
import license_zh_CN from "../public/locales/zh-CN/license.json";

import module_en_US from "../public/locales/en-US/module.json";
import module_ja_JP from "../public/locales/ja-JP/module.json";
import module_zh_TW from "../public/locales/zh-TW/module.json";
import module_zh_CN from "../public/locales/zh-CN/module.json";

import term_en_US from "../public/locales/en-US/term.json";
import term_ja_JP from "../public/locales/ja-JP/term.json";
import term_zh_TW from "../public/locales/zh-TW/term.json";
import term_zh_CN from "../public/locales/zh-CN/term.json";

const resources = {
  enUS: {
    common: common_en_US,
    settings: settings_en_US,
    license: license_en_US,
    module: module_en_US,
    term: term_en_US,
  },
  jaJP: {
    common: common_ja_JP,
    settings: settings_ja_JP,
    license: license_ja_JP,
    module: module_ja_JP,
    term: term_ja_JP,
  },
  zhTW: {
    common: common_zh_TW,
    settings: settings_zh_TW,
    license: license_zh_TW,
    module: module_zh_TW,
    term: term_zh_TW,
  },
  zhCN: {
    common: common_zh_CN,
    settings: settings_zh_CN,
    license: license_zh_CN,
    module: module_zh_CN,
    term: term_zh_CN,
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
    fallbackLng: "enUS",
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    ns: ["common", "settings"],
    defaultNS: "common",
  });

export default i18n;
