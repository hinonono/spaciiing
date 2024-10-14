import { EditorPreference } from "../EditorPreference";
import { ExternalMessage } from "./ExternalMessage";

export interface ExternalMessageUpdateEditorPreference extends ExternalMessage {
  editorPreference: EditorPreference;
}
