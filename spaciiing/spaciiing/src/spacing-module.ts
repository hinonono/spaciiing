import * as fund from "./fundamental-module";

export function useSpacing(message: any) {
  // 調整spacing
  console.log("message.useCustomValue == " + message.useCustomValue);
  const selectedLayers = fund.makeCurrentSelection();

  if (message.useCustomValue == "true") {
    console.log("UseCustomValue == TRUE");
    figma.currentPage.setPluginData(
      "recent-custom-spacing",
      String(message.spacing)
    );
  }

  if (selectedLayers.length < 2) {
    figma.notify("❌請選擇至少2個圖層");
  } else {
    if (message.mode == "vertical") {
      // 上下模式
      selectedLayers.sort(compareWithY);

      for (let i = 0; i < selectedLayers.length; i++) {
        if (i == selectedLayers.length - 1) {
          return;
        } else {
          selectedLayers[i + 1].y =
            parseInt(String(selectedLayers[i].y)) +
            parseInt(String(selectedLayers[i].height)) +
            parseInt(message.spacing);
        }
      }
    } else if (message.mode == "horizontal") {
      // 左右模式
      selectedLayers.sort(compareWithX);

      for (let i = 0; i < selectedLayers.length; i++) {
        if (i == selectedLayers.length - 1) {
          return;
        } else {
          selectedLayers[i + 1].x =
            parseInt(String(selectedLayers[i].x)) +
            parseInt(String(selectedLayers[i].width)) +
            parseInt(message.spacing);
        }
      }
    }
  }
}

function compareWithX(a: SceneNode, b: SceneNode) {
  if (a.x < b.x) {
    return -1;
  }
  if (a.x > b.x) {
    return 1;
  }
  return 0;
}

function compareWithY(a: SceneNode, b: SceneNode) {
  if (a.y < b.y) {
    return -1;
  }
  if (a.y > b.y) {
    return 1;
  }
  return 0;
}
