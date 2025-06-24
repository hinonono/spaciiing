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