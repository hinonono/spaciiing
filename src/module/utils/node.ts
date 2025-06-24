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