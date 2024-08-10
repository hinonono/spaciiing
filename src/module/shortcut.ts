import { MessageShortcutFindAndReplace } from "./../types/Message";
import * as util from "./util";
import {
  ExternalMessageUpdateMagicalObject,
  MessageShortcut,
  MessageShortcutGenerateIconTemplate,
  MessageShortcutGenerateMagicalObjectMember,
  MessageShortcutUpdateMagicalObject,
  SpacingMode,
} from "../types/Message";
import * as spaciiing from "./spaciiing";
import { MagicalObject, MagicalObjectMembers } from "../types/MagicalObject";

export function executeShortcut(message: MessageShortcut) {
  if (message.phase == undefined) {
    figma.notify(`❌ The "phase" property of the message is not set.`);
    return;
  }

  if (message.phase == "Init") {
    initShortcut();
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
        memorizeSelectedNodeId("note");
        break;
      case "memorizeTitleSection":
        memorizeSelectedNodeId("titleSection");
        break;
      case "memorizeDesignStatusTag":
        memorizeSelectedNodeId("designStatusTag");
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
      default:
        break;
    }
  }

  if (message.phase == "WillEnd") {
    shortcutWillEnd(message as MessageShortcutUpdateMagicalObject);
  }
}

function initShortcut() {
  const pluginDataKey = "magical-object";
  const data = figma.root.getPluginData(pluginDataKey);

  if (data == "") {
    //
  } else {
    // 有找到設置的magical object
    const mo = JSON.parse(data) as MagicalObject;
    const message: ExternalMessageUpdateMagicalObject = {
      magicalObject: mo,
      module: "Shortcut",
      direction: "Outer",
      phase: "Init",
    };

    util.sendMessageBack(message);
  }
}

function shortcutWillEnd(message: MessageShortcutUpdateMagicalObject) {
  console.log("Shorcut will End.");

  const pluginDataKey = "magical-object";
  const mo = message.magicalObject;
  figma.root.setPluginData(pluginDataKey, JSON.stringify(mo));
}

async function findAndReplaceInSelection(
  message: MessageShortcutFindAndReplace
) {
  const selection = util.getCurrentSelection();

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
    textNode.characters = util.getFormattedDate();
    textNode.locked = true;
  } else if ("children" in node) {
    for (const child of node.children) {
      updateDateText(child);
    }
  }
}

function memorizeSelectedNodeId(member: MagicalObjectMembers) {
  const selection = util.getCurrentSelection();

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

  const pluginDataKey = "magical-object";
  const data = figma.root.getPluginData(pluginDataKey);
  if (data != "") {
    // 有找到設置的magical object
    const mo = JSON.parse(data) as MagicalObject;

    switch (member) {
      case "note":
        mo.noteId = selectedNode.id;
        break;
      case "designStatusTag":
        mo.designStatusTagId = selectedNode.id;
        break;
      case "titleSection":
        mo.titleSectionId = selectedNode.id;
        break;
      default:
        break;
    }

    const message: ExternalMessageUpdateMagicalObject = {
      magicalObject: mo,
      module: "Shortcut",
      direction: "Outer",
      phase: "Actual",
    };

    util.sendMessageBack(message);

    figma.root.setPluginData(pluginDataKey, JSON.stringify(mo));
    figma.notify(`✅ ID Set to ${selectedNode.id}`);
  }
}

