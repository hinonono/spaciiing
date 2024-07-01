import * as util from "./util";
import { ExternalMessageUpdateFrame, MessageMemorizer } from "../types/Message";

export function useQuickAction(message: MessageMemorizer) {
  switch (message.action) {
    case "newFrame":
      makeNewFrame();
      break;
    case "setResizableNodeWidth":
      setResizableNodeSize("width");
      break;
    case "setResizableNodeHeight":
      setResizableNodeSize("height");
      break;
    case "memorizeObjectWidth":
      memorizeObjectSize("width");
      break;
    case "memorizeObjectHeight":
      memorizeObjectSize("height");
      break;
    case "memorizedObjectName":
      memorzieObjectName();
      break;
    case "setSelectionToMemorizedName":
      setSelectionToMemorizedName();
      break;
    default:
      break;
  }
}

function setSelectionToMemorizedName() {
  const selection = util.getCurrentSelection();

  // Check if there is any selection
  if (selection.length === 0) {
    figma.notify("❌ No object is selected.");
    return;
  }

  // Retrieve the stored name
  const storedName = figma.currentPage.getPluginData("memorized-object-name");

  // Check if a name has been stored
  if (!storedName) {
    figma.notify("❌ Cannot find stored name.");
    return;
  }

  // Set the name of each selected layer to the stored name
  selection.forEach((layer) => {
    layer.name = storedName;
  });

  // Notify the user of the successful name change
  figma.notify(`✅ The name of ${selection.length} object(s) has been set.`);
}

function memorzieObjectName() {
  const selection = util.getCurrentSelection();

  // Check if exactly one item is selected
  if (selection.length !== 1) {
    figma.notify("❌ Please select only one object.");
    return;
  }

  const selectedNode = selection[0];

  // Additional error checking to ensure the frame node has name
  if (selectedNode.name == "") {
    figma.notify("❌ The selected object's name cannot be empty.");
    return;
  }

  const memorizedObjectName = selectedNode.name;

  figma.currentPage.setPluginData(
    "memorized-object-name",
    String(memorizedObjectName)
  );
  figma.notify(`✅ Name memorized：${memorizedObjectName}`);

  // Retrieve the stored name
  const storedName = figma.currentPage.getPluginData("memorized-object-name");

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

function memorizeObjectSize(dimension: "width" | "height" | "both") {
  const selection = util.getCurrentSelection();

  // Check if exactly one item is selected
  if (selection.length !== 1) {
    figma.notify("❌ Please select only one object.");
    return;
  }

  const selectedNode = selection[0];

  // Additional error checking to ensure the frame node has width and height properties
  if (
    typeof selectedNode.width !== "number" ||
    typeof selectedNode.height !== "number"
  ) {
    figma.notify(
      "❌ The selected object's width and height must be set to a number."
    );
    return;
  }

  if (dimension === "width" || dimension === "both") {
    const memorizedObjectWidth = selectedNode.width;
    figma.currentPage.setPluginData(
      "memorized-object-width",
      String(memorizedObjectWidth)
    );
    figma.notify(`✅ Width memorized：${memorizedObjectWidth}`);
  }

  if (dimension === "height" || dimension === "both") {
    const memorizedObjectHeight = selectedNode.height;
    figma.currentPage.setPluginData(
      "memorized-object-height",
      String(memorizedObjectHeight)
    );
    figma.notify(`✅ Height memorized：${memorizedObjectHeight}`);
  }

  // Retrieve the stored width and height
  const storedWidth = figma.currentPage.getPluginData("memorized-object-width");
  const storedHeight = figma.currentPage.getPluginData(
    "memorized-object-height"
  );

  // Send the updated frame size back
  const message: ExternalMessageUpdateFrame = {
    module: "Memorizer",
    mode: "UpdateFrameToMemorizedSize",
    memorizedObjectWidth:
      dimension === "width" || dimension === "both" ? storedWidth : "",
    memorizedObjectHeight:
      dimension === "height" || dimension === "both" ? storedHeight : "",
    direction: "Outer",
    phase: "Actual",
  };

  util.sendMessageBack(message);
}

function setResizableNodeSize(dimension: "width" | "height") {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.notify("Please select at least one object.");
    return;
  }

  const storedWidth = figma.currentPage.getPluginData("memorized-object-width");
  const storedHeight = figma.currentPage.getPluginData(
    "memorized-object-height"
  );

  selection.forEach((selectedNode) => {
    if (!selectedNode) {
      figma.notify("The selected object is invalid.");
      return;
    }

    if (!util.isNodeWithResizeMethod(selectedNode)) {
      figma.notify("Resizing selected object is not supported.");
      return;
    }

    // Handle setting width or height based on the dimension parameter
    if (dimension === "width") {
      if (!storedWidth) {
        figma.notify("The width has not been memorized yet.");
      } else {
        const newWidth = Number(storedWidth);
        selectedNode.resize(newWidth, selectedNode.height);
        figma.notify(`Width set: ${newWidth}`);
      }
    } else if (dimension === "height") {
      if (!storedHeight) {
        figma.notify("The height has not been memorized yet.");
      } else {
        const newHeight = Number(storedHeight);
        selectedNode.resize(selectedNode.width, newHeight);
        figma.notify(`Height set: ${newHeight}`);
      }
    }
  });
}

function makeNewFrame() {
  const storedWidth = figma.currentPage.getPluginData("memorized-object-width");
  const storedHeight = figma.currentPage.getPluginData(
    "memorized-object-height"
  );
  const viewport = util.getCurrentViewport();

  // Create a new frame
  const newFrame = figma.createFrame();
  newFrame.x = viewport.x;
  newFrame.y = viewport.y;
  console.log(storedWidth, storedHeight);

  if (storedWidth == undefined && storedHeight == undefined) {
    newFrame.resize(375, 812);
  } else {
    newFrame.resize(Number(storedWidth), Number(storedHeight));
  }

  // Set any other properties or styles of the frame as needed

  // Add the new frame to the current page
  figma.currentPage.appendChild(newFrame);
}
