import { EditorType } from "../EditorType";
import { Message } from "./Message";

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
  | "UpdateStyleList"
  | "UpdateEditorPreference"
  | "UpdateEditorType"
  | "ShowExtractedProperties"
  | "UpdateReferenceObject"
  | "UpdateRuntimeSyncedResources";

export interface ExternalMessage extends Message {
  mode?: ExternalMode;
  editorType?: EditorType;
  triggeredCommand?: string
}
