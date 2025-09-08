import { ConnectPointPosition, RectangleSegmentMap, RectSegmentType, SegmentConnectionData, SegmentConnectionGroup } from "../../types/ArrowCreator";
import { CYStroke } from "../../types/CYStroke";
import { Coordinates, Direction } from "../../types/General";
import { MessageArrowCreator } from "../../types/Messages/MessageArrowCreator";
import { utils } from "../utils";
import { router } from "./router";
import { semanticTokens } from "../tokens";
import { ArrowSchema } from "../../types/ArrowSchema";

export function reception(message: MessageArrowCreator) {
    const selection = utils.editor.getCurrentSelection();

    // Check if there are any nodes selected
    if (selection.length === 0) {
        figma.notify("No nodes selected.");
        return;
    } else if (selection.length === 1) {
        figma.notify("Please select at least two objects.");
        return;
    }

    const sortedSelction = utils.editor.sortSelectionBasedOnXAndY(message.layoutDirection, selection)

    for (let i = 0; i < sortedSelction.length - 1; i++) {
        const sourceItem = sortedSelction[i];
        const targetItem = sortedSelction[i + 1]

        const route = determineRoute(
            message.layoutDirection,
            sourceItem,
            message.connectPointPositionPair.start,
            targetItem,
            message.connectPointPositionPair.end,
            message.safeMargin,
        )

        console.log("normal route", route);

        drawArrowAndAnnotation(
            route,
            message.stroke,
            message.createAnnotationBox,
            message.layoutDirection,
            sourceItem.id,
            message.connectPointPositionPair.start,
            targetItem.id,
            message.connectPointPositionPair.end,
            message.safeMargin,
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
function calcNodeSegments(node: SceneNode, margin: { horizontal: number, vertical: number }, offset: number): SegmentConnectionData {
    const { absoluteBoundingBox, width, height } = node;
    if (!absoluteBoundingBox) {
        throw new Error("absoluteBondingBox is required in order to calculate node segments.");
    }
    const { x, y } = absoluteBoundingBox;

    const actual: RectangleSegmentMap = {
        [RectSegmentType.TL]: { x: x - offset, y: y - offset },
        [RectSegmentType.TC]: { x: x + width / 2, y: y - offset },
        [RectSegmentType.TR]: { x: x + width + offset, y: y - offset },
        [RectSegmentType.ML]: { x: x - offset, y: y + height / 2 },
        [RectSegmentType.MC]: { x: x + width / 2, y: y + height / 2 },
        [RectSegmentType.MR]: { x: x + width + offset, y: y + height / 2 },
        [RectSegmentType.BL]: { x: x - offset, y: y + height + offset },
        [RectSegmentType.BC]: { x: x + width / 2, y: y + height + offset },
        [RectSegmentType.BR]: { x: x + width + offset, y: y + height + offset },
    };
    const withMargin: RectangleSegmentMap = {
        [RectSegmentType.TL]: { x: x - margin.horizontal, y: y - margin.vertical },
        [RectSegmentType.TC]: { x: x + width / 2, y: y - margin.vertical },
        [RectSegmentType.TR]: { x: x + width + margin.horizontal, y: y - margin.vertical },
        [RectSegmentType.ML]: { x: x - margin.horizontal, y: y + height / 2 },
        [RectSegmentType.MC]: { x: x + width / 2, y: y + height / 2 },
        [RectSegmentType.MR]: { x: x + width + margin.horizontal, y: y + height / 2 },
        [RectSegmentType.BL]: { x: x - margin.horizontal, y: y + height + margin.vertical },
        [RectSegmentType.BC]: { x: x + width / 2, y: y + height + margin.vertical },
        [RectSegmentType.BR]: { x: x + width + margin.horizontal, y: y + height + margin.vertical },
    };
    return { actual, withMargin };
}

function calcNodeGap(start: SceneNode, end: SceneNode): { horizontal: number, vertical: number } {
    if (!start.absoluteBoundingBox || !end.absoluteBoundingBox) {
        throw new Error("Absolute bounding box is required to calculate node gap.")
    }

    let hGap: number, vGap: number;

    const rightOfSourceNode = start.absoluteBoundingBox.x + start.width;
    const rightOfTargetNode = end.absoluteBoundingBox.x + end.width;

    const bottomOfSourceNode = start.absoluteBoundingBox.y + start.height;
    const bottomOfTargetNode = end.absoluteBoundingBox.y + end.height;

    // Calculate vertical gap
    if (end.absoluteBoundingBox.y >= bottomOfSourceNode) {
        vGap = end.absoluteBoundingBox.y - bottomOfSourceNode; // target is below
    } else if (start.absoluteBoundingBox.y >= bottomOfTargetNode) {
        vGap = start.absoluteBoundingBox.y - bottomOfTargetNode; // target is above
    } else {
        vGap = 0; // overlapping vertically
    }

    // Calculate horizontal gap
    if (end.absoluteBoundingBox.x >= rightOfSourceNode) {
        hGap = end.absoluteBoundingBox.x - rightOfSourceNode; // target is to the right
    } else if (start.absoluteBoundingBox.x >= rightOfTargetNode) {
        hGap = start.absoluteBoundingBox.x - rightOfTargetNode; // target is to the left
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
            start: source,
            end: target,
            betweenItem: {
                topCenter: {
                    x: source.withMargin[RectSegmentType.TR].x,
                    y: Math.min(source.withMargin[RectSegmentType.TR].y, target.withMargin[RectSegmentType.TL].y)
                },
                bottomCenter: {
                    x: source.withMargin[RectSegmentType.TR].x,
                    y: Math.max(source.withMargin[RectSegmentType.BR].y, target.withMargin[RectSegmentType.BL].y)
                }
            },
        }
    } else {
        return {
            start: source,
            end: target,
            betweenItem: {
                middleLeft: {
                    x: Math.min(source.withMargin[RectSegmentType.BL].x, target.withMargin[RectSegmentType.TL].x),
                    y: source.withMargin[RectSegmentType.BL].y
                },
                middleRight: {
                    x: Math.max(source.withMargin[RectSegmentType.BR].x, target.withMargin[RectSegmentType.TR].x),
                    y: source.withMargin[RectSegmentType.BL].y
                }
            }
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
    await utils.node.setStrokeCap(vector, vectorNetwork, strokeStyle.startPointCap, strokeStyle.endPointCap)
    applyStrokeStyle(vector, strokeStyle);

    vector.name = "Arrow Vector"

    return vector
}

function applyStrokeStyle(node: VectorNode, strokeStyle: CYStroke) {
    const strokeColor = utils.color.hexToRgb(strokeStyle.color);
    node.strokes = [{ type: "SOLID", color: strokeColor, opacity: strokeStyle.opacity }];
    if (strokeStyle.dashAndGap) {
        node.dashPattern = strokeStyle.dashAndGap
    }
    node.strokeWeight = strokeStyle.strokeWeight;
    node.cornerRadius = strokeStyle.cornerRadius
}

function calcMargin(gap: { horizontal: number, vertical: number }): { horizontal: number, vertical: number } {
    const margin = {
        horizontal: gap.horizontal === 0 ? gap.vertical / 2 : gap.horizontal / 2,
        vertical: gap.vertical === 0 ? gap.horizontal / 2 : gap.vertical / 2
    }

    return margin;
}

function determineRoute(
    direction: Direction,
    start: SceneNode,
    startConnectPoint: ConnectPointPosition,
    end: SceneNode,
    endConnectPoint: ConnectPointPosition,
    offset: number,
) {
    const gap = calcNodeGap(start, end);
    const margin = calcMargin(gap);

    if (!start.absoluteBoundingBox || !end.absoluteBoundingBox) {
        throw new Error("Absolute bounding box is required to determine route.")
    }

    console.log(start.absoluteBoundingBox, end.absoluteBoundingBox)

    const startConnectionData = calcNodeSegments(start, margin, offset);
    const endConnectionData = calcNodeSegments(end, margin, offset);
    const group = createSegmentConnectionGroup(direction, startConnectionData, endConnectionData)

    let route: Coordinates[] = [];

    if (direction === "horizontal") {
        if (startConnectPoint === RectSegmentType.TC) {
            route = router.horizontal.routeFromTC(endConnectPoint, group);
        } else if (startConnectPoint === RectSegmentType.BC) {
            route = router.horizontal.routeFromBC(endConnectPoint, group);
        } else if (startConnectPoint === RectSegmentType.ML) {
            route = router.horizontal.routeFromML(endConnectPoint, group);
        } else if (startConnectPoint === RectSegmentType.MR) {
            route = router.horizontal.routeFromMR(endConnectPoint, group);
        } else {
            throw new Error("Unable to determine route from source item connect point.")
        }
    } else {
        if (startConnectPoint === RectSegmentType.TC) {
            route = router.vertical.routeFromTC(endConnectPoint, group);
        } else if (startConnectPoint === RectSegmentType.BC) {
            route = router.vertical.routeFromBC(endConnectPoint, group);
        } else if (startConnectPoint === RectSegmentType.ML) {
            route = router.vertical.routeFromML(endConnectPoint, group);
        } else if (startConnectPoint === RectSegmentType.MR) {
            route = router.vertical.routeFromMR(endConnectPoint, group);
        } else {
            throw new Error("Unable to determine route from source item connect point.")
        }
    }

    const optimizedRoute = utils.vector.removeDuplicateCoordinatesFromPath(route);

    return optimizedRoute;
}

async function drawArrowAndAnnotation(
    route: Coordinates[],
    strokeStyle: CYStroke,
    createAnnotationBool: boolean,
    direction: Direction,
    startNodeId: string,
    startConnectPoint: ConnectPointPosition,
    endNodeId: string,
    endConnectPoint: ConnectPointPosition,
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
                startNodeId,
                startConnectPoint,
                endNodeId,
                endConnectPoint,
                offset,
                strokeStyle,
                createAnnotationBool
            )
        }
    } else {
        throw new Error("Unable to draw path because route is undefined.")
    }

    if (createAnnotationBool) {
        const midPoint = utils.vector.calcMidpoint(route)
        const annotationNode = await createAnnotation(midPoint, strokeStyle);

        const arrowGroup = figma.group([line, annotationNode], figma.currentPage);
        arrowGroup.name = "Arrow"

        setArrowSchemaData(
            arrowGroup,
            line.id,
            direction,
            startNodeId,
            startConnectPoint,
            endNodeId,
            endConnectPoint,
            offset,
            strokeStyle,
            createAnnotationBool,
            annotationNode.id
        )
    }
}

async function createAnnotation(midPoint: Coordinates, strokeStlye: CYStroke) {
    await utils.editor.loadFont([
        semanticTokens.fontFamily.regular,
        semanticTokens.fontFamily.semiBold
    ]);
    const annotationNodeSize = {
        width: strokeStlye.strokeWeight * 30,
        height: strokeStlye.strokeWeight * 8,
        fontSize: strokeStlye.strokeWeight * 3,
    }

    const annotation = utils.node.createTextNode(
        "Sample Text",
        { family: "Inter", style: "Semi Bold" },
        annotationNodeSize.fontSize
    );

    annotation.textAlignHorizontal = "CENTER";
    annotation.textAlignVertical = "CENTER";
    annotation.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

    const backgroundColor = utils.color.hexToRgb(strokeStlye.color);

    const annotationNode = utils.node.createAutolayoutFrame(
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
    startNodeId: string,
    startConnectPoint: ConnectPointPosition,
    endNodeId: string,
    endItemConnectPoint: ConnectPointPosition,
    offset: number,
    strokeStyle: CYStroke,
    hasAnnotation: boolean,
    annotationNodeId?: string,
) {
    // const key = "arrow-schema"
    const schema: ArrowSchema = {
        objectType: "SPACIIING_ARROW",
        arrowNodeId: arrowNodeId,
        annotationNodeId: annotationNodeId,
        direction: direction,
        startNodeId: startNodeId,
        startConnectPoint: startConnectPoint,
        endNodeId: endNodeId,
        endConnectPoint: endItemConnectPoint,
        offset: offset,
        strokeStyle: strokeStyle,
        hasAnnotation: hasAnnotation,
    }

    groupNode.setPluginData(utils.dataKeys.ARROW_SCHEMA, JSON.stringify(schema));
    groupNode.setRelaunchData(({ [utils.relaunchCommand.updateArrowsPosition.name]: utils.relaunchCommand.updateArrowsPosition.desc }))
}

function getArrowSchema(obj: SceneNode): ArrowSchema {
    // const key = "arrow-schema"

    const data = obj.getPluginData(utils.dataKeys.ARROW_SCHEMA);

    if (data) {
        const decodedData = JSON.parse(data) as ArrowSchema;
        return decodedData;
    } else {
        throw new Error("ArrowSchema is undefined.");
    }
}

export async function updateArrowPosition() {
    const selection = utils.editor.getCurrentSelection();

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
            const sourceNode = figma.currentPage.findOne(n => n.id === schema.startNodeId);
            const targetNode = figma.currentPage.findOne(n => n.id === schema.endNodeId);

            if (!sourceNode || !targetNode) {
                throw new Error("Missing source or target node.");
            }

            if (!arrowNode || arrowNode.type !== "VECTOR") {
                throw new Error("Missing or invalid arrow node.");
            }

            const newRoute = determineRoute(
                schema.direction,
                sourceNode,
                schema.startConnectPoint,
                targetNode,
                schema.endConnectPoint,
                schema.offset
            );

            if (figma.editorType === "slides") {
                // 將ArrowNode的位置歸零，使得記載著「畫布絕對位置」的向量線段可以反映在正確的位置上
                // 在簡報模式中，若要取得畫布的(0,0)點位置，需要考慮當前投影片之於畫布的相對位置
                // 由於簡報模式無法直接抓取「簡報node」，因此使用「起始點node」替代來計算相對於當前畫布而言的畫布（0,0）位置
                // 以此使得記載著「畫布絕對位置」的向量線段可以反映在正確的位置上
                if (!sourceNode.absoluteBoundingBox) {
                    throw new Error("Source node must include absolute bounding box in order to calculate new arrow position.")
                }
                const pageOriginRelativeToCurrentSlide: Vector = { x: sourceNode.x - sourceNode.absoluteBoundingBox.x, y: sourceNode.y - sourceNode.absoluteBoundingBox.y };

                arrowNode.x = pageOriginRelativeToCurrentSlide.x;
                arrowNode.y = pageOriginRelativeToCurrentSlide.y;
            } else {
                // 將ArrowNode的位置歸零，使得記載著「畫布絕對位置」的向量線段可以反映在正確的位置上
                arrowNode.x = 0;
                arrowNode.y = 0;
            }

            const newVectorNetwork = createVectorNetwork(newRoute);
            await utils.node.setStrokeCap(arrowNode, newVectorNetwork, schema.strokeStyle.startPointCap, schema.strokeStyle.endPointCap);
            applyStrokeStyle(arrowNode, schema.strokeStyle)

            if (annotationNode) {
                const midPoint = utils.vector.calcMidpoint(newRoute);
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