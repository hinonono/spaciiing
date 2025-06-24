import { ConnectPointPosition, RectangleSegmentType, SegmentConnectionGroup } from "../../types/ArrowCreator";
import { Coordinates } from "../../types/General";
import { utils } from "../utils";

export function determineRouteFromMiddleRight(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectangleSegmentType.MiddleRight) {
        if (!group.betweenItemMiddleRight || !group.betweenItemMiddleLeft) {
            throw new Error("Required properties for determin route is undefined.")
        }
        const path = [
            group.source.actual[RectangleSegmentType.MiddleRight],
            {
                x: group.betweenItemMiddleRight.x,
                y: group.source.withMargin[RectangleSegmentType.MiddleRight].y
            },
            {
                x: group.betweenItemMiddleRight.x,
                y: group.target.withMargin[RectangleSegmentType.MiddleRight].y
            },
            group.target.actual[RectangleSegmentType.MiddleRight],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath;
    } else if (targetItemConnectPoint === RectangleSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.BottomRight],
            group.target.withMargin[RectangleSegmentType.TopLeft],
            group.target.withMargin[RectangleSegmentType.BottomLeft],
            group.target.withMargin[RectangleSegmentType.BottomCenter],
            group.target.actual[RectangleSegmentType.BottomCenter],
        ];
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.BottomRight],
            group.target.withMargin[RectangleSegmentType.TopLeft],
            group.target.withMargin[RectangleSegmentType.MiddleLeft],
            group.target.actual[RectangleSegmentType.MiddleLeft],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else if (targetItemConnectPoint === RectangleSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.BottomRight],
            group.target.withMargin[RectangleSegmentType.TopCenter],
            group.target.actual[RectangleSegmentType.TopCenter],
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
    if (!group.betweenItemMiddleLeft || !group.betweenItemMiddleRight) {
        throw new Error("Required properties for determining route are undefined.");
    }
    if (targetItemConnectPoint === RectangleSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleLeft],
            group.source.withMargin[RectangleSegmentType.MiddleLeft],
            group.source.withMargin[RectangleSegmentType.BottomLeft],
            group.target.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.MiddleRight],
            group.target.actual[RectangleSegmentType.MiddleRight],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleLeft],
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.source.withMargin[RectangleSegmentType.MiddleLeft].y
            },
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.target.withMargin[RectangleSegmentType.BottomLeft].y
            },
            group.target.withMargin[RectangleSegmentType.BottomCenter],
            group.target.actual[RectangleSegmentType.BottomCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleLeft],
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.source.withMargin[RectangleSegmentType.MiddleLeft].y
            },
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.target.withMargin[RectangleSegmentType.MiddleLeft].y
            },
            group.target.actual[RectangleSegmentType.MiddleLeft],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleLeft],
            group.source.withMargin[RectangleSegmentType.MiddleLeft],
            group.source.withMargin[RectangleSegmentType.BottomLeft],
            group.target.withMargin[RectangleSegmentType.TopCenter],
            group.target.actual[RectangleSegmentType.TopCenter],
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
    if (!group.betweenItemMiddleLeft || !group.betweenItemMiddleRight) {
        throw new Error("Required properties for determin route is undefined.")
    }
    if (targetItemConnectPoint === RectangleSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            {
                x: group.betweenItemMiddleRight.x,
                y: group.source.withMargin[RectangleSegmentType.TopCenter].y
            },
            {
                x: group.betweenItemMiddleRight.x,
                y: group.target.withMargin[RectangleSegmentType.MiddleRight].y
            },
            group.target.actual[RectangleSegmentType.MiddleRight],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            {
                x: group.betweenItemMiddleRight.x,
                y: group.source.withMargin[RectangleSegmentType.TopCenter].y
            },
            {
                x: group.betweenItemMiddleRight.x,
                y: group.target.withMargin[RectangleSegmentType.BottomRight].y
            },
            group.target.withMargin[RectangleSegmentType.BottomCenter],
            group.target.actual[RectangleSegmentType.BottomCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.source.withMargin[RectangleSegmentType.TopLeft].y
            },
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.target.withMargin[RectangleSegmentType.MiddleLeft].y
            },
            group.target.actual[RectangleSegmentType.MiddleLeft],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopRight],
            group.source.withMargin[RectangleSegmentType.BottomRight],
            group.target.withMargin[RectangleSegmentType.TopCenter],
            group.target.actual[RectangleSegmentType.TopCenter],
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
    if (targetItemConnectPoint === RectangleSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectangleSegmentType.BottomCenter],
            group.source.withMargin[RectangleSegmentType.BottomCenter],
            group.target.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.MiddleRight],
            group.target.actual[RectangleSegmentType.MiddleRight],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.BottomCenter],
            group.source.withMargin[RectangleSegmentType.BottomCenter],
            group.target.withMargin[RectangleSegmentType.TopLeft],
            group.target.withMargin[RectangleSegmentType.BottomLeft],
            group.target.withMargin[RectangleSegmentType.BottomCenter],
            group.target.actual[RectangleSegmentType.BottomCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectangleSegmentType.BottomCenter],
            group.source.withMargin[RectangleSegmentType.BottomCenter],
            group.target.withMargin[RectangleSegmentType.TopLeft],
            group.target.withMargin[RectangleSegmentType.MiddleLeft],
            group.target.actual[RectangleSegmentType.MiddleLeft],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.BottomCenter],
            group.source.withMargin[RectangleSegmentType.BottomCenter],
            group.target.withMargin[RectangleSegmentType.TopCenter],
            group.target.actual[RectangleSegmentType.TopCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from bottom center.");
    }
}