import { Message } from "../types/Messages/Message";
import { MessageShortcut } from "../types/Messages/MessageShortcut";

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

export function createAutoLayoutIndividually() {
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
