import { ConnectPointPosition, RectangleSegmentMap, RectangleSegmentType, SegmentConnectionData, SegmentConnectionGroup } from "../../types/ArrowCreator";
import { CYStroke } from "../../types/CYStroke";
import { Coordinates, Direction } from "../../types/General";
import { MessageArrowCreator } from "../../types/Messages/MessageArrowCreator";
import * as util from "../util";
import * as rh from "./routeHorizontal"
import * as rv from "./routeVertical";
import { semanticTokens } from "../tokens";
import { ArrowSchema } from "../../types/ArrowSchema";

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

        const route = determineRoute(
            message.layoutDirection,
            sourceItem,
            message.connectPointPositionPair.source,
            targetItem,
            message.connectPointPositionPair.target,
            message.safeMargin,
        )

        drawArrowAndAnnotation(
            route,
            message.stroke,
            message.createAnnotationBox,
            message.layoutDirection,
            sourceItem.id,
            message.connectPointPositionPair.source,
            targetItem.id,
            message.connectPointPositionPair.target,
            message.safeMargin,
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

function createVectorNetwork(points: Coordinates[]) {
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

    return vectorNetwork;
}

async function createPolyline(points: Coordinates[], strokeStyle: CYStroke) {
    if (points.length < 2) {
        throw new Error("A polyline requires at least two points.");
    }
    const vector = figma.createVector();
    figma.currentPage.appendChild(vector);

    const vectorNetwork = createVectorNetwork(points);
    await util.setStrokeCap(vector, vectorNetwork, strokeStyle.startPointCap, strokeStyle.endPointCap)
    applyStrokeStyle(vector, strokeStyle);

    vector.name = "Arrow Vector"

    return vector
}

function applyStrokeStyle(node: VectorNode, strokeStyle: CYStroke) {
    const strokeColor = util.hexToRgb(strokeStyle.color);
    node.strokes = [{ type: "SOLID", color: strokeColor, opacity: strokeStyle.opacity }];
    if (strokeStyle.dashAndGap) {
        node.dashPattern = strokeStyle.dashAndGap
    }
    node.strokeWeight = strokeStyle.strokeWeight;
    node.cornerRadius = strokeStyle.cornerRadius
}

function determineRoute(
    direction: Direction,
    sourceNode: SceneNode,
    sourceItemConnectPoint: ConnectPointPosition,
    targetNode: SceneNode,
    targetItemConnectPoint: ConnectPointPosition,
    offset: number,
) {
    const gap = calcNodeGap(sourceNode, targetNode);
    const finalDecidedGap = {
        horizontal: gap.horizontal === 0 ? gap.vertical / 2 : gap.horizontal / 2,
        vertical: gap.vertical === 0 ? gap.horizontal / 2 : gap.vertical / 2
    }

    if (!sourceNode.absoluteBoundingBox || !targetNode.absoluteBoundingBox) {
        throw new Error("Absolute bounding box is required to determine route.")
    }

    console.log(sourceNode.absoluteBoundingBox, targetNode.absoluteBoundingBox)

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

    return route;
}

async function drawArrowAndAnnotation(
    route: Coordinates[],
    strokeStyle: CYStroke,
    createAnnotationBool: boolean,
    direction: Direction,
    sourceNodeId: string,
    sourceItemConnectPoint: ConnectPointPosition,
    targetNodeId: string,
    targetItemConnectPoint: ConnectPointPosition,
    offset: number,
) {
    let line: VectorNode;

    if (route.length !== 0) {
        line = await createPolyline(route, strokeStyle)

        if (createAnnotationBool === false) {
            const arrowGroup = figma.group([line], figma.currentPage);
            arrowGroup.name = "Arrow"

            setArrowSchemaData(
                arrowGroup,
                line.id,
                direction,
                sourceNodeId,
                sourceItemConnectPoint,
                targetNodeId,
                targetItemConnectPoint,
                offset,
                strokeStyle,
                createAnnotationBool
            )
        }
    } else {
        throw new Error("Unable to draw path because route is undefined.")
    }

    if (createAnnotationBool) {
        const midPoint = util.calcMidpoint(route)
        const annotationNode = await createAnnotation(midPoint, strokeStyle);

        const arrowGroup = figma.group([line, annotationNode], figma.currentPage);
        arrowGroup.name = "Arrow"

        setArrowSchemaData(
            arrowGroup,
            line.id,
            direction,
            sourceNodeId,
            sourceItemConnectPoint,
            targetNodeId,
            targetItemConnectPoint,
            offset,
            strokeStyle,
            createAnnotationBool,
            annotationNode.id
        )
    }
}

async function createAnnotation(midPoint: Coordinates, strokeStlye: CYStroke) {
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

    setAnnotationNodePosition(annotationNode, midPoint);
    annotationNode.cornerRadius = semanticTokens.cornerRadius.infinite;

    return annotationNode
}

function setAnnotationNodePosition(node: SceneNode, midPoint: Coordinates) {
    node.x = midPoint.x - (node.width / 2);
    node.y = midPoint.y - (node.height / 2);
}

function setArrowSchemaData(
    groupNode: SceneNode,
    arrowNodeId: string,
    direction: Direction,
    sourceNodeId: string,
    sourceItemConnectPoint: ConnectPointPosition,
    targetNodeId: string,
    targetItemConnectPoint: ConnectPointPosition,
    offset: number,
    strokeStyle: CYStroke,
    hasAnnotation: boolean,
    annotationNodeId?: string,
) {
    const key = "arrow-schema"
    const schema: ArrowSchema = {
        arrowNodeId: arrowNodeId,
        annotationNodeId: annotationNodeId,
        direction: direction,
        sourceNodeId: sourceNodeId,
        sourceItemConnectPoint: sourceItemConnectPoint,
        targetNodeId: targetNodeId,
        targetItemConnectPoint: targetItemConnectPoint,
        offset: offset,
        strokeStyle: strokeStyle,
        hasAnnotation: hasAnnotation,
    }

    groupNode.setPluginData(key, JSON.stringify(schema));
    groupNode.setRelaunchData(({ updateArrowsPosition: "Update arrows position" }))
}

function getArrowSchema(obj: SceneNode): ArrowSchema {
    const key = "arrow-schema"

    const data = obj.getPluginData(key)

    if (data) {
        const decodedData = JSON.parse(data) as ArrowSchema;
        return decodedData;
    } else {
        throw new Error("ArrowSchema is undefined.");
    }
}

export async function updateArrowPosition() {
    const selection = util.getCurrentSelection();

    if (selection.length === 0) {
        figma.notify("No nodes selected.");
        return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < selection.length; i++) {
        const item = selection[i];

        try {
            const schema = getArrowSchema(item);
            const arrowNode = figma.currentPage.findOne(n => n.id === schema.arrowNodeId);
            const annotationNode = figma.currentPage.findOne(n => n.id === schema.annotationNodeId);
            const sourceNode = figma.currentPage.findOne(n => n.id === schema.sourceNodeId);
            const targetNode = figma.currentPage.findOne(n => n.id === schema.targetNodeId);

            if (!sourceNode || !targetNode) {
                throw new Error("Missing source or target node.");
            }

            if (!arrowNode || arrowNode.type !== "VECTOR") {
                throw new Error("Missing or invalid arrow node.");
            }

            const newRoute = determineRoute(
                schema.direction,
                sourceNode,
                schema.sourceItemConnectPoint,
                targetNode,
                schema.targetItemConnectPoint,
                schema.offset
            );

            // Align arrow node to first point in route
            arrowNode.x = newRoute[0].x;
            arrowNode.y = newRoute[0].y;

            // Then translate route points relative to (0,0)
            const relativeRoute = newRoute.map(point => ({
                x: point.x - newRoute[0].x,
                y: point.y - newRoute[0].y,
            }));

            const newVectorNetwork = createVectorNetwork(relativeRoute);
            await util.setStrokeCap(arrowNode, newVectorNetwork, schema.strokeStyle.startPointCap, schema.strokeStyle.endPointCap);
            applyStrokeStyle(arrowNode, schema.strokeStyle)

            if (annotationNode) {
                const midPoint = util.calcMidpoint(newRoute);
                setAnnotationNodePosition(annotationNode, midPoint);
            }

            successCount++;
        } catch (error) {
            console.error(`Error updating arrow for item at index ${i}:`, error);
            errorCount++;
        }
    }

    figma.notify(`Arrow update completed. ✅Success: ${successCount}, ❌Errors: ${errorCount}`);
}