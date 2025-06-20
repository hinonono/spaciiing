import { Message } from "./Message";
import { NodeRenamable } from "../NodeRenamable";

// Renamer專用的基底屬性
export type RenamerSupportedTargets = "text" | "image" | "auto_layout";

export interface RenamerOptions {
  deleteHiddenLayer: boolean;
  skipLockedLayer: boolean;
  skipHiddenLayers: boolean;
  useTextLayerContent: boolean;
}

export interface MessageRenamer extends Message {
  target: RenamerSupportedTargets[];
  renameTarget: NodeRenamable[];
  options: RenamerOptions;
  lang: string;
}

export interface PredifinedNames {
  image: string,
  frame: string,
  group: string,
  rectangle: string,
  ellipse: string,
  line: string,
  polygon: string,
  star: string,
  vector: string,
  auto_layout_horizontal: string,
  auto_layout_vertical: string,
  text: string
}