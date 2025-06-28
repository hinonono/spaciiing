import { ConnectPointPosition, RectSegmentType, SegmentConnectionGroup } from "../../../types/ArrowCreator";
import { Coordinates } from "../../../types/General";
import { utils } from "../../utils";

export function routeFromMR(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    const { start, end, betweenItem } = group;
    let path: Coordinates[] = [];

    if (targetItemConnectPoint === RectSegmentType.MR) {
        if (!betweenItem[RectSegmentType.MR] || !betweenItem[RectSegmentType.ML]) {
            throw new Error("Required properties for determin route is undefined.")
        }
        path = [
            start.actual[RectSegmentType.MR],
            {
                x: betweenItem[RectSegmentType.MR].x,
                y: start.withMargin[RectSegmentType.MR].y
            },
            {
                x: betweenItem[RectSegmentType.MR].x,
                y: end.withMargin[RectSegmentType.MR].y
            },
            end.actual[RectSegmentType.MR],
        ]


    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        path = [
            start.actual[RectSegmentType.MR],
            start.withMargin[RectSegmentType.MR],
            start.withMargin[RectSegmentType.BR],
            end.withMargin[RectSegmentType.TL],
            end.withMargin[RectSegmentType.BL],
            end.withMargin[RectSegmentType.BC],
            end.actual[RectSegmentType.BC],
        ];


    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        path = [
            start.actual[RectSegmentType.MR],
            start.withMargin[RectSegmentType.MR],
            start.withMargin[RectSegmentType.BR],
            end.withMargin[RectSegmentType.TL],
            end.withMargin[RectSegmentType.ML],
            end.actual[RectSegmentType.ML],
        ]
            ;

    } else if (targetItemConnectPoint === RectSegmentType.TC) {
        path = [
            start.actual[RectSegmentType.MR],
            start.withMargin[RectSegmentType.MR],
            start.withMargin[RectSegmentType.BR],
            end.withMargin[RectSegmentType.TC],
            end.actual[RectSegmentType.TC],
        ]
            ;

    } else {
        throw new Error("Unable to determine route from middle right.")
    }

    return path;
}

export function routeFromML(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    const { start, end, betweenItem } = group;
    let path: Coordinates[] = [];

    if (!betweenItem[RectSegmentType.ML] || !betweenItem[RectSegmentType.MR]) {
        throw new Error("Required properties for determining route are undefined.");
    }
    if (targetItemConnectPoint === RectSegmentType.MR) {
        path = [
            start.actual[RectSegmentType.ML],
            start.withMargin[RectSegmentType.ML],
            start.withMargin[RectSegmentType.BL],
            end.withMargin[RectSegmentType.TR],
            end.withMargin[RectSegmentType.MR],
            end.actual[RectSegmentType.MR],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        path = [
            start.actual[RectSegmentType.ML],
            {
                x: betweenItem[RectSegmentType.ML].x,
                y: start.withMargin[RectSegmentType.ML].y
            },
            {
                x: betweenItem[RectSegmentType.ML].x,
                y: end.withMargin[RectSegmentType.BL].y
            },
            end.withMargin[RectSegmentType.BC],
            end.actual[RectSegmentType.BC],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        path = [
            start.actual[RectSegmentType.ML],
            {
                x: betweenItem[RectSegmentType.ML].x,
                y: start.withMargin[RectSegmentType.ML].y
            },
            {
                x: betweenItem[RectSegmentType.ML].x,
                y: end.withMargin[RectSegmentType.ML].y
            },
            end.actual[RectSegmentType.ML],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.TC) {
        path = [
            start.actual[RectSegmentType.ML],
            start.withMargin[RectSegmentType.ML],
            start.withMargin[RectSegmentType.BL],
            end.withMargin[RectSegmentType.TC],
            end.actual[RectSegmentType.TC],
        ];

    } else {
        throw new Error("Unable to determine route from middle left.");
    }

    return path;
}

export function routeFromTC(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    const { start, end, betweenItem } = group;
    let path: Coordinates[] = [];

    if (!betweenItem[RectSegmentType.ML] || !betweenItem[RectSegmentType.MR]) {
        throw new Error("Required properties for determin route is undefined.")
    }
    if (targetItemConnectPoint === RectSegmentType.MR) {
        path = [
            start.actual[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TC],
            {
                x: betweenItem[RectSegmentType.MR].x,
                y: start.withMargin[RectSegmentType.TC].y
            },
            {
                x: betweenItem[RectSegmentType.MR].x,
                y: end.withMargin[RectSegmentType.MR].y
            },
            end.actual[RectSegmentType.MR],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        path = [
            start.actual[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TC],
            {
                x: betweenItem[RectSegmentType.MR].x,
                y: start.withMargin[RectSegmentType.TC].y
            },
            {
                x: betweenItem[RectSegmentType.MR].x,
                y: end.withMargin[RectSegmentType.BR].y
            },
            end.withMargin[RectSegmentType.BC],
            end.actual[RectSegmentType.BC],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        path = [
            start.actual[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TC],
            {
                x: betweenItem[RectSegmentType.ML].x,
                y: start.withMargin[RectSegmentType.TL].y
            },
            {
                x: betweenItem[RectSegmentType.ML].x,
                y: end.withMargin[RectSegmentType.ML].y
            },
            end.actual[RectSegmentType.ML],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.TC) {
        path = [
            start.actual[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TC],
            start.withMargin[RectSegmentType.TR],
            start.withMargin[RectSegmentType.BR],
            end.withMargin[RectSegmentType.TC],
            end.actual[RectSegmentType.TC],
        ];

    } else {
        throw new Error("Unable to determine route from top center.");
    }

    return path;
}

export function routeFromBC(
    targetItemConnectPoint: ConnectPointPosition,
    group: SegmentConnectionGroup
): Coordinates[] {
    const { start, end, betweenItem } = group;
    let path: Coordinates[] = [];

    if (targetItemConnectPoint === RectSegmentType.MR) {
        path = [
            start.actual[RectSegmentType.BC],
            start.withMargin[RectSegmentType.BC],
            end.withMargin[RectSegmentType.TR],
            end.withMargin[RectSegmentType.MR],
            end.actual[RectSegmentType.MR],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.BC) {
        path = [
            start.actual[RectSegmentType.BC],
            start.withMargin[RectSegmentType.BC],
            end.withMargin[RectSegmentType.TL],
            end.withMargin[RectSegmentType.BL],
            end.withMargin[RectSegmentType.BC],
            end.actual[RectSegmentType.BC],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.ML) {
        path = [
            start.actual[RectSegmentType.BC],
            start.withMargin[RectSegmentType.BC],
            end.withMargin[RectSegmentType.TL],
            end.withMargin[RectSegmentType.ML],
            end.actual[RectSegmentType.ML],
        ];

    } else if (targetItemConnectPoint === RectSegmentType.TC) {
        path = [
            start.actual[RectSegmentType.BC],
            start.withMargin[RectSegmentType.BC],
            end.withMargin[RectSegmentType.TC],
            end.actual[RectSegmentType.TC],
        ];

    } else {
        throw new Error("Unable to determine route from bottom center.");
    }

    return path;
}