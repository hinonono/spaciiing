import { ConnectPointPosition, RectSegmentType, SegmentConnectionGroup } from "../../../types/ArrowCreator";
import { Coordinates } from "../../../types/General";
import { utils } from "../../utils";

export function routeFromTC(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    const { start, end, betweenItem } = group;
    let path: Coordinates[] = [];

    if (targetItemConnectPoint === RectSegmentType.TC) {
        if (!betweenItem[RectSegmentType.TC] || !betweenItem[RectSegmentType.BC]) {
            throw new Error("Required properties for determin route is undefined.")
        }

        path = [
            start.actual[RectSegmentType.TC],
            {
                x: start.withMargin[RectSegmentType.TC].x,
                y: betweenItem[RectSegmentType.TC].y
            },
            {
                x: end.withMargin[RectSegmentType.TC].x,
                y: betweenItem[RectSegmentType.TC].y
            },
            end.actual[RectSegmentType.TC],
        ]
    } else if (targetItemConnectPoint === RectSegmentType.MR) {
        path = [
            start.actual[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TR],
            end.withMargin[RectSegmentType.BL],
            end.withMargin[RectSegmentType.BR],
            end.withMargin[RectSegmentType.MR],
            end.actual[RectSegmentType.MR],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        path = [
            start.actual[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TR],
            end.withMargin[RectSegmentType.BL],
            end.withMargin[RectSegmentType.BC],
            end.actual[RectSegmentType.BC],
        ]
    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        path = [
            start.actual[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TR],
            end.withMargin[RectSegmentType.ML],
            end.actual[RectSegmentType.ML],
        ]
    } else {
        throw new Error("Unable to determine route from top center.")
    }

    return path;
}

export function routeFromBC(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    const { start, end, betweenItem } = group;
    let path: Coordinates[] = [];

    if (!betweenItem[RectSegmentType.TC] || !betweenItem[RectSegmentType.BC]) {
        throw new Error("Required properties for determining route are undefined.");
    }
    if (targetItemConnectPoint === RectSegmentType.TC) {
        path = [
            start.actual[RectSegmentType.BC],
            start.withMargin[RectSegmentType.BC],
            start.withMargin[RectSegmentType.BR],
            end.withMargin[RectSegmentType.TL],
            end.withMargin[RectSegmentType.TC],
            end.actual[RectSegmentType.TC],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.MR) {
        path = [
            start.actual[RectSegmentType.BC],
            {
                x: start.withMargin[RectSegmentType.BC].x,
                y: betweenItem[RectSegmentType.BC].y
            },
            {
                x: end.withMargin[RectSegmentType.BR].x,
                y: betweenItem[RectSegmentType.BC].y
            },
            end.withMargin[RectSegmentType.MR],
            end.actual[RectSegmentType.MR],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        path = [
            start.actual[RectSegmentType.BC],
            {
                x: start.withMargin[RectSegmentType.BC].x,
                y: betweenItem[RectSegmentType.BC].y
            },
            {
                x: end.withMargin[RectSegmentType.BC].x,
                y: betweenItem[RectSegmentType.BC].y
            },
            end.actual[RectSegmentType.BC],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        path = [
            start.actual[RectSegmentType.BC],
            start.withMargin[RectSegmentType.BC],
            start.withMargin[RectSegmentType.BR],
            end.withMargin[RectSegmentType.ML],
            end.actual[RectSegmentType.ML],
        ];

    } else {
        throw new Error("Unable to determine route from bottom center.");
    }

    return path;
}

export function routeFromML(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    const { start, end, betweenItem } = group;
    let path: Coordinates[] = [];

    if (!betweenItem[RectSegmentType.TC] || !betweenItem[RectSegmentType.BC]) {
        throw new Error("Required properties for determin route is undefined.")
    }
    if (targetItemConnectPoint === RectSegmentType.TC) {
        path = [
            start.actual[RectSegmentType.ML],
            start.withMargin[RectSegmentType.ML],
            {
                x: start.withMargin[RectSegmentType.ML].x,
                y: betweenItem[RectSegmentType.TC].y
            },
            {
                x: end.withMargin[RectSegmentType.TC].x,
                y: betweenItem[RectSegmentType.TC].y
            },
            end.actual[RectSegmentType.TC],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.MR) {
        path = [
            start.actual[RectSegmentType.ML],
            start.withMargin[RectSegmentType.ML],
            {
                x: start.withMargin[RectSegmentType.ML].x,
                y: betweenItem[RectSegmentType.TC].y
            },
            {
                x: end.withMargin[RectSegmentType.TR].x,
                y: betweenItem[RectSegmentType.TC].y
            },
            end.withMargin[RectSegmentType.MR],
            end.actual[RectSegmentType.MR],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        path = [
            start.actual[RectSegmentType.ML],
            start.withMargin[RectSegmentType.ML],
            {
                x: start.withMargin[RectSegmentType.BL].x,
                y: betweenItem[RectSegmentType.BC].y
            },
            {
                x: end.withMargin[RectSegmentType.BC].x,
                y: betweenItem[RectSegmentType.BC].y
            },
            end.actual[RectSegmentType.BC],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        path = [
            start.actual[RectSegmentType.ML],
            start.withMargin[RectSegmentType.ML],
            start.withMargin[RectSegmentType.TL],
            start.withMargin[RectSegmentType.TR],
            end.withMargin[RectSegmentType.ML],
            end.actual[RectSegmentType.ML],
        ];

    } else {
        throw new Error("Unable to determine route from middle left.");
    }

    return path;
}

export function routeFromMR(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    const { start, end, betweenItem } = group;
    let path: Coordinates[] = [];

    if (targetItemConnectPoint === RectSegmentType.TC) {
        path = [
            start.actual[RectSegmentType.MR],
            start.withMargin[RectSegmentType.MR],
            end.withMargin[RectSegmentType.TL],
            end.withMargin[RectSegmentType.TC],
            end.actual[RectSegmentType.TC],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.MR) {
        path = [
            start.actual[RectSegmentType.MR],
            start.withMargin[RectSegmentType.MR],
            end.withMargin[RectSegmentType.BL],
            end.withMargin[RectSegmentType.BR],
            end.withMargin[RectSegmentType.MR],
            end.actual[RectSegmentType.MR],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        path = [
            start.actual[RectSegmentType.MR],
            start.withMargin[RectSegmentType.MR],
            end.withMargin[RectSegmentType.BL],
            end.withMargin[RectSegmentType.BC],
            end.actual[RectSegmentType.BC],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        path = [
            start.actual[RectSegmentType.MR],
            start.withMargin[RectSegmentType.MR],
            end.withMargin[RectSegmentType.ML],
            end.actual[RectSegmentType.ML],
        ];

    } else {
        throw new Error("Unable to determine route from middle right.");
    }

    return path;
}