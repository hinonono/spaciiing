import { Coordinates } from "./General";

// Enum to represent different segments of the rectangular layer
export enum RectSegmentType {
    TopLeft = "topLeft",
    TopCenter = "topCenter",
    TopRight = "topRight",
    MiddleLeft = "middleLeft",
    MiddleCenter = "middleCenter",
    MiddleRight = "middleRight",
    BottomLeft = "bottomLeft",
    BottomCenter = "bottomCenter",
    BottomRight = "bottomRight"
}
export type ConnectPointPosition =
    | RectSegmentType.TopCenter
    | RectSegmentType.BottomCenter
    | RectSegmentType.MiddleLeft
    | RectSegmentType.MiddleRight;

export type StrokeMode = "freeform" | "style";


export interface ConnectPointPositionPair {
    source: ConnectPointPosition;
    target: ConnectPointPosition;
}


// Interface to hold all segments of a rectangle
export interface RectangleSegmentMap {
    [RectSegmentType.TopLeft]: Coordinates;
    [RectSegmentType.TopCenter]: Coordinates;
    [RectSegmentType.TopRight]: Coordinates;
    [RectSegmentType.MiddleLeft]: Coordinates;
    [RectSegmentType.MiddleCenter]: Coordinates;
    [RectSegmentType.MiddleRight]: Coordinates;
    [RectSegmentType.BottomLeft]: Coordinates;
    [RectSegmentType.BottomCenter]: Coordinates;
    [RectSegmentType.BottomRight]: Coordinates;
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