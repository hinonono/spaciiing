import { ConnectPointPositionAbstract, RectangleSegmentType, SegmentConnectionGroupAbstract } from "../../types/ArrowCreator";
import { Coordinates } from "../../types/General";
import { removeDuplicateCoordinatesFromPath } from "../util";

export function determineRouteFromC2(
    targetItemConnectPoint: ConnectPointPositionAbstract,
    group: SegmentConnectionGroupAbstract
): Coordinates[] {
    if (targetItemConnectPoint === "C2") {
        const path = [
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
    group: SegmentConnectionGroupAbstract
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
        const path = [
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
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C6") {
        const path = [
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
    group: SegmentConnectionGroupAbstract
): Coordinates[] {
    if (targetItemConnectPoint === "C2") {
        const path = [
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
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C4") {
        const path = [
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
        return removeDuplicateCoordinatesFromPath(path);
    } else if (targetItemConnectPoint === "C6") {
        const path = [
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
    group: SegmentConnectionGroupAbstract
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