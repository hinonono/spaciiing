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