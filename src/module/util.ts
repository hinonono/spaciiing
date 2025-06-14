import {
  CollectionExplanationable,
  ColorCollection,
  NumberCollection,
} from "../types/ColorCollection";
import { EditorPreference } from "../types/EditorPreference";
import { ExternalMessageUpdateEditorPreference } from "../types/Messages/MessageEditorPreference";
import { Module } from "../types/Module";
import { ResizableNode } from "../types/NodeResizable";
import { semanticTokens } from "./tokens";
import loremText from "../assets/loremText.json";
import { CornerRadiusNode } from "../types/NodeCornerRadius";
import { SingleCornerRadiusNode } from "../types/NodeSingleCornerRadius";
import { EditorType } from "../types/EditorType";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { Coordinates, Direction } from "../types/General";
import { CYStrokeCap } from "../types/CYStroke";

const isDevelopment = process.env.REACT_APP_ENV === "development";

// 取代原有的 fundamental-module.ts
export function deepClone(val: unknown) {
  return JSON.parse(JSON.stringify(val));
}

export function sendMessageBack(message: object) {
  // console.log("Message sent back");
  // console.log(message);
  figma.ui.postMessage({
    pluginMessage: message,
  });
}

/**
 * Saves the editor preference to the current page's plugin data.
 *
 * @param {EditorPreference} editorPreference - The editor preference to save.
 * @param {Module} [source] - Optional source of the call, used for logging purposes.
 */
export function saveEditorPreference(
  editorPreference: EditorPreference,
  source?: Module
) {
  figma.root.setPluginData(
    "editor-preference",
    JSON.stringify(editorPreference)
  );
  console.log(
    `😍使用者偏好已儲存，呼叫自${source !== undefined ? String(source) : "未知"
    }`, editorPreference
  );
}

function createEditorPreference(): EditorPreference {
  const createdEditorPreference: EditorPreference = {
    magicObjects: {
      noteId: "",
      tagId: "",
      sectionId: "",
    },
    lorem: loremText.en,
    iconFrame: {
      innerFrame: 20,
      outerFrame: 24,
    },
    strokeStyles: []
  };

  return createdEditorPreference;
}

/**
 * Reads the editor preference from the root plugin data.
 *
 * @returns {EditorPreference} The decoded editor preference if it exists, otherwise a new empty EditorPreference object.
 */
export function readEditorPreference(): EditorPreference {
  const editorPreference = figma.root.getPluginData("editor-preference");

  if (!editorPreference) {
    // 當之前未建立過Preference物件時，新建一個
    const createdEditorPreference: EditorPreference = createEditorPreference();

    saveEditorPreference(createdEditorPreference);

    return createdEditorPreference;
  } else {
    // 當之前已建立過Preference物件時，進行解碼
    const decodedEditorPreference = JSON.parse(
      editorPreference
    ) as EditorPreference;

    // Merge with default preferences to ensure all properties are present
    const defaultEditorPreference = createEditorPreference();
    const mergedEditorPreference = {
      ...defaultEditorPreference,
      ...decodedEditorPreference,
    };

    return mergedEditorPreference;
  }
}

/**
 * Updates the editor preference by sending the updated preference back as a message.
 *
 * @param {EditorPreference} editorPreference - The updated editor preference to send.
 * @param {Module} [source] - Optional source of the call, used for logging purposes.
 */
export function updateEditorPreference(
  editorPreference: EditorPreference,
  source?: Module
) {
  const message: ExternalMessageUpdateEditorPreference = {
    editorPreference: editorPreference,
    module: "PluginSetting",
    mode: "UpdateEditorPreference",
    phase: "Init",
  };
  sendMessageBack(message);
  console.log(
    `😍使用者偏好已更新至前端，呼叫自${source !== undefined ? String(source) : "未知"
    }`, editorPreference
  );
}

export function updateEditorType(editorType: EditorType) {
  const message: ExternalMessage = {
    module: "Init",
    direction: "Outer",
    phase: "Actual",
    editorType: editorType,
  };
  sendMessageBack(message);
}

export function updateTriggeredCommand() {
  const message: ExternalMessage = {
    module: "Init",
    direction: "Outer",
    phase: "Actual",
    triggeredCommand: figma.command
  };
  sendMessageBack(message);
  console.log(figma.command);

}

export function isColorCollection(
  collection: CollectionExplanationable
): collection is ColorCollection {
  return (collection as ColorCollection).members[0]?.color !== undefined;
}

