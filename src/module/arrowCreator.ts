import { ConnectPointPosition, RectangleSegmentMap, RectangleSegmentType, SegmentConnectionData, SegmentConnectionGroup } from "../types/ArrowCreator";
import { CYStroke } from "../types/CYStroke";
import { Coordinates } from "../types/General";
import { MessageArrowCreator } from "../types/Messages/MessageArrowCreator";
import * as util from "./util";


export function reception(message: MessageArrowCreator) {
    console.log("🅾️Recepted from module Arrow Creator");
    console.log(message);


    const selection = util.getCurrentSelection();

    // Check if there are any nodes selected
    if (selection.length === 0) {
        figma.notify("No nodes selected.");
        return;
    } else if (selection.length === 1) {
        figma.notify("Please select at least two objects.");
        return;
    }

    for (let i = 0; i < selection.length - 1; i++) {
        const sourceItem = selection[i];
        const targetItem = selection[i + 1]

        // calculateRouteELK(sourceItem, targetItem, message.stroke)
        determineRoute(
            sourceItem,
            message.connectPointPositionPair.source,
            targetItem,
            message.connectPointPositionPair.target,
            message.safeMargin,
            message.stroke
        )

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
function calcNodeSegments(x: number, y: number, width: number, height: number, margin: number, offset: number): SegmentConnectionData {
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
        [RectangleSegmentType.TopLeft]: { x: x - margin, y: y - margin },
        [RectangleSegmentType.TopCenter]: { x: x + width / 2, y: y - margin },
        [RectangleSegmentType.TopRight]: { x: x + width + margin, y: y - margin },
        [RectangleSegmentType.MiddleLeft]: { x: x - margin, y: y + height / 2 },
        [RectangleSegmentType.MiddleCenter]: { x: x + width / 2, y: y + height / 2 },
        [RectangleSegmentType.MiddleRight]: { x: x + width + margin, y: y + height / 2 },
        [RectangleSegmentType.BottomLeft]: { x: x - margin, y: y + height + margin },
        [RectangleSegmentType.BottomCenter]: { x: x + width / 2, y: y + height + margin },
        [RectangleSegmentType.BottomRight]: { x: x + width + margin, y: y + height + margin },
    };
    return { actual, withMargin };
}

function calcNodeGap(mode: "horizontal" | "vertical", sourceNode: SceneNode, targetNode: SceneNode): number {
    if (mode === "horizontal") {
        const number = targetNode.x - (sourceNode.x + sourceNode.width)
        return number
    } else {
        const number = targetNode.y - (sourceNode.y + sourceNode.height)
        return number;
    }
}

function createSegmentConnectionGroup(
    mode: "horizontal" | "vertical",
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
    vector.name = "Arrow"
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
}



function determineRoute(
    sourceNode: SceneNode,
    sourceItemConnectPoint: ConnectPointPosition,
    targetNode: SceneNode,
    targetItemConnectPoint: ConnectPointPosition,
    offset: number,
    strokeStyle: CYStroke,
) {
    const gap = calcNodeGap("horizontal", sourceNode, targetNode) / 2;

    const sourceNodeConnectionData = calcNodeSegments(sourceNode.x, sourceNode.y, sourceNode.width, sourceNode.height, gap, offset)
    const targetNodeConnectionData = calcNodeSegments(targetNode.x, targetNode.y, targetNode.width, targetNode.height, gap, offset)
    const group = createSegmentConnectionGroup("horizontal", sourceNodeConnectionData, targetNodeConnectionData)

    if (sourceItemConnectPoint === RectangleSegmentType.TopCenter) {
        const route = determineRouteFromTopCenter(targetItemConnectPoint, group);
        createPolyline(route, strokeStyle)

    } else if (sourceItemConnectPoint === RectangleSegmentType.BottomCenter) {

    } else if (sourceItemConnectPoint === RectangleSegmentType.MiddleLeft) {

    } else if (sourceItemConnectPoint === RectangleSegmentType.MiddleRight) {

    } else {
        throw new Error("Unable to determine route from source item connect point.")
    }
}

function removeDuplicateCoordinatesFromPath(path: Coordinates[]) {
    // Remove consecutive duplicate coordinates
    const uniquePath = path.filter((coord, index, arr) =>
        index === 0 || coord.x !== arr[index - 1].x || coord.y !== arr[index - 1].y
    );

    return uniquePath;
}

function determineRouteFromTopCenter(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectangleSegmentType.TopCenter) {
        if (!group.betweenItemTopCenter || !group.betweenItemBottomCenter) {
            throw new Error("Required properties for determin route is undefined.")
        }

        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            {
                x: group.source.withMargin[RectangleSegmentType.TopCenter].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectangleSegmentType.TopCenter].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.actual[RectangleSegmentType.TopCenter],
        ]
        const uniquePath = removeDuplicateCoordinatesFromPath(path)
        return uniquePath;
    } else if (targetItemConnectPoint === RectangleSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.BottomLeft],
            group.target.withMargin[RectangleSegmentType.BottomCenter],
            group.target.actual[RectangleSegmentType.BottomCenter],
        ]
        const uniquePath = removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.MiddleLeft],
            group.target.actual[RectangleSegmentType.MiddleLeft],
        ]
        const uniquePath = removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.TopLeft],
            group.target.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.MiddleRight],
            group.target.actual[RectangleSegmentType.MiddleRight],
        ];
        const uniquePath = removeDuplicateCoordinatesFromPath(path)
        return uniquePath
    } else {
        throw new Error("Unable to determine route from top center.")
    }
}