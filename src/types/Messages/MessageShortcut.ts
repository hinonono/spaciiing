import { Direction } from "../General";
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
  | "updateExampleFileUrl"
  | "numbering"
  | "updateArrowPosition"
  | "spiltText"
  | "createSection"
  | "resizeAspectFit"
  | "resizeAspectFill"
  | "debug";

export type NumberingForm =
  | "ALPHABETIC_LOWERCASE"
  | "ALPHABETIC_UPPERCASE"
  | "NUMBER"
  | "ZHTW_SIMPLE_HANZI"
  | "ZHTW_COMPLEX_HANZI"

export type SpiltType = "SPACE" | "LINE_BREAK" | "CUSTOM"

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
export interface MessageShortcutNumbering extends MessageShortcut {
  numberingdirection: Direction,
  numberingForm: NumberingForm
  startFrom?: number;
}

export interface MessageShortcutSpiltText extends MessageShortcut {
  spiltType: SpiltType;
  spiltSymbol?: string;
}

export interface MessageCreateSection extends MessageShortcut {
  padding: number
}