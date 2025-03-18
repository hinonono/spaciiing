import { Message } from "./Message";
import { ExternalMessage } from "./ExternalMessage";
import { Direction } from "../General";

// Spaciiing模組專用的基底屬性
export type SpacingMode = Direction | "grid";

export interface MessageSpaciiing extends Message {
  mode: SpacingMode;
  spacing: number;
  useCustomValue: boolean;
  addAutolayout: boolean;
  gridColumn?: number;
}

export interface ExternalMessageUpdateCustomSpacing extends ExternalMessage {
  spacing: string;
}
