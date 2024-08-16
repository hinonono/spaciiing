import { StyleMode } from "../types/Messages/MessageStyleIntroducer";
import { ResizableNode } from "../types/NodeResizable";

// 取代原有的 fundamental-module.ts
export function deepClone(val: unknown) {
  return JSON.parse(JSON.stringify(val));
}

export function sendMessageBack(message: object) {
  // console.log("Message sent back");
  console.log(message);
  figma.ui.postMessage({
    pluginMessage: message,
  });
}

/**
 * Converts RGB values (0-1) to a hexadecimal color string.
 *
 * @param {number} r - Red component (0 to 1).
 * @param {number} g - Green component (0 to 1).
 * @param {number} b - Blue component (0 to 1).
 * @param {boolean} [withHashTag=true] - Whether to prepend a '#' to the hex string.
 * @returns {string} Hexadecimal color string.
 */
export function rgbToHex(
  r: number,
  g: number,
  b: number,
  withHashTag: boolean = true
): string {
  // Ensure the RGB values are within the valid range
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  // Convert each component to a 2-digit hexadecimal string
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  if (withHashTag) {
    // Concatenate the hex components and prepend a '#'
    return `#${hexR}${hexG}${hexB}`;
  } else {
    // Concatenate the hex components and prepend a '#'
    return `${hexR}${hexG}${hexB}`;
  }
}

export function rgbToHexWithTransparency(
  r: number,
  g: number,
  b: number,
  opacity: number
): string {
  // Ensure the RGB values are within the valid range
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  opacity = Math.round(opacity * 255);

  // Convert each component to a 2-digit hexadecimal string
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");
  const hexA = opacity.toString(16).padStart(2, "0");

  // Concatenate the hex components and prepend a '#'
  return `#${hexR}${hexG}${hexB}${hexA}`;
}

/**
 * Converts RGB values (0-1) to an RGB string.
 *
 * @param {number} r - Red component (0 to 1).
 * @param {number} g - Green component (0 to 1).
 * @param {number} b - Blue component (0 to 1).
 * @returns {string} RGB color string with RGB scaled to 0-255.
 */
export function rgbToRGB255(r: number, g: number, b: number): string {
  const newR = Math.round(r * 255);
  const newG = Math.round(g * 255);
  const newB = Math.round(b * 255);

  return `rgb(${newR}, ${newG}, ${newB})`;
}

/**
 * Converts RGB values (0-1) and an alpha value (0-1) to an RGBA string.
 *
 * @param {number} r - Red component (0 to 1).
 * @param {number} g - Green component (0 to 1).
 * @param {number} b - Blue component (0 to 1).
 * @param {number} a - Alpha component (0 to 1).
 * @returns {string} RGBA color string with RGB scaled to 0-255 and alpha rounded to two decimal places.
 */
export function rgbToRGBA255(
  r: number,
  g: number,
  b: number,
  a: number
): string {
  const newR = Math.round(r * 255);
  const newG = Math.round(g * 255);
  const newB = Math.round(b * 255);
  const newA = a.toFixed(2); // Round alpha to two decimal places

  return `rgba(${newR}, ${newG}, ${newB}, ${newA})`;
}

// Function to get the current viewport and return it as a Vector type
export function getCurrentViewport(): Vector {
  // Get the current viewport
  const viewport = figma.viewport;

  // Create a Vector object with the current viewport center coordinates
  const vector: Vector = {
    x: Math.round(viewport.center.x),
    y: Math.round(viewport.center.y),
  };

  return vector;
}

export function getCurrentSelection(): Array<SceneNode> {
  // Get an array of the currently selected layers
  return [...figma.currentPage.selection];
}

export function getNodesInSelectedFrame(): Array<SceneNode> | null {
  const selectedNode = figma.currentPage.selection[0];

  if (selectedNode && selectedNode.type === "FRAME") {
    return [...selectedNode.children];
  }

  return null;
}

export function isNodeWithResizeMethod(node: SceneNode): node is ResizableNode {
  return (
    node.type === "FRAME" ||
    node.type === "STAR" ||
    node.type === "ELLIPSE" ||
    node.type === "POLYGON" ||
    node.type === "RECTANGLE"
  );
}

export function mapToUnitRange(value: number): number {
  if (value < 0) {
    return 0;
  } else if (value > 255) {
    return 1;
  } else {
    return value / 255;
  }
}

