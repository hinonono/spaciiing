import { MessageShortcutSpiltText, SpiltType } from './../types/Messages/MessageShortcut';
import { AppContextType } from "../AppProvider";
import { Message } from "../types/Messages/Message";
import { MessageShortcut, MessageShortcutNumbering, NumberingForm } from "../types/Messages/MessageShortcut";
import { checkProFeatureAccessibleForUser } from "./utilFrontEnd";
import * as pluginConfig from "../pluginConfig.json";
import { ReactHTMLElement } from "react";
import { Direction } from "../types/General";

export function initShortcut() {
  const message: Message = {
    module: "Shortcut",
    phase: "Init",
    direction: "Inner",
  };

  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
}

export function createAutoLayoutIndividually(appContext: AppContextType, isRealCall: boolean) {
  if (!isRealCall) {
    if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
      appContext.setFreeUserDelayModalConfig({
        show: true,
        initialTime: pluginConfig.freeUserWaitingTime,
        onProceed: () => createAutoLayoutIndividually(appContext, true), // Retry with isRealCall = true
      });
      return;
    }
  }

  const message: MessageShortcut = {
    action: "createAutoLayoutIndividually",
    module: "Shortcut",
    phase: "Actual",
  };

  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
}

export const applyNumbering = (appContext: AppContextType, direction: Direction, form: NumberingForm, startfrom?: number, isRealCall = false) => {
  if (!isRealCall) {
    if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
      appContext.setFreeUserDelayModalConfig({
        show: true,
        initialTime: pluginConfig.freeUserWaitingTime,
        onProceed: () => applyNumbering(appContext, direction, form, startfrom, true),
      });
      return;
    }
  }

  const message: MessageShortcutNumbering = {
    module: "Shortcut",
    action: "numbering",
    direction: "Inner",
    phase: "Actual",
    numberingdirection: direction,
    numberingForm: form,
    startFrom: startfrom
  };
  parent.postMessage({ pluginMessage: message, }, "*");
};

export const applySpiltText = (appContext: AppContextType, spiltType: SpiltType, spiltSymbol?: string, isRealCall = false) => {
  if (!isRealCall) {
    if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
      appContext.setFreeUserDelayModalConfig({
        show: true,
        initialTime: pluginConfig.freeUserWaitingTime,
        onProceed: () => applySpiltText(appContext, spiltType, spiltSymbol, true),
      });
      return;
    }
  }

  const message: MessageShortcutSpiltText = {
    module: "Shortcut",
    action: "spiltText",
    direction: "Inner",
    phase: "Actual",
    spiltType: spiltType,
    spiltSymbol: spiltSymbol
  };
  parent.postMessage({ pluginMessage: message, }, "*");
};

export interface ShortcutButtonConfig {
  id?: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  svg?: React.ReactNode;
}