export function isNumberCollection(
  collection: CollectionExplanationable
): collection is NumberCollection {
  return (collection as NumberCollection).members[0]?.value !== undefined;
}

export function setStroke(
  node: FrameNode,
  color: RGB,
  weight: { top: number; bottom: number; left: number; right: number }
) {
  node.strokes = [{ type: "SOLID", color: color }];
  node.strokeWeight = weight.top;
  node.strokeTopWeight = weight.top;
  node.strokeBottomWeight = weight.bottom;
  node.strokeLeftWeight = weight.left;
  node.strokeRightWeight = weight.right;
}

export function setPadding(
  node: FrameNode,
  padding: { top: number; bottom: number; left: number; right: number }
) {
  node.paddingTop = padding.top;
  node.paddingBottom = padding.bottom;
  node.paddingLeft = padding.left;
  node.paddingRight = padding.right;
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
    return `#${hexR}${hexG}${hexB}`.toUpperCase();
  } else {
    // Concatenate the hex components and prepend a '#'
    return `${hexR}${hexG}${hexB}`.toUpperCase();
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

/**
 * Formats the current date and time into a specified format.
 *
 * @export
 * @function getFormattedDate
 * @param {("shortDate" | "fullDateTime")} format - Specifies the date format:
 *   - "shortDate": Returns the date in "DD/MM" format.
 *   - "fullDateTime": Returns the full date and time in "DD/MM/YYYY HOUR:MINUTE:SECOND" format.
 * @returns {string} A formatted date string in the specified format.
 *
 * @throws {Error} If the provided format is unsupported.
 */
export function getFormattedDate(
  format: "shortDate" | "fullDateTime",
  preferredStyle: "western" | "eastern"
): string {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  if (format === "shortDate") {
    return preferredStyle === "western" ? `${day}/${month}` : `${month}/${day}`;
  } else if (format === "fullDateTime") {
    return preferredStyle === "western" ? `${day}/${month}/${year} ${hours}:${minutes}:${seconds}` : `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  } else {
    throw new Error("Unsupported format");
  }
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
  } else {
    textNode.fills = [{ type: "SOLID", color: semanticTokens.text.primary }];
  }
  if (lineHeight) {
    textNode.lineHeight = lineHeight;
  }
  return textNode;
}

/**
 * Formats a number to two decimal places if it has decimals;
 * otherwise, returns the number as a string without any decimal places.
 *
 * @param {number} value - The number to format.
 * @returns {string} - The formatted number as a string. If the number is an integer,
 * it is returned without any decimal places. If it has decimals, it is formatted to two decimal places.
 */
export function formatNumberToDecimals(
  value: number,
  decimal: number = 0
): string {
  if (Math.floor(value) === value) {
    return value.toString(); // If the value is an integer, return it as is
  } else {
    return value.toFixed(decimal); // If the value has decimals, format to 2 decimal places
  }
}

export function isNodeSupportSingleCornerRadius(
  node: SceneNode
): node is SingleCornerRadiusNode {
  return (
    node.type === "COMPONENT" ||
    node.type === "COMPONENT_SET" ||
    node.type === "FRAME" ||
    node.type === "INSTANCE" ||
    node.type === "RECTANGLE"
  );
}

export function isNodeSupportCornerRadius(
  node: SceneNode
): node is CornerRadiusNode {
  return (
    node.type === "BOOLEAN_OPERATION" ||
    node.type === "COMPONENT" ||
    node.type === "COMPONENT_SET" ||
    node.type === "FRAME" ||
    node.type === "INSTANCE" ||
    node.type === "RECTANGLE" ||
    node.type === "STAR" ||
    node.type === "VECTOR"
  );
}


export function removeDuplicateCoordinatesFromPath(path: Coordinates[]) {
  // Remove consecutive duplicate coordinates
  const uniquePath = path.filter((coord, index, arr) =>
    index === 0 || coord.x !== arr[index - 1].x || coord.y !== arr[index - 1].y
  );
  return uniquePath;
}

export function calcMidpoint(path: Coordinates[]): Coordinates {

  if (path.length === 0) {
    throw new Error("Path cannot be empty");
  }

  const midIndex = Math.floor(path.length / 2);

  if (path.length % 2 === 1) {
    // Odd number of points, return the middle one
    return path[midIndex];
  } else {
    // Even number of points, calculate the midpoint between two middle points
    const point1 = path[midIndex - 1];
    const point2 = path[midIndex];
    return {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
    };
  }
}

// The .sort() function in JavaScript/TypeScript uses a comparison function that returns:
// 	•	A negative value (< 0) if a should be placed before b.
// 	•	A positive value (> 0) if a should be placed after b.
// 	•	Zero (0) if their order remains the same.

// So, using a.x - b.x:
// 	•	If a.x is less than b.x, it returns negative, meaning a comes before b.
// 	•	If a.x is greater than b.x, it returns positive, meaning b comes before a.
/**
 * 排序傳入的圖層。
 * @param direction - Horizonal代表由左至右、由上而下排列；Vertical代表由上至下、由左至右排列
 * @param selection 
 * @returns 
 */
export function sortSelectionBasedOnXAndY(direction: Direction, selection: SceneNode[]): SceneNode[] {
  return selection.sort((a, b) => {
    if (!a.absoluteBoundingBox || !b.absoluteBoundingBox) {
      throw new Error("Absolute bounding box is required for sorting.");
    }

    const aX = a.absoluteBoundingBox.x;
    const aY = a.absoluteBoundingBox.y;
    const bX = b.absoluteBoundingBox.x;
    const bY = b.absoluteBoundingBox.y;

    if (direction === "horizontal") {
      return aX === bX ? aY - bY : aX - bX;
    } else {
      return aY === bY ? aX - bX : aY - bY;
    }
  });
}

/**
 * Get alphapet for nubering purpose.
 * @param index 
 * @param uppercase 
 * @returns 
 */
export function getAlphabet(index: number, uppercase: boolean): string {
  const base = 'a'.charCodeAt(0);
  let result = '';
  index += 0; // Always start from 0 for alphabetic sequences
  while (index >= 0) {
    result = String.fromCharCode(base + (index % 26)) + result;
    index = Math.floor(index / 26) - 1;
  }
  return uppercase ? result.toUpperCase() : result;
}

export function getHanziNumber(index: number, digitMap: string[], unitMap: string[], options?: { omitLeadingOneAtTen?: boolean }): string {
  const number = index + 1;
  const digits = number.toString().split("").reverse();
  let result = "";

  for (let i = digits.length - 1; i >= 0; i--) {
    const digit = parseInt(digits[i]);
    const isMostSignificant = i === digits.length - 1;
    const isTensPlace = i === 1;

    // Omit leading "壹" for "拾" when number is exactly 10~19
    const omitOne = options?.omitLeadingOneAtTen === true &&
      isMostSignificant &&
      isTensPlace &&
      digit === 1;

    if (digit === 0) continue;
    result += (omitOne ? "" : digitMap[digit]) + (unitMap[i] || "");
  }

  return result;
}

export function getComplexHanziNumber(index: number): string {
  const complexDigits = ["", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
  const complexUnits = ["", "拾", "佰", "仟", "萬"];
  return getHanziNumber(index, complexDigits, complexUnits, { omitLeadingOneAtTen: true });
}

export function getSimpleHanziNumber(index: number): string {
  const simpleDigits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const simpleUnits = ["", "十", "百", "千", "萬"];
  return getHanziNumber(index, simpleDigits, simpleUnits, { omitLeadingOneAtTen: true });
}

/**
 * 繞過Figma Plugin API限制的Func，用於設置單邊筆畫端點樣式
 * @param node 
 * @param startPointCap 
 * @param endPointCap 
 */
export async function setStrokeCap(
  node: VectorNode,
  vectorNetwork: VectorNetwork,
  startPointCap: CYStrokeCap,
  endPointCap: CYStrokeCap
) {
  // 一定要先設定在物件身上一次（這是Figma Plugin API的限制）
  await node.setVectorNetworkAsync(vectorNetwork);
  node.strokeCap = "NONE";

  // 接著用JSON格式進行修改再放回去
  let copy = JSON.parse(JSON.stringify(node.vectorNetwork))
  if ("strokeCap" in copy.vertices[copy.vertices.length - 1]) {


    copy.vertices[0].strokeCap = startPointCap
    copy.vertices[copy.vertices.length - 1].strokeCap = endPointCap
  }
  await node.setVectorNetworkAsync(copy)
}

export async function ensureFontIsLoaded(textNode: TextNode) {
  const fontName = textNode.fontName as FontName;
  await figma.loadFontAsync(fontName);
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Figma API不認得BoundVariables但它自己又有傳，所以把它去掉
 * @param effect 
 * @returns 
 */
export function stripBoundVariables(effect: Effect): Effect {
  // Make a shallow copy of the effect
  const { boundVariables, ...cleanEffect } = effect as any;
  return cleanEffect as Effect;
}