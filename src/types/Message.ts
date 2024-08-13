import { Module } from "./Module";

// 訊息的基底屬性
export interface Message {
  module: Module;
  direction?: MessageDirection;
  phase: MessagePhase;
}

// 訊息的階段
type MessagePhase = "Init" | "Actual" | "WillEnd";

// 訊息的方向
type MessageDirection = "Inner" | "Outer";

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
