import { Dimension, MessageAspectRatio } from "../types/Message";
import { getPreferredLang } from "./localization";
import { notify } from "./pluginNotificationHelper";
import * as util from "./util";

export function reception(message: MessageAspectRatio) {
  if (message.phase == "Actual") {
    adjustNodeAspectRatio(
      message.widthRatio,
      message.heightRatio,
      message.lockedDimension
    );
  }
}

async function adjustNodeAspectRatio(
  widthRatio: number,
  heightRatio: number,
  lockedDimension: Dimension
) {
  const selection = util.getCurrentSelection();

  // Check if there are any nodes selected
  if (selection.length === 0) {
    const langCode = await getPreferredLang();
    console.log(langCode);

    notify("noNodesSelected", langCode, "ERROR");
    // figma.notify("No nodes selected");
    return;
  }

  // Adjust each node in the selection
  selection.forEach((node) => {
    // Skip locked layers
    if (node.locked) {
      return;
    }

    if ("resize" in node) {
      if (lockedDimension === "width") {
        const newHeight = (node.width * heightRatio) / widthRatio;
        node.resize(node.width, newHeight);
      } else if (lockedDimension === "height") {
        const newWidth = (node.height * widthRatio) / heightRatio;
        node.resize(newWidth, node.height);
      }
    } else {
      figma.notify("Selected node does not support resizing");
    }
  });
}
