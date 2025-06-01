import { ConnectPointPosition, RectangleSegmentMap, RectangleSegmentType, SegmentConnectionData, SegmentConnectionGroup } from "../../types/ArrowCreator";
import { CYStroke } from "../../types/CYStroke";
import { Coordinates, Direction } from "../../types/General";
import { MessageArrowCreator } from "../../types/Messages/MessageArrowCreator";
import * as util from "../util";
import * as rh from "./routeHorizontal"
import * as rv from "./routeVertical";
import { semanticTokens } from "../tokens";

export function reception(message: MessageArrowCreator) {
    const selection = util.getCurrentSelection();

    // Check if there are any nodes selected
    if (selection.length === 0) {
        figma.notify("No nodes selected.");
        return;
    } else if (selection.length === 1) {
        figma.notify("Please select at least two objects.");
        return;
    }

    const sortedSelction = util.sortSelectionBasedOnXAndY(message.layoutDirection, selection)

    for (let i = 0; i < sortedSelction.length - 1; i++) {
        const sourceItem = sortedSelction[i];
        const targetItem = sortedSelction[i + 1]

        // calculateRouteELK(sourceItem, targetItem, message.stroke)
        determineRoute(
            message.layoutDirection,
            sourceItem,
            message.connectPointPositionPair.source,
            targetItem,
            message.connectPointPositionPair.target,
            message.safeMargin,
            message.stroke,
            message.createAnnotationBox
        )
    }

    for (const item of sortedSelction) {
        item.setRelaunchData({ drawArrows: '' });
    }
}



/**
 * Calculates the positions of various connection points on a rectangular layer,
 * both with and without a specified margin.
 *
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {number} margin - The margin to apply around the rectangle for the "withMargin" points.
 * @returns {ConnectPointAxis} An object containing two sets of connection points:
 *   - `actual`: The connection points without any margin.
 *   - `withMargin`: The connection points adjusted by the specified margin.
 */
function calcNodeSegments(x: number, y: number, width: number, height: number, hMargin: number, vMargin: number, offset: number): SegmentConnectionData {
    const actual: RectangleSegmentMap = {
        [RectangleSegmentType.TopLeft]: { x: x - offset, y: y - offset },
        [RectangleSegmentType.TopCenter]: { x: x + width / 2, y: y - offset },
        [RectangleSegmentType.TopRight]: { x: x + width + offset, y: y - offset },
        [RectangleSegmentType.MiddleLeft]: { x: x - offset, y: y + height / 2 },
        [RectangleSegmentType.MiddleCenter]: { x: x + width / 2, y: y + height / 2 },
        [RectangleSegmentType.MiddleRight]: { x: x + width + offset, y: y + height / 2 },
        [RectangleSegmentType.BottomLeft]: { x: x - offset, y: y + height + offset },
        [RectangleSegmentType.BottomCenter]: { x: x + width / 2, y: y + height + offset },
        [RectangleSegmentType.BottomRight]: { x: x + width + offset, y: y + height + offset },
    };
    const withMargin: RectangleSegmentMap = {
        [RectangleSegmentType.TopLeft]: { x: x - hMargin, y: y - vMargin },
        [RectangleSegmentType.TopCenter]: { x: x + width / 2, y: y - vMargin },
        [RectangleSegmentType.TopRight]: { x: x + width + hMargin, y: y - vMargin },
        [RectangleSegmentType.MiddleLeft]: { x: x - hMargin, y: y + height / 2 },
        [RectangleSegmentType.MiddleCenter]: { x: x + width / 2, y: y + height / 2 },
        [RectangleSegmentType.MiddleRight]: { x: x + width + hMargin, y: y + height / 2 },
        [RectangleSegmentType.BottomLeft]: { x: x - hMargin, y: y + height + vMargin },
        [RectangleSegmentType.BottomCenter]: { x: x + width / 2, y: y + height + vMargin },
        [RectangleSegmentType.BottomRight]: { x: x + width + hMargin, y: y + height + vMargin },
    };
    return { actual, withMargin };
}

