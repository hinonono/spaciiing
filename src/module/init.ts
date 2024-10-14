import { ExternalMessageUpdateFrame } from "../types/Messages/MessageMemorizer";
import * as util from "./util";
import * as licenseManagement from "./licenseManagement";
import * as localization from "./localization";
// import { ExternalMessageUpdateEditorPreference } from "../types/Messages/MessageEditorPreference";

export async function init() {
  // 檢查License狀態
  await licenseManagement.initLicenseCheck();
  await localization.initLocalization();

  // V20：新版
  const editorPreference = util.readEditorPreference();
  console.log(editorPreference);

  util.updateEditorPreference(editorPreference, "Init");

  //
  const storedWidth = figma.currentPage.getPluginData("memorized-object-width");
  const storedHeight = figma.currentPage.getPluginData(
    "memorized-object-height"
  );
  const storedName = figma.currentPage.getPluginData("memorized-object-name");
  // const storedSpacing = figma.currentPage.getPluginData(
  //   "recent-custom-spacing"
  // );

  if (storedWidth != "" && storedHeight != "") {
    // Send the updated frame size back
    const message: ExternalMessageUpdateFrame = {
      module: "Memorizer",
      mode: "UpdateFrameToMemorizedSize",
      memorizedObjectWidth: storedWidth,
      memorizedObjectHeight: storedHeight,
      direction: "Outer",
      phase: "Actual",
    };

    util.sendMessageBack(message);
  }

  if (storedName != "") {
    // Send the updated frame size back
    const message: ExternalMessageUpdateFrame = {
      module: "Memorizer",
      mode: "UpdateMemorizedName",
      memorizedName: storedName,
      direction: "Outer",
      phase: "Actual",
    };

    util.sendMessageBack(message);
  }

  // if (storedSpacing != undefined) {
  //   const message: ExternalMessageUpdateCustomSpacing = {
  //     spacing: storedSpacing,
  //     module: "Spaciiing",
  //     phase: "Actual",
  //   };

  //   util.sendMessageBack(message);
  // }
}
