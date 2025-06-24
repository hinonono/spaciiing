import * as util from "./util";
import {
  ExternalMessageLocalization,
  MessageLocalization,
} from "../types/Messages/MessageLocalization";
import { utils } from "./utils";

export async function initLocalization() {
  // 檢查用戶的Client Storage是否有儲存license key
  const KEY = "preferred-language";
  const preferredLanguage = await figma.clientStorage.getAsync(KEY);

  // console.log("P LANG");

  // console.log(preferredLanguage);

  if (preferredLanguage) {
    // 如果有偏好語言的話，載入
    const message: ExternalMessageLocalization = {
      lang: preferredLanguage,
      module: "Localization",
      phase: "Init",
      direction: "Outer",
    };
    utils.communication.sendMessageBack(message);
  } else {
    // 沒有偏好語言，進行初始化
    await figma.clientStorage.setAsync(KEY, "enUS");
  }
}

export async function setPreferredLangToLocalStorage(lang: string) {
  const KEY = "preferred-language";
  await figma.clientStorage.setAsync(KEY, lang);
}

export function reception(message: MessageLocalization) {
  if (message.phase == "Actual") {
    setPreferredLangToLocalStorage(message.lang);
  }
}

export async function getPreferredLang(): Promise<string> {
  const KEY = "preferred-language";
  const preferredLanguage = await figma.clientStorage.getAsync(KEY);

  if (preferredLanguage) {
    return preferredLanguage;
  } else {
    return "enUS";
  }
}