function calcNodeGap(sourceNode: SceneNode, targetNode: SceneNode): { horizontal: number, vertical: number } {
    if (!sourceNode.absoluteBoundingBox || !targetNode.absoluteBoundingBox) {
        throw new Error("Absolute bounding box is required to calculate node gap.")
    }

    let hGap: number, vGap: number;

    const rightOfSourceNode = sourceNode.absoluteBoundingBox.x + sourceNode.width;
    const rightOfTargetNode = targetNode.absoluteBoundingBox.x + targetNode.width;

    const bottomOfSourceNode = sourceNode.absoluteBoundingBox.y + sourceNode.height;
    const bottomOfTargetNode = targetNode.absoluteBoundingBox.y + targetNode.height;

    // Calculate vertical gap
    if (targetNode.absoluteBoundingBox.y >= bottomOfSourceNode) {
        vGap = targetNode.absoluteBoundingBox.y - bottomOfSourceNode; // target is below
    } else if (sourceNode.absoluteBoundingBox.y >= bottomOfTargetNode) {
        vGap = sourceNode.absoluteBoundingBox.y - bottomOfTargetNode; // target is above
    } else {
        vGap = 0; // overlapping vertically
    }

    // Calculate horizontal gap
    if (targetNode.absoluteBoundingBox.x >= rightOfSourceNode) {
        hGap = targetNode.absoluteBoundingBox.x - rightOfSourceNode; // target is to the right
    } else if (sourceNode.absoluteBoundingBox.x >= rightOfTargetNode) {
        hGap = sourceNode.absoluteBoundingBox.x - rightOfTargetNode; // target is to the left
    } else {
        hGap = 0; // overlapping horizontally
    }

    return {
        horizontal: hGap,
        vertical: vGap
    };
}

function createSegmentConnectionGroup(
    mode: Direction,
    source: SegmentConnectionData,
    target: SegmentConnectionData
): SegmentConnectionGroup {
    if (mode === "horizontal") {
        return {
            source: source,
            target: target,
            betweenItemTopCenter: {
                x: source.withMargin[RectangleSegmentType.TopRight].x,
                y: Math.min(source.withMargin[RectangleSegmentType.TopRight].y, target.withMargin[RectangleSegmentType.TopLeft].y)
            },
            betweenItemBottomCenter: {
                x: source.withMargin[RectangleSegmentType.TopRight].x,
                y: Math.max(source.withMargin[RectangleSegmentType.BottomRight].y, target.withMargin[RectangleSegmentType.BottomLeft].y)
            }
        }
    } else {
        return {
            source: source,
            target: target,
            betweenItemMiddleLeft: {
                x: Math.min(source.withMargin[RectangleSegmentType.BottomLeft].x, target.withMargin[RectangleSegmentType.TopLeft].x),
                y: source.withMargin[RectangleSegmentType.BottomLeft].y
            },
            betweenItemMiddleRight: {
                x: Math.max(source.withMargin[RectangleSegmentType.BottomRight].x, target.withMargin[RectangleSegmentType.TopRight].x),
                y: source.withMargin[RectangleSegmentType.BottomLeft].y
            },
        }
    }
}

async function createPolyline(points: Coordinates[], strokeStyle: CYStroke) {
    if (points.length < 2) {
        throw new Error("A polyline requires at least two points.");
    }
    const vector = figma.createVector();
    figma.currentPage.appendChild(vector);

    const vertices = points.map((point) => ({
        x: point.x,
        y: point.y,
    }));

    const segments = points.slice(1).map((_, i) => ({
        start: i,
        end: i + 1,
    }));

    const vectorNetwork = {
        vertices,
        segments,
        regions: [], // No enclosed region, just a line
    };

    await vector.setVectorNetworkAsync(vectorNetwork);

    const strokeColor = util.hexToRgb(strokeStyle.color);
    // Apply stroke style
    vector.strokes = [{ type: "SOLID", color: strokeColor, opacity: strokeStyle.opacity }];
    if (strokeStyle.dashAndGap) {
        vector.dashPattern = strokeStyle.dashAndGap
    }
    vector.strokeWeight = strokeStyle.strokeWeight;
    vector.name = "Arrow Vector"
    vector.cornerRadius = strokeStyle.cornerRadius
    vector.strokeCap = "NONE"


    // Workaround for buggy figma plugin api
    // 由於Figma不允許直接對單側Stroke Cap進行修改，所以先將它化為純文字然後改變它
    /* make a copy of the original node */
    let copy = JSON.parse(JSON.stringify(vector.vectorNetwork))
    if ("strokeCap" in copy.vertices[copy.vertices.length - 1]) {
        copy.vertices[0].strokeCap = strokeStyle.startPointCap
        copy.vertices[copy.vertices.length - 1].strokeCap = strokeStyle.endPointCap
    }
    await vector.setVectorNetworkAsync(copy)

    return vector
}

