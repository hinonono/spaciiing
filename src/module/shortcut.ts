import { CatalogueKit } from './catalogue';
import * as spaciiing from "./spaciiing";
import * as propertyClipboard from "./propertyClipboard";
import { MagicObjectMembers } from "../types/MagicObject";
import {
  MessageCreateSection,
  MessageShortcut,
  MessageShortcutFindAndReplace,
  MessageShortcutGenerateIconTemplate,
  MessageShortcutGenerateMagicalObjectMember,
  MessageShortcutNumbering,
  MessageShortcutSpiltText,
  MessageUnifyText,
} from "../types/Messages/MessageShortcut";
import { SpacingMode } from "../types/Messages/MessageSpaciiing";
import { updateArrowPosition } from "./arrowCreator/arrowCreator";
import { Direction } from "../types/General";
import { utils } from "./utils";
import { semanticTokens } from './tokens';

export function executeShortcut(message: MessageShortcut) {
  if (message.phase == undefined) {
    figma.notify(`❌ The "phase" property of the message is not set.`);
    return;
  }

  if (message.phase == "Actual") {
    switch (message.action) {
      case "makeFrameOverlay":
        makeOverlay();
        break;
      case "colorToLabelHEX":
        generateLabelFromObjectFillColor("HEX");
        break;
      case "colorToLabelHEXWithTransparency":
        generateLabelFromObjectFillColor("HEX_WITH_TRANSPARENCY");
        break;
      case "colorToLabelRGB":
        generateLabelFromObjectFillColor("RGB");
        break;
      case "colorToLabelRGBA":
        generateLabelFromObjectFillColor("RGBA");
        break;
      case "convertSelectionToTextStyles":
        convertSelectionToTextStyles();
        break;
      case "generateIconTemplate":
        generateIconTemplate(message as MessageShortcutGenerateIconTemplate);
        break;
      case "memorizeNote":
        if (message.editorPreference) {
          memorizeSelectedNodeId("note");
        }
        break;
      case "memorizeTitleSection":
        if (message.editorPreference) {
          memorizeSelectedNodeId("titleSection");
        }
        break;
      case "memorizeDesignStatusTag":
        if (message.editorPreference) {
          memorizeSelectedNodeId("designStatusTag");
        }
        break;
      case "generateNote":
        generateMagicalObjectMember(
          message as MessageShortcutGenerateMagicalObjectMember
        );
        break;
      case "generateDesignStatusTag":
        generateMagicalObjectMember(
          message as MessageShortcutGenerateMagicalObjectMember
        );
        break;
      case "generateTitleSection":
        generateMagicalObjectMember(
          message as MessageShortcutGenerateMagicalObjectMember
        );
        break;
      case "findAndReplace":
        findAndReplaceInSelection(message as MessageShortcutFindAndReplace);
        break;
      case "unifyText":
        unifyText(message as MessageUnifyText);
        break;
      case "createAutoLayoutIndividually":
        createAutoLayoutIndividually();
        break;
      case "updateCatalogueDescBackToFigma":
        if (!message.lang) { throw new Error("Lang is required to update catalogue description back to figma.") }
        CatalogueKit.linker.writeCatalogueDescBackToFigma(message.lang);
        break;
      case "numbering":
        numbering(message as MessageShortcutNumbering);
        break;
      case "updateArrowPosition":
        updateArrowPosition();
        break;
      case "spiltText":
        spiltText(message as MessageShortcutSpiltText);
        break;
      case "createSection":
        createSection(message as MessageCreateSection);
        break;
      case "resizeAspectFill":
        aspectResize("fill");
        break;
      case "resizeAspectFit":
        aspectResize("fit");
        break;
      case "debug":
        debugFunction();
        break;
      default:
        break;
    }
  }
}

function debugFunction() {
  const selection = utils.editor.getCurrentSelection();

  // Filter selection to only include text nodes
  const textNodes = selection.filter(
    (node) => node.type === "TEXT"
  ) as TextNode[];

  const textNode = textNodes[0];

  textNode.hyperlink = {
    type: "NODE",
    value: "800-1002"
  }

  figma.notify("OK!")
}