export function getBoundingBox(layers: SceneNode[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  layers.forEach((layer) => {
    const { x, y, width, height } = layer;

    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + width > maxX) maxX = x + width;
    if (y + height > maxY) maxY = y + height;
  });

  const width = maxX - minX;
  const height = maxY - minY;

  return { width, height };
}

export function getSelectionPosition(layers: SceneNode[]) {
  let minX = Infinity;
  let minY = Infinity;

  layers.forEach((layer) => {
    const { x, y } = layer;

    if (x < minX) minX = x;
    if (y < minY) minY = y;
  });

  return { x: minX, y: minY };
}

export function hasImageFill(node: RectangleNode): boolean {
  return (
    Array.isArray(node.fills) &&
    node.fills.some((fill) => fill.type === "IMAGE")
  );
}

// Utility function to convert RGBA from 0-255 range to 0-1 range
export function convertColorRange(rgba: {
  r: number;
  g: number;
  b: number;
  a: number;
}): RGBA {
  return {
    r: rgba.r / 255,
    g: rgba.g / 255,
    b: rgba.b / 255,
    a: rgba.a,
  };
}

export function hexToRgb(hex: string): RGB {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse the r, g, b values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  return { r, g, b };
}

export function hexToRgba(hex: string, opacity: number): RGBA | null {
  // Check if opacity is within the valid range
  if (opacity < 0 || opacity > 1) {
    console.error("Opacity must be between 0 and 1.");
    return null;
  }

  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse the r, g, b values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  // Return the RGBA value
  return { r, g, b, a: opacity };
}

