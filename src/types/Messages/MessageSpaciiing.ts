import { ExternalMessage, Message } from "../Message";

// Spaciiing模組專用的基底屬性
export type SpacingMode = "horizontal" | "vertical";

export interface MessageSpaciiing extends Message {
  mode: SpacingMode;
  spacing: string;
  useCustomValue: boolean;
  addAutolayout: boolean;
}

export interface ExternalMessageUpdateCustomSpacing extends ExternalMessage {
  spacing: string;
}
