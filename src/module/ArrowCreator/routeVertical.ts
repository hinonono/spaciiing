import { ConnectPointPosition, RectangleSegmentType, SegmentConnectionGroup } from "../../types/ArrowCreator";
import { Coordinates } from "../../types/General";
import { removeDuplicateCoordinatesFromPath } from "../util";

export function determineRouteFromTopCenter(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectangleSegmentType.TopCenter) {
        if (!group.betweenItemTopCenter || !group.betweenItemBottomCenter) {
            throw new Error("Required properties for determin route is undefined.")
        }

        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            {
                x: group.source.withMargin[RectangleSegmentType.TopCenter].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectangleSegmentType.TopCenter].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.actual[RectangleSegmentType.TopCenter],
        ]
        const uniquePath = removeDuplicateCoordinatesFromPath(path)
        return uniquePath;
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.BottomLeft],
            group.target.withMargin[RectangleSegmentType.BottomRight],
            group.target.withMargin[RectangleSegmentType.MiddleRight],
            group.target.actual[RectangleSegmentType.MiddleRight],
        ];
        const uniquePath = removeDuplicateCoordinatesFromPath(path)
        return uniquePath
    } else if (targetItemConnectPoint === RectangleSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.BottomLeft],
            group.target.withMargin[RectangleSegmentType.BottomCenter],
            group.target.actual[RectangleSegmentType.BottomCenter],
        ]
        const uniquePath = removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopCenter],
            group.source.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.MiddleLeft],
            group.target.actual[RectangleSegmentType.MiddleLeft],
        ]
        const uniquePath = removeDuplicateCoordinatesFromPath(path);
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
    if (targetItemConnectPoint === RectangleSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.BottomCenter],
            group.source.withMargin[RectangleSegmentType.BottomCenter],
            group.source.withMargin[RectangleSegmentType.BottomRight],
            group.target.withMargin[RectangleSegmentType.TopLeft],
            group.target.withMargin[RectangleSegmentType.TopCenter],
            group.target.actual[RectangleSegmentType.TopCenter],
        ];
        // const path = [
        //     group.source.actual[RectangleSegmentType.BottomCenter],
        //     group.source.withMargin[RectangleSegmentType.BottomCenter],
        //     group.target.withMargin[RectangleSegmentType.TopCenter],
        //     group.target.actual[RectangleSegmentType.TopCenter],
        // ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectangleSegmentType.BottomCenter],
            {
                x: group.source.withMargin[RectangleSegmentType.BottomCenter].x,
                y: group.betweenItemBottomCenter.y
            },
            {
                x: group.target.withMargin[RectangleSegmentType.BottomRight].x,
                y: group.betweenItemBottomCenter.y
            },
            group.target.withMargin[RectangleSegmentType.MiddleRight],
            group.target.actual[RectangleSegmentType.MiddleRight],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.BottomCenter],
            {
                x: group.source.withMargin[RectangleSegmentType.BottomCenter].x,
                y: group.betweenItemBottomCenter.y
            },
            {
                x: group.target.withMargin[RectangleSegmentType.BottomCenter].x,
                y: group.betweenItemBottomCenter.y
            },
            group.target.actual[RectangleSegmentType.BottomCenter],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectangleSegmentType.BottomCenter],
            group.source.withMargin[RectangleSegmentType.BottomCenter],
            group.source.withMargin[RectangleSegmentType.BottomRight],
            group.target.withMargin[RectangleSegmentType.MiddleLeft],
            group.target.actual[RectangleSegmentType.MiddleLeft],
        ];
        return removeDuplicateCoordinatesFromPath(path);
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
    if (targetItemConnectPoint === RectangleSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleLeft],
            group.source.withMargin[RectangleSegmentType.MiddleLeft],
            {
                x: group.source.withMargin[RectangleSegmentType.MiddleLeft].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectangleSegmentType.TopCenter].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.actual[RectangleSegmentType.TopCenter],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleLeft],
            group.source.withMargin[RectangleSegmentType.MiddleLeft],
            {
                x: group.source.withMargin[RectangleSegmentType.MiddleLeft].x,
                y: group.betweenItemTopCenter.y
            },
            {
                x: group.target.withMargin[RectangleSegmentType.TopRight].x,
                y: group.betweenItemTopCenter.y
            },
            group.target.withMargin[RectangleSegmentType.MiddleRight],
            group.target.actual[RectangleSegmentType.MiddleRight],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleLeft],
            group.source.withMargin[RectangleSegmentType.MiddleLeft],
            {
                x: group.source.withMargin[RectangleSegmentType.BottomLeft].x,
                y: group.betweenItemBottomCenter.y
            },
            {
                x: group.target.withMargin[RectangleSegmentType.BottomCenter].x,
                y: group.betweenItemBottomCenter.y
            },
            group.target.actual[RectangleSegmentType.BottomCenter],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleLeft],
            group.source.withMargin[RectangleSegmentType.MiddleLeft],
            group.source.withMargin[RectangleSegmentType.TopLeft],
            group.source.withMargin[RectangleSegmentType.TopRight],
            group.target.withMargin[RectangleSegmentType.MiddleLeft],
            group.target.actual[RectangleSegmentType.MiddleLeft],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from middle left.");
    }
}


export function determineRouteFromMiddleRight(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    if (targetItemConnectPoint === RectangleSegmentType.TopCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.MiddleRight],
            group.target.withMargin[RectangleSegmentType.TopLeft],
            group.target.withMargin[RectangleSegmentType.TopCenter],
            group.target.actual[RectangleSegmentType.TopCenter],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleRight) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.MiddleRight],
            group.target.withMargin[RectangleSegmentType.BottomLeft],
            group.target.withMargin[RectangleSegmentType.BottomRight],
            group.target.withMargin[RectangleSegmentType.MiddleRight],
            group.target.actual[RectangleSegmentType.MiddleRight],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.BottomCenter) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.MiddleRight],
            group.target.withMargin[RectangleSegmentType.BottomLeft],
            group.target.withMargin[RectangleSegmentType.BottomCenter],
            group.target.actual[RectangleSegmentType.BottomCenter],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === RectangleSegmentType.MiddleLeft) {
        const path = [
            group.source.actual[RectangleSegmentType.MiddleRight],
            group.source.withMargin[RectangleSegmentType.MiddleRight],
            group.target.withMargin[RectangleSegmentType.MiddleLeft],
            group.target.actual[RectangleSegmentType.MiddleLeft],
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from middle right.");
    }
}