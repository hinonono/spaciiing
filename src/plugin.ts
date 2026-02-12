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
import { ModuleHandler } from "./types/ModuleHandler";

figma.showUI(__html__, { themeColors: true });
figma.ui.resize(pluginConfig.windowSize.default.width, pluginConfig.windowSize.default.height);

figma.ui.onmessage = (message: Message) => {
  const selectionLength = utils.editor.getCurrentSelection().length;

  handlePreferenceSaving(message);
  handleSyncedResources(message);

  const handler = moduleHandlers[message.module];
  if (!handler) return;

  handler.execute(message);

  const shouldIncrementTime = handler.shouldIncrementTime !== false;

  if (shouldIncrementTime && handler.getSavedClicks) {
    const clicks = handler.getSavedClicks(message, selectionLength);
    utils.service.incrementSavedClicks(clicks, true);
  }
};

function handlePreferenceSaving(message: Message): void {
  if (
    message.shouldSaveEditorPreference === true
  ) {
    if (message.editorPreference) {
      utils.data.saveEditorPreference(
        message.editorPreference,
        "General"
      );
    } else {
      throw new Error("Missing Editor Preference.");
    }
  }
}

function handleSyncedResources(message: Message): void {
  if (
    message.shouldSaveSyncedReources === true &&
    message.shouldSaveSyncedReourcesType
  ) {
    if (message.syncedResources) {
      utils.data.saveSyncedResource(
        message.shouldSaveSyncedReourcesType,
        message.syncedResources
      );
    } else {
      throw new Error("Missing synced resources.");
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moduleHandlers: Record<string, ModuleHandler<any>> = {
  Init: {
    execute: () => init.init(),
    shouldIncrementTime: false,
  },

  Localization: {
    execute: (message: MessageLocalization) =>
      localization.reception(message),
    shouldIncrementTime: false,
  },

  Spaciiing: {
    execute: (message: MessageSpaciiing) =>
      spaciiing.useSpacing(message),
    getSavedClicks: (_, selectionLength) =>
      selectionLength * 4,
  },

  ArrowCreator: {
    execute: (message: MessageArrowCreator) =>
      arrowCreator.reception(message),
    getSavedClicks: (_, selectionLength) =>
      (selectionLength - 1) * 18,
  },

  Framer: {
    execute: (message: MessageFramer) =>
      framer.useEqual(message),
    getSavedClicks: (_, selectionLength) =>
      selectionLength,
  },

  PropertyClipboard: {
    execute: (message: MessagePropertyClipboard) =>
      propertyClipboard.reception(message),
    getSavedClicks: (message: MessagePropertyClipboard, selectionLength) =>
      message.property
        ? selectionLength * message.property.length
        : 0,
  },

  Shortcut: {
    execute: (message: MessageShortcut) =>
      shortcut.executeShortcut(message),
    getSavedClicks: (message: MessageShortcut, selectionLength) =>
      message.phase !== "Init"
        ? selectionLength * 10
        : 0,
  },

  Renamer: {
    execute: (message: MessageRenamer) =>
      renamer.renameSelectedObjects(message),
    getSavedClicks: (_, selectionLength) =>
      selectionLength * 2,
  },

  VariableEditor: {
    execute: (message: MessageVariableEditor) =>
      variableEditor.reception(message),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSavedClicks: (message: MessageVariableEditor, _) => {
      if (message.intent === "executeCode") {
        const veMessage =
          message as MessageVariableEditorExecuteCode;
        return Math.round(veMessage.code.length / 114) * 5;
      }
      return 0;
    },
  },

  VirtualProfile: {
    execute: (message: MessageVirtualProfile) =>
      virtualProfile.reception(message),
    getSavedClicks: (_, selectionLength) =>
      selectionLength * 4,
  },

  Instantiater: {
    execute: (message: MessageInstantiater) =>
      instantiater.instantiateTarget(message),
    getSavedClicks: (message: MessageInstantiater) =>
      message.targets.length * 80,
  },

  LoremGenerator: {
    execute: (message: MessageLoremGenerator) =>
      lorem.makeLorem(message),
    getSavedClicks: (_, selectionLength) =>
      selectionLength * 4,
  },

  SelectionFilter: {
    execute: (message: MessageSelectionFilter) =>
      selectionFilter.reception(message),
    getSavedClicks: (_, selectionLength) =>
      selectionLength * 16,
  },

  LicenseManagement: {
    execute: (message: MessageLicenseManagement) =>
      licenseManagement.reception(message),
    shouldIncrementTime: false,
  },

  AspectRatioHelper: {
    execute: (message: MessageAspectRatio) =>
      aspectRatioHelper.reception(message),
    getSavedClicks: (_, selectionLength) =>
      selectionLength * 2,
  },

  Resize: {
    execute: (message: MessageResize) =>
      resize.reception(message),
    shouldIncrementTime: false,
  },

  MinMaxWindow: {
    execute: (message: MessageMinMaxWindow) =>
      minMaxWindow.reception(message),
    shouldIncrementTime: false,
  },

  StyleIntroducer: {
    execute: (message: MessageStyleIntroducer) =>
      styleIntroducer.reception(message),
    getSavedClicks: (message: MessageStyleIntroducer) =>
      message.styleSelection
        ? message.styleSelection.scopes.length * 18 + 8
        : 0,
  },

  General: {
    execute: () => { },
    shouldIncrementTime: false,
  },

  PluginSetting: {
    execute: () => { },
    shouldIncrementTime: false,
  },
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
