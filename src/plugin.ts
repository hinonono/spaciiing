// 屬性
import {
  MessageFramer,
  MessageSpaciiing,
  MessageMemorizer,
  MessageLoremGenerator,
  MessageInstantiater,
  Message,
  MessageShortcut,
  MessageRenamer,
  MessageVariableEditor,
  MessageVirtualProfile,
  ExternalMessage,
  MessageSelectionFilter,
  MessageLicenseManagement,
  MessageLocalization,
  MessageAspectRatio,
} from "./types/Message";

// 功能模組
import * as init from "./module/init";
import * as spaciiing from "./module/spaciiing";
import * as framer from "./module/framer";
import * as memorizer from "./module/memorizer";
import * as shortcut from "./module/shortcut";
import * as lorem from "./module/loremGenerator";
import * as instantiater from "./module/instantiater";
import * as renamer from "./module/renamer";
import * as variableEditor from "./module/variableEditor";
import * as virtualProfile from "./module/virtualProfile";
import * as selectionFilter from "./module/selectionFilter";
import * as util from "./module/util";
import * as licenseManagement from "./module/licenseManagement";
import * as localization from "./module/localization";
import * as aspectRatioHelper from "./module/aspectRatioHelper";

figma.showUI(__html__, { themeColors: true });
figma.ui.resize(380, 500);

figma.ui.onmessage = (message: Message) => {
  console.log(message);

  switch (message.module) {
    case "Init":
      init.init();
      break;
    case "Localization":
      localization.reception(message as MessageLocalization);
      break;
    case "Spaciiing":
      spaciiing.useSpacing(message as MessageSpaciiing);
      break;
    case "Framer":
      framer.useEqual(message as MessageFramer);
      break;
    case "Memorizer":
      memorizer.useQuickAction(message as MessageMemorizer);
      break;
    case "Shortcut":
      shortcut.executeShortcut(message as MessageShortcut);
      break;
    case "Renamer":
      renamer.renameSelectedObjects(message as MessageRenamer);
      break;
    case "VariableEditor":
      variableEditor.reception(message as MessageVariableEditor);
      break;
    case "VirtualProfile":
      virtualProfile.reception(message as MessageVirtualProfile);
      break;
    case "Instantiater":
      instantiater.instantiateTarget(message as MessageInstantiater);
      break;
    case "LoremGenerator":
      lorem.makeLorem(message as MessageLoremGenerator);
      break;
    case "SelectionFilter":
      selectionFilter.reception(message as MessageSelectionFilter);
      break;
    case "LicenseManagement":
      licenseManagement.reception(message as MessageLicenseManagement);
      break;
    case "AspectRatioHelper":
      aspectRatioHelper.reception(message as MessageAspectRatio);
      break;
    default:
      break;
  }
};

// Function to execute before the plugin is closed
const handlePluginClose = () => {
  console.log("Plugin is about to be closed.");

  const message: ExternalMessage = {
    module: "VirtualProfile",
    direction: "Outer",
    mode: "PullVirtualProfile",
    phase: "WillEnd",
  };

  util.sendMessageBack(message);
};

// Add event listener for plugin close
figma.on("close", handlePluginClose);
