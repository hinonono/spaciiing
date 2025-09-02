import { CYStrokeCap } from "../../types/CYStroke";
import { semanticTokens } from "../tokens";

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

export function hasImageFill(node: RectangleNode): boolean {
    return (
        Array.isArray(node.fills) &&
        node.fills.some((fill) => fill.type === "IMAGE")
    );
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

export function deepClone(val: unknown) {
    return JSON.parse(JSON.stringify(val));
}