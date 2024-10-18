import { MessageSpaciiing } from "../types/Messages/MessageSpaciiing";
import * as util from "./util";

function compareWithAxis(axis: "x" | "y") {
  return (a: SceneNode, b: SceneNode) => {
    if (a[axis] < b[axis]) {
      return -1;
    }
    if (a[axis] > b[axis]) {
      return 1;
    }
    return 0;
  };
}

export function useSpacing(message: MessageSpaciiing) {
  const selectedLayers = util.getCurrentSelection();

  // Check if message.spacing is a valid number
  const spacing = Number(message.spacing);
  if (isNaN(spacing)) {
    figma.notify("❌ The spacing value must be a number.");
    return;
  }

  // Save custom spacing value if applicable
  if (message.shouldSaveEditorPreference && message.editorPreference) {
    util.saveEditorPreference(message.editorPreference, "Spaciiing");
  }

  if (message.mode === "grid") {
    if (message.gridColumn === undefined) {
      throw new Error("The gridColumn is not specified.");
    }

    applySpacingToLayers(
      selectedLayers,
      spacing,
      "horizontal",
      message.addAutolayout,
      false,
      message.gridColumn
    );
  } else {
    applySpacingToLayers(
      selectedLayers,
      spacing,
      message.mode,
      message.addAutolayout
    );
  }
}

/**
 * Adjusts the spacing between selected layers and optionally adds them to an autolayout frame.
 *
 * @param {SceneNode[]} layers - The layers to which spacing will be applied.
 * @param {number} spacing - The amount of spacing to apply between layers.
 * @param {"vertical" | "horizontal"} mode - The mode of spacing, either vertical or horizontal.
 * @param {boolean} addAutolayout - Whether to add the layers to an autolayout frame.
 * @param {boolean} [returnFinalFrame=false] - Whether to return the final autolayout frame.
 * @returns {FrameNode | void} - The autolayout frame if returnFinalFrame is true, otherwise void.
 */
export function applySpacingToLayers(
  layers: SceneNode[],
  spacing: number,
  mode: "vertical" | "horizontal",
  addAutolayout: boolean,
  returnFinalFrame: boolean = false,
  column?: number
): FrameNode | void {
  // Ensure at least 2 layers are selected
  if (layers.length < 2) {
    figma.notify("❌ Please select at least two objects.");
    return;
  }

  // Determine the axis and size property based on the mode
  const isVerticalMode = mode === "vertical";
  const axis = isVerticalMode ? "y" : "x";

  // Sort selected layers based on the chosen axis
  layers.sort(compareWithAxis(axis));

  // Adjust the positions of the layers
  for (let i = 0; i < layers.length - 1; i++) {
    const currentLayer = layers[i];
    const nextLayer = layers[i + 1];

    // Calculate the offset considering rotation
    const currentLayerBounds = currentLayer.absoluteBoundingBox;
    const nextLayerBounds = nextLayer.absoluteBoundingBox;

    if (!currentLayerBounds || !nextLayerBounds) {
      figma.notify("❌ One of the layers has no bounding box.");
      return;
    }

    const offset = isVerticalMode
      ? currentLayerBounds.y +
        currentLayerBounds.height +
        spacing -
        nextLayerBounds.y
      : currentLayerBounds.x +
        currentLayerBounds.width +
        spacing -
        nextLayerBounds.x;

    if (isVerticalMode) {
      nextLayer.y += offset;
    } else {
      nextLayer.x += offset;
    }
  }

  // Calculate the bounding box dimensions of the selected layers
  const selectionBoundingBox = util.getBoundingBox(layers);
  const selectionPosition = util.getSelectionPosition(layers);

  if (addAutolayout) {
    const autolayoutFrame = util.createAutolayoutFrame(
      layers,
      spacing,
      isVerticalMode ? "VERTICAL" : "HORIZONTAL"
    );

    // // Create a new frame with autolayout
    // const autolayoutFrame = figma.createFrame();

    // // Set the autolayout properties
    // autolayoutFrame.layoutMode = isVerticalMode ? "VERTICAL" : "HORIZONTAL";
    // autolayoutFrame.itemSpacing = spacing;

    // // Add the selected layers to the autolayout frame
    // layers.forEach((layer) => {
    //   figma.currentPage.appendChild(autolayoutFrame);
    //   autolayoutFrame.appendChild(layer);
    // });

    // Resize the autolayout frame to fit its contents
    autolayoutFrame.resize(
      selectionBoundingBox.width,
      selectionBoundingBox.height
    );

    autolayoutFrame.x = selectionPosition.x;
    autolayoutFrame.y = selectionPosition.y;

    // Select the autolayout frame
    figma.currentPage.selection = [autolayoutFrame];

    if (returnFinalFrame) {
      return autolayoutFrame;
    }
  }

  // Notify the user of successful spacing adjustment
  figma.notify(`✅ Spacing set to ${spacing} successfully.`);
}
