import { Coordinates } from "./General";

// Enum to represent different segments of the rectangular layer
export enum RectSegmentType {
    TL = "topLeft",
    TC = "topCenter",
    TR = "topRight",
    ML = "middleLeft",
    MC = "middleCenter",
    MR = "middleRight",
    BL = "bottomLeft",
    BC = "bottomCenter",
    BR = "bottomRight"
}
export type ConnectPointPosition =
    | RectSegmentType.TC
    | RectSegmentType.BC
    | RectSegmentType.ML
    | RectSegmentType.MR;

export type StrokeMode = "freeform" | "style";


export interface ConnectPointPositionPair {
    source: ConnectPointPosition;
    target: ConnectPointPosition;
}


// Interface to hold all segments of a rectangle
export interface RectangleSegmentMap {
    [RectSegmentType.TL]: Coordinates;
    [RectSegmentType.TC]: Coordinates;
    [RectSegmentType.TR]: Coordinates;
    [RectSegmentType.ML]: Coordinates;
    [RectSegmentType.MC]: Coordinates;
    [RectSegmentType.MR]: Coordinates;
    [RectSegmentType.BL]: Coordinates;
    [RectSegmentType.BC]: Coordinates;
    [RectSegmentType.BR]: Coordinates;
}

// Extended interface to include margins
export interface SegmentConnectionData {
    actual: RectangleSegmentMap;
    withMargin: RectangleSegmentMap;
}

export interface SegmentConnectionGroup {
    source: SegmentConnectionData;
    target: SegmentConnectionData;
    betweenItemTopCenter?: Coordinates
    betweenItemBottomCenter?: Coordinates;
    betweenItemMiddleLeft?: Coordinates;
    betweenItemMiddleRight?: Coordinates;
}