function aspectResize(mode: "fit" | "fill") {
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("No nodes selected.");
    return;
  }

  if (selection.length > 1) {
    figma.notify("Please select only one image layer.");
    return;
  }

  const node = selection[0];
  if ("fills" in node && Array.isArray(node.fills) && utils.editor.isNodeWithResizeMethod(node)) {
    const parent = node.parent;

    // Validate parent node: must exist and have width/height properties
    if (
      !parent ||
      typeof (parent as any).width !== "number" ||
      typeof (parent as any).height !== "number"
    ) {
      figma.notify(
        `❌ Aspect resize is not supported: parent node must exist and have width/height properties.`
      );
      return;
    }

    // Only support nodes with width/height
    if (
      typeof node.width !== "number" ||
      typeof node.height !== "number"
    ) {
      figma.notify("❌ Aspect resize is not supported for this node type.");
      return;
    }

    const nodeAspect = node.width / node.height;
    const parentAspect = (parent as any).width / (parent as any).height;

    let newWidth = node.width;
    let newHeight = node.height;

    if (mode === "fill") {
      if (nodeAspect > parentAspect) {
        newWidth = (parent as any).height * nodeAspect;
        newHeight = (parent as any).height;
      } else {
        newWidth = (parent as any).width;
        newHeight = (parent as any).width / nodeAspect;
      }

      node.constraints = { horizontal: "SCALE", vertical: "SCALE" };
    } else {
      if (nodeAspect > parentAspect) {
        newWidth = (parent as any).width;
        newHeight = (parent as any).width / nodeAspect;
        node.constraints = { horizontal: "STRETCH", vertical: "CENTER" };
      } else {
        newWidth = (parent as any).height * nodeAspect;
        newHeight = (parent as any).height;
        node.constraints = { horizontal: "CENTER", vertical: "STRETCH" };
      }
      node.lockAspectRatio();
    }

    // Center the node within the parent  
    node.resizeWithoutConstraints(newWidth, newHeight);
    node.x = ((parent as any).width - newWidth) / 2;
    node.y = ((parent as any).height - newHeight) / 2;

    figma.notify(
      `✅ Aspect resize (${mode}) applied.`
    );
  } else {
    figma.notify(
      `❌ Aspect resize is not supported for this layer type.`
    );
  }
}

function createSection(message: MessageCreateSection) {
  const { padding } = message;
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("No nodes selected.");
    return;
  }

  const group = figma.group(selection, figma.currentPage);
  if (!group.absoluteBoundingBox) {
    figma.notify("❌ Absolute bounding box is not availabe.");
    return;
  }

  //Create section
  const section = figma.createSection();
  section.name = "Section";

  section.resizeWithoutConstraints(group.absoluteBoundingBox.width + padding * 2, group.absoluteBoundingBox.height + padding * 2);
  section.x = group.absoluteBoundingBox.x - padding;
  section.y = group.absoluteBoundingBox.y - padding;
  section.appendChild(group);
  group.x = padding;
  group.y = padding;

  figma.ungroup(group);
  figma.notify(`✅ Created section with ${selection.length} nodes and ${padding}pt padding.`);
}

