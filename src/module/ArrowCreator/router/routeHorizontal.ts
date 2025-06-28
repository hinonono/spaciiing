import { ConnectPointPosition, RectSegmentType, SegmentConnectionGroup } from "../../../types/ArrowCreator";
import { Coordinates } from "../../../types/General";
import { utils } from "../../utils";

export function determineRouteFromTopCenter(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectSegmentType.TC) {
        if (!group.betweenItemTopCenter || !group.betweenItemBottomCenter) {
            throw new Error("Required properties for determin route is undefined.")
        }

        const path = [
            group.source.actual[RectSegmentType.TC],
            {
                x: group.source.withMargin[RectSegmentType.TC].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.TC].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.actual[RectSegmentType.TC],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath;
    } else if (targetItemConnectPoint === RectSegmentType.MR) {
        const path = [
            group.source.actual[RectSegmentType.TC],
            group.source.withMargin[RectSegmentType.TC],
            group.source.withMargin[RectSegmentType.TR],
            group.target.withMargin[RectSegmentType.BL],
            group.target.withMargin[RectSegmentType.BR],
            group.target.withMargin[RectSegmentType.MR],
            group.target.actual[RectSegmentType.MR],
        ];
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath
    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        const path = [
            group.source.actual[RectSegmentType.TC],
            group.source.withMargin[RectSegmentType.TC],
            group.source.withMargin[RectSegmentType.TR],
            group.target.withMargin[RectSegmentType.BL],
            group.target.withMargin[RectSegmentType.BC],
            group.target.actual[RectSegmentType.BC],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        const path = [
            group.source.actual[RectSegmentType.TC],
            group.source.withMargin[RectSegmentType.TC],
            group.source.withMargin[RectSegmentType.TR],
            group.target.withMargin[RectSegmentType.ML],
            group.target.actual[RectSegmentType.ML],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else {
        throw new Error("Unable to determine route from top center.")
    }
}

export function determineRouteFromBottomCenter(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (!group.betweenItemTopCenter || !group.betweenItemBottomCenter) {
        throw new Error("Required properties for determining route are undefined.");
    }
    if (targetItemConnectPoint === RectSegmentType.TC) {
        const path = [
            group.source.actual[RectSegmentType.BC],
            group.source.withMargin[RectSegmentType.BC],
            group.source.withMargin[RectSegmentType.BR],
            group.target.withMargin[RectSegmentType.TL],
            group.target.withMargin[RectSegmentType.TC],
            group.target.actual[RectSegmentType.TC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MR) {
        const path = [
            group.source.actual[RectSegmentType.BC],
            {
                x: group.source.withMargin[RectSegmentType.BC].x,
                y: group.betweenItemBottomCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.BR].x,
                y: group.betweenItemBottomCenter.y
            },
            group.target.withMargin[RectSegmentType.MR],
            group.target.actual[RectSegmentType.MR],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        const path = [
            group.source.actual[RectSegmentType.BC],
            {
                x: group.source.withMargin[RectSegmentType.BC].x,
                y: group.betweenItemBottomCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.BC].x,
                y: group.betweenItemBottomCenter.y
            },
            group.target.actual[RectSegmentType.BC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        const path = [
            group.source.actual[RectSegmentType.BC],
            group.source.withMargin[RectSegmentType.BC],
            group.source.withMargin[RectSegmentType.BR],
            group.target.withMargin[RectSegmentType.ML],
            group.target.actual[RectSegmentType.ML],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from bottom center.");
    }
}

export function determineRouteFromMiddleLeft(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (!group.betweenItemTopCenter || !group.betweenItemBottomCenter) {
        throw new Error("Required properties for determin route is undefined.")
    }
    if (targetItemConnectPoint === RectSegmentType.TC) {
        const path = [
            group.source.actual[RectSegmentType.ML],
            group.source.withMargin[RectSegmentType.ML],
            {
                x: group.source.withMargin[RectSegmentType.ML].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.TC].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.actual[RectSegmentType.TC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MR) {
        const path = [
            group.source.actual[RectSegmentType.ML],
            group.source.withMargin[RectSegmentType.ML],
            {
                x: group.source.withMargin[RectSegmentType.ML].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.TR].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.withMargin[RectSegmentType.MR],
            group.target.actual[RectSegmentType.MR],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        const path = [
            group.source.actual[RectSegmentType.ML],
            group.source.withMargin[RectSegmentType.ML],
            {
                x: group.source.withMargin[RectSegmentType.BL].x,
                y: group.betweenItemBottomCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.BC].x,
                y: group.betweenItemBottomCenter.y
            },
            group.target.actual[RectSegmentType.BC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        const path = [
            group.source.actual[RectSegmentType.ML],
            group.source.withMargin[RectSegmentType.ML],
            group.source.withMargin[RectSegmentType.TL],
            group.source.withMargin[RectSegmentType.TR],
            group.target.withMargin[RectSegmentType.ML],
            group.target.actual[RectSegmentType.ML],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from middle left.");
    }
}

export function determineRouteFromMiddleRight(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectSegmentType.TC) {
        const path = [
            group.source.actual[RectSegmentType.MR],
            group.source.withMargin[RectSegmentType.MR],
            group.target.withMargin[RectSegmentType.TL],
            group.target.withMargin[RectSegmentType.TC],
            group.target.actual[RectSegmentType.TC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MR) {
        const path = [
            group.source.actual[RectSegmentType.MR],
            group.source.withMargin[RectSegmentType.MR],
            group.target.withMargin[RectSegmentType.BL],
            group.target.withMargin[RectSegmentType.BR],
            group.target.withMargin[RectSegmentType.MR],
            group.target.actual[RectSegmentType.MR],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        const path = [
            group.source.actual[RectSegmentType.MR],
            group.source.withMargin[RectSegmentType.MR],
            group.target.withMargin[RectSegmentType.BL],
            group.target.withMargin[RectSegmentType.BC],
            group.target.actual[RectSegmentType.BC],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        const path = [
            group.source.actual[RectSegmentType.MR],
            group.source.withMargin[RectSegmentType.MR],
            group.target.withMargin[RectSegmentType.ML],
            group.target.actual[RectSegmentType.ML],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from middle right.");
    }
}