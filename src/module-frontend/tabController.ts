// 用於管理Tab的切換行為

import { useAppContext } from "../AppProvider";
import { Module } from "../types/Module";
import { initShortcut } from "./shortcutFronEnd";
import { initStyleIntroducer } from "./styleIntroducerFrontEnd";
import {
  initVariableEditor,
  variableEditorWillEnd,
} from "./variableEditorFrontEnd";
import {
  initVirtualProfile,
  virtualProfileWillEnd,
} from "./virtualProfileFrontEnd";

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

export function tabWillEndController(
  prevTab: Module | null,
  activeTab: Module
) {
  const {
    virtualProfileGroups,
    setVirtualProfileGroups,
    setCustomCodeExecutionResults,
  } = useAppContext();

  switch (prevTab) {
    case "Init":
      if (activeTab !== "Init") {
        // Do something when leaving Init tab
      }
      break;
    case "Localization":
      if (activeTab !== "Localization") {
        // Do something when leaving Localization tab
      }
      break;
    case "Spaciiing":
      if (activeTab !== "Spaciiing") {
        // Do something when leaving Spaciiing tab
      }
      break;
    case "Memorizer":
      if (activeTab !== "Memorizer") {
        // Do something when leaving Memorizer tab
      }
      break;
    case "Shortcut":
      if (activeTab !== "Shortcut") {
        // Do something when leaving Shortcut tab
      }
      break;
    case "Framer":
      if (activeTab !== "Framer") {
        // Do something when leaving Framer tab
      }
      break;
    case "LoremGenerator":
      if (activeTab !== "LoremGenerator") {
        // Do something when leaving LoremGenerator tab
      }
      break;
    case "Instantiater":
      if (activeTab !== "Instantiater") {
        // Do something when leaving Instantiater tab
      }
      break;
    case "Renamer":
      if (activeTab !== "Renamer") {
        // Do something when leaving Renamer tab
      }
      break;
    case "VariableEditor":
      if (activeTab !== "VariableEditor") {
        variableEditorWillEnd(setCustomCodeExecutionResults);
      }
      break;
    case "VirtualProfile":
      if (activeTab !== "VirtualProfile") {
        virtualProfileWillEnd(virtualProfileGroups, setVirtualProfileGroups);
      }
      break;
    case "SelectionFilter":
      if (activeTab !== "SelectionFilter") {
        // Do something when leaving SelectionFilter tab
      }
      break;
    case "PluginSetting":
      if (activeTab !== "PluginSetting") {
        // Do something when leaving PluginSetting tab
      }
      break;
    case "LicenseManagement":
      if (activeTab !== "LicenseManagement") {
        // Do something when leaving LicenseManagement tab
      }
      break;
    case "AspectRatioHelper":
      if (activeTab !== "AspectRatioHelper") {
        // Do something when leaving AspectRatioHelper tab
      }
      break;
    case "Resize":
      if (activeTab !== "Resize") {
        // Do something when leaving Resize tab
      }
      break;
    case "StyleIntroducer":
      if (activeTab !== "StyleIntroducer") {
        // Do something when leaving StyleIntroducer tab
      }
      break;
    default:
      // Handle unknown previous tab
      break;
  }
}