async function spiltText(message: MessageShortcutSpiltText) {
  const { spiltType, spiltSymbol } = message;
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("No nodes selected.");
    return;
  }

  if (selection.length > 1) {
    figma.notify("Please select only one text layer.");
    return;
  }

  const node = selection[0];

  if (node.type !== "TEXT") {
    figma.notify("Selected node is not a text layer.");
    return;
  }

  await utils.editor.loadFontOnTextNode(node);

  await utils.editor.loadFont([
    semanticTokens.fontFamily.regular,
  ]);

  const originalText = node.characters;

  let parts: string[] = [];
  let mode: Direction = "horizontal"

  if (spiltType === "LINE_BREAK") {
    parts = originalText.split(/\r?\n/);
    mode = "vertical";
  } else if (spiltType === "SPACE") {
    parts = originalText.split(/\s+/);
  } else {
    if (!spiltSymbol) {
      throw new Error("Custom symbol is required to spilt text.")
    }
    parts = originalText.split(spiltSymbol);
  }

  parts = parts.map(part => part.trim()).filter(part => part.length > 0);

  // const parts = originalText.split(spiltSymbol).map(part => part.trim()).filter(part => part.length > 0);

  if (parts.length <= 1) {
    figma.notify("Nothing to split. Text does not contain the split symbol.");
    return;
  }

  const parent = node.parent;
  if (!parent) {
    figma.notify("Cannot add new layers. Parent not found.");
    return;
  }

  const originalX = node.x;
  const originalY = node.y;

  let spiltedTextNodes: TextNode[] = [];

  // Create new text layers
  for (let i = 0; i < parts.length; i++) {
    const newText = figma.createText();
    newText.characters = parts[i];
    figma.currentPage.appendChild(newText);
    newText.x = originalX
    newText.y = originalY
    spiltedTextNodes.push(newText);

    figma.currentPage.selection = [newText];

    await propertyClipboard.pastePropertyComposer(
      "pastePropertyToObject",
      node.id,
      ["LAYER_OPACITY", "LAYER_BLEND_MODE"],
      "pasteToReplace"
    )

    await propertyClipboard.pastePropertyComposer(
      "pastePropertyToObject",
      node.id,
      ["FONT_NAME", "FONT_SIZE", "LINE_HEIGHT", "LETTER_SPACING", "ALIGNMENT"],
      "pasteToReplace"
    )

    await propertyClipboard.pastePropertyComposer(
      "pastePropertyToObject",
      node.id,
      ["FILL_ALL"],
      "pasteToReplace"
    )

    await propertyClipboard.pastePropertyComposer(
      "pastePropertyToObject",
      node.id,
      ["STROKES", "STROKE_ALIGN", "STROKE_WEIGHT", "STROKE_STYLE", "STROKE_DASH", "STROKE_GAP", "STROKE_CAP", "STROKE_JOIN", "STROKE_MITER_LIMIT",],
      "pasteToReplace"
    )

    await propertyClipboard.pastePropertyComposer(
      "pastePropertyToObject",
      node.id,
      ["EFFECT_ALL"],
      "pasteToReplace"
    )
  }

  spaciiing.applySpacingToLayers(spiltedTextNodes, 8, mode, false, false)
  setTimeout(() => {
    try {
      node.remove();
      figma.notify(`✅ Split into ${parts.length} text layers. Original node deleted.`);
    } catch (e) {
      console.error("Failed to remove node:", e);
    }
  }, 100); // 100ms is usually safe
}

async function numbering(message: MessageShortcutNumbering) {
  const { numberingdirection, numberingForm, startFrom } = message;
  const selection = utils.editor.getCurrentSelection();

  // Check if there are any nodes selected
  if (selection.length === 0) {
    figma.notify("No nodes selected.");
    return;
  } else if (selection.length === 1) {
    figma.notify("Please select at least two objects.");
    return;
  }

  // Ensure all selected nodes are text layers
  const allTextNodes = selection.every(node => node.type === "TEXT");
  if (!allTextNodes) {
    figma.notify("❌ All selected nodes must be text layers.");
    return;
  }

  const sortedSelection = utils.editor.sortSelectionBasedOnXAndY(numberingdirection, selection) as TextNode[];

  for (let i = 0; i < sortedSelection.length; i++) {
    const textNode = sortedSelection[i];
    await figma.loadFontAsync(textNode.fontName as FontName);

    let value: string;
    switch (numberingForm) {
      case "ALPHABETIC_LOWERCASE":
        value = utils.string.getAlphabet(i, false);
        break;
      case "ALPHABETIC_UPPERCASE":
        value = utils.string.getAlphabet(i, true);
        break;
      case "ZHTW_SIMPLE_HANZI":
        value = utils.string.getSimpleHanziNumber(i);
        break;
      case "ZHTW_COMPLEX_HANZI":
        value = utils.string.getComplexHanziNumber(i);
        break;
      case "NUMBER":
      default:
        const start = startFrom ?? 1;
        value = `${start + i}`;
        break;
    }

    textNode.characters = value;
  }

  figma.notify(`✅ Numbered ${sortedSelection.length} text layers.`);
}


