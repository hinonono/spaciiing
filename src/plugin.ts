// 屬性
import pluginConfig from "./pluginConfig.json";
import { Message } from "./types/Messages/Message";

import { MessageResize } from "./types/Messages/MessageResize";
import { MessageAspectRatio } from "./types/Messages/MessageAspectRatio";
import { MessageLocalization } from "./types/Messages/MessageLocalization";
import { MessageSelectionFilter } from "./types/Messages/MessageSelectionFilter";
import { MessageVirtualProfile } from "./types/Messages/MessageVirtualProfile";
import { MessageVariableEditor, MessageVariableEditorExecuteCode } from "./types/Messages/MessageVariableEditor";
import { MessageInstantiater } from "./types/Messages/MessageInstantiater";
import { MessageLoremGenerator } from "./types/Messages/MessageLoremGenerator";
import { MessageFramer } from "./types/Messages/MessageFramer";
import { MessageSpaciiing } from "./types/Messages/MessageSpaciiing";
import { MessageShortcut } from "./types/Messages/MessageShortcut";

// 功能模組
import * as init from "./module/init";
import * as spaciiing from "./module/spaciiing";
import * as framer from "./module/framer";
import * as shortcut from "./module/shortcut";
import * as lorem from "./module/loremGenerator";
import * as instantiater from "./module/instantiater";
import * as renamer from "./module/renamer";
import * as variableEditor from "./module/variableEditor";
import * as virtualProfile from "./module/virtualProfile";
import * as selectionFilter from "./module/selectionFilter";
import * as licenseManagement from "./module/licenseManagement";
import * as localization from "./module/localization";
import * as aspectRatioHelper from "./module/aspectRatioHelper";
import * as resize from "./module/resize";
import * as minMaxWindow from "./module/minMaxWindow";
import * as styleIntroducer from "./module/styleIntroducer/styleIntroducer";
import * as propertyClipboard from "./module/propertyClipboard";
import * as arrowCreator from "./module/arrowCreator/arrowCreator";
import { MessageStyleIntroducer } from "./types/Messages/MessageStyleIntroducer";
import { MessageLicenseManagement } from "./types/Messages/MessageLicenseManagement";
import { MessageRenamer } from "./types/Messages/MessageRenamer";
import { ExternalMessage } from "./types/Messages/ExternalMessage";
import { MessagePropertyClipboard } from "./types/Messages/MessagePropertyClipboard";
import { MessageArrowCreator } from "./types/Messages/MessageArrowCreator";

import { utils } from "./module/utils";
import { MessageMinMaxWindow } from "./types/Messages/MessageMinMaxWindow";

figma.showUI(__html__, { themeColors: true });
figma.ui.resize(pluginConfig.windowSize.default.width, pluginConfig.windowSize.default.height);

figma.ui.onmessage = (message: Message) => {
  const selectionLength = utils.editor.getCurrentSelection().length;
  let incrementSavedClicks = 0;
  let shouldIncrementTime = true;

  if (
    message.shouldSaveEditorPreference &&
    message.shouldSaveEditorPreference == true
  ) {
    if (message.editorPreference) {
      utils.data.saveEditorPreference(message.editorPreference, "General");
    } else {
      throw new Error("Missing Editor Preference.");
    }
  }

  if (
    message.shouldSaveSyncedReources &&
    message.shouldSaveSyncedReourcesType &&
    message.shouldSaveSyncedReources === true
  ) {
    if (message.syncedResources) {
      utils.data.saveSyncedResource(message.shouldSaveSyncedReourcesType, message.syncedResources);
    } else {
      throw new Error("Missing synced resources.")
    }
  }

  switch (message.module) {
    case "Init":
      init.init();
      incrementSavedClicks = 0;
      shouldIncrementTime = false;
      break;
    case "Localization":
      localization.reception(message as MessageLocalization);
      incrementSavedClicks = 0;
      shouldIncrementTime = false;
      break;
    case "Spaciiing":
      spaciiing.useSpacing(message as MessageSpaciiing);
      incrementSavedClicks = selectionLength * 4
      break;
    case "ArrowCreator":
      arrowCreator.reception(message as MessageArrowCreator)
      incrementSavedClicks = (selectionLength - 1) * 18
      break;
    case "Framer":
      framer.useEqual(message as MessageFramer);
      incrementSavedClicks = selectionLength
      break;
    case "PropertyClipboard":
      const pcMessage = message as MessagePropertyClipboard;
      propertyClipboard.reception(pcMessage);
      if (pcMessage.property) {
        incrementSavedClicks = selectionLength * pcMessage.property.length
      }
      break;
    case "Shortcut":
      const scMessage = message as MessageShortcut;
      shortcut.executeShortcut(scMessage);
      if (scMessage.phase !== "Init") {
        incrementSavedClicks = selectionLength * 10;
      }
      break;
    case "Renamer":
      renamer.renameSelectedObjects(message as MessageRenamer);
      incrementSavedClicks = selectionLength * 2
      break;
    case "VariableEditor":
      const veMessage = message as MessageVariableEditor;
      variableEditor.reception(veMessage);

      if (veMessage.intent === "executeCode") {
        const veMessage2 = veMessage as MessageVariableEditorExecuteCode;
        incrementSavedClicks = Math.round(veMessage2.code.length / 114) * 5
      }
      break;
    case "VirtualProfile":
      virtualProfile.reception(message as MessageVirtualProfile);
      incrementSavedClicks = selectionLength * 4
      break;
    case "Instantiater":
      const iMessage = message as MessageInstantiater;
      instantiater.instantiateTarget(iMessage);
      incrementSavedClicks = iMessage.targets.length * 80
      break;
    case "LoremGenerator":
      lorem.makeLorem(message as MessageLoremGenerator);
      incrementSavedClicks = selectionLength * 4
      break;
    case "SelectionFilter":
      selectionFilter.reception(message as MessageSelectionFilter);
      incrementSavedClicks = selectionLength * 16
      break;
    case "LicenseManagement":
      licenseManagement.reception(message as MessageLicenseManagement);
      shouldIncrementTime = false;
      break;
    case "AspectRatioHelper":
      aspectRatioHelper.reception(message as MessageAspectRatio);
      incrementSavedClicks = selectionLength * 2
      break;
    case "Resize":
      shouldIncrementTime = false;
      incrementSavedClicks = 0;
      resize.reception(message as MessageResize);
      break;
    case "MinMaxWindow":
      shouldIncrementTime = false;
      incrementSavedClicks = 0;
      minMaxWindow.reception(message as MessageMinMaxWindow);
      break;
    case "StyleIntroducer":
      const siMessage = message as MessageStyleIntroducer;
      styleIntroducer.reception(siMessage);

      if (siMessage.styleSelection) {
        incrementSavedClicks = siMessage.styleSelection.scopes.length * 18 + 8
      }
      break;
    case "General":
      shouldIncrementTime = false;
      incrementSavedClicks = 0;
      break;
    case "PluginSetting":
      shouldIncrementTime = false;
      incrementSavedClicks = 0;
      break;
    default:
      shouldIncrementTime = false;
      break;
  }

  if (shouldIncrementTime) {
    utils.service.incrementSavedClicks(incrementSavedClicks, shouldIncrementTime);
  }
};

// Function to execute before the plugin is closed
const handlePluginClose = () => {
  const message: ExternalMessage = {
    module: "VirtualProfile",
    direction: "Outer",
    mode: "PullVirtualProfile",
    phase: "WillEnd",
  };

  utils.communication.sendMessageBack(message);
};

// Add event listener for plugin close
figma.on("close", handlePluginClose);
