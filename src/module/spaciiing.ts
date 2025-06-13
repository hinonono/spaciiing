import { Direction } from "../types/General";
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

  if (message.mode === "grid") {
    if (message.gridColumn === undefined) {
      throw new Error("The gridColumn is unspecified.");
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
  mode: Direction,
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

  // Adjust the positions of the layers
  if (column && mode === "horizontal") {
    let currentColumn = 1;
    let currentRow = 0;

    for (let i = 0; i < layers.length; i++) {
      const currentLayer = layers[i];
      const currentLayerBounds = currentLayer.absoluteBoundingBox;

      if (!currentLayerBounds) {
        figma.notify("❌ One of the layers has no bounding box.");
        return;
      }

      if (currentColumn > column) {
        // Move to the next row
        currentColumn = 1;
        currentRow += 1;
      }

      if (currentColumn === 1 && currentRow > 0) {
        // Find the object with the largest height in the previous row
        let maxHeight = 0;
        for (let j = i - column; j < i; j++) {
          const previousRowLayer = layers[j];
          const previousRowLayerBounds = previousRowLayer.absoluteBoundingBox;
          if (
            previousRowLayerBounds &&
            previousRowLayerBounds.height > maxHeight
          ) {
            maxHeight = previousRowLayerBounds.height;
          }
        }
        // Position the first item in the new row
        currentLayer.y = layers[i - column].y + maxHeight + spacing;
        currentLayer.x = layers[0].x; // Align with the first column
      } else if (currentColumn > 1) {
        // Position subsequent items in the current row
        const previousLayer = layers[i - 1];
        currentLayer.x = previousLayer.x + previousLayer.width + spacing;
        currentLayer.y = previousLayer.y;
      }

      currentColumn += 1;
    }
  } else {
    // Sort selected layers based on the chosen axis
    layers.sort(compareWithAxis(axis));

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

    // Resize the autolayout frame to fit its contents
    if (column && mode === "horizontal") {
      autolayoutFrame.resize(
        selectionBoundingBox.width,
        selectionBoundingBox.height
      );
      autolayoutFrame.itemSpacing = spacing;
      autolayoutFrame.counterAxisSpacing = spacing;

      autolayoutFrame.layoutWrap = "WRAP";
    } else {
      autolayoutFrame.resize(
        selectionBoundingBox.width,
        selectionBoundingBox.height
      );
    }

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
