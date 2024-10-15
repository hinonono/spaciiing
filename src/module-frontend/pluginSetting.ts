import { useAppContext } from "../AppProvider";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { ExternalMessageUpdateEditorPreference } from "../types/Messages/MessageEditorPreference";

export function pluginSettingHandler(message: ExternalMessage) {
  if (message.mode === "UpdateEditorPreference") {
    updateEditorPreferenceHandler(
      message as ExternalMessageUpdateEditorPreference
    );
  }
}

const updateEditorPreferenceHandler = (
  message: ExternalMessageUpdateEditorPreference
) => {
  console.log("接收了EP！");
  console.log(message.editorPreference);

  const { setEditorPreference } = useAppContext();

  setEditorPreference(() => message.editorPreference);
};
