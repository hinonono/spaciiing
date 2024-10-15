import { Message } from "../types/Messages/Message";

export function initVariableEditor() {
  const message: Message = {
    module: "VariableEditor",
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