function generateIconTemplate(message: MessageShortcutGenerateIconTemplate) {
  const system = message.system;
  const quantity = message.quantity;
  const viewport = util.getCurrentViewport();

  // Determine inner frame size based on system
  let innerFrameSize;
  if (system === 24) {
    innerFrameSize = 20;
  } else if (system === 48) {
    innerFrameSize = 40;
  } else {
    console.error("Unsupported system size. Only 24 and 48 are supported.");
    return;
  }

  const results = [];

  // Generate the components
  for (let i = 0; i < quantity; i++) {
    // Create the outer frame
    const outerFrame = figma.createFrame();
    outerFrame.resize(system, system);
    outerFrame.name = `Outer Frame ${i + 1}`;
    outerFrame.x = viewport.x;
    outerFrame.y = viewport.y;

    // Create the inner frame
    const innerFrame = figma.createFrame();
    innerFrame.resize(innerFrameSize, innerFrameSize);
    innerFrame.name = `CONTENT`;

    // Center the inner frame within the outer frame
    innerFrame.x = (outerFrame.width - innerFrame.width) / 2;
    innerFrame.y = (outerFrame.height - innerFrame.height) / 2;

    // Set constraints for the inner frame to scale on both sides
    innerFrame.constraints = {
      horizontal: "SCALE",
      vertical: "SCALE",
    };

    // Add the inner frame to the outer frame
    outerFrame.appendChild(innerFrame);

    // Create a component from the outer frame
    const component = figma.createComponent();
    component.resize(outerFrame.width, outerFrame.height);
    component.name = `Icon${system}/${i + 1}`;
    component.x = viewport.x;
    component.y = viewport.y;

    // Move the outer frame's children to the component
    while (outerFrame.children.length > 0) {
      component.appendChild(outerFrame.children[0]);
    }

    // Remove the empty outer frame
    outerFrame.remove();

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

  spaciiing.applySpacingToLayers(results, spacing, mode, addAutolayout, false);
}

async function generateLabelFromObjectFillColor(
  type: "HEX" | "RGB" | "RGBA" | "HEX_WITH_TRANSPARENCY"
) {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.notify("❌ Please select at least one object with fill color.");
    return;
  }

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

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

        if (type === "HEX") {
          label = util.rgbToHex(
            rectColor.color.r,
            rectColor.color.g,
            rectColor.color.b
          );
          createTextLabel(selectedNode, label, "HEX_LABEL");
        } else if (type === "RGB") {
          label = util.rgbToRGB255(
            rectColor.color.r,
            rectColor.color.g,
            rectColor.color.b
          );
          createTextLabel(selectedNode, label, "RGB_LABEL");
        } else if (type === "RGBA") {
          if (rectColor.opacity != null) {
            label = util.rgbToRGBA255(
              rectColor.color.r,
              rectColor.color.g,
              rectColor.color.b,
              rectColor.opacity
            );
            createTextLabel(selectedNode, label, "RGBA_LABEL");
          } else {
            figma.notify(
              "❌ Unable to generate rgba text label due to null opacity."
            );
          }
        } else if (type === "HEX_WITH_TRANSPARENCY") {
          label = util.rgbToHexWithTransparency(
            rectColor.color.r,
            rectColor.color.g,
            rectColor.color.b,
            rectColor.opacity ?? 1
          );
          createTextLabel(selectedNode, label, "HEX_WITH_TRANSPARENCY_LABEL");
        }
      }
    }
  }
}

function createTextLabel(node: SceneNode, text: string, labelName: string) {
  const textNode = figma.createText();
  textNode.fontSize = 16;
  textNode.characters = text;
  textNode.name = labelName;
  textNode.x = node.x;
  textNode.y = node.y + node.height + 16;
  figma.currentPage.appendChild(textNode);
}

function makeOverlay() {
  const storedWidth = figma.currentPage.getPluginData("memorized-object-width");
  const storedHeight = figma.currentPage.getPluginData(
    "memorized-object-height"
  );

  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === "FRAME") {
    const selectedFrame = selection[0];
    const rectangle = figma.createRectangle();

    if (storedWidth != undefined && storedHeight != undefined) {
      rectangle.resize(Number(storedWidth), Number(storedHeight));
    } else {
      rectangle.resize(375, 812);
    }

    rectangle.x = 0;
    rectangle.y = 0;
    rectangle.fills = [
      { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.5 },
    ];
    rectangle.name = "Overlay";
    rectangle.locked = true;

    selectedFrame.appendChild(rectangle);
  } else {
    // No frame selected or multiple items selected
    console.log("Please select a single frame.");
  }
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
      newTextStyle.name = node.characters.substring(0, 30); // Limiting the name length
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
