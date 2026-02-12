import { AppContextType } from "../AppProvider";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { ExternalMessageUpdateEditorPreference } from "../types/Messages/MessageEditorPreference";
import { ExternalMessageUpdateRuntimeSyncedResources } from "../types/Messages/MessageRuntimeSyncedResources";

export function pluginSettingHandler(
  message: ExternalMessage,
  appContext: AppContextType
) {
  if (message.mode === "UpdateEditorPreference") {
    updateEditorPreferenceHandler(
      message as ExternalMessageUpdateEditorPreference,
      appContext
    );
  } else if (message.mode === "UpdateRuntimeSyncedResources") {
    updateRuntimeSyncedResourcesHandler(
      message as ExternalMessageUpdateRuntimeSyncedResources,
      appContext
    )
  } else if (message.mode === "UpdateEditorType") {
    updateEditorTypeHandler(message, appContext);
  }
}

function updateRuntimeSyncedResourcesHandler(
  message: ExternalMessageUpdateRuntimeSyncedResources,
  appContext: AppContextType
) {
  const { setRuntimeSyncedResources } = appContext;
  setRuntimeSyncedResources(() => message.runtimeSyncedResources);
}

const updateEditorPreferenceHandler = (
  message: ExternalMessageUpdateEditorPreference,
  appContext: AppContextType
) => {
  const { setEditorPreference } = appContext;
  setEditorPreference(() => message.editorPreference);
};

const updateEditorTypeHandler = (
  message: ExternalMessage,
  appContext: AppContextType
) => {
  const { setEditorType } = appContext;

  if (!message.editorType) { return; }

  setEditorType(message.editorType);
}
