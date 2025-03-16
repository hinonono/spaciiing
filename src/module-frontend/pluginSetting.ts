import { AppContextType } from "../AppProvider";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { ExternalMessageUpdateEditorPreference } from "../types/Messages/MessageEditorPreference";

export function pluginSettingHandler(
  message: ExternalMessage,
  appContext: AppContextType
) {
  if (message.mode === "UpdateEditorPreference") {
    updateEditorPreferenceHandler(
      message as ExternalMessageUpdateEditorPreference,
      appContext
    );
  } else if (message.mode === "UpdateEditorType") {
    updateEditorTypeHandler(message, appContext);
  }
}

const updateEditorPreferenceHandler = (
  message: ExternalMessageUpdateEditorPreference,
  appContext: AppContextType
) => {
  console.log("接收了EP！");
  console.log(message.editorPreference);

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
