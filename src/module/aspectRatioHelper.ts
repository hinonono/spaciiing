import { Dimension } from "../types/General";
import { MessageAspectRatio } from "../types/Messages/MessageAspectRatio";
import * as util from "./util";
import { utils } from "./utils";

export function reception(message: MessageAspectRatio) {
  if (message.phase == "Actual") {
    adjustNodeAspectRatio(
      message.widthRatio,
      message.heightRatio,
      message.lockedDimension
    );
  }
}

function adjustNodeAspectRatio(
  widthRatio: number,
  heightRatio: number,
  lockedDimension: Dimension
) {
  const selection = utils.editor.getCurrentSelection();

  // Check if there are any nodes selected
  if (selection.length === 0) {
    // LocalizationService.getLanguageCode().then((langCode) => {
    //   if (langCode) {
    //     notify("noNodesSelected", langCode, "ERROR");
    //   }
    // });
    figma.notify("No nodes selected.");
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
