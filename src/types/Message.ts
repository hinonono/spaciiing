import { LicenseManagement } from "./LicenseManagement";
import { MagicalObject, MagicalObjectMembers } from "./MagicalObject";
import { NodeFilterable } from "./NodeFilterable";
import { NodeRenamable } from "./NodeRenamable";
import { VirtualProfile, VirtualProfileGroup } from "./VirtualProfile";

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
  | "AspectRatioHelper";

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
  | "UpdateLicense";
export interface ExternalMessage extends Message {
  mode?: ExternalMode;
}

// License
export type LicenseManagementAction = "UPDATE" | "VERIFY";
export interface ExternalMessageLicenseManagement extends ExternalMessage {
  action: LicenseManagementAction;
  license: LicenseManagement;
}
export interface ExternalMessageLocalization extends ExternalMessage {
  lang: string;
}
export interface ExternalMessageUpdateFrame extends ExternalMessage {
  memorizedObjectWidth?: string;
  memorizedObjectHeight?: string;
  memorizedName?: string;
}
export interface ExternalMessageUpdateCustomSpacing extends ExternalMessage {
  spacing: string;
}
export interface ExternalMessageUpdateVirtualProfile extends ExternalMessage {
  virtualProfile?: VirtualProfile;
  virtualProfileGroups?: VirtualProfileGroup[];
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
}

// Renamer專用的基底屬性
export type RenamerSupportedTargets = "text" | "image" | "auto_layout";
export interface RenamerDocumentOption {
  deleteHiddenLayer: boolean;
  skipLockedLayer: boolean;
  includeParentLayer: boolean;
}
export interface MessageRenamer extends Message {
  target: RenamerSupportedTargets[];
  renameTarget: NodeRenamable[];
  docOptions: RenamerDocumentOption;
}

// Variable Editor專用的基底屬性
type VariableEditorIntent = "executeCode" | "getAvailableMode";
export interface MessageVariableEditor extends Message {
  intent: VariableEditorIntent;
}

export interface MessageVariableEditorExecuteCode
  extends MessageVariableEditor {
  dataType: VariableResolvedDataType;
  destination: string;
  code: string;
  scope: VariableScope[];
  mode: string;
  newCollectionName?: string;
}

export interface MessageGetAvailableCollectionMode
  extends MessageVariableEditor {
  id: string;
}

// Virtual Profile 專用的基底屬性
export interface MessageVirtualProfile extends Message {}
export interface MessageVirtualProfileSingleValue
  extends MessageVirtualProfile,
    VirtualProfileSingleValue {}

export interface MessageVirtualProfileWholeObject
  extends MessageVirtualProfile {
  virtualProfile?: VirtualProfile;
  virtualProfileGroups?: VirtualProfileGroup[];
}

export interface VirtualProfileSingleValue {
  virtualProfileKey?: string;
  virtualProfileValue: string;
}

// Selection Filter 專用的基底屬性
export interface AdditionalFilterOptions {
  skipLockLayers: boolean;
  skipHiddenLayers: boolean;
  findWithName: boolean;
  findCriteria: string;
}
export interface MessageSelectionFilter extends Message {
  filterScopes: NodeFilterable[];
  additionalFilterOptions: AdditionalFilterOptions;
}

// License Management 專用的基底屬性
export interface MessageLicenseManagement extends Message {
  license: LicenseManagement;
  action: LicenseManagementAction;
}

// Localization
export interface MessageLocalization extends Message {
  lang: string;
}

// Aspect Ratio 專用的基底屬性
export type Dimension = "width" | "height";

export interface MessageAspectRatio extends Message {
  lockedDimension: Dimension;
  isCustomAspectRatio: boolean;
  widthRatio: number;
  heightRatio: number;
}
