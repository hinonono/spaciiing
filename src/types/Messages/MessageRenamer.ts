import { Message } from "./Message";
import { NodeRenamable } from "../NodeRenamable";

// Renamer專用的基底屬性
export type RenamerSupportedTargets = "text" | "image" | "auto_layout";

export interface RenamerOptions {
  deleteHiddenLayer: boolean;
  skipLockedLayer: boolean;
  includeParentLayer: boolean;
}

export interface MessageRenamer extends Message {
  target: RenamerSupportedTargets[];
  renameTarget: NodeRenamable[];
  options: RenamerOptions;
}
