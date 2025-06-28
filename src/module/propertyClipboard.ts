import { PropertyClipboardAction } from './../types/Messages/MessagePropertyClipboard';
import { CopyPastableNode } from "../types/CopyPastableNode";
import {
  ExternalMessageShowNestedComponentProperties,
  ExternalMessageUpdateReferenceObject,
  MessagePropertyClipboard,
  PasteBehavior,
} from "../types/Messages/MessagePropertyClipboard";
import { ComponentPropertiesFrontEnd, PropertyClipboardSupportedProperty } from "../types/PropertClipboard";

import { utils } from "./utils";

export function reception(message: MessagePropertyClipboard) {
  const { action } = message;

  switch (action) {
    case "setReferenceObject":
      setReferenceObject();
      break;
    case "pastePropertyToObject":
      pastePropertyController(message);
      break;
    case "pasteInstancePropertyToObject":
      pasteInstancePropertyController(message);
      break;
    default:
      break;
  }
}

function setReferenceObject() {
  const selection = utils.editor.getCurrentSelection();

  if (selection.length !== 1) {
    figma.notify("❌ Please select exactly one object.");
    return;
  }

  const selectedNode = selection[0];
  const message: ExternalMessageUpdateReferenceObject = {
    referenceObject: { name: selectedNode.name, id: selectedNode.id, layerType: selectedNode.type },
    module: "PropertyClipboard",
    phase: "Actual",
    mode: "UpdateReferenceObject"
  }

  utils.communication.sendMessageBack(message);


  if (selectedNode.type === "INSTANCE") {
    // V25 支援複製Instance內部的巢狀屬性
    const extractedProperties = determineNestedInstanceProperties(selectedNode);

    const message: ExternalMessageShowNestedComponentProperties = {
      module: "PropertyClipboard",
      mode: "ShowExtractedProperties",
      phase: "Actual",
      extractedProperties: extractedProperties
    };
    utils.communication.sendMessageBack(message);
  }
}

function determineNestedInstanceProperties(sourceNode: InstanceNode): ComponentPropertiesFrontEnd[] {
  let results: ComponentPropertiesFrontEnd[] = [];

  function traverse(node: SceneNode) {
    if (node.type === "INSTANCE" && node.isExposedInstance) {
      const componentProps = node.componentProperties;
      if (componentProps) {
        for (const [propertyName, propertyData] of Object.entries(componentProps)) {
          results.push({
            nodeId: node.id,
            propertyName,
            value: propertyData.value,
            layerName: node.name
          });
        }
      }
    }

    if ("children" in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(sourceNode);
  console.log("Extracted component properties:", results);
  return results;
}

async function pasteInstancePropertyController(message: MessagePropertyClipboard) {
  if (!message.instanceProperty) {
    figma.notify("❌ Property is missing from message.");
    return;
  }

  if (!message.referenceObject) {
    figma.notify("❌ Reference object is missing from message.");
    return;
  }

  if (!message.referenceObject) {
    figma.notify("❌ Reference object is null.");
    return;
  }

  const referenceObjectNode = await figma.getNodeByIdAsync(
    message.referenceObject.id
  );

  if (!referenceObjectNode) {
    figma.notify("❌ Cannot get reference object by provided id.");
    return;
  }

  if (referenceObjectNode.type !== "INSTANCE") {
    figma.notify("❌ Reference object is not an allowed type.");
    return;
  }

  for (let i = 0; i < message.instanceProperty.length; i++) {
    const element = message.instanceProperty[i];
    pasteInstancePropertyToObject(element);
  }
}

function pasteInstancePropertyToObject(
  property: ComponentPropertiesFrontEnd,
) {
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if (object.type === "INSTANCE") {
      const stablePrefix = property.nodeId.split(":")[0];
      const targetChild = object.findOne((child) => {
        return child.id.startsWith(stablePrefix) && child.name === property.layerName;
      });

      if (
        targetChild &&
        "setProperties" in targetChild &&
        typeof targetChild.setProperties === "function"
      ) {
        const propsToSet: { [key: string]: string | boolean } = {};
        propsToSet[property.propertyName] = property.value;
        try {
          targetChild.setProperties(propsToSet);
        } catch (error) {
          figma.notify(`❌ Failed to set property on ${targetChild.name}`);
        }
      } else {
        figma.notify(`❌ Could not find matching child or it does not support setProperties.`);
      }
    }
  });
}

