import { EditorPreference } from "../EditorPreference";
import { Message } from "./Message";

export interface MessageSaveEditorPreference extends Message {
    editorPreference: EditorPreference
}