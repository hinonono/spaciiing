
import { MessageFramer } from "../types/Messages/MessageFramer";
import { utils } from "./utils";

export function useEqual(message: MessageFramer) {
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object is selected.");
    return;
  } else if (selection.length > 1) {
    figma.notify("❌ Please select only one object.");
    return;
  }

  const parent = selection[0];
  if (parent.type !== "FRAME") {
    figma.notify("❌ The uppest selected object must be a frame.");
    return;
  }

  const child = utils.editor.getNodesInSelectedFrame();
  if (!child || child.length === 0) {
    figma.notify("❌ There is no object inside frame.");
    return;
  }

  // Group the selected nodes
  const group = figma.group(child, parent);

  const {
    x: spacingX,
    y: spacingY,
    width: groupWidth,
    height: groupHeight,
  } = group;

  let newWidth = parent.width;
  let newHeight = parent.height;

  switch (message.mode) {
    case "topAndBottom":
      newHeight = groupHeight + spacingY * 2;
      parent.resize(parent.width, newHeight);
      break;
    case "leftAndRight":
      newWidth = groupWidth + spacingX * 2;
      parent.resize(newWidth, parent.height);
      break;
    case "all":
      newWidth = groupWidth + spacingX * 2;
      newHeight = groupHeight + spacingY * 2;
      parent.resize(newWidth, newHeight);
      break;
    default:
      console.warn(`Unsupported mode: ${message.mode}`);
  }

  // Notify the distances from the objects to the edges of the frame
  const leftDistance = spacingX;
  const rightDistance = newWidth - (spacingX + groupWidth);
  const topDistance = spacingY;
  const bottomDistance = newHeight - (spacingY + groupHeight);

  figma.notify(
    `Distance to frame edge:
       L: ${leftDistance},
       R: ${rightDistance},
       U: ${topDistance},
       D: ${bottomDistance}`
  );

  // Ungroup the nodes
  figma.ungroup(group);
}
