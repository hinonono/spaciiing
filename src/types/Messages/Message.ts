import { EditorPreference } from "../EditorPreference";
import { Module } from "../Module";

// 訊息的基底屬性
export interface Message {
  module: Module;
  direction?: MessageDirection;
  phase: MessagePhase;
  shouldSaveEditorPreference?: boolean;
  editorPreference?: EditorPreference;
}

// 訊息的階段
type MessagePhase = "Init" | "Actual" | "WillEnd";

// 訊息的方向
type MessageDirection = "Inner" | "Outer";