// Helper function to format the date as MM/DD
export function getFormattedDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${month}/${day}`;
}

/**
 * Adds a specified number of hours to the given date.
 * @param date The original date.
 * @param hours The number of hours to add.
 * @returns A new date object with the hours added.
 */
export function addHours(date: Date, hours: number): Date {
  // Create a new date object based on the provided date
  const resultDate = new Date(date);
  // Add the specified number of hours
  resultDate.setHours(resultDate.getHours() + hours);
  // Return the modified date
  return resultDate;
}

export function convertUTCStringToDate(utcString: string) {
  return new Date(utcString);
}

// Utility function to capitalize the first letter of every word
export const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export function parseColorToRgba(
  color: string,
  opacity: number = 1
): RGBA | null {
  color = color.trim();
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const rgbaRegex =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d.]+)\s*\)$/;
  const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
  const hslaRegex =
    /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([\d.]+)\s*\)$/;
  const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;

  if (rgbRegex.test(color)) {
    const match = color.match(rgbRegex);
    if (match) {
      const [, r, g, b] = match;
      return {
        r: parseInt(r) / 255,
        g: parseInt(g) / 255,
        b: parseInt(b) / 255,
        a: opacity,
      };
    }
  } else if (rgbaRegex.test(color)) {
    const match = color.match(rgbaRegex);
    if (match) {
      const [, r, g, b, a] = match;
      return {
        r: parseInt(r) / 255,
        g: parseInt(g) / 255,
        b: parseInt(b) / 255,
        a: parseFloat(a),
      };
    }
  } else if (hslRegex.test(color)) {
    const match = color.match(hslRegex);
    if (match) {
      const [, h, s, l] = match;
      return hslToRgba(
        parseInt(h),
        parseInt(s) / 100,
        parseInt(l) / 100,
        opacity
      );
    }
  } else if (hslaRegex.test(color)) {
    const match = color.match(hslaRegex);
    if (match) {
      const [, h, s, l, a] = match;
      return hslToRgba(
        parseInt(h),
        parseInt(s) / 100,
        parseInt(l) / 100,
        parseFloat(a)
      );
    }
  } else if (hexRegex.test(color)) {
    return hexToRgba(color, opacity);
  } else {
    console.error("Invalid color format");
    return null;
  }

  return null;
}

function hslToRgba(h: number, s: number, l: number, a: number): RGBA {
  h = h / 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r, g, b, a };
}

/**
 * Creates an explanation item consisting of a title and a description.
 * The item is wrapped in a frame node with specified padding and border properties.
 *
 * @param {string} title - The title text for the explanation item.
 * @param {string} description - The description text for the explanation item.
 * @param {FontName} fontName - The font name for the title and description.
 * @returns {FrameNode} The frame node containing the title and description.
 * @throws Will throw an error if the explanation item wrapper node cannot be created.
 */
export function createExplanationItem(
  title: string,
  description: string,
  fontName: FontName,
  type: StyleMode,
  color?: RGB,
  effects?: Effect[],
  textStyle?: TextStyle
): FrameNode {
  const baseFontSize = 16;
  const basePadding = 16;
  const baseSpacing = 8;
  const secodaryColor: Paint[] = [
    { type: "SOLID", color: { r: 0.54, g: 0.54, b: 0.54 } },
  ];

  const titleNode = createTextNode(title, fontName, baseFontSize * 1.25);
  const descriptionNode = createTextNode(
    description == "" ? "(blank)" : description,
    fontName,
    baseFontSize * 0.75,
    secodaryColor
  );

  let explanationTextsWrapperNode: FrameNode;

  // 如果type是COLOR，則在titleNode後面加上顏色碼
  if (type === "COLOR") {
    if (!color) {
      throw new Error("Color is required for color type.");
    }

    const colorHexNode = createTextNode(
      rgbToHex(color.r, color.g, color.b, true),
      fontName,
      baseFontSize * 0.75,
      secodaryColor
    );

    colorHexNode.textCase = "UPPER";

    const titleWrapper = createAutolayoutFrame(
      [titleNode, colorHexNode],
      baseSpacing,
      "VERTICAL"
    );
    titleWrapper.name = "Explanation Item Title Wrapper";
    titleNode.layoutSizingHorizontal = "FILL";
    colorHexNode.layoutSizingHorizontal = "FILL";

    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleWrapper, descriptionNode],
      baseSpacing * 2,
      "VERTICAL"
    );

    titleWrapper.layoutSizingHorizontal = "FILL";
  } else if (type === "TEXT") {
    // 如果type是TEXT，則在titleNode後面加上描述文字屬性的TextNode
    if (!textStyle) {
      throw new Error("Text style is required for text type.");
    }

    const fontNameNode = createExplanationTextPropertyItem(
      "Font Name",
      `${textStyle.fontName.family} ${textStyle.fontName.style}`,
      fontName
    );
    const fontSizeNode = createExplanationTextPropertyItem(
      "Font Size",
      `${textStyle.fontSize}`,
      fontName
    );

    const lineHeightNode = createExplanationTextPropertyItem(
      "Line Height",
      `${
        textStyle.lineHeight.unit == "AUTO"
          ? "Auto"
          : textStyle.lineHeight.value
      }`,
      fontName
    );

    const letterSpacingNode = createExplanationTextPropertyItem(
      "Letter Spacing",
      `${textStyle.letterSpacing.value}`,
      fontName
    );

    const paragraphSpacingNode = createExplanationTextPropertyItem(
      "Paragraph Spacing",
      `${textStyle.paragraphSpacing}`,
      fontName
    );

    const textCaseNode = createExplanationTextPropertyItem(
      "Text Case",
      `${textStyle.textCase}`,
      fontName
    );

    const tempWrapper1 = createAutolayoutFrame(
      [fontNameNode, fontSizeNode],
      baseSpacing * 2,
      "HORIZONTAL"
    );

    const tempWrapper2 = createAutolayoutFrame(
      [lineHeightNode, letterSpacingNode],
      baseSpacing * 2,
      "HORIZONTAL"
    );

    const tempWrapper3 = createAutolayoutFrame(
      [paragraphSpacingNode, textCaseNode],
      baseSpacing * 2,
      "HORIZONTAL"
    );

    tempWrapper1.name = "Text Property Items Wrapper";
    tempWrapper2.name = "Text Property Items Wrapper";
    tempWrapper3.name = "Text Property Items Wrapper";

    tempWrapper1.layoutSizingVertical = "HUG";
    tempWrapper2.layoutSizingVertical = "HUG";
    tempWrapper3.layoutSizingVertical = "HUG";

    fontNameNode.layoutSizingHorizontal = "FILL";
    fontSizeNode.layoutSizingHorizontal = "FILL";
    lineHeightNode.layoutSizingHorizontal = "FILL";
    letterSpacingNode.layoutSizingHorizontal = "FILL";
    paragraphSpacingNode.layoutSizingHorizontal = "FILL";
    textCaseNode.layoutSizingHorizontal = "FILL";

    fontNameNode.layoutSizingVertical = "HUG";
    fontSizeNode.layoutSizingVertical = "HUG";
    lineHeightNode.layoutSizingVertical = "HUG";
    letterSpacingNode.layoutSizingVertical = "HUG";
    paragraphSpacingNode.layoutSizingVertical = "HUG";
    textCaseNode.layoutSizingVertical = "HUG";

    const titleWrapper = createAutolayoutFrame(
      [titleNode, tempWrapper1, tempWrapper2, tempWrapper3],
      baseSpacing,
      "VERTICAL"
    );
    titleWrapper.name = "Explanation Item Title Wrapper";
    titleNode.layoutSizingHorizontal = "FILL";
    tempWrapper1.layoutSizingHorizontal = "FILL";
    tempWrapper2.layoutSizingHorizontal = "FILL";
    tempWrapper3.layoutSizingHorizontal = "FILL";

    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleWrapper, descriptionNode],
      baseSpacing * 2,
      "VERTICAL"
    );

    titleWrapper.layoutSizingHorizontal = "FILL";
  } else {
    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleNode, descriptionNode],
      baseSpacing * 2,
      "VERTICAL"
    );

    titleNode.layoutSizingHorizontal = "FILL";
    descriptionNode.layoutSizingHorizontal = "FILL";
  }
  explanationTextsWrapperNode.name = "Explanation Item Texts Wrapper";

  // const nodesToPushInWrapper: SceneNode[] = [];
  let explanationItemWrapperNode: FrameNode;

  if (type === "COLOR") {
    if (!color) {
      throw new Error("Color is required for color type.");
    }
    const colorFrame = figma.createFrame();
    colorFrame.resize(64, 64);
    colorFrame.name = "Swatch";
    colorFrame.fills = [{ type: "SOLID", color: color }];
    colorFrame.cornerRadius = 12;

    if (isWhite(color)) {
      colorFrame.strokes = [
        { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } },
      ];
      colorFrame.strokeWeight = 1;
    }

    const item = createAutolayoutFrame(
      [colorFrame, explanationTextsWrapperNode],
      16,
      "HORIZONTAL"
    );

    explanationItemWrapperNode = item;
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
  } else if (type === "EFFECT") {
    if (!effects) {
      throw new Error("Effects are required for effect type.");
    }

    const effectFrame = figma.createFrame();
    effectFrame.resize(64, 64);
    effectFrame.name = "Effect";
    effectFrame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    effectFrame.cornerRadius = 12;
    effectFrame.effects = effects;

    const item = createAutolayoutFrame(
      [effectFrame, explanationTextsWrapperNode],
      baseSpacing * 2,
      "HORIZONTAL"
    );

    explanationItemWrapperNode = item;
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
  } else {
    // 預設 或 類型是TEXT
    explanationItemWrapperNode = createAutolayoutFrame(
      [explanationTextsWrapperNode],
      0,
      "VERTICAL"
    );
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
  }

  explanationItemWrapperNode.name = "Explanation Item";
  explanationItemWrapperNode.clipsContent = false;

  // Set height to hug content
  explanationItemWrapperNode.primaryAxisSizingMode = "AUTO";

  explanationItemWrapperNode.paddingTop = basePadding * 1.5;
  explanationItemWrapperNode.paddingBottom = basePadding * 1.5;
  explanationItemWrapperNode.paddingLeft = basePadding / 2;
  explanationItemWrapperNode.paddingRight = basePadding / 2;

  // Set border properties for top edge only
  explanationItemWrapperNode.strokes = [
    { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } },
  ];
  explanationItemWrapperNode.strokeWeight = 1;
  explanationItemWrapperNode.strokeTopWeight = 1;
  explanationItemWrapperNode.strokeBottomWeight = 0;
  explanationItemWrapperNode.strokeLeftWeight = 0;
  explanationItemWrapperNode.strokeRightWeight = 0;

  // Center items to the top
  explanationItemWrapperNode.counterAxisAlignItems = "MIN";

  return explanationItemWrapperNode;
}

/**
 * Creates an explanation item frame for a variable.
 *
 * @param {string} title - The title text for the explanation item.
 * @param {string} description - The description text for the explanation item.
 * @param {FontName} fontName - The font name for the title and description.
 * @param {StyleMode} type - The type of the style (e.g., COLOR, TEXT, EFFECT).
 * @param {RGB[]} [color] - An optional array of RGB color values for the COLOR type.
 * @returns {FrameNode} The frame node representing the explanation item.
 * @throws Will throw an error if the color is required but not provided.
 */
export function createExplanationItemForVariable(
  title: string,
  description: string,
  fontName: FontName,
  type: StyleMode,
  color?: RGBA[]
): FrameNode {
  const baseFontSize = 16;
  const basePadding = 16;

  const titleNode = createTextNode(title, fontName, baseFontSize * 1.25);
  const descriptionNode = createTextNode(
    description == "" ? "(blank)" : description,
    fontName,
    baseFontSize * 0.75,
    [{ type: "SOLID", color: { r: 0.54, g: 0.54, b: 0.54 } }]
  );

  let explanationTextsWrapperNode: FrameNode;

  // 如果type是COLOR，則在titleNode後面加上顏色碼
  if (type === "COLOR") {
    if (!color) {
      throw new Error("Color is required for color type.");
    }

    const hexValues = color.map((color) => rgbToHex(color.r, color.g, color.b));

    const colorHexNode = createTextNode(
      hexValues.join(", "),
      fontName,
      baseFontSize * 0.75,
      [{ type: "SOLID", color: { r: 0.54, g: 0.54, b: 0.54 } }]
    );

    colorHexNode.textCase = "UPPER";

    const titleWrapper = createAutolayoutFrame(
      [titleNode, colorHexNode],
      4,
      "VERTICAL"
    );

    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleWrapper, descriptionNode],
      8,
      "VERTICAL"
    );

    titleWrapper.layoutSizingHorizontal = "FILL";
  } else {
    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleNode, descriptionNode],
      8,
      "VERTICAL"
    );
  }

  titleNode.layoutSizingHorizontal = "FILL";
  descriptionNode.layoutSizingHorizontal = "FILL";

  // const nodesToPushInWrapper: SceneNode[] = [];
  let explanationItemWrapperNode: FrameNode;

  if (type === "COLOR") {
    if (!color) {
      throw new Error("Color is required for color type.");
    }

    const colorFrames: FrameNode[] = [];
    color.forEach((color) => {
      const colorFrame = figma.createFrame();
      colorFrame.resize(64, 64);
      colorFrame.name = "Swatch";
      colorFrame.fills = [
        { type: "SOLID", color: { r: color.r, g: color.g, b: color.b } },
      ];
      colorFrame.cornerRadius = 12;
      colorFrame.opacity = color.a;

      if (isWhite(color)) {
        colorFrame.strokes = [
          { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } },
        ];
        colorFrame.strokeWeight = 1;
      }
      colorFrames.push(colorFrame);
    });

    const item = createAutolayoutFrame(
      [...colorFrames, explanationTextsWrapperNode],
      16,
      "HORIZONTAL"
    );

    explanationItemWrapperNode = item;
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
  } else {
    explanationItemWrapperNode = figma.createFrame();
  }

  explanationItemWrapperNode.name = "Explanation Item";
  explanationItemWrapperNode.clipsContent = false;

  // Set height to hug content
  explanationItemWrapperNode.primaryAxisSizingMode = "AUTO";

  explanationItemWrapperNode.paddingTop = basePadding * 1.5;
  explanationItemWrapperNode.paddingBottom = basePadding * 1.5;
  explanationItemWrapperNode.paddingLeft = basePadding / 2;
  explanationItemWrapperNode.paddingRight = basePadding / 2;

  // Set border properties for top edge only
  explanationItemWrapperNode.strokes = [
    { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } },
  ];
  explanationItemWrapperNode.strokeWeight = 1;
  explanationItemWrapperNode.strokeTopWeight = 1;
  explanationItemWrapperNode.strokeBottomWeight = 0;
  explanationItemWrapperNode.strokeLeftWeight = 0;
  explanationItemWrapperNode.strokeRightWeight = 0;

  // Center items to the top
  explanationItemWrapperNode.counterAxisAlignItems = "MIN";

  return explanationItemWrapperNode;
}

/**
 * Creates an explanation wrapper frame containing a title and a list of explanation items.
 *
 * @param {FrameNode[]} explanationItems - An array of frame nodes representing the explanation items.
 * @param {string} title - The title text for the explanation wrapper.
 * @param {FontName} fontName - The font name for the title and explanation items.
 * @returns {FrameNode} The main frame node containing the title and explanation items.
 * @throws Will throw an error if the explanation items frame or wrapper frame cannot be created.
 */
export function createExplanationWrapper(
  explanationItems: FrameNode[],
  title: string,
  secondaryTitle: string,
  fontName: FontName
): FrameNode {
  const baseFontSize = 16;
  const basePadding = 16;
  const baseSpacing = 8;

  const titleNode = createTextNode(title, fontName, baseFontSize * 2);
  const secondaryTitleNode = createTextNode(
    secondaryTitle,
    fontName,
    baseFontSize,
    [{ type: "SOLID", color: { r: 0.54, g: 0.54, b: 0.54 } }]
  );

  const titleWrapper = createAutolayoutFrame(
    [secondaryTitleNode, titleNode],
    8,
    "VERTICAL"
  );

  const itemsFrame = createAutolayoutFrame(explanationItems, 0, "VERTICAL");
  itemsFrame.name = "Explanation Items Wrapper";
  itemsFrame.clipsContent = false;
  itemsFrame.layoutSizingHorizontal = "HUG";
  itemsFrame.layoutSizingVertical = "HUG";
  itemsFrame.primaryAxisSizingMode = "AUTO";
  itemsFrame.counterAxisSizingMode = "AUTO";
  itemsFrame.layoutAlign = "STRETCH";

  // Create the main auto-layout frame to contain the title and items frame
  const wrapperFrame = createAutolayoutFrame(
    [titleWrapper, itemsFrame],
    baseSpacing * 4,
    "VERTICAL"
  );

  titleWrapper.layoutSizingHorizontal = "FILL";

  // Set padding for the main frame
  wrapperFrame.paddingTop = basePadding * 2;
  wrapperFrame.paddingBottom = basePadding * 2;
  wrapperFrame.paddingLeft = basePadding * 2;
  wrapperFrame.paddingRight = basePadding * 2;

  wrapperFrame.primaryAxisSizingMode = "AUTO"; // This makes the height hug the content
  wrapperFrame.counterAxisSizingMode = "FIXED"; // This ensures the width is fixed

  // Set the fixed width and initial height
  wrapperFrame.resize(640, wrapperFrame.height);

  // Ensure explanation items fill the container width
  explanationItems.forEach((item) => {
    item.layoutSizingHorizontal = "FILL";
  });

  return wrapperFrame;
}

export function createExplanationWrapperForVariable(
  explanationItems: FrameNode[],
  title: string,
  secondaryTitle: string,
  modes: string[],
  fontName: FontName
): FrameNode {
  const baseFontSize = 16;
  const basePadding = 16;
  const baseSpacing = 8;

  const titleNode = createTextNode(title, fontName, baseFontSize * 2);
  const secondaryTitleNode = createTextNode(
    secondaryTitle,
    fontName,
    baseFontSize,
    [{ type: "SOLID", color: { r: 0.54, g: 0.54, b: 0.54 } }]
  );

  const modesText =
    modes.length === 1 ? `Mode: [${modes[0]}]` : `Modes: [${modes.join(", ")}]`;

  const modesNode = createTextNode(modesText, fontName, baseFontSize);

  const titleWrapper = createAutolayoutFrame(
    [secondaryTitleNode, titleNode, modesNode],
    8,
    "VERTICAL"
  );

  const itemsFrame = createAutolayoutFrame(explanationItems, 0, "VERTICAL");
  itemsFrame.clipsContent = false;
  itemsFrame.layoutSizingHorizontal = "HUG";
  itemsFrame.layoutSizingVertical = "HUG";
  itemsFrame.primaryAxisSizingMode = "AUTO";
  itemsFrame.counterAxisSizingMode = "AUTO";
  itemsFrame.layoutAlign = "STRETCH";

  // Create the main auto-layout frame to contain the title and items frame
  const wrapperFrame = createAutolayoutFrame(
    [titleWrapper, itemsFrame],
    baseSpacing * 4,
    "VERTICAL"
  );

  titleWrapper.layoutSizingHorizontal = "FILL";

  // Set padding for the main frame
  wrapperFrame.paddingTop = basePadding * 2;
  wrapperFrame.paddingBottom = basePadding * 2;
  wrapperFrame.paddingLeft = basePadding * 2;
  wrapperFrame.paddingRight = basePadding * 2;

  wrapperFrame.primaryAxisSizingMode = "AUTO"; // This makes the height hug the content
  wrapperFrame.counterAxisSizingMode = "FIXED"; // This ensures the width is fixed

  // Set the fixed width and initial height
  wrapperFrame.resize(640, wrapperFrame.height);

  // Ensure explanation items fill the container width
  explanationItems.forEach((item) => {
    item.layoutSizingHorizontal = "FILL";
  });

  return wrapperFrame;
}

// export function isColorCollection(
//   collection: CollectionExplanationable
// ): collection is ColorCollection {
//   return (collection as ColorCollection).members[0]?.color !== undefined;
// }

export function createExplanationTextPropertyItem(
  title: string,
  value: string,
  fontName: FontName
) {
  const titleNode = createTextNode(title, fontName, 12);
  titleNode.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  titleNode.lineHeight = { unit: "PIXELS", value: 12 * 1.5 };

  const valueNode = createTextNode(value, fontName, 12);
  valueNode.fills = [{ type: "SOLID", color: { r: 0.54, g: 0.54, b: 0.54 } }];
  valueNode.lineHeight = { unit: "PIXELS", value: 12 * 1.5 };
  valueNode.textAlignHorizontal = "RIGHT";

  const wrapper = createAutolayoutFrame(
    [titleNode, valueNode],
    0,
    "HORIZONTAL"
  );
  wrapper.name = "Text Property Item";
  wrapper.layoutGrow = 1;
  wrapper.paddingTop = 4;
  wrapper.paddingBottom = 4;

  // 筆畫
  wrapper.strokes = [{ type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } }];
  wrapper.strokeTopWeight = 0;
  wrapper.strokeBottomWeight = 1;
  wrapper.strokeLeftWeight = 0;
  wrapper.strokeRightWeight = 0;

  // Autolayout 內元素排版
  titleNode.layoutSizingHorizontal = "FILL";
  valueNode.layoutSizingHorizontal = "FILL";

  return wrapper;
}

/**
 * Creates a new auto-layout frame and adds the specified layers to it.
 *
 * @param {SceneNode[]} layers - The layers to be added to the auto-layout frame.
 * @param {number} spacing - The spacing between the layers in the auto-layout frame.
 * @param {"NONE" | "HORIZONTAL" | "VERTICAL"} mode - The layout mode for the auto-layout frame.
 * @returns {FrameNode} The created auto-layout frame containing the specified layers.
 */
export function createAutolayoutFrame(
  layers: SceneNode[],
  spacing: number,
  mode: "NONE" | "HORIZONTAL" | "VERTICAL"
): FrameNode {
  // Create a new frame with autolayout
  const autolayoutFrame = figma.createFrame();

  // Set the autolayout properties
  autolayoutFrame.layoutMode = mode;
  autolayoutFrame.itemSpacing = spacing;

  // Add the selected layers to the autolayout frame
  layers.forEach((layer) => {
    autolayoutFrame.appendChild(layer);
  });

  // Ensure no fill is applied to the autolayout frame
  autolayoutFrame.fills = [];

  return autolayoutFrame;
}

/**
 * Checks if the given RGB color is white.
 *
 * @param {RGB} color - The RGB color to check.
 * @returns {boolean} True if the color is white, false otherwise.
 */
export function isWhite(color: RGB): boolean {
  return color.r === 1 && color.g === 1 && color.b === 1;
}

/**
 * Creates a new text node with the specified properties.
 *
 * @param {string} text - The text content for the text node.
 * @param {FontName} fontName - The font name to be applied to the text node.
 * @param {number} fontSize - The font size to be applied to the text node.
 * @param {Paint[]} paint - The paint (color) to be applied to the text node.
 * @param {LineHeight} lineHeight - The line height to be applied to the text node.
 * @returns {TextNode} The created text node with the specified properties.
 */
export function createTextNode(
  text: string,
  fontName: FontName,
  fontSize: number,
  paint?: Paint[],
  lineHeight?: LineHeight
): TextNode {
  const textNode = figma.createText();
  textNode.characters = text;
  textNode.fontSize = fontSize;
  textNode.fontName = fontName;
  if (paint) {
    textNode.fills = paint;
  }
  if (lineHeight) {
    textNode.lineHeight = lineHeight;
  }
  return textNode;
}
