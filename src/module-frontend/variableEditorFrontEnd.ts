import { Message } from "../types/Messages/Message";
import {
  ExternalMessageUpdateCustomCodeExecutionResults,
  ExternalMessageUpdateVariableCollectionList,
  ExternalMessageUpdateVariableCollectionMode,
  ExternalVariableCollection,
  ExternalVariableMode,
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
  setVariableCollectionList: React.Dispatch<
    React.SetStateAction<ExternalVariableCollection[]>
  >
) {
  setVariableCollectionList(message.collections);
}

export function UpdateVariableCollectionMode(
  message: ExternalMessageUpdateVariableCollectionMode,
  setvariableCollectionModes: React.Dispatch<
    React.SetStateAction<ExternalVariableMode[]>
  >
) {
  setvariableCollectionModes(message.modes);
}

export function updateCustomCodeExecutionResults(
  message: ExternalMessageUpdateCustomCodeExecutionResults,
  setCustomCodeExecutionResults: React.Dispatch<React.SetStateAction<string[]>>
) {
  setCustomCodeExecutionResults(message.results);
}

export function variableEditorWillEnd(
  setCustomCodeExecutionResults: React.Dispatch<React.SetStateAction<string[]>>
) {
  setCustomCodeExecutionResults([]);
}
