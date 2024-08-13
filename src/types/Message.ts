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

// Framer模組專用的基底屬性
export type FramerMode = "topAndBottom" | "leftAndRight" | "all";
export interface MessageFramer extends Message {
  mode: FramerMode;
}

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

export interface ExternalMessageUpdateFrame extends ExternalMessage {
  memorizedObjectWidth?: string;
  memorizedObjectHeight?: string;
  memorizedName?: string;
}
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

// Lorem Generator專用的基底屬性
export type LoremSupportedLang = "zh-tw" | "en";
export type LoremLength = "short" | "medium" | "long";
export interface MessageLoremGenerator extends Message {
  lang: LoremSupportedLang;
  length: LoremLength;
}

// Instantiater專用的基底屬性
export type InstantiaterType = "actual" | "explanation";
export type InstantiateForm = "style" | "variable";
export type InstantiaterSupportedBrand =
  | "ios"
  | "antDesign"
  | "materialDesign"
  | "tailwind"
  | "bootstrap"
  | "polaris"
  | "carbon";
export type InstantiaterCategory = "color" | "effect" | "typography";
export type InstantiaterTarget =
  | ""
  | "all"
  | "iosEffectDefaultDropShadow"
  | "iosTypographyLarge"
  | "iosSystemColorsLight"
  | "iosSystemColorsDark"
  | "iosSystemGrayColorsLight"
  | "iosSystemGrayColorsDark"
  | "m3ElevationLight"
  | "m3ElevationDark"
  | "m3BaselinePrimary"
  | "m3BaselineSecondary"
  | "m3BaselineTertiary"
  | "m3BaselineNeutral"
  | "m3BaselineError"
  | "antDesignNeutralColorLight"
  | "antDesignNeutralColorDark"
  | "antDesignDustRedLight"
  | "antDesignDustRedDark"
  | "antDesignVolcanoLight"
  | "antDesignVolcanoDark"
  | "antDesignSunsetOrangeLight"
  | "antDesignSunsetOrangeDark"
  | "antDesignCalendulaGoldLight"
  | "antDesignCalendulaGoldDark"
  | "antDesignSunriseYellowLight"
  | "antDesignSunriseYellowDark"
  | "antDesignLimeLight"
  | "antDesignLimeDark"
  | "antDesignPolarGreenLight"
  | "antDesignPolarGreenDark"
  | "antDesignCyanLight"
  | "antDesignCyanDark"
  | "antDesignDaybreakBlueLight"
  | "antDesignDaybreakBlueDark"
  | "antDesignGeekBlueLight"
  | "antDesignGeekBlueDark"
  | "antDesignGoldenPurpleLight"
  | "antDesignGoldenPurpleDark"
  | "antDesignMagentaLight"
  | "antDesignMagentaDark"
  | "antDesignDropShadow"
  | "tailwindSlate"
  | "tailwindGray"
  | "tailwindZinc"
  | "tailwindNeutral"
  | "tailwindStone"
  | "tailwindRed"
  | "tailwindOrange"
  | "tailwindAmber"
  | "tailwindYellow"
  | "tailwindLime"
  | "tailwindGreen"
  | "tailwindEmerald"
  | "tailwindTeal"
  | "tailwindCyan"
  | "tailwindSky"
  | "tailwindBlue"
  | "tailwindIndigo"
  | "tailwindViolet"
  | "tailwindPurple"
  | "tailwindFuchsia"
  | "tailwindPink"
  | "tailwindRose"
  | "bootstrapBlue"
  | "bootstrapIndigo"
  | "bootstrapPurple"
  | "bootstrapPink"
  | "bootstrapRed"
  | "bootstrapOrange"
  | "bootstrapYellow"
  | "bootstrapGreen"
  | "bootstrapTeal"
  | "bootstrapCyan"
  | "bootstrapGray"
  | "polarisRose"
  | "polarisMagenta"
  | "polarisPurple"
  | "polarisBlue"
  | "polarisAzure"
  | "polarisTeal"
  | "polarisCyan"
  | "polarisGreen"
  | "polarisLime"
  | "polarisYellow"
  | "polarisOrange"
  | "polarisRed"
  | "carbonBlue"
  | "carbonCoolGray"
  | "carbonCyan"
  | "carbonGray"
  | "carbonGreen"
  | "carbonMagenta"
  | "carbonOrange"
  | "carbonPurple"
  | "carbonRed"
  | "carbonTeal"
  | "carbonWarmGray"
  | "carbonYellow";

export interface MessageInstantiater extends Message {
  targets: InstantiaterTarget[];
  type: InstantiaterType;
  form: InstantiateForm;
  variableCollectionId?: string;
  newCollectionName?: string;
}



