import { ConnectPointPosition, ConnectPointPositionAbstract, RectangleSegmentType, SegmentConnectionGroup, SegmentConnectionGroupAbstract } from "../../types/ArrowCreator";
import { Coordinates, Direction } from "../../types/General";
import { removeDuplicateCoordinatesFromPath } from "../util";

export function abstractConnectPoint(raw: ConnectPointPosition, direction: Direction): ConnectPointPositionAbstract {
    if (direction === "horizontal") {
        switch (raw) {
            case RectangleSegmentType.TopCenter:
                return "C2";
            case RectangleSegmentType.MiddleRight:
                return "C4";
            case RectangleSegmentType.BottomCenter:
                return "C6";
            case RectangleSegmentType.MiddleLeft:
                return "C8";
            default:
                break;
        }
    } else {

    }
}

export function abstractSegmentConnectionGroup(raw: SegmentConnectionGroup, direction: Direction): SegmentConnectionGroupAbstract {
    if (direction === "horizontal") {
        return {
            source: {
                actual: {
                    P1: raw.source.actual[RectangleSegmentType.TopLeft],
                    P2: undefined,
                    P3: undefined,
                    P4: undefined,
                    P5: undefined,
                    P6: undefined,
                    P7: undefined,
                    P8: undefined,
                    P9: undefined
                },
                withMargin: undefined
            },
            target: raw.target,
            S1: undefined,
            S2: undefined
        }
    } else {

    }
}

