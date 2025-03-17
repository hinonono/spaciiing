import { Axis, ConnectItemHorizontalRelativePosition, ConnectPointAxis, ConnectPointPosition, LayerSegments, SegmentType } from "../types/ArrowCreator";
import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs';
import { CYStroke } from "../types/CYStroke";
import { MessageArrowCreator } from "../types/Messages/MessageArrowCreator";
import * as util from "./util";

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

    for (let i = 0; i < selection.length - 1; i++) {
        const sourceItem = selection[i];
        const targetItem = selection[i + 1]

        calculateRouteELK(sourceItem, targetItem, message.stroke)

    }


}

//使用ELK.JS試試看
// Create an instance of ELK.
const elk = new ELK();

function calculateRouteELK(sourceNode: SceneNode, targetNode: SceneNode, strokeStyle: CYStroke) {
    // Define two nodes with ports specifying connection points.
    const nodeA: ElkNode = {
        id: "A",
        width: sourceNode.width,
        height: sourceNode.height,
        children: [],
        ports: [
            {
                id: "top-center",
                layoutOptions: {
                    "port.side": "NORTH", // Top Center
                    "port.alignment": "CENTER"
                }
            },
            {
                id: "middle-left",
                layoutOptions: {
                    "port.side": "WEST", // Middle Left
                    "port.alignment": "CENTER"
                }
            },
            {
                id: "middle-right",
                layoutOptions: {
                    "port.side": "EAST", // Middle Right
                    "port.alignment": "CENTER"
                }
            },
            {
                id: "bottom-center",
                layoutOptions: {
                    "port.side": "SOUTH", // Bottom Center
                    "port.alignment": "CENTER"
                }
            }
        ]
    };

    const nodeB: ElkNode = {
        id: "B",
        width: targetNode.width,
        height: targetNode.height,
        children: [],
        ports: [
            {
                id: "top-center",
                layoutOptions: {
                    "port.side": "NORTH", // Top Center
                    "port.alignment": "CENTER"
                }
            },
            {
                id: "middle-left",
                layoutOptions: {
                    "port.side": "WEST", // Middle Left
                    "port.alignment": "CENTER"
                }
            },
            {
                id: "middle-right",
                layoutOptions: {
                    "port.side": "EAST", // Middle Right
                    "port.alignment": "CENTER"
                }
            },
            {
                id: "bottom-center",
                layoutOptions: {
                    "port.side": "SOUTH", // Bottom Center
                    "port.alignment": "CENTER"
                }
            }
        ]
    };

    // Define the edge connecting the specified ports on the nodes.
    const edge = {
        id: 'edge-A-B',
        sources: ['A'],
        targets: ['B'],
        sourcePorts: ['middle-right'],  // Start connection from node A's middleRight port.
        targetPorts: ['middle-left'],     // End connection at node B's middleLeft port.
    };

    // Create a graph including the nodes and the edge.
    const graph = {
        id: 'root',
        layoutOptions: {
            'elk.algorithm': 'layered', // Experiment with other algorithms if needed.
        },
        children: [nodeA, nodeB],
        edges: [edge],
    };

    elk.layout(graph).then((layoutResult) => {
        const routedEdge = layoutResult.edges?.[0] as ElkExtendedEdge;
        if (routedEdge && routedEdge.sections) {
            // For each section, combine startPoint, bendPoints, and endPoint to form the full route.
            const allPoints: Axis[] = routedEdge.sections.flatMap(section => {
                const points: { x: number; y: number }[] = [];
                if (section.startPoint) {
                    points.push(section.startPoint);
                }
                if (section.bendPoints) {
                    points.push(...section.bendPoints);
                }
                if (section.endPoint) {
                    points.push(section.endPoint);
                }
                return points;
            });

            console.log('Routing points:', allPoints);
            // Now you can use allPoints to draw your arrow in Figma.
            createPolyline(allPoints, strokeStyle)
        }
    });
}

function createPolyline(points: Axis[], strokeStyle: CYStroke) {
    if (points.length < 2) {
        console.error("A polyline requires at least two points.");
        return;
    }

    const vector = figma.createVector();
    figma.currentPage.appendChild(vector);

    // Create vertices (points)
    const vertices = points.map((point) => ({
        x: point.x,
        y: point.y,
    }));

    // Create segments (connections between points)
    const segments = points.slice(1).map((_, i) => ({
        start: i,
        end: i + 1,
    }));

    // Create the vector network
    vector.vectorNetwork = {
        vertices,
        segments,
        regions: [], // No enclosed region, just a line
    };

    vector.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }]; // Black stroke
    vector.strokeWeight = 4; // Line thickness
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
// function calculateSegments(x: number, y: number, width: number, height: number, margin: number, offset: number): ConnectPointAxis {
//     const actual: LayerSegments = {
//         [SegmentType.TopLeft]: { x: x - offset, y: y - offset },
//         [SegmentType.TopCenter]: { x: x + width / 2, y: y - offset },
//         [SegmentType.TopRight]: { x: x + width + offset, y: y - offset },

