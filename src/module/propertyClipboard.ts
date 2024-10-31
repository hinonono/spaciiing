import { CopyPastableNode } from "../types/CopyPastableNode";
import {
  MessagePropertyClipboard,
  PasteBehavior,
} from "../types/Messages/MessagePropertyClipboard";
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

  if (!message.behavior) {
    figma.notify("❌ Paste behavior is missing from message.");
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
    pastePropertyToObject(
      element,
      referenceObjectNode as CopyPastableNode,
      message.behavior
    );
  }
}

function pastePropertyToObject(
  property: PropertyClipboardSupportedProperty,
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  switch (property) {
    case "WIDTH":
      setSelectionWidth(referenceObject);
      break;
    case "HEIGHT":
      setSelectionHeight(referenceObject);
      break;
    case "LAYER_OPACITY":
      setSelectionOpacity(referenceObject);
      break;
    case "LAYER_CORNER_RADIUS":
      setSelectionCornerRadius(referenceObject);
      break;
    case "LAYER_BLEND_MODE":
      setSelectionBlendMode(referenceObject);
    case "STROKES":
      setSelectionStrokes(referenceObject);
      break;
    case "STROKE_ALIGN":
      setSelectionStrokeAlign(referenceObject);
      break;
    case "STROKE_WEIGHT":
      setSelectionStrokeWeight(referenceObject);
      break;
    case "STROKE_STYLE":
      setSelectionStrokeStyle(referenceObject);
      break;
    case "STROKE_DASH":
      setSelectionStrokeDash(referenceObject);
      break;
    case "STROKE_GAP":
      setSelectionStrokeGap(referenceObject);
      break;
    case "STROKE_CAP":
      setSelectionStrokeCap(referenceObject);
      break;
    case "STROKE_JOIN":
      setSelectionStrokeJoin(referenceObject);
      break;
    case "STROKE_MITER_LIMIT":
      setSelectionStrokeMiterLimit(referenceObject);
      break;
    case "FILL_SOLID":
      setSelectionSolidFill(referenceObject, behavior);
      break;
    case "FILL_GRADIENT":
      setSelectionGradientFill(referenceObject, behavior);
      break;
    case "FILL_IMAGE":
      setSelectionImageFill(referenceObject, behavior);
      break;
    case "FILL_VIDEO":
      setSelectionVideoFill(referenceObject, behavior);
      break;
    case "EXPORT_SETTINGS":
      setSelectionExportSettings(referenceObject);
      break;
    default:
      figma.notify(`Unsupported property type: ${property}`);
      break;
  }
}

// Set opacity of selected layers from the reference object
function setSelectionOpacity(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("opacity" in object) {
      // Check if the object has an opacity property
      object.opacity = referenceObject.opacity;
    } else {
      figma.notify(`❌ Object of type ${object.type} cannot have opacity set.`);
    }
  });
}

// Set corner radius of selected layers from the reference object
function setSelectionCornerRadius(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if (
      util.isNodeSupportSingleCornerRadius(object) &&
      util.isNodeSupportSingleCornerRadius(referenceObject)
    ) {
      // Applies single corner radii if both support single corners
      object.topLeftRadius = referenceObject.topLeftRadius;
      object.topRightRadius = referenceObject.topRightRadius;
      object.bottomRightRadius = referenceObject.bottomRightRadius;
      object.bottomLeftRadius = referenceObject.bottomLeftRadius;
    } else if (
      util.isNodeSupportCornerRadius(object) &&
      util.isNodeSupportCornerRadius(referenceObject)
    ) {
      // Applies full radius and smoothing if supported by both
      console.log("Here I am");

      object.cornerRadius = referenceObject.cornerRadius;
      object.cornerSmoothing = referenceObject.cornerSmoothing;
    } else {
      // Informs user if corner radius is not supported
      figma.notify(
        `❌ Object of type ${object.type} cannot have corner radius set.`
      );
    }
  });
}

// Set blend mode of selected layers from the reference object
function setSelectionBlendMode(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("blendMode" in object) {
      // Check if the object has a blendMode property
      object.blendMode = referenceObject.blendMode;
    } else {
      figma.notify(
        `❌ Object of type ${object.type} cannot have blend mode set.`
      );
    }
  });
}

function setSelectionSolidFill(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  // Check if fills exist and filter only solid fills
  const fills = referenceObject.fills as readonly Paint[] | undefined;
  if (!fills) {
    figma.notify("❌ Reference object has no fills.");
    return;
  }

  const solidFills = fills.filter((fill) => fill.type === "SOLID");

  // If there are no solid fills, notify the user and return
  if (solidFills.length === 0) {
    figma.notify("❌ Reference object does not contain any solid fills.");
    return;
  }

  // Loop through the selection to apply only the solid fills array
  selection.forEach((object) => {
    if ("fills" in object && Array.isArray(object.fills)) {
      // Apply only the array of solid fills
      if (behavior === "pasteToIncrement") {
        object.fills = [...object.fills, ...solidFills];
      } else {
        object.fills = solidFills;
      }
    } else {
      // Notify if the object cannot have fills applied
      figma.notify(`❌ Object of type ${object.type} does not support fills.`);
    }
  });
}