function createAutoLayoutIndividually() {
  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No layers selected. Please select at least 1 layers.");
    return;
  }

  for (let i = 0; i < selection.length; i++) {
    const item = selection[i];
    const originalX = item.x;
    const originalY = item.y;

    const autoLayoutFrame = utils.node.createAutolayoutFrame([item], 0, "HORIZONTAL");
    autoLayoutFrame.resize(item.width, item.height);
    autoLayoutFrame.x = originalX;
    autoLayoutFrame.y = originalY;

    figma.currentPage.appendChild(autoLayoutFrame);
  }
}

/**
 * Function to unify text content across selected text nodes.
 * @param {MessageUnifyText} message - The message containing the target text content.
 */
function unifyText(message: MessageUnifyText) {
  const targetTextContent = message.targetTextContent;
  const selection = utils.editor.getCurrentSelection();

  // Filter selection to only include text nodes
  const textNodes = selection.filter(
    (node) => node.type === "TEXT"
  ) as TextNode[];

  if (textNodes.length === 0) {
    figma.notify("❌ No text nodes selected. Please select some text nodes.");
    return;
  }

  // Load fonts and update text content
  textNodes.forEach(async (textNode) => {
    await figma.loadFontAsync(textNode.fontName as FontName);

    if (targetTextContent.includes("$O")) {
      const originalContent = textNode.characters;
      textNode.characters = targetTextContent.replace("$ORIGIN$", originalContent);

    } else {
      textNode.characters = targetTextContent;
    }
  });

  figma.notify(`✅ Text content updated for ${textNodes.length} text node(s).`);
}

async function findAndReplaceInSelection(
  message: MessageShortcutFindAndReplace
) {
  const selection = utils.editor.getCurrentSelection();

  // Recursive function to find all text layers within the selection
  function findAllTextLayers(nodes: readonly SceneNode[]): SceneNode[] {
    let textLayers: SceneNode[] = [];

    for (const node of nodes) {
      if (node.type === "TEXT" || node.type === "SHAPE_WITH_TEXT") {
        textLayers.push(node);
      } else if ("children" in node) {
        textLayers = textLayers.concat(findAllTextLayers([...node.children]));
      }
    }

    return textLayers;
  }

  const texts = findAllTextLayers([...selection]);

  // Check if there are any texts found
  if (texts.length === 0) {
    figma.notify("❌ Please select at least one text layer.");
    return;
  }

  let replacedLayersCount = 0;

  // Loop through each text node
  for (const text of texts) {
    if (text.type === "TEXT") {
      await figma.loadFontAsync(text.fontName as FontName);

      const oldName = text.name;
      const oldText = text.characters;

      const newText = oldText
        .split(message.findCriteria)
        .join(message.replaceCriteria);

      if (newText !== oldText) {
        text.characters = newText;
        replacedLayersCount++;
      }

      if (message.keepOriginalLayerName) {
        text.name = oldName;
      }
    } else if (text.type === "SHAPE_WITH_TEXT" && text.text) {
      await figma.loadFontAsync(text.text.fontName as FontName);
      const oldName = text.name;
      const oldText = text.text.characters;

      const newText = oldText
        .split(message.findCriteria)
        .join(message.replaceCriteria);

      if (newText !== oldText) {
        text.text.characters = newText;
        replacedLayersCount++;
      }

      if (message.keepOriginalLayerName) {
        text.name = oldName;
      }
    }
  }

  figma.notify(`✅ Replaced text in ${replacedLayersCount} layer(s).`);
}

