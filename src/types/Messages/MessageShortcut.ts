import { MagicObjectMembers } from "../MagicObject";
import { Message } from "./Message";

export type ShortcutAction =
  | "makeFrameOverlay"
  | "colorToLabelHEX"
  | "colorToLabelHEXWithTransparency"
  | "colorToLabelRGB"
  | "colorToLabelRGBA"
  | "convertSelectionToTextStyles"
  | "generateIconTemplate"
  | "memorizeNote"
  | "memorizeDesignStatusTag"
  | "memorizeTitleSection"
  | "updateMagicalObject"
  | "generateNote"
  | "generateDesignStatusTag"
  | "generateTitleSection"
  | "findAndReplace"
  | "unifyText"
  | "createAutoLayoutIndividually"
  | "updateCatalogueDescBackToFigma"
  | "debug";

export interface MessageShortcut extends Message {
  action: ShortcutAction;
}
export interface MessageUnifyText extends MessageShortcut {
  targetTextContent: string;
}
export interface MessageShortcutGenerateIconTemplate extends MessageShortcut {
  innerFrame: number;
  outerFrame: number;
  quantity: number;
}
export interface MessageShortcutUpdateMagicalObjectSingle
  extends MessageShortcut {
  member: MagicObjectMembers;
}
export interface MessageShortcutGenerateMagicalObjectMember
  extends MessageShortcutUpdateMagicalObjectSingle {
  componentId: string;
}
export interface MessageShortcutFindAndReplace extends MessageShortcut {
  findCriteria: string;
  replaceCriteria: string;
  keepOriginalLayerName: boolean;
}
