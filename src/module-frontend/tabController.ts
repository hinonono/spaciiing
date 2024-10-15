// 用於管理Tab的切換行為

import { Module } from "../types/Module";
import { initShortcut } from "./shortcutFronEnd";
import { initStyleIntroducer } from "./styleIntroducerFrontEnd";
import { initVariableEditor } from "./variableEditorFrontEnd";
import { initVirtualProfile } from "./virtualProfileFrontEnd";

export function activeTabController(activeTab: Module) {
  switch (activeTab) {
    case "Init":
      // Handle Init case
      break;
    case "Localization":
      // Handle Localization case
      break;
    case "Spaciiing":
      // Handle Spaciiing case
      break;
    case "Memorizer":
      // Handle Memorizer case
      break;
    case "Shortcut":
      initShortcut();
      break;
    case "Framer":
      // Handle Framer case
      break;
    case "LoremGenerator":
      // Handle LoremGenerator case
      break;
    case "Instantiater":
      initVariableEditor();
      break;
    case "Renamer":
      // Handle Renamer case
      break;
    case "VariableEditor":
      initVariableEditor();
      break;
    case "VirtualProfile":
      initVirtualProfile();
      break;
    case "SelectionFilter":
      // Handle SelectionFilter case
      break;
    case "PluginSetting":
      // Handle PluginSetting case
      break;
    case "LicenseManagement":
      // Handle LicenseManagement case
      break;
    case "AspectRatioHelper":
      // Handle AspectRatioHelper case
      break;
    case "Resize":
      // Handle Resize case
      break;
    case "StyleIntroducer":
      initStyleIntroducer();
      break;
    default:
      // Handle unknown case
      break;
  }
}