export async function pastePropertyComposer(
  action: PropertyClipboardAction,
  referenceObjectId: string,
  property: PropertyClipboardSupportedProperty[],
  behavior?: PasteBehavior
) {
  const message: MessagePropertyClipboard = {
    action: action,
    referenceObject: {
      name: "internal",
      id: referenceObjectId,
      layerType: "internal"
    },
    property: property,
    behavior: behavior,
    module: 'PropertyClipboard',
    phase: "Actual"
  }

  console.log(message)

  await pastePropertyController(message);
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

  if (!message.referenceObject) {
    figma.notify("❌ Reference object is null.");
    return;
  }

  const referenceObjectNode = await figma.getNodeByIdAsync(
    message.referenceObject.id
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
    "SHAPE_WITH_TEXT",
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

async function pastePropertyToObject(
  property: PropertyClipboardSupportedProperty,
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior
) {
  switch (property) {
    case "WIDTH":
      setSelectionSize(referenceObject, { width: true });
      // setSelectionWidth(referenceObject);
      break;
    case "HEIGHT":
      setSelectionSize(referenceObject, { height: true });
      // setSelectionHeight(referenceObject);
      break;
    case "LAYER_OPACITY":
      applyPropertyToSelection(referenceObject, "opacity");
      break;
    case "LAYER_CORNER_RADIUS":
      setSelectionCornerRadius(referenceObject);
      break;
    case "LAYER_BLEND_MODE":
      applyPropertyToSelection(referenceObject, "blendMode");
    case "STROKES":
      applyPropertyToSelection(referenceObject, "strokes");
      break;
    case "STROKE_ALIGN":
      applyPropertyToSelection(referenceObject, "strokeAlign");
      break;
    case "STROKE_WEIGHT":
      applyPropertyToSelection(referenceObject, "strokeWeight");
      break;
    case "STROKE_STYLE":
      applyPropertyToSelection(referenceObject, "dashPattern");
      break;
    case "STROKE_DASH":
      setSelectionStrokeDash(referenceObject);
      break;
    case "STROKE_GAP":
      setSelectionStrokeGap(referenceObject);
      break;
    case "STROKE_CAP":
      applyPropertyToSelection(referenceObject, "strokeCap");
      break;
    case "STROKE_JOIN":
      applyPropertyToSelection(referenceObject, "strokeJoin");
      break;
    case "STROKE_MITER_LIMIT":
      applyPropertyToSelection(referenceObject, "strokeMiterLimit");
      break;
    case "FILL_ALL":
      applyFillToSelection(referenceObject, behavior, "ALL");
      break;
    case "FILL_SOLID":
      applyFillToSelection(referenceObject, behavior, "SOLID");
      break;
    case "FILL_GRADIENT":
      applyFillToSelection(referenceObject, behavior, "GRADIENT");
      break;
    case "FILL_IMAGE":
      applyFillToSelection(referenceObject, behavior, "IMAGE");
      break;
    case "FILL_VIDEO":
      applyFillToSelection(referenceObject, behavior, "VIDEO");
      break;
    case "EFFECT_ALL":
      applyEffectToSelection(referenceObject, behavior, "ALL");
      break;
    case "EFFECT_INNER_SHADOW":
      applyEffectToSelection(referenceObject, behavior, "INNER_SHADOW");
      break;
    case "EFFECT_DROP_SHADOW":
      applyEffectToSelection(referenceObject, behavior, "DROP_SHADOW");
      break;
    case "EFFECT_LAYER_BLUR":
      applyEffectToSelection(referenceObject, behavior, "LAYER_BLUR");
      break;
    case "EFFECT_BACKGROUND_BLUR":
      applyEffectToSelection(referenceObject, behavior, "BACKGROUND_BLUR");
      break;
    case "EFFECT_NOISE":
      applyEffectToSelection(referenceObject, behavior, "NOISE");
      break;
    case "EFFECT_TEXTURE":
      applyEffectToSelection(referenceObject, behavior, "TEXTURE");
      break;
    case "EXPORT_SETTINGS":
      applyPropertyToSelection(referenceObject, "exportSettings");
      break;
    case "FONT_NAME":
      await pasteFontName(referenceObject);
      break;
    case "FONT_SIZE":
      await pasteFontSize(referenceObject);
      break;
    case "LINE_HEIGHT":
      await pasteLineHeight(referenceObject);
      break;
    case "LETTER_SPACING":
      await pasteLetterSpacing(referenceObject)
      break;
    case "ALIGNMENT":
      await pasteTextAlign(referenceObject);
      break;
    default:
      figma.notify(`Unsupported property type: ${property}`);
      break;
  }
}

// Set corner radius of selected layers from the reference object
function setSelectionCornerRadius(referenceObject: CopyPastableNode) {
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if (
      utils.typeCheck.isNodeSupportSingleCornerRadius(object) &&
      utils.typeCheck.isNodeSupportSingleCornerRadius(referenceObject)
    ) {
      // Applies single corner radii if both support single corners
      object.topLeftRadius = referenceObject.topLeftRadius;
      object.topRightRadius = referenceObject.topRightRadius;
      object.bottomRightRadius = referenceObject.bottomRightRadius;
      object.bottomLeftRadius = referenceObject.bottomLeftRadius;
    } else if (
      utils.typeCheck.isNodeSupportCornerRadius(object) &&
      utils.typeCheck.isNodeSupportCornerRadius(referenceObject)
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

/**
 * 用於降低重複性code，指定要將何種填色套用
 * @param referenceObject
 * @param behavior
 * @param specifiedFill
 * @returns
 */
async function applyFillToSelection(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior,
  specifiedFill: "ALL" | "SOLID" | "GRADIENT" | "IMAGE" | "VIDEO"
) {
  const selection = utils.editor.getCurrentSelection();

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

  let filteredFills: Paint[];
  if (specifiedFill === "ALL") {
    filteredFills = [...fills];
  } else if (specifiedFill === "GRADIENT") {
    filteredFills = fills.filter(
      (fill) =>
        fill.type === "GRADIENT_LINEAR" ||
        fill.type === "GRADIENT_RADIAL" ||
        fill.type === "GRADIENT_ANGULAR" ||
        fill.type === "GRADIENT_DIAMOND"
    );
  } else {
    filteredFills = fills.filter((fill) => fill.type === specifiedFill);
  }

  // If there are no video fills, notify the user and return
  if (filteredFills.length === 0) {
    figma.notify(
      `❌ Reference object does not contain any ${specifiedFill.toLowerCase()} type of fills.`
    );
    return;
  }

  if (
    referenceObject.fillStyleId !== "" &&
    typeof referenceObject.fillStyleId === "string"
  ) {
    // 當Fill style有連結的時候
    for (const object of selection) {
      if ("fills" in object && Array.isArray(object.fills)) {
        try {
          await object.setFillStyleIdAsync(referenceObject.fillStyleId);
        } catch (error) {
          figma.notify(`❌ Failed to apply fill style to ${object.type}`);
        }
      } else {
        figma.notify(
          `❌ Object of type ${object.type} does not support fill style id.`
        );
      }
    }
  } else {
    // Loop through the selection to apply only the video fills array
    selection.forEach((object) => {
      if ("fills" in object && Array.isArray(object.fills)) {
        if (behavior === "pasteToIncrement") {
          object.fills = [...object.fills, ...filteredFills];
        } else {
          object.fills = filteredFills;
        }
      } else {
        figma.notify(
          `❌ Object of type ${object.type} does not support fills.`
        );
      }
    });
  }
}

function setSelectionSize(referenceObject: CopyPastableNode, options: { width?: boolean; height?: boolean }) {
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  selection.forEach((object) => {
    if ("resize" in object) {
      const newWidth = options.width ? referenceObject.width : object.width;
      const newHeight = options.height ? referenceObject.height : object.height;
      object.resize(newWidth, newHeight);
    } else {
      figma.notify(`❌ Object of type ${object.type} cannot be resized.`);
    }
  });
}

function setSelectionStrokeDash(referenceObject: CopyPastableNode) {
  const selection = utils.editor.getCurrentSelection();

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
  const selection = utils.editor.getCurrentSelection();

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
 */
function applyPropertyToSelection(
  referenceObject: CopyPastableNode,
  propertyName: keyof CopyPastableNode,
  notifyUnsupported: boolean = true
) {
  const selection = utils.editor.getCurrentSelection();

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

/**
 * 用於降低重複性code，指定要套用何種效果
 * @param referenceObject
 * @param behavior
 * @param specifiedEffect
 * @returns
 */
async function applyEffectToSelection(
  referenceObject: CopyPastableNode,
  behavior: PasteBehavior,
  specifiedEffect:
    | "ALL"
    | "DROP_SHADOW"
    | "INNER_SHADOW"
    | "LAYER_BLUR"
    | "BACKGROUND_BLUR"
    | "NOISE"
    | "TEXTURE"
) {
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  const effects = referenceObject.effects as readonly Effect[] | undefined;
  if (!effects) {
    figma.notify("❌ Reference object has no effects.");
    return;
  }

  let filteredEffects: Effect[];

  if (specifiedEffect === "ALL") {
    filteredEffects = [...effects];
  } else {
    filteredEffects = effects.filter(
      (effect) => effect.type === specifiedEffect
    );
  }

  if (filteredEffects.length === 0) {
    figma.notify(
      `❌ Reference object does not contain any ${specifiedEffect
        .toLowerCase()
        .replace("_", " ")}.`
    );
    return;
  }

  // Apply effectStyleId if available, otherwise apply effects directly
  if (
    referenceObject.effectStyleId !== "" &&
    typeof referenceObject.effectStyleId === "string"
  ) {
    // When effect style has a valid linked ID
    for (const object of selection) {
      if ("effects" in object && Array.isArray(object.effects)) {
        try {
          await object.setEffectStyleIdAsync(referenceObject.effectStyleId);
        } catch (error) {
          figma.notify(`❌ Failed to apply effect style to ${object.type}`);
        }
      } else {
        figma.notify(
          `❌ Object of type ${object.type} does not support pasting effect style.`
        );
      }
    }
  } else {
    // Apply filtered effects directly to each selected object
    for (const object of selection) {
      if ("effects" in object && Array.isArray(object.effects)) {
        if (behavior === "pasteToIncrement") {
          object.effects = [...object.effects, ...filteredEffects.map(utils.editor.stripBoundVariables)];
        } else {
          object.effects = filteredEffects.map(utils.editor.stripBoundVariables);
        }
      } else {
        figma.notify(
          `❌ Object of type ${object.type} does not support pasting effects.`
        );
      }
    }
  }
}

async function pasteFontName(referenceObject: SceneNode) {
  if (referenceObject.type !== "TEXT") {
    throw new Error("Reference object should be text node in order to paste typography properties.")
  }
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  for (const object of selection) {
    if (object.type === "TEXT") {
      await utils.editor.loadFontOnTextNode(object)

      const fontName = referenceObject.fontName as FontName;
      await figma.loadFontAsync(fontName);

      object.fontName = fontName;
    } else {
      figma.notify(`❌ Object of type ${object.type} is not a text layer.`);
    }
  }
}

async function pasteFontSize(referenceObject: SceneNode) {
  if (referenceObject.type !== "TEXT") {
    throw new Error("Reference object should be text node in order to paste typography properties.")
  }
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  for (const object of selection) {
    if (object.type === "TEXT") {
      await utils.editor.loadFontOnTextNode(object);
      object.fontSize = referenceObject.fontSize;
    } else {
      figma.notify(`❌ Object of type ${object.type} is not a text layer.`);
    }
  }
}

async function pasteLineHeight(referenceObject: SceneNode) {
  if (referenceObject.type !== "TEXT") {
    throw new Error("Reference object should be text node in order to paste typography properties.")
  }
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  for (const object of selection) {
    if (object.type === "TEXT") {
      await utils.editor.loadFontOnTextNode(object);
      object.lineHeight = referenceObject.lineHeight;
    } else {
      figma.notify(`❌ Object of type ${object.type} is not a text layer.`);
    }
  }
}

async function pasteLetterSpacing(referenceObject: SceneNode) {
  if (referenceObject.type !== "TEXT") {
    throw new Error("Reference object should be text node in order to paste typography properties.")
  }
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  for (const object of selection) {
    if (object.type === "TEXT") {
      await utils.editor.loadFontOnTextNode(object);
      object.letterSpacing = referenceObject.letterSpacing;
    } else {
      figma.notify(`❌ Object of type ${object.type} is not a text layer.`);
    }
  }
}

async function pasteTextAlign(referenceObject: SceneNode) {
  if (referenceObject.type !== "TEXT") {
    throw new Error("Reference object should be text node in order to paste typography properties.")
  }
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No object selected.");
    return;
  }

  for (const object of selection) {
    if (object.type === "TEXT") {
      await utils.editor.loadFontOnTextNode(object);
      object.textAlignHorizontal = referenceObject.textAlignHorizontal;
      object.textAlignVertical = referenceObject.textAlignVertical;
    } else {
      figma.notify(`❌ Object of type ${object.type} is not a text layer.`);
    }
  }
}