async function determineRoute(
    direction: Direction,
    sourceNode: SceneNode,
    sourceItemConnectPoint: ConnectPointPosition,
    targetNode: SceneNode,
    targetItemConnectPoint: ConnectPointPosition,
    offset: number,
    strokeStyle: CYStroke,
    createAnnotationBool: boolean
) {
    const gap = calcNodeGap(sourceNode, targetNode);
    const finalDecidedGap = {
        horizontal: gap.horizontal === 0 ? gap.vertical / 2 : gap.horizontal / 2,
        vertical: gap.vertical === 0 ? gap.horizontal / 2 : gap.vertical / 2
    }

    console.log("final gap", finalDecidedGap);


    if (!sourceNode.absoluteBoundingBox || !targetNode.absoluteBoundingBox) {
        throw new Error("Absolute bounding box is required to determine route.")
    }

    const sourceNodeConnectionData = calcNodeSegments(sourceNode.absoluteBoundingBox.x, sourceNode.absoluteBoundingBox.y, sourceNode.absoluteBoundingBox.width, sourceNode.absoluteBoundingBox.height, finalDecidedGap.horizontal, finalDecidedGap.vertical, offset)
    const targetNodeConnectionData = calcNodeSegments(targetNode.absoluteBoundingBox.x, targetNode.absoluteBoundingBox.y, targetNode.absoluteBoundingBox.width, targetNode.absoluteBoundingBox.height, finalDecidedGap.horizontal, finalDecidedGap.vertical, offset)
    const group = createSegmentConnectionGroup(direction, sourceNodeConnectionData, targetNodeConnectionData)

    let route: Coordinates[] = [];

    if (direction === "horizontal") {
        if (sourceItemConnectPoint === RectangleSegmentType.TopCenter) {
            route = rh.determineRouteFromTopCenter(targetItemConnectPoint, group);
        } else if (sourceItemConnectPoint === RectangleSegmentType.BottomCenter) {
            route = rh.determineRouteFromBottomCenter(targetItemConnectPoint, group);
        } else if (sourceItemConnectPoint === RectangleSegmentType.MiddleLeft) {
            route = rh.determineRouteFromMiddleLeft(targetItemConnectPoint, group);
        } else if (sourceItemConnectPoint === RectangleSegmentType.MiddleRight) {
            route = rh.determineRouteFromMiddleRight(targetItemConnectPoint, group);
        } else {
            throw new Error("Unable to determine route from source item connect point.")
        }
    } else {
        if (sourceItemConnectPoint === RectangleSegmentType.TopCenter) {
            route = rv.determineRouteFromTopCenter(targetItemConnectPoint, group);
        } else if (sourceItemConnectPoint === RectangleSegmentType.BottomCenter) {
            route = rv.determineRouteFromBottomCenter(targetItemConnectPoint, group);
        } else if (sourceItemConnectPoint === RectangleSegmentType.MiddleLeft) {
            route = rv.determineRouteFromMiddleLeft(targetItemConnectPoint, group);
        } else if (sourceItemConnectPoint === RectangleSegmentType.MiddleRight) {
            route = rv.determineRouteFromMiddleRight(targetItemConnectPoint, group);
        } else {
            throw new Error("Unable to determine route from source item connect point.")
        }
    }

    let line: VectorNode;

    if (route.length !== 0) {
        line = await createPolyline(route, strokeStyle)

        if (createAnnotationBool === false) {
            const arrowGroup = figma.group([line], figma.currentPage);
            arrowGroup.name = "Arrow"
        }
    } else {
        throw new Error("Unable to draw path because route is undefined.")
    }

    if (createAnnotationBool) {
        const midPoint = util.calcMidpoint(route)
        const annotationNode = await createAnnotation(midPoint, strokeStyle);

        const arrowGroup = figma.group([line, annotationNode], figma.currentPage);
        arrowGroup.name = "Arrow"
    }
}

async function createAnnotation(position: Coordinates, strokeStlye: CYStroke) {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    const annotationNodeSize = {
        width: strokeStlye.strokeWeight * 30,
        height: strokeStlye.strokeWeight * 8,
        fontSize: strokeStlye.strokeWeight * 3,
    }

    const annotation = util.createTextNode(
        "Sample Text",
        { family: "Inter", style: "Semi Bold" },
        annotationNodeSize.fontSize
    );

    annotation.textAlignHorizontal = "CENTER";
    annotation.textAlignVertical = "CENTER";
    annotation.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

    const backgroundColor = util.hexToRgb(strokeStlye.color);

    const annotationNode = util.createAutolayoutFrame(
        [annotation],
        8,
        "HORIZONTAL"
    )



    annotationNode.layoutAlign = "CENTER";
    annotationNode.primaryAxisAlignItems = "CENTER";
    annotationNode.counterAxisAlignItems = "CENTER";

    annotationNode.layoutSizingVertical = "FIXED"
    annotationNode.layoutSizingHorizontal = "FIXED"

    annotationNode.fills = [{ type: "SOLID", color: backgroundColor }];

    annotationNode.resize(annotationNodeSize.width, annotationNodeSize.height)
    annotationNode.name = "Annotation"

    annotationNode.x = position.x - (annotationNodeSize.width / 2)
    annotationNode.y = position.y - (annotationNodeSize.height / 2)
    annotationNode.cornerRadius = semanticTokens.cornerRadius.infinite;

    return annotationNode
}