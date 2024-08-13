// 訊息的基底屬性
export interface Message {
  module: ModuleType;
  direction?: MessageDirection;
  phase: MessagePhase;
}

// 訊息的階段
type MessagePhase = "Init" | "Actual" | "WillEnd";

// 訊息的方向
type MessageDirection = "Inner" | "Outer";

export type ModuleType =
  | "Init"
  | "Localization"
  | "Spaciiing"
  | "Memorizer"
  | "Shortcut"
  | "Framer"
  | "LoremGenerator"
  | "Instantiater"
  | "Renamer"
  | "VariableEditor"
  | "VirtualProfile"
  | "SelectionFilter"
  | "PluginSetting"
  | "LicenseManagement"
  | "AspectRatioHelper"
  | "Resize"
  | "StyleIntroducer";

// 從Plugin內部傳送到外部專用的基底屬性
export type ExternalMode =
  | "UpdateFrameToMemorizedSize"
  | "UpdateMemorizedName"
  | "UpdateVariableCollectionList"
  | "UpdateVariableCollectionMode"
  | "UpdateVirtualProfile"
  | "UpdateMagicalObject"
  | "UpdateCustomCodeExecutionResults"
  | "PullVirtualProfile"
  | "UpdateLicense"
  | "UpdateStyleList";
export interface ExternalMessage extends Message {
  mode?: ExternalMode;
}

// License



export interface ExternalVariableCollection {
  id: string;
  name: string;
}
export interface ExternalMessageUpdateVariableCollectionList
  extends ExternalMessage {
  collections: ExternalVariableCollection[];
}
export interface ExternalMessageUpdateCustomCodeExecutionResults
  extends ExternalMessage {
  results: string[];
}
export interface ExternalVariableMode {
  modeId: string;
  name: string;
}
export interface ExternalMessageUpdateVariableCollectionMode
  extends ExternalMessage {
  modes: ExternalVariableMode[];
}
