import { Direction } from "../../types/General";
import { ResizableNode } from "../../types/NodeResizable";

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

export async function loadFontOnTextNode(textNode: TextNode) {
    const fontName = textNode.fontName as FontName;
    await figma.loadFontAsync(fontName);
}

export async function loadFont(family: string, styles: string[]) {
    const fontsToLoad: FontName[] = styles.map((style) => ({
        family,
        style,
    }));

    await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));
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