async function generateMagicalObjectMember(
  message: MessageShortcutGenerateMagicalObjectMember
) {
  const selection = figma.currentPage.selection;

  // Filter selection to only include frames
  const frames = selection.filter((node) => node.type === "FRAME");

  // Check if there are any frames selected
  if (frames.length === 0) {
    figma.notify("❌ Please select at least one frame.");
    return;
  }

  // Find the component using the componentId from the message
  const component = await figma.getNodeByIdAsync(message.componentId);

  // Check if the component exists and is of type COMPONENT or COMPONENT_SET
  if (
    !component ||
    (component.type !== "COMPONENT" && component.type !== "COMPONENT_SET")
  ) {
    figma.notify("❌ Component not found or invalid type.");
    return;
  }

  // Create an instance of the component or component set
  let instance;
  if (component.type === "COMPONENT") {
    instance = component.createInstance();
  } else if (component.type === "COMPONENT_SET") {
    // Create an instance of the default variant
    instance = component.defaultVariant.createInstance();
  }

  // Check if the instance was created successfully
  if (!instance) {
    figma.notify("❌ Instance creation failed.");
    return;
  }

  console.log(message.member);

  if (message.member == "titleSection") {
    // Find the most left frame
    let mostLeftFrame = frames[0];
    for (const frame of frames) {
      if (frame.x < mostLeftFrame.x) {
        mostLeftFrame = frame;
      }
    }

    // Create a new instance above the most left frame
    const newInstance = instance.clone();
    // Start updating from the instance root
    updateDateText(newInstance);

    // Set the position of the instance to be 40px above the most left frame
    newInstance.x = mostLeftFrame.x;
    newInstance.y = mostLeftFrame.y - newInstance.height - 40;

    // Add the instance to the same parent as the most left frame
    figma.currentPage.appendChild(newInstance);

    figma.notify("✅ Component instance generated above the most left frame.");
  } else {
    // Iterate over each selected frame and create an instance on top of it
    for (const frame of frames) {
      // Create a new instance for each frame
      const newInstance = instance.clone();
      // Start updating from the instance root
      updateDateText(newInstance);

      // Set the position of the instance to be 40px above the selected frame
      newInstance.x = frame.x;
      newInstance.y = frame.y - newInstance.height - 40;

      // Add the instance to the same parent as the selected frame
      figma.currentPage.appendChild(newInstance);
    }

    instance.remove();

    figma.notify("✅ Component instances generated above the selected frames.");
  }
}

// Function to find and update the text layer named "%DATE%"
async function updateDateText(node: SceneNode) {
  if (node.type === "TEXT" && node.name === "%DATE%") {
    const textNode = node as TextNode;

    await figma.loadFontAsync(textNode.fontName as FontName);
    textNode.characters = textNode.characters.replace("YY", utils.data.getCurrentTime("YEAR"));
    textNode.characters = textNode.characters.replace("MO", utils.data.getCurrentTime("MONTH"));
    textNode.characters = textNode.characters.replace("DD", utils.data.getCurrentTime("DAY"));
    textNode.characters = textNode.characters.replace("HH", utils.data.getCurrentTime("HOUR"));
    textNode.characters = textNode.characters.replace("MI", utils.data.getCurrentTime("MIN"));
    textNode.characters = textNode.characters.replace("SS", utils.data.getCurrentTime("SECOND"));

    textNode.locked = true;
  } else if ("children" in node) {
    for (const child of node.children) {
      updateDateText(child);
    }
  }
}

function memorizeSelectedNodeId(member: MagicObjectMembers) {
  const selection = utils.editor.getCurrentSelection();

  if (selection.length !== 1) {
    figma.notify("❌ Please select only one layer.");
    return;
  }

  const selectedNode = selection[0];

  if (
    selectedNode.type != "COMPONENT_SET" &&
    selectedNode.type != "COMPONENT"
  ) {
    figma.notify("❌ Please select a component or component set.");
    return;
  }

  // 新版
  const editorPreference = utils.data.readEditorPreference();
  switch (member) {
    case "note":
      editorPreference.magicObjects.noteId = selectedNode.id;
      break;
    case "designStatusTag":
      editorPreference.magicObjects.tagId = selectedNode.id;
      break;
    case "titleSection":
      editorPreference.magicObjects.sectionId = selectedNode.id;
      break;
    default:
      break;
  }
  utils.data.saveEditorPreference(editorPreference, "Shortcut");
  utils.data.updateEditorPreference(editorPreference, "Shortcut");
  figma.notify(
    `✅ The id is memorized successfully from object ${selectedNode.name}`
  );
}

