import { EditorPreference } from "../EditorPreference";
import { Module } from "../Module";
import { RuntimeSyncedResources } from "../RuntimeSyncedResources";
import { SyncedResourceType } from "./MessageSaveSyncedResource";

// 訊息的基底屬性
export interface Message {
  module: Module;
  direction?: MessageDirection;
  phase: MessagePhase;
  shouldSaveEditorPreference?: boolean;
  editorPreference?: EditorPreference;
  shouldSaveSyncedReources?: boolean;
  shouldSaveSyncedReourcesType?: SyncedResourceType;
  syncedResources?: RuntimeSyncedResources;
  lang?: string,
}

// 訊息的階段
type MessagePhase = "Init" | "Actual" | "WillEnd";

// 訊息的方向
type MessageDirection = "Inner" | "Outer";
