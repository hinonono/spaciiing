import { useAppContext } from "../AppProvider";
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
