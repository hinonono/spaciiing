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