function generateIconTemplate(message: MessageShortcutGenerateIconTemplate) {
  const receivedInnerFrame = message.innerFrame;
  const receivedOuterFrame = message.outerFrame;
  const quantity = message.quantity;

  const viewport = utils.editor.getCurrentViewport();

  const outerFrameSize = Math.max(receivedInnerFrame, receivedOuterFrame);
  const innerFrameSize = Math.min(receivedInnerFrame, receivedOuterFrame);

  // Determine inner frame size based on system
  // let innerFrameSize;
  // if (system === 24) {
  //   innerFrameSize = 20;
  // } else if (system === 48) {
  //   innerFrameSize = 40;
  // } else {
  //   console.error("Unsupported system size. Only 24 and 48 are supported.");
  //   return;
  // }

  const results = [];

  // Generate the components
  for (let i = 0; i < quantity; i++) {
    // Create the outer frame
    const outerFrameNode = figma.createFrame();

    outerFrameNode.resize(outerFrameSize, outerFrameSize);
    outerFrameNode.name = `Outer Frame ${i + 1}`;
    outerFrameNode.x = viewport.x;
    outerFrameNode.y = viewport.y;

    // Create the inner frame
    const innerFrameNode = figma.createFrame();
    innerFrameNode.resize(innerFrameSize, innerFrameSize);
    innerFrameNode.name = `Container`;

    // Center the inner frame within the outer frame
    innerFrameNode.x = (outerFrameNode.width - innerFrameNode.width) / 2;
    innerFrameNode.y = (outerFrameNode.height - innerFrameNode.height) / 2;

    // Set constraints for the inner frame to scale on both sides
    innerFrameNode.constraints = {
      horizontal: "SCALE",
      vertical: "SCALE",
    };

    // Add the inner frame to the outer frame
    outerFrameNode.appendChild(innerFrameNode);

    // Create a component from the outer frame
    const component = figma.createComponent();
    component.resize(outerFrameNode.width, outerFrameNode.height);
    component.name = `Icon${outerFrameSize}/${i + 1}`;
    component.x = viewport.x;
    component.y = viewport.y;

    // Move the outer frame's children to the component
    while (outerFrameNode.children.length > 0) {
      component.appendChild(outerFrameNode.children[0]);
    }

    // Remove the empty outer frame
    outerFrameNode.remove();

    results.push(component);
  }

  results.forEach((item) => {
    // Add the component to the Figma current page
    figma.currentPage.appendChild(item);
  });

  figma.currentPage.selection = results;
  const spacing = 8;
  const mode: SpacingMode = "horizontal";
  const addAutolayout = false;

  spaciiing.applySpacingToLayers(
    results,
    spacing,
    mode,
    addAutolayout,
    false,
    5
  );
}

async function generateLabelFromObjectFillColor(
  type: "HEX" | "RGB" | "RGBA" | "HEX_WITH_TRANSPARENCY"
) {
  const selection = figma.currentPage.selection;
  const fontName = { family: "Inter", style: "Regular" };

  if (selection.length === 0) {
    figma.notify("❌ Please select at least one object with fill color.");
    return;
  }

  await figma.loadFontAsync(fontName);

  for (const selectedNode of selection) {
    if ("fills" in selectedNode) {
      const fills = selectedNode.fills as readonly Paint[];

      if (
        Array.isArray(fills) &&
        fills.length > 0 &&
        fills[0].type === "SOLID"
      ) {
        const rectColor = fills[0] as SolidPaint;
        let label: string | null = null;

        switch (type) {
          case "HEX":
            label = utils.color.rgbToHex(
              rectColor.color.r,
              rectColor.color.g,
              rectColor.color.b
            );
            break;
          case "RGB":
            label = utils.color.rgbToRGB255(
              rectColor.color.r,
              rectColor.color.g,
              rectColor.color.b
            );
            break;
          case "RGBA":
            if (rectColor.opacity != null) {
              label = utils.color.rgbToRGBA255(
                rectColor.color.r,
                rectColor.color.g,
                rectColor.color.b,
                rectColor.opacity
              );
            } else {
              figma.notify(
                "❌ Unable to generate rgba text label due to null opacity."
              );
              continue;
            }
            break;
          case "HEX_WITH_TRANSPARENCY":
            label = utils.color.rgbToHexWithTransparency(
              rectColor.color.r,
              rectColor.color.g,
              rectColor.color.b,
              rectColor.opacity ?? 1
            );
            break;
        }

        if (label) {
          createAndPlaceTextNode(label, type, selectedNode, fontName);
        }
      }
    }
  }
}

