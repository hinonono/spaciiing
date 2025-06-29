import * as licenseManagement from "./licenseManagement";
import * as localization from "./localization";
import { EditorType } from "../types/EditorType";
import { utils } from "./utils";

export async function init() {
  // 檢查License狀態
  await licenseManagement.initLicenseCheck();
  await localization.initLocalization();

  // V20：新版
  const editorPreference = utils.data.readEditorPreference();
  utils.data.updateEditorPreference(editorPreference, "Init");

  const runtimeSyncedResources = utils.data.compileSyncedResources();
  utils.data.updateRuntimeSyncedResources(runtimeSyncedResources, "Init");

  const editorType = figma.editorType as EditorType;
  utils.runtime.updateEditorType(editorType);
  utils.runtime.updateTriggeredCommand();

  figma.root.setRelaunchData({ open: 'All in one edit tool' })
}
