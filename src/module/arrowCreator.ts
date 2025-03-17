import { ConnectPointPosition, RectangleSegmentMap, RectangleSegmentType, SegmentConnectionData } from "../types/ArrowCreator";

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
function calculateItemSegments(x: number, y: number, width: number, height: number, margin: number, offset: number): SegmentConnectionData {
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
        [RectangleSegmentType.TopLeft]: { x: x - margin - offset, y: y - margin - offset },
        [RectangleSegmentType.TopCenter]: { x: x + width / 2, y: y - margin - offset },
        [RectangleSegmentType.TopRight]: { x: x + width + margin + offset, y: y - margin - offset },

        [RectangleSegmentType.MiddleLeft]: { x: x - margin - offset, y: y + height / 2 },
        [RectangleSegmentType.MiddleCenter]: { x: x + width / 2, y: y + height / 2 },
        [RectangleSegmentType.MiddleRight]: { x: x + width + margin + offset, y: y + height / 2 },

        [RectangleSegmentType.BottomLeft]: { x: x - margin - offset, y: y + height + margin + offset },
        [RectangleSegmentType.BottomCenter]: { x: x + width / 2, y: y + height + margin + offset },
        [RectangleSegmentType.BottomRight]: { x: x + width + margin + offset, y: y + height + margin + offset },
    };

    return { actual, withMargin };
}

function calculateItemGap(mode: "horizontal" | "vertical", startItem: SceneNode, endItem: SceneNode): number {
    if (mode === "horizontal") {
        const number = endItem.x - (startItem.x + startItem.width)
        return number
    } else {
        const number = endItem.y - (startItem.y + startItem.height)
        return number;
    }
}


function determineRoute(
    startItem: SceneNode,
    startItemConnectPoint: ConnectPointPosition,
    endItem: SceneNode,
    endItemConnectPoint: ConnectPointPosition,
    offset: number
) {
    const gap = calculateItemGap("horizontal", startItem, endItem) / 2;

    const startItemAxis = calculateItemSegments(startItem.x, startItem.y, startItem.width, startItem.height, gap, offset)
    const endItemAxis = calculateItemSegments(endItem.x, endItem.y, endItem.width, endItem.height, gap, offset)


    switch (startItemConnectPoint) {
        case RectangleSegmentType.TopCenter:
            // console.log("Start from Top Center");
            calculateRouteFromTopCenter(
                endItemConnectPoint,

            );

            break;
        case RectangleSegmentType.BottomCenter:
            // console.log("Start from Bottom Center");

            break;
        case RectangleSegmentType.MiddleLeft:
            // console.log("Start from Middle Left");

            break;
        case RectangleSegmentType.MiddleRight:
            // console.log("Start from Middle Right");

            break;
        default:
            console.error("Invalid startItemConnectPoint");

            break;
    }
}

function calculateRouteFromTopCenter(
    endItemConnectPoint: ConnectPointPosition,
) {
    switch (endItemConnectPoint) {
        case RectangleSegmentType.TopCenter:



            break;
        case RectangleSegmentType.BottomCenter:


            break;
        case RectangleSegmentType.MiddleLeft:


            break;
        case RectangleSegmentType.MiddleRight:


            break;
        default:
            console.error("Invalid endItemConnectPoint");

            break;
    }
}