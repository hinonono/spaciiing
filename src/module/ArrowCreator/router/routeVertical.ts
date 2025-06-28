import { ConnectPointPosition, RectSegmentType, SegmentConnectionGroup } from "../../../types/ArrowCreator";
import { Coordinates } from "../../../types/General";
import { utils } from "../../utils";

export function determineRouteFromMiddleRight(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectSegmentType.MR) {
        if (!group.betweenItem[RectSegmentType.MR] || !group.betweenItem[RectSegmentType.ML]) {
            throw new Error("Required properties for determin route is undefined.")
        }
        const path = [
            group.start.actual[RectSegmentType.MR],
            {
                x: group.betweenItem[RectSegmentType.MR].x,
                y: group.start.withMargin[RectSegmentType.MR].y
            },
            {
                x: group.betweenItem[RectSegmentType.MR].x,
                y: group.end.withMargin[RectSegmentType.MR].y
            },
            group.end.actual[RectSegmentType.MR],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath;
    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        const path = [
            group.start.actual[RectSegmentType.MR],
            group.start.withMargin[RectSegmentType.MR],
            group.start.withMargin[RectSegmentType.BR],
            group.end.withMargin[RectSegmentType.TL],
            group.end.withMargin[RectSegmentType.BL],
            group.end.withMargin[RectSegmentType.BC],
            group.end.actual[RectSegmentType.BC],
        ];
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath
    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        const path = [
            group.start.actual[RectSegmentType.MR],
            group.start.withMargin[RectSegmentType.MR],
            group.start.withMargin[RectSegmentType.BR],
            group.end.withMargin[RectSegmentType.TL],
            group.end.withMargin[RectSegmentType.ML],
            group.end.actual[RectSegmentType.ML],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else if (targetItemConnectPoint === RectSegmentType.TC) {
        const path = [
            group.start.actual[RectSegmentType.MR],
            group.start.withMargin[RectSegmentType.MR],
            group.start.withMargin[RectSegmentType.BR],
            group.end.withMargin[RectSegmentType.TC],
            group.end.actual[RectSegmentType.TC],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else {
        throw new Error("Unable to determine route from middle right.")
    }
}

export function determineRouteFromMiddleLeft(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (!group.betweenItem[RectSegmentType.ML] || !group.betweenItem[RectSegmentType.MR]) {
        throw new Error("Required properties for determining route are undefined.");
    }
    if (targetItemConnectPoint === RectSegmentType.MR) {
        const path = [
            group.start.actual[RectSegmentType.ML],
            group.start.withMargin[RectSegmentType.ML],
            group.start.withMargin[RectSegmentType.BL],
            group.end.withMargin[RectSegmentType.TR],
            group.end.withMargin[RectSegmentType.MR],
            group.end.actual[RectSegmentType.MR],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        const path = [
            group.start.actual[RectSegmentType.ML],
            {
                x: group.betweenItem[RectSegmentType.ML].x,
                y: group.start.withMargin[RectSegmentType.ML].y
            },
            {
                x: group.betweenItem[RectSegmentType.ML].x,
                y: group.end.withMargin[RectSegmentType.BL].y
            },
            group.end.withMargin[RectSegmentType.BC],
            group.end.actual[RectSegmentType.BC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        const path = [
            group.start.actual[RectSegmentType.ML],
            {
                x: group.betweenItem[RectSegmentType.ML].x,
                y: group.start.withMargin[RectSegmentType.ML].y
            },
            {
                x: group.betweenItem[RectSegmentType.ML].x,
                y: group.end.withMargin[RectSegmentType.ML].y
            },
            group.end.actual[RectSegmentType.ML],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.TC) {
        const path = [
            group.start.actual[RectSegmentType.ML],
            group.start.withMargin[RectSegmentType.ML],
            group.start.withMargin[RectSegmentType.BL],
            group.end.withMargin[RectSegmentType.TC],
            group.end.actual[RectSegmentType.TC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from middle left.");
    }
}

export function determineRouteFromTopCenter(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (!group.betweenItem[RectSegmentType.ML] || !group.betweenItem[RectSegmentType.MR]) {
        throw new Error("Required properties for determin route is undefined.")
    }
    if (targetItemConnectPoint === RectSegmentType.MR) {
        const path = [
            group.start.actual[RectSegmentType.TC],
            group.start.withMargin[RectSegmentType.TC],
            {
                x: group.betweenItem[RectSegmentType.MR].x,
                y: group.start.withMargin[RectSegmentType.TC].y
            },
            {
                x: group.betweenItem[RectSegmentType.MR].x,
                y: group.end.withMargin[RectSegmentType.MR].y
            },
            group.end.actual[RectSegmentType.MR],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        const path = [
            group.start.actual[RectSegmentType.TC],
            group.start.withMargin[RectSegmentType.TC],
            {
                x: group.betweenItem[RectSegmentType.MR].x,
                y: group.start.withMargin[RectSegmentType.TC].y
            },
            {
                x: group.betweenItem[RectSegmentType.MR].x,
                y: group.end.withMargin[RectSegmentType.BR].y
            },
            group.end.withMargin[RectSegmentType.BC],
            group.end.actual[RectSegmentType.BC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        const path = [
            group.start.actual[RectSegmentType.TC],
            group.start.withMargin[RectSegmentType.TC],
            {
                x: group.betweenItem[RectSegmentType.ML].x,
                y: group.start.withMargin[RectSegmentType.TL].y
            },
            {
                x: group.betweenItem[RectSegmentType.ML].x,
                y: group.end.withMargin[RectSegmentType.ML].y
            },
            group.end.actual[RectSegmentType.ML],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.TC) {
        const path = [
            group.start.actual[RectSegmentType.TC],
            group.start.withMargin[RectSegmentType.TC],
            group.start.withMargin[RectSegmentType.TR],
            group.start.withMargin[RectSegmentType.BR],
            group.end.withMargin[RectSegmentType.TC],
            group.end.actual[RectSegmentType.TC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from top center.");
    }
}

export function determineRouteFromBottomCenter(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectSegmentType.MR) {
        const path = [
            group.start.actual[RectSegmentType.BC],
            group.start.withMargin[RectSegmentType.BC],
            group.end.withMargin[RectSegmentType.TR],
            group.end.withMargin[RectSegmentType.MR],
            group.end.actual[RectSegmentType.MR],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        const path = [
            group.start.actual[RectSegmentType.BC],
            group.start.withMargin[RectSegmentType.BC],
            group.end.withMargin[RectSegmentType.TL],
            group.end.withMargin[RectSegmentType.BL],
            group.end.withMargin[RectSegmentType.BC],
            group.end.actual[RectSegmentType.BC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        const path = [
            group.start.actual[RectSegmentType.BC],
            group.start.withMargin[RectSegmentType.BC],
            group.end.withMargin[RectSegmentType.TL],
            group.end.withMargin[RectSegmentType.ML],
            group.end.actual[RectSegmentType.ML],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.TC) {
        const path = [
            group.start.actual[RectSegmentType.BC],
            group.start.withMargin[RectSegmentType.BC],
            group.end.withMargin[RectSegmentType.TC],
            group.end.actual[RectSegmentType.TC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from bottom center.");
    }
}