export function determineRouteFromC2(
    targetItemConnectPoint: ConnectPointPositionAbstract,
    group: SegmentConnectionGroupAbstract,
    direction: Direction
): Coordinates[] {
    if (targetItemConnectPoint === "C2") {
        let path: Coordinates[] = [];

        if (direction === "horizontal") {
            path = [
                group.source.actual.P2,
                {
                    x: group.source.withMargin.P2.x,
                    y: group.S1.y
                },
                {
                    x: group.target.withMargin.P2.x,
                    y: group.S1.y
                },
                group.target.actual.P2,
            ]
        } else {
            path = [
                group.source.actual.P2,
                {
                    x: group.S2.x,
                    y: group.source.withMargin.P2.y
                },
                {
                    x: group.S2.x,
                    y: group.target.withMargin.P2.y
                },
                group.target.actual.P2,
            ]
        }
        const uniquePath = removeDuplicateCoordinatesFromPath(path)
        return uniquePath;
    } else if (targetItemConnectPoint === "C4") {
        const path = [
            group.source.actual.P2,
            group.source.withMargin.P2,
            group.source.withMargin.P3,
            group.target.withMargin.P7,
            group.target.withMargin.P5,
            group.target.withMargin.P4,
            group.target.actual.P4,
        ];
        const uniquePath = removeDuplicateCoordinatesFromPath(path)
        return uniquePath
    } else if (targetItemConnectPoint === "C6") {
        const path = [
            group.source.actual.P2,
            group.source.withMargin.P2,
            group.source.withMargin.P3,
            group.target.withMargin.P7,
            group.target.withMargin.P6,
            group.target.actual.P6,
        ]
        const uniquePath = removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else if (targetItemConnectPoint === "C8") {
        const path = [
            group.source.actual.P2,
            group.source.withMargin.P2,
            group.source.withMargin.P3,
            group.target.withMargin.P8,
            group.target.actual.P8,
        ]
        const uniquePath = removeDuplicateCoordinatesFromPath(path);
        return uniquePath;
    } else {
        throw new Error("Unable to determine route from abstract point C2.")
    }
}

export function determineRouteFromC6(
    targetItemConnectPoint: ConnectPointPositionAbstract,
    group: SegmentConnectionGroupAbstract,
    direction: Direction
): Coordinates[] {
    if (targetItemConnectPoint === "C2") {
        const path = [
            group.source.actual.P6,
            group.source.withMargin.P6,
            group.source.withMargin.P5,
            group.target.withMargin.P1,
            group.target.withMargin.P2,
            group.target.actual.P2,
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C4") {
        let path: Coordinates[] = []

        if (direction === "horizontal") {
            path = [
                group.source.actual.P6,
                {
                    x: group.source.withMargin.P6.x,
                    y: group.S2.y
                },
                {
                    x: group.target.withMargin.P5.x,
                    y: group.S2.y
                },
                group.target.withMargin.P4,
                group.target.actual.P4,
            ];
        } else {
            path = [
                group.source.actual.P6,
                {
                    x: group.S1.x,
                    y: group.source.withMargin.P6.y
                },
                {
                    x: group.S1.x,
                    y: group.target.withMargin.P5.y
                },
                group.target.withMargin.P4,
                group.target.actual.P4,
            ];
        }

        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C6") {
        let path: Coordinates[] = []

        if (direction === "horizontal") {
            path = [
                group.source.actual.P6,
                {
                    x: group.source.withMargin.P6.x,
                    y: group.S2.y
                },
                {
                    x: group.target.withMargin.P6.x,
                    y: group.S2.y
                },
                group.target.actual.P6,
            ];
        } else {
            path = [
                group.source.actual.P6,
                {
                    x: group.S1.x,
                    y: group.source.withMargin.P6.y
                },
                {
                    x: group.S1.x,
                    y: group.target.withMargin.P6.y
                },
                group.target.actual.P6,
            ];
        }
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C8") {
        const path = [
            group.source.actual.P6,
            group.source.withMargin.P6,
            group.source.withMargin.P5,
            group.target.withMargin.P8,
            group.target.actual.P8,
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from abstract point C6.");
    }
}

export function determineRouteFromC8(
    targetItemConnectPoint: ConnectPointPositionAbstract,
    group: SegmentConnectionGroupAbstract,
    direction: Direction
): Coordinates[] {
    if (targetItemConnectPoint === "C2") {
        let path: Coordinates[] = []

        if (direction === "horizontal") {
            path = [
                group.source.actual.P8,
                group.source.withMargin.P8,
                {
                    x: group.source.withMargin.P8.x,
                    y: group.S1.y
                },
                {
                    x: group.target.withMargin.P2.x,
                    y: group.S1.y
                },
                group.target.actual.P2,
            ];
        } else {
            path = [
                group.source.actual.P8,
                group.source.withMargin.P8,
                {
                    x: group.S2.x,
                    y: group.source.withMargin.P8.y
                },
                {
                    x: group.S2.x,
                    y: group.target.withMargin.P2.y
                },
                group.target.actual.P2,
            ];
        }
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C4") {
        let path: Coordinates[] = []

        if (direction === "horizontal") {
            path = [
                group.source.actual.P8,
                group.source.withMargin.P8,
                {
                    x: group.source.withMargin.P8.x,
                    y: group.S1.y
                },
                {
                    x: group.target.withMargin.P3.x,
                    y: group.S1.y
                },
                group.target.withMargin.P4,
                group.target.actual.P4,
            ];
        } else {
            path = [
                group.source.actual.P8,
                group.source.withMargin.P8,
                {
                    x: group.S2.x,
                    y: group.source.withMargin.P8.y
                },
                {
                    x: group.S2.x,
                    y: group.target.withMargin.P3.y
                },
                group.target.withMargin.P4,
                group.target.actual.P4,
            ];
        }
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C6") {
        let path: Coordinates[] = []

        if (direction === "horizontal") {
            path = [
                group.source.actual.P8,
                group.source.withMargin.P8,
                {
                    x: group.source.withMargin.P7.x,
                    y: group.S2.y
                },
                {
                    x: group.target.withMargin.P6.x,
                    y: group.S2.y
                },
                group.target.actual.P6,
            ];
        } else {
            path = [
                group.source.actual.P8,
                group.source.withMargin.P8,
                {
                    x: group.S1.x,
                    y: group.source.withMargin.P7.y
                },
                {
                    x: group.S1.x,
                    y: group.target.withMargin.P6.y
                },
                group.target.actual.P6,
            ];
        }
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C8") {
        const path = [
            group.source.actual.P8,
            group.source.withMargin.P8,
            group.source.withMargin.P1,
            group.source.withMargin.P3,
            group.target.withMargin.P8,
            group.target.actual.P8,
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from abstract point C8.");
    }
}

export function determineRouteFromC4(
    targetItemConnectPoint: ConnectPointPositionAbstract,
    group: SegmentConnectionGroupAbstract,
    direction: Direction
): Coordinates[] {
    if (targetItemConnectPoint === "C2") {
        const path = [
            group.source.actual.P4,
            group.source.withMargin.P4,
            group.target.withMargin.P1,
            group.target.withMargin.P2,
            group.target.actual.P2,
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C4") {
        const path = [
            group.source.actual.P4,
            group.source.withMargin.P4,
            group.target.withMargin.P7,
            group.target.withMargin.P5,
            group.target.withMargin.P4,
            group.target.actual.P4,
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C6") {
        const path = [
            group.source.actual.P4,
            group.source.withMargin.P4,
            group.target.withMargin.P7,
            group.target.withMargin.P6,
            group.target.actual.P6,
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C8") {
        const path = [
            group.source.actual.P4,
            group.source.withMargin.P4,
            group.target.withMargin.P8,
            group.target.actual.P8,
        ];
        return removeDuplicateCoordinatesFromPath(path);
    } else {
        throw new Error("Unable to determine route from abstract point C4.");
    }
}