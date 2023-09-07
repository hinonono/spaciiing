export interface myStyle {
  series: string;
  name: string;
  comment?: string;
}

export interface myColor {
  myStyle: myStyle;
  color: RGBA;
}

export interface myDropShadowEffect {
  myStyle: myStyle;
  effect: Array<Effect>;
}

export function sendMessageBack(message: object) {
  figma.ui.postMessage({
    pluginMessage: message,
  });
}

export function makeCurrentSelection(): Array<SceneNode> {
  //製作使用者目前所選擇的圖層的陣列
  const selection = figma.currentPage.selection;
  const selectedLayers = [];
  for (const layer of selection) {
    selectedLayers.push(layer);
  }

  return selectedLayers;
}

export function makeSelectionWhenFrame(): Array<SceneNode> | null {
  if (figma.currentPage.selection[0] != undefined) {
    const selectedFrame = figma.currentPage.selection[0] as FrameNode;
    const nodesWithinFrame = [];

    if (selectedFrame.children != undefined) {
      for (const child of selectedFrame.children) {
        nodesWithinFrame.push(child);
      }
    }

    return nodesWithinFrame;
  } else {
    return null;
  }
}

export function getUserCurrentViewVectior(): Vector {
  var result: Vector = {
    x: Math.round(figma.viewport.center.x),
    y: Math.round(figma.viewport.center.y),
  };

  return result;
}
