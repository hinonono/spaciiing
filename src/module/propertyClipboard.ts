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
    case "FILL_ALL":
      setSelectionAllFills(referenceObject, behavior);
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
    case "EFFECT_ALL":
      setSelectionAllEffects(referenceObject, behavior);
      break;
    case "EFFECT_INNER_SHADOW":
      setSelectionInnerShadow(referenceObject, behavior);
      break;
    case "EFFECT_DROP_SHADOW":
      setSelectionDropShadow(referenceObject, behavior);
      break;
    case "EFFECT_LAYER_BLUR":
      setSelectionLayerBlur(referenceObject, behavior);
      break;
    case "EFFECT_BACKGROUND_BLUR":
      setSelectionBackgroundBlur(referenceObject, behavior);
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
  applyPropertyToSelection(referenceObject, "opacity");
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
  applyPropertyToSelection(referenceObject, "blendMode");
}

function setSelectionAllFills(
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
  if (!fills || fills.length === 0) {
    figma.notify("❌ Reference object has no fills.");
    return;
  }

  // Loop through the selection to apply only the solid fills array
  selection.forEach((object) => {
    if ("fills" in object && Array.isArray(object.fills)) {
      if (behavior === "pasteToIncrement") {
        object.fills = [...object.fills, ...fills];
      } else {
        object.fills = fills;
      }
    } else {
      // Notify if the object cannot have fills applied
      figma.notify(`❌ Object of type ${object.type} does not support fills.`);
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
  applyPropertyToSelection(referenceObject, "strokes");
}

function setSelectionStrokeWeight(referenceObject: CopyPastableNode) {
  applyPropertyToSelection(referenceObject, "strokeWeight");
}

function setSelectionStrokeAlign(referenceObject: CopyPastableNode) {
  applyPropertyToSelection(referenceObject, "strokeAlign");
}

function setSelectionStrokeStyle(referenceObject: CopyPastableNode) {
  applyPropertyToSelection(referenceObject, "dashPattern");
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
  applyPropertyToSelection(referenceObject, "strokeCap");
}

function setSelectionStrokeJoin(referenceObject: CopyPastableNode) {
  applyPropertyToSelection(referenceObject, "strokeJoin");
}

function setSelectionStrokeMiterLimit(referenceObject: CopyPastableNode) {
  applyPropertyToSelection(referenceObject, "strokeMiterLimit");
}

function setSelectionExportSettings(referenceObject: CopyPastableNode) {
  applyPropertyToSelection(referenceObject, "exportSettings");
}

/**
 * Applies a specified property from a reference object to all currently selected objects.
 *
 * This function dynamically copies a property (e.g., `strokeMiterLimit`, `opacity`)
 * from the `referenceObject` to each object in the current selection. It also supports
 * optional notifications when the selected object does not support the specified property.
 *
 * @param referenceObject - The object from which to copy the property value.
 *                          This object must contain the property specified by `propertyName`.
 * @param propertyName - The name of the property to apply to the selected objects.
 *                       This should be a key of `CopyPastableNode`, e.g., `"strokeMiterLimit"`, `"opacity"`, etc.
 * @param notifyUnsupported - A boolean flag indicating whether to notify the user if a
 *                            selected object does not support the specified property.
 *                            Defaults to `true`.
 *
 * Example usage:
 * ```typescript
 * applyPropertyToSelection(referenceObject, "strokeMiterLimit");
 * ```
 *
 * - If `propertyName` exists on both the `referenceObject` and the selected objects,
 *   the property will be applied.
 * - If `notifyUnsupported` is `true` and a selected object does not support the property,
 *   a notification will be displayed to the user.
 */
function applyPropertyToSelection(
  referenceObject: CopyPastableNode,
  propertyName: keyof CopyPastableNode,
  notifyUnsupported: boolean = true
) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  // Loop through the selection to apply the property
  selection.forEach((object) => {
    if (propertyName in object) {
      // @ts-ignore: Ignore TS error for dynamic property assignment
      object[propertyName] = referenceObject[propertyName];
    } else if (notifyUnsupported) {
      figma.notify(
        `❌ Object of type ${object.type} does not support ${propertyName}.`
      );
    }
  });
}

function setSelectionAllEffects(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  const effects = referenceObject.effects as readonly Effect[] | undefined;
  if (!effects || effects.length === 0) {
    figma.notify("❌ Reference object has no effects.");
    return;
  }

  selection.forEach((object) => {
    if ("effects" in object && Array.isArray(object.effects)) {
      if (behavior === "pasteToIncrement") {
        object.effects = [...object.effects, ...effects];
      } else {
        object.effects = effects;
      }
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support effects.`
      );
    }
  });
}

function setSelectionInnerShadow(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  applyEffectToSelection(referenceObject, behavior, "INNER_SHADOW");
}

function setSelectionDropShadow(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  applyEffectToSelection(referenceObject, behavior, "DROP_SHADOW");
}

function setSelectionLayerBlur(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  applyEffectToSelection(referenceObject, behavior, "LAYER_BLUR");
}

function setSelectionBackgroundBlur(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  applyEffectToSelection(referenceObject, behavior, "BACKGROUND_BLUR");
}

function applyEffectToSelection(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior,
  specifiedEffect:
    | "DROP_SHADOW"
    | "INNER_SHADOW"
    | "LAYER_BLUR"
    | "BACKGROUND_BLUR"
) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  const effects = referenceObject.effects as readonly Effect[] | undefined;
  if (!effects) {
    figma.notify("❌ Reference object has no effects.");
    return;
  }

  const filteredEffects = effects.filter(
    (effect) => effect.type === specifiedEffect
  );

  if (filteredEffects.length === 0) {
    figma.notify(
      `❌ Reference object does not contain any ${specifiedEffect
        .toLowerCase()
        .replace("_", " ")}.`
    );
    return;
  }

  selection.forEach((object) => {
    if ("effects" in object && Array.isArray(object.effects)) {
      if (behavior === "pasteToIncrement") {
        object.effects = [...object.effects, ...filteredEffects];
      } else {
        object.effects = filteredEffects;
      }
    } else {
      figma.notify(
        `❌ Object of type ${object.type} does not support effects.`
      );
    }
  });
}
