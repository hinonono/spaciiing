import { ExternalMessage, Message } from "../Message";

// Memorizer模組專用的基底屬性
export type MemorizerMode = "memorize" | "apply";

export type AvailableMemorizeOptions = "width" | "height" | "name";

export type MemorizerAction =
  | "newFrame"
  | "setResizableNodeWidth"
  | "setResizableNodeHeight"
  | "setSelectionToMemorizedName"
  | "memorizeObjectSize"
  | "memorizeObjectWidth"
  | "memorizeObjectHeight"
  | "memorizedObjectName";

export interface MessageMemorizer extends Message {
  action: MemorizerAction;
}

export interface ExternalMessageUpdateFrame extends ExternalMessage {
  memorizedObjectWidth?: string;
  memorizedObjectHeight?: string;
  memorizedName?: string;
}