//         [SegmentType.MiddleLeft]: { x: x - offset, y: y + height / 2 },
//         [SegmentType.MiddleCenter]: { x: x + width / 2, y: y + height / 2 },
//         [SegmentType.MiddleRight]: { x: x + width + offset, y: y + height / 2 },

//         [SegmentType.BottomLeft]: { x: x - offset, y: y + height + offset },
//         [SegmentType.BottomCenter]: { x: x + width / 2, y: y + height + offset },
//         [SegmentType.BottomRight]: { x: x + width + offset, y: y + height + offset },
//     };

//     const withMargin: LayerSegments = {
//         [SegmentType.TopLeft]: { x: x - margin - offset, y: y - margin - offset },
//         [SegmentType.TopCenter]: { x: x + width / 2, y: y - margin - offset },
//         [SegmentType.TopRight]: { x: x + width + margin + offset, y: y - margin - offset },

//         [SegmentType.MiddleLeft]: { x: x - margin - offset, y: y + height / 2 },
//         [SegmentType.MiddleCenter]: { x: x + width / 2, y: y + height / 2 },
//         [SegmentType.MiddleRight]: { x: x + width + margin + offset, y: y + height / 2 },

//         [SegmentType.BottomLeft]: { x: x - margin - offset, y: y + height + margin + offset },
//         [SegmentType.BottomCenter]: { x: x + width / 2, y: y + height + margin + offset },
//         [SegmentType.BottomRight]: { x: x + width + margin + offset, y: y + height + margin + offset },
//     };

//     return { actual, withMargin };
// }

// function calculateItemGap(startItem: SceneNode, endItem: SceneNode): number {
//     const number = endItem.x - (startItem.x + startItem.width)

//     return number
// }

// function determineConnectItemHorizontalRelativePosition(startItem: SceneNode, endItem: SceneNode): ConnectItemHorizontalRelativePosition | null {
//     if (startItem.y === endItem.y) {
//         return "align";
//     } else if (startItem.y > endItem.y) {
//         return "lower"
//     } else if (startItem.y < endItem.y) {
//         return "higher"
//     } else {
//         return null;
//     }
// }

// function calculateRoute(
//     startItem: SceneNode,
//     startItemConnectPoint: ConnectPointPosition,
//     endItem: SceneNode,
//     endItemConnectPoint: ConnectPointPosition,
//     offset: number
// ) {
//     const gap = calculateItemGap(startItem, endItem) / 2;
//     const relativePosition = determineConnectItemHorizontalRelativePosition(startItem, endItem);

//     if (relativePosition === null) {
//         throw new Error("Invalid alignment: Unable to determine horizontal relative position between startItem and endItem.");
//     }

//     const startItemAxis = calculateSegments(startItem.x, startItem.y, startItem.width, startItem.height, gap, offset)
//     const endItemAxis = calculateSegments(endItem.x, endItem.y, endItem.width, endItem.height, gap, offset)


//     switch (startItemConnectPoint) {
//         case SegmentType.TopCenter:
//             // console.log("Start from Top Center");
//             calculateRouteFromTopCenter(
//                 endItemConnectPoint,
//                 relativePosition
//             );

//             break;
//         case SegmentType.BottomCenter:
//             // console.log("Start from Bottom Center");

//             break;
//         case SegmentType.MiddleLeft:
//             // console.log("Start from Middle Left");

//             break;
//         case SegmentType.MiddleRight:
//             // console.log("Start from Middle Right");

//             break;
//         default:
//             console.error("Invalid startItemConnectPoint");

//             break;
//     }
// }

// function calculateRouteFromTopCenter(
//     endItemConnectPoint: ConnectPointPosition,
//     relativePosition: ConnectItemHorizontalRelativePosition
// ) {
//     switch (endItemConnectPoint) {
//         case SegmentType.TopCenter:
//             if (relativePosition === "align") {

//             } else if (relativePosition === "lower") {

//             } else if (relativePosition === "higher") {

//             }


//             break;
//         case SegmentType.BottomCenter:
//             if (relativePosition === "align") {

//             } else if (relativePosition === "lower") {

//             } else if (relativePosition === "higher") {

//             }

//             break;
//         case SegmentType.MiddleLeft:
//             if (relativePosition === "align") {

//             } else if (relativePosition === "lower") {

//             } else if (relativePosition === "higher") {

//             }

//             break;
//         case SegmentType.MiddleRight:
//             if (relativePosition === "align") {

//             } else if (relativePosition === "lower") {

//             } else if (relativePosition === "higher") {

//             }

//             break;
//         default:
//             console.error("Invalid endItemConnectPoint");

//             break;
//     }
// }