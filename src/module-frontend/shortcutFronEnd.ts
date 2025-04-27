import { AppContextType } from "../AppProvider";
import { Message } from "../types/Messages/Message";
import { MessageShortcut } from "../types/Messages/MessageShortcut";
import { checkProFeatureAccessibleForUser } from "./utilFrontEnd";
import * as info from "../info.json";
import { ReactHTMLElement } from "react";

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
        initialTime: info.freeUserWaitingTime,
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

export interface ShortcutButtonConfig {
  id?: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  svg?: React.ReactNode;
}