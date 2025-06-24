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

import { utils } from "./utils";

const isDevelopment = process.env.REACT_APP_ENV === "development";

// 取代原有的 fundamental-module.ts
export function deepClone(val: unknown) {
  return JSON.parse(JSON.stringify(val));
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

export function incrementSavedClicks(incrementBy: number) {
  const ep = utils.data.readEditorPreference()
  const newEp: EditorPreference = { ...ep, savedClicks: ep.savedClicks + incrementBy };

  utils.data.saveEditorPreference(newEp, "General")
  utils.data.updateEditorPreference(newEp);
}