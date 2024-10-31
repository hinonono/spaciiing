import { AppContextType } from "../AppProvider";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { Message } from "../types/Messages/Message";
import {
  ExternalMessageUpdateCustomCodeExecutionResults,
  ExternalMessageUpdateVariableCollectionList,
  ExternalMessageUpdateVariableCollectionMode,
} from "../types/Messages/MessageVariableEditor";

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

export function UpdateVariableCollectionList(
  message: ExternalMessageUpdateVariableCollectionList,
  appContext: AppContextType
) {
  const { setVariableCollectionList } = appContext;
  setVariableCollectionList(message.collections);
}

export function UpdateVariableCollectionMode(
  message: ExternalMessageUpdateVariableCollectionMode,
  appContext: AppContextType
) {
  const { setvariableCollectionModes } = appContext;
  setvariableCollectionModes(message.modes);
}

export function updateCustomCodeExecutionResults(
  message: ExternalMessageUpdateCustomCodeExecutionResults,
  appContext: AppContextType
) {
  const { setCustomCodeExecutionResults } = appContext;
  setCustomCodeExecutionResults(message.results);
}

export function variableEditorWillEnd(appContext: AppContextType) {
  const { setCustomCodeExecutionResults } = appContext;
  setCustomCodeExecutionResults([]);
}

export function variableEditorHandler(
  message: ExternalMessage,
  appContext: AppContextType
) {
  if (message.mode === "UpdateVariableCollectionList") {
    UpdateVariableCollectionList(
      message as ExternalMessageUpdateVariableCollectionList,
      appContext
    );
  }
  if (message.mode === "UpdateVariableCollectionMode") {
    UpdateVariableCollectionMode(
      message as ExternalMessageUpdateVariableCollectionMode,
      appContext
    );
  }
  if (message.mode === "UpdateCustomCodeExecutionResults") {
    updateCustomCodeExecutionResults(
      message as ExternalMessageUpdateCustomCodeExecutionResults,
      appContext
    );
  }
}
