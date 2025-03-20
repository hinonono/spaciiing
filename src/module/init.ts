import * as util from "./util";
import * as licenseManagement from "./licenseManagement";
import * as localization from "./localization";
import { EditorType } from "../types/EditorType";

export async function init() {
  // 檢查License狀態
  await licenseManagement.initLicenseCheck();
  await localization.initLocalization();

  // V20：新版
  const editorPreference = util.readEditorPreference();
  util.updateEditorPreference(editorPreference, "Init");

  const editorType = figma.editorType as EditorType;
  util.updateEditorType(editorType);
}