function createAndPlaceTextNode(
  label: string,
  type: string,
  selectedNode: SceneNode,
  fontName: FontName
) {
  const textNode = utils.node.createTextNode(label, fontName, 16);
  textNode.name = `${type}_LABEL`;
  textNode.x = selectedNode.x;
  textNode.y = selectedNode.y + selectedNode.height + 16;
  figma.currentPage.appendChild(textNode);
}

/**
 * Creates an overlay on top of each selected frame.
 */
function makeOverlay() {
  // Get the current selection of nodes
  const selection = utils.editor.getCurrentSelection();

  // Iterate over each selected item
  selection.forEach((selectedItem) => {
    // Check if the selected item is a frame
    if (selectedItem.type === "FRAME") {
      // Create a new rectangle node
      const rectangle = figma.createRectangle();

      // Set the rectangle size to match the frame size
      rectangle.resize(selectedItem.width, selectedItem.height);

      // Position the rectangle at the top-left corner of the frame
      rectangle.x = 0;
      rectangle.y = 0;

      // Set the fill color and opacity of the rectangle
      rectangle.fills = [
        { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.5 },
      ];

      // Name the rectangle as "Overlay"
      rectangle.name = "Overlay";

      rectangle.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };

      // Lock the rectangle to prevent accidental modifications
      rectangle.locked = true;

      // Append the rectangle as a child of the selected frame
      selectedItem.appendChild(rectangle);
    }
  });
}

async function convertSelectionToTextStyles() {
  const selection = figma.currentPage.selection;

  if (!selection || selection.length === 0) {
    figma.notify("❌ No nodes selected. Please select some text nodes.");
    return;
  }

  const textNodes = selection.filter(
    (node) => node.type === "TEXT"
  ) as TextNode[];

  if (textNodes.length === 0) {
    figma.notify("❌ No text nodes selected. Please select some text nodes.");
    return;
  }

  // Collect unique fonts to load
  const fontsToLoad = new Set<{ family: string; style: string }>();

  textNodes.forEach((node) => {
    if (typeof node.fontName !== "symbol") {
      fontsToLoad.add(node.fontName as { family: string; style: string });
    }
  });

  try {
    // Load all unique fonts
    await Promise.all(
      Array.from(fontsToLoad).map((font) => figma.loadFontAsync(font))
    );

    textNodes.forEach((node) => {
      if (
        typeof node.fontName === "symbol" ||
        typeof node.fontSize === "symbol" ||
        typeof node.letterSpacing === "symbol" ||
        typeof node.lineHeight === "symbol"
      ) {
        return;
      }

      const newTextStyle = figma.createTextStyle();
      newTextStyle.name = node.characters;
      newTextStyle.fontSize = node.fontSize;
      newTextStyle.textDecoration = "NONE";
      newTextStyle.fontName = node.fontName;
      newTextStyle.letterSpacing = node.letterSpacing;
      newTextStyle.lineHeight = node.lineHeight;
    });

    figma.notify("✅ Text styles created successfully!");
  } catch (error) {
    console.error("Error creating text styles:", error);
    figma.notify(
      "❌ Error creating text styles. Please check the console for more details."
    );
  }
}
