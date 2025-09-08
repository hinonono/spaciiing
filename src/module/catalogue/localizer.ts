// 用於處理型錄語言的本地化需求
import module_en_US from "../../../public/locales/en-US/module.json";
import module_ja_JP from "../../../public/locales/ja-JP/module.json";
import module_zh_TW from "../../../public/locales/zh-TW/module.json";
import module_zh_CN from "../../../public/locales/zh-CN/module.json";

import term_en_US from "../../../public/locales/en-US/term.json";
import term_ja_JP from "../../../public/locales/ja-JP/term.json";
import term_zh_TW from "../../../public/locales/zh-TW/term.json";
import term_zh_CN from "../../../public/locales/zh-CN/term.json";
import { CatalogueLocalizationResources } from "../../types/CatalogueLocalization";

function getCatalogueLocalization(lang: string, file: "module" | "term"): { [key: string]: string } {
    if (file === "module") {
        switch (lang) {
            case "enUS":
                return module_en_US;
            case "jaJP":
                return module_ja_JP;
            case "zhTW":
                return module_zh_TW;
            case "zhCN":
                return module_zh_CN;
            default:
                throw new Error(`Unsupported Language Key. Got ${lang}.`)
        }
    } else {
        switch (lang) {
            case "enUS":
                return term_en_US;
            case "jaJP":
                return term_ja_JP;
            case "zhTW":
                return term_zh_TW;
            case "zhCN":
                return term_zh_CN;
            default:
                throw new Error(`Unsupported Language Key. Got ${lang}.`)
        }
    }
}

export function createLocalizationResource(lang: string): CatalogueLocalizationResources {
    return {
        lang: lang,
        term: getCatalogueLocalization(lang, "term"),
        module: getCatalogueLocalization(lang, "module")
    }
}