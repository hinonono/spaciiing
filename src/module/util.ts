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