function setSelectionGradientFill(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  // Check if fills exist and filter only gradient fills
  const fills = referenceObject.fills as readonly Paint[] | undefined;
  if (!fills) {
    figma.notify("❌ Reference object has no fills.");
    return;
  }

  const gradientFills = fills.filter(
    (fill) =>
      fill.type === "GRADIENT_LINEAR" ||
      fill.type === "GRADIENT_RADIAL" ||
      fill.type === "GRADIENT_ANGULAR" ||
      fill.type === "GRADIENT_DIAMOND"
  );

  // If there are no gradient fills, notify the user and return
  if (gradientFills.length === 0) {
    figma.notify("❌ Reference object does not contain any gradient fills.");
    return;
  }

  // Loop through the selection to apply only the gradient fills array
  selection.forEach((object) => {
    if ("fills" in object && Array.isArray(object.fills)) {
      if (behavior === "pasteToIncrement") {
        object.fills = [...object.fills, ...gradientFills];
      } else {
        object.fills = gradientFills;
      }
    } else {
      figma.notify(`❌ Object of type ${object.type} does not support fills.`);
    }
  });
}

function setSelectionImageFill(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  // Check if fills exist and filter only image fills
  const fills = referenceObject.fills as readonly Paint[] | undefined;
  if (!fills) {
    figma.notify("❌ Reference object has no fills.");
    return;
  }

  const imageFills = fills.filter((fill) => fill.type === "IMAGE");

  // If there are no image fills, notify the user and return
  if (imageFills.length === 0) {
    figma.notify("❌ Reference object does not contain any image fills.");
    return;
  }

  // Loop through the selection to apply only the image fills array
  selection.forEach((object) => {
    if ("fills" in object && Array.isArray(object.fills)) {
      if (behavior === "pasteToIncrement") {
        object.fills = [...object.fills, ...imageFills];
      } else {
        object.fills = imageFills;
      }
    } else {
      figma.notify(`❌ Object of type ${object.type} does not support fills.`);
    }
  });
}

function setSelectionVideoFill(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  // Check if fills exist and filter only video fills
  const fills = referenceObject.fills as readonly Paint[] | undefined;
  if (!fills) {
    figma.notify("❌ Reference object has no fills.");
    return;
  }

  const videoFills = fills.filter((fill) => fill.type === "VIDEO");

  // If there are no video fills, notify the user and return
  if (videoFills.length === 0) {
    figma.notify("❌ Reference object does not contain any video fills.");
    return;
  }

  // Loop through the selection to apply only the video fills array
  selection.forEach((object) => {
    if ("fills" in object && Array.isArray(object.fills)) {
      if (behavior === "pasteToIncrement") {
        object.fills = [...object.fills, ...videoFills];
      } else {
        object.fills = videoFills;
      }
    } else {
      figma.notify(`❌ Object of type ${object.type} does not support fills.`);
    }
  });
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

function setSelectionStrokeStyle(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("dashPattern" in object) {
      // Check if the object has strokeAlign property
      object.dashPattern = referenceObject.dashPattern;
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support stroke style.`
      );
    }
  });
}

function setSelectionStrokeDash(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("dashPattern" in object) {
      // Check if the object has strokeAlign property
      if (referenceObject.dashPattern.length === 2) {
        if (object.dashPattern.length === 2) {
          const objectGap = object.dashPattern[1];
          const referenceDash = referenceObject.dashPattern[0];

          object.dashPattern = [referenceDash, objectGap];
        } else {
          figma.notify(
            `⚠️ Some object uses custom dash and gap value, please apply "Stroke Style" instead.`
          );
        }
      } else {
        figma.notify(
          `⚠️ The reference object uses custom dash and gap value, please apply "Stroke Style" instead.`
        );
      }
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support stroke dash.`
      );
    }
  });
}

function setSelectionStrokeGap(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("dashPattern" in object) {
      // Check if the object has strokeAlign property
      if (referenceObject.dashPattern.length === 2) {
        if (object.dashPattern.length === 2) {
          const objectDash = object.dashPattern[0];
          const referenceGap = referenceObject.dashPattern[1];

          object.dashPattern = [objectDash, referenceGap];
        } else {
          figma.notify(
            `⚠️ Some object uses custom dash and gap value, please apply "Stroke Style" instead.`
          );
        }
      } else {
        figma.notify(
          `⚠️ The reference object uses custom dash and gap value, please apply "Stroke Style" instead.`
        );
      }
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support stroke gap.`
      );
    }
  });
}

function setSelectionStrokeCap(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("strokeCap" in object) {
      // Check if the object has strokeCap property
      object.strokeCap = referenceObject.strokeCap;
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support stroke cap.`
      );
    }
  });
}

function setSelectionStrokeJoin(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("strokeJoin" in object) {
      // Check if the object has strokeJoin property
      object.strokeJoin = referenceObject.strokeJoin;
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support stroke join.`
      );
    }
  });
}

function setSelectionStrokeMiterLimit(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("strokeMiterLimit" in object) {
      // Check if the object has strokeMiterLimit property
      object.strokeMiterLimit = referenceObject.strokeMiterLimit;
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support stroke miter limit.`
      );
    }
  });
}

function setSelectionExportSettings(referenceObject: CopyPastableNode) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("exportSettings" in object) {
      object.exportSettings = referenceObject.exportSettings;
    } else {
      figma.notify(`❌ Object does not support export settings.`);
    }
  });
}
