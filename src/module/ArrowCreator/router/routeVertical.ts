import { ConnectPointPosition, RectSegmentType, SegmentConnectionGroup } from "../../../types/ArrowCreator";
import { Coordinates } from "../../../types/General";
import { utils } from "../../utils";

export function determineRouteFromMiddleRight(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectSegmentType.MiddleRight) {
        if (!group.betweenItemMiddleRight || !group.betweenItemMiddleLeft) {
            throw new Error("Required properties for determin route is undefined.")
        }
        const path = [
            group.source.actual[RectSegmentType.MiddleRight],
            {
                x: group.betweenItemMiddleRight.x,
                y: group.source.withMargin[RectSegmentType.MiddleRight].y
            },
            {
                x: group.betweenItemMiddleRight.x,
                y: group.target.withMargin[RectSegmentType.MiddleRight].y
            },
            group.target.actual[RectSegmentType.MiddleRight],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath;
    } else if (targetItemConnectPoint === RectSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.BottomRight],
            group.target.withMargin[RectSegmentType.TopLeft],
            group.target.withMargin[RectSegmentType.BottomLeft],
            group.target.withMargin[RectSegmentType.BottomCenter],
            group.target.actual[RectSegmentType.BottomCenter],
        ];
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path)
        return uniquePath
    } else if (targetItemConnectPoint === RectSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.BottomRight],
            group.target.withMargin[RectSegmentType.TopLeft],
            group.target.withMargin[RectSegmentType.MiddleLeft],
            group.target.actual[RectSegmentType.MiddleLeft],
        ]
        const uniquePath = utils.vector.removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else if (targetItemConnectPoint === RectSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.MiddleRight],
            group.source.withMargin[RectSegmentType.BottomRight],
            group.target.withMargin[RectSegmentType.TopCenter],
            group.target.actual[RectSegmentType.TopCenter],
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
    if (targetItemConnectPoint === RectSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectSegmentType.MiddleLeft],
            group.source.withMargin[RectSegmentType.MiddleLeft],
            group.source.withMargin[RectSegmentType.BottomLeft],
            group.target.withMargin[RectSegmentType.TopRight],
            group.target.withMargin[RectSegmentType.MiddleRight],
            group.target.actual[RectSegmentType.MiddleRight],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectSegmentType.MiddleLeft],
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.source.withMargin[RectSegmentType.MiddleLeft].y
            },
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.target.withMargin[RectSegmentType.BottomLeft].y
            },
            group.target.withMargin[RectSegmentType.BottomCenter],
            group.target.actual[RectSegmentType.BottomCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectSegmentType.MiddleLeft],
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.source.withMargin[RectSegmentType.MiddleLeft].y
            },
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.target.withMargin[RectSegmentType.MiddleLeft].y
            },
            group.target.actual[RectSegmentType.MiddleLeft],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectSegmentType.MiddleLeft],
            group.source.withMargin[RectSegmentType.MiddleLeft],
            group.source.withMargin[RectSegmentType.BottomLeft],
            group.target.withMargin[RectSegmentType.TopCenter],
            group.target.actual[RectSegmentType.TopCenter],
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
    if (targetItemConnectPoint === RectSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopCenter],
            {
                x: group.betweenItemMiddleRight.x,
                y: group.source.withMargin[RectSegmentType.TopCenter].y
            },
            {
                x: group.betweenItemMiddleRight.x,
                y: group.target.withMargin[RectSegmentType.MiddleRight].y
            },
            group.target.actual[RectSegmentType.MiddleRight],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopCenter],
            {
                x: group.betweenItemMiddleRight.x,
                y: group.source.withMargin[RectSegmentType.TopCenter].y
            },
            {
                x: group.betweenItemMiddleRight.x,
                y: group.target.withMargin[RectSegmentType.BottomRight].y
            },
            group.target.withMargin[RectSegmentType.BottomCenter],
            group.target.actual[RectSegmentType.BottomCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopCenter],
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.source.withMargin[RectSegmentType.TopLeft].y
            },
            {
                x: group.betweenItemMiddleLeft.x,
                y: group.target.withMargin[RectSegmentType.MiddleLeft].y
            },
            group.target.actual[RectSegmentType.MiddleLeft],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopCenter],
            group.source.withMargin[RectSegmentType.TopRight],
            group.source.withMargin[RectSegmentType.BottomRight],
            group.target.withMargin[RectSegmentType.TopCenter],
            group.target.actual[RectSegmentType.TopCenter],
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
    if (targetItemConnectPoint === RectSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectSegmentType.BottomCenter],
            group.source.withMargin[RectSegmentType.BottomCenter],
            group.target.withMargin[RectSegmentType.TopRight],
            group.target.withMargin[RectSegmentType.MiddleRight],
            group.target.actual[RectSegmentType.MiddleRight],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectSegmentType.BottomCenter],
            group.source.withMargin[RectSegmentType.BottomCenter],
            group.target.withMargin[RectSegmentType.TopLeft],
            group.target.withMargin[RectSegmentType.BottomLeft],
            group.target.withMargin[RectSegmentType.BottomCenter],
            group.target.actual[RectSegmentType.BottomCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectSegmentType.BottomCenter],
            group.source.withMargin[RectSegmentType.BottomCenter],
            group.target.withMargin[RectSegmentType.TopLeft],
            group.target.withMargin[RectSegmentType.MiddleLeft],
            group.target.actual[RectSegmentType.MiddleLeft],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectSegmentType.BottomCenter],
            group.source.withMargin[RectSegmentType.BottomCenter],
            group.target.withMargin[RectSegmentType.TopCenter],
            group.target.actual[RectSegmentType.TopCenter],
        ];
        return utils.vector.removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from bottom center.");
    }
}