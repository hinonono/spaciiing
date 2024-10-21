import { CopyPastableNode } from "../types/CopyPastableNode";
import { MessagePropertyClipboard } from "../types/Messages/MessagePropertyClipboard";
import { PropertyClipboardSupportedProperty } from "../types/PropertClipboard";
import * as util from "./util";

export function reception(message: MessagePropertyClipboard) {
  const { action } = message;

  switch (action) {
    case "setReferenceObject":
      setReferenceObject();
      break;
    case "pastePropertyToObject":
      pastePropertyController(message);
      break;
    default:
      break;
  }
}

function setReferenceObject() {
  const selection = util.getCurrentSelection();

  if (selection.length !== 1) {
    figma.notify("❌ Please select exactly one object.");
    return;
  }

  const selectedObjectId = selection[0].id;
  const selectedObjectName = selection[0].name;

  const newEditorPreference = util.readEditorPreference();
  newEditorPreference.referenceObject = {
    id: selectedObjectId,
    name: selectedObjectName,
  };

  util.saveEditorPreference(newEditorPreference);
  util.updateEditorPreference(newEditorPreference, "PropertyClipboard");
}

async function pastePropertyController(message: MessagePropertyClipboard) {
  if (!message.property) {
    figma.notify("❌ Property is missing from message.");
    return;
  }

  const editorPreference = util.readEditorPreference();

  if (!editorPreference.referenceObject) {
    figma.notify("❌ Reference object is null.");
    return;
  }

  const referenceObjectNode = await figma.getNodeByIdAsync(
    editorPreference.referenceObject.id
  );

  if (!referenceObjectNode) {
    figma.notify("❌ Cannot get reference object by provided id.");
    return;
  }

  const allowedTypes: NodeType[] = [
    "COMPONENT",
    "COMPONENT_SET",
    "ELLIPSE",
    "FRAME",
    "GROUP",
    "INSTANCE",
    "LINE",
    "POLYGON",
    "RECTANGLE",
    "STAR",
    "TEXT",
    "VECTOR",
  ];

  if (!allowedTypes.includes(referenceObjectNode.type)) {
    figma.notify("❌ Reference object is not an allowed type.");
    return;
  }

  for (let i = 0; i < message.property.length; i++) {
    const element = message.property[i];
    pastePropertyToObject(element, referenceObjectNode as CopyPastableNode);
  }
}

function pastePropertyToObject(
  property: PropertyClipboardSupportedProperty,
  referenceObject: CopyPastableNode
) {
  switch (property) {
    case "WIDTH":
      setSelectionWidth(referenceObject);
      break;
    case "HEIGHT":
      setSelectionHeight(referenceObject);
      break;
    case "STROKES":
      setSelectionStrokes(referenceObject);
      break;
    case "STROKE_ALIGN":
      setSelectionStrokeAlign(referenceObject);
      break;
    case "STROKE_WEIGHT":
      setSelectionStrokeWeight(referenceObject);
      break;
    default:
      figma.notify(`Unsupported property type: ${property}`);
      break;
  }
}

function setSelectionWidth(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("resize" in object) {
      // Check if the object has a resize method
      object.resize(referenceObject.width, object.height);
    } else {
      figma.notify(`❌ Object of type ${object.type} cannot be resized.`);
    }
  });
}

function setSelectionHeight(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("resize" in object) {
      // Check if the object has a resize method
      object.resize(object.width, referenceObject.height);
    } else {
      figma.notify(`❌ Object of type ${object.type} cannot be resized.`);
    }
  });
}

function setSelectionStrokes(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("strokes" in object) {
      // Check if the object has strokes property
      object.strokes = referenceObject.strokes;
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support strokes.`
      );
    }
  });
}

function setSelectionStrokeWeight(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("strokeWeight" in object) {
      // Check if the object has strokeWeight property
      object.strokeWeight = referenceObject.strokeWeight;
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support stroke weight.`
      );
    }
  });
}

function setSelectionStrokeAlign(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("strokeAlign" in object) {
      // Check if the object has strokeAlign property
      object.strokeAlign = referenceObject.strokeAlign;
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support stroke alignment.`
      );
    }
  });
}
