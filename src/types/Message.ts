import { MagicalObject, MagicalObjectMembers } from "./MagicalObject";

// 傳送過來的訊息的基底屬性
export interface Message {
  module: ModuleType;
  direction?: MessageDirection;
  phase: MessagePhase;
}

type MessagePhase = "Init" | "Actual" | "WillEnd";
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

// Spaciiing模組專用的基底屬性
export type SpacingMode = "horizontal" | "vertical";
export interface MessageSpaciiing extends Message {
  mode: SpacingMode;
  spacing: string;
  useCustomValue: boolean;
  addAutolayout: boolean;
}





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
  | "findAndReplace";
export interface MessageShortcut extends Message {
  action: ShortcutAction;
}
export interface MessageShortcutGenerateIconTemplate extends MessageShortcut {
  system: number;
  quantity: number;
}
export interface MessageShortcutUpdateMagicalObject extends MessageShortcut {
  magicalObject: MagicalObject;
}
export interface MessageShortcutUpdateMagicalObjectSingle
  extends MessageShortcut {
  member: MagicalObjectMembers;
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


export interface ExternalMessageUpdateCustomSpacing extends ExternalMessage {
  spacing: string;
}

export interface ExternalMessageUpdateMagicalObject extends ExternalMessage {
  magicalObject: MagicalObject;
}
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


