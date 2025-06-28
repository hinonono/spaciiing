import { ConnectPointPosition, RectSegmentType, SegmentConnectionGroup } from "../../../types/ArrowCreator";
import { Coordinates } from "../../../types/General";
import { utils } from "../../utils";

export function determineRouteFromTopCenter(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectSegmentType.TopCenter) {
        if (!group.betweenItemTopCenter || !group.betweenItemBottomCenter) {
            throw new Error("Required properties for determin route is undefined.")
        }

        const path = [
            group.source.actual[RectSegmentType.TopCenter],
            {
                x: group.source.withMargin[RectSegmentType.TopCenter].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.TopCenter].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.actual[RectSegmentType.TopCenter],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath;
    } else if (targetItemConnectPoint === RectSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopRight],
            group.target.withMargin[RectSegmentType.BottomLeft],
            group.target.withMargin[RectSegmentType.BottomRight],
            group.target.withMargin[RectSegmentType.MiddleRight],
            group.target.actual[RectSegmentType.MiddleRight],
        ];
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath
    } else if (targetItemConnectPoint === RectSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopRight],
            group.target.withMargin[RectSegmentType.BottomLeft],
            group.target.withMargin[RectSegmentType.BottomCenter],
            group.target.actual[RectSegmentType.BottomCenter],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else if (targetItemConnectPoint === RectSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopRight],
            group.target.withMargin[RectSegmentType.MiddleLeft],
            group.target.actual[RectSegmentType.MiddleLeft],
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
    if (targetItemConnectPoint === RectSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectSegmentType.BottomCenter],
            group.source.withMargin[RectSegmentType.BottomCenter],
            group.source.withMargin[RectSegmentType.BottomRight],
            group.target.withMargin[RectSegmentType.TopLeft],
            group.target.withMargin[RectSegmentType.TopCenter],
            group.target.actual[RectSegmentType.TopCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectSegmentType.BottomCenter],
            {
                x: group.source.withMargin[RectSegmentType.BottomCenter].x,
                y: group.betweenItemBottomCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.BottomRight].x,
                y: group.betweenItemBottomCenter.y
            },
            group.target.withMargin[RectSegmentType.MiddleRight],
            group.target.actual[RectSegmentType.MiddleRight],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectSegmentType.BottomCenter],
            {
                x: group.source.withMargin[RectSegmentType.BottomCenter].x,
                y: group.betweenItemBottomCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.BottomCenter].x,
                y: group.betweenItemBottomCenter.y
            },
            group.target.actual[RectSegmentType.BottomCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectSegmentType.BottomCenter],
            group.source.withMargin[RectSegmentType.BottomCenter],
            group.source.withMargin[RectSegmentType.BottomRight],
            group.target.withMargin[RectSegmentType.MiddleLeft],
            group.target.actual[RectSegmentType.MiddleLeft],
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
    if (targetItemConnectPoint === RectSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectSegmentType.MiddleLeft],
            group.source.withMargin[RectSegmentType.MiddleLeft],
            {
                x: group.source.withMargin[RectSegmentType.MiddleLeft].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.TopCenter].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.actual[RectSegmentType.TopCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectSegmentType.MiddleLeft],
            group.source.withMargin[RectSegmentType.MiddleLeft],
            {
                x: group.source.withMargin[RectSegmentType.MiddleLeft].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.TopRight].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.withMargin[RectSegmentType.MiddleRight],
            group.target.actual[RectSegmentType.MiddleRight],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectSegmentType.MiddleLeft],
            group.source.withMargin[RectSegmentType.MiddleLeft],
            {
                x: group.source.withMargin[RectSegmentType.BottomLeft].x,
                y: group.betweenItemBottomCenter.y
            },
            {
                x: group.target.withMargin[RectSegmentType.BottomCenter].x,
                y: group.betweenItemBottomCenter.y
            },
            group.target.actual[RectSegmentType.BottomCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectSegmentType.MiddleLeft],
            group.source.withMargin[RectSegmentType.MiddleLeft],
            group.source.withMargin[RectSegmentType.TopLeft],
            group.source.withMargin[RectSegmentType.TopRight],
            group.target.withMargin[RectSegmentType.MiddleLeft],
            group.target.actual[RectSegmentType.MiddleLeft],
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
    if (targetItemConnectPoint === RectSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.MiddleRight],
            group.target.withMargin[RectSegmentType.TopLeft],
            group.target.withMargin[RectSegmentType.TopCenter],
            group.target.actual[RectSegmentType.TopCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.MiddleRight],
            group.target.withMargin[RectSegmentType.BottomLeft],
            group.target.withMargin[RectSegmentType.BottomRight],
            group.target.withMargin[RectSegmentType.MiddleRight],
            group.target.actual[RectSegmentType.MiddleRight],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.MiddleRight],
            group.target.withMargin[RectSegmentType.BottomLeft],
            group.target.withMargin[RectSegmentType.BottomCenter],
            group.target.actual[RectSegmentType.BottomCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.MiddleRight],
            group.target.withMargin[RectSegmentType.MiddleLeft],
            group.target.actual[RectSegmentType.MiddleLeft],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from middle right.");
    }
}