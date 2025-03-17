import { ConnectItemHorizontalRelativePosition, ConnectPointAxis, ConnectPointPosition, LayerSegments, SegmentType } from "../types/ArrowCreator";

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
function calculateSegments(x: number, y: number, width: number, height: number, margin: number, offset: number): ConnectPointAxis {
    const actual: LayerSegments = {
        [SegmentType.TopLeft]: { x: x - offset, y: y - offset },
        [SegmentType.TopCenter]: { x: x + width / 2, y: y - offset },
        [SegmentType.TopRight]: { x: x + width + offset, y: y - offset },

        [SegmentType.MiddleLeft]: { x: x - offset, y: y + height / 2 },
        [SegmentType.MiddleCenter]: { x: x + width / 2, y: y + height / 2 },
        [SegmentType.MiddleRight]: { x: x + width + offset, y: y + height / 2 },

        [SegmentType.BottomLeft]: { x: x - offset, y: y + height + offset },
        [SegmentType.BottomCenter]: { x: x + width / 2, y: y + height + offset },
        [SegmentType.BottomRight]: { x: x + width + offset, y: y + height + offset },
    };

    const withMargin: LayerSegments = {
        [SegmentType.TopLeft]: { x: x - margin - offset, y: y - margin - offset },
        [SegmentType.TopCenter]: { x: x + width / 2, y: y - margin - offset },
        [SegmentType.TopRight]: { x: x + width + margin + offset, y: y - margin - offset },

        [SegmentType.MiddleLeft]: { x: x - margin - offset, y: y + height / 2 },
        [SegmentType.MiddleCenter]: { x: x + width / 2, y: y + height / 2 },
        [SegmentType.MiddleRight]: { x: x + width + margin + offset, y: y + height / 2 },

        [SegmentType.BottomLeft]: { x: x - margin - offset, y: y + height + margin + offset },
        [SegmentType.BottomCenter]: { x: x + width / 2, y: y + height + margin + offset },
        [SegmentType.BottomRight]: { x: x + width + margin + offset, y: y + height + margin + offset },
    };

    return { actual, withMargin };
}

function calculateItemGap(startItem: SceneNode, endItem: SceneNode): number {
    const number = endItem.x - (startItem.x + startItem.width)

    return number
}

function determineConnectItemHorizontalRelativePosition(startItem: SceneNode, endItem: SceneNode): ConnectItemHorizontalRelativePosition | null {
    if (startItem.y === endItem.y) {
        return "align";
    } else if (startItem.y > endItem.y) {
        return "lower"
    } else if (startItem.y < endItem.y) {
        return "higher"
    } else {
        return null;
    }
}

function calculateRoute(
    startItem: SceneNode,
    startItemConnectPoint: ConnectPointPosition,
    endItem: SceneNode,
    endItemConnectPoint: ConnectPointPosition,
    offset: number
) {
    const gap = calculateItemGap(startItem, endItem) / 2;
    const relativePosition = determineConnectItemHorizontalRelativePosition(startItem, endItem);

    if (relativePosition === null) {
        throw new Error("Invalid alignment: Unable to determine horizontal relative position between startItem and endItem.");
    }

    const startItemAxis = calculateSegments(startItem.x, startItem.y, startItem.width, startItem.height, gap, offset)
    const endItemAxis = calculateSegments(endItem.x, endItem.y, endItem.width, endItem.height, gap, offset)


    switch (startItemConnectPoint) {
        case SegmentType.TopCenter:
            // console.log("Start from Top Center");
            calculateRouteFromTopCenter(
                endItemConnectPoint,
                relativePosition
            );

            break;
        case SegmentType.BottomCenter:
            // console.log("Start from Bottom Center");

            break;
        case SegmentType.MiddleLeft:
            // console.log("Start from Middle Left");

            break;
        case SegmentType.MiddleRight:
            // console.log("Start from Middle Right");

            break;
        default:
            console.error("Invalid startItemConnectPoint");

            break;
    }
}

function calculateRouteFromTopCenter(
    endItemConnectPoint: ConnectPointPosition,
    relativePosition: ConnectItemHorizontalRelativePosition
) {
    switch (endItemConnectPoint) {
        case SegmentType.TopCenter:
            if (relativePosition === "align") {

            } else if (relativePosition === "lower") {

            } else if (relativePosition === "higher") {

            }


            break;
        case SegmentType.BottomCenter:
            if (relativePosition === "align") {

            } else if (relativePosition === "lower") {

            } else if (relativePosition === "higher") {

            }

            break;
        case SegmentType.MiddleLeft:
            if (relativePosition === "align") {

            } else if (relativePosition === "lower") {

            } else if (relativePosition === "higher") {

            }

            break;
        case SegmentType.MiddleRight:
            if (relativePosition === "align") {

            } else if (relativePosition === "lower") {

            } else if (relativePosition === "higher") {

            }

            break;
        default:
            console.error("Invalid endItemConnectPoint");

            break;
    }
}