import { useAppContext } from "../AppProvider";
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
  message: ExternalMessageUpdateVariableCollectionList
) {
  const { setVariableCollectionList } = useAppContext();
  setVariableCollectionList(message.collections);
}

export function UpdateVariableCollectionMode(
  message: ExternalMessageUpdateVariableCollectionMode
) {
  const { setvariableCollectionModes } = useAppContext();
  setvariableCollectionModes(message.modes);
}

export function updateCustomCodeExecutionResults(
  message: ExternalMessageUpdateCustomCodeExecutionResults
) {
  const { setCustomCodeExecutionResults } = useAppContext();
  setCustomCodeExecutionResults(message.results);
}

export function variableEditorWillEnd() {
  const { setCustomCodeExecutionResults } = useAppContext();
  setCustomCodeExecutionResults([]);
}

export function variableEditorHandler(message: ExternalMessage) {
  if (message.mode === "UpdateVariableCollectionList") {
    UpdateVariableCollectionList(
      message as ExternalMessageUpdateVariableCollectionList
    );
  }
  if (message.mode === "UpdateVariableCollectionMode") {
    UpdateVariableCollectionMode(
      message as ExternalMessageUpdateVariableCollectionMode
    );
  }
  if (message.mode === "UpdateCustomCodeExecutionResults") {
    updateCustomCodeExecutionResults(
      message as ExternalMessageUpdateCustomCodeExecutionResults
    );
  }
}
