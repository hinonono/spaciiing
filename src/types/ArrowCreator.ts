import { Coordinates } from "./General";

// Enum to represent different segments of the rectangular layer
export enum RectangleSegmentType {
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
    | RectangleSegmentType.TopCenter
    | RectangleSegmentType.BottomCenter
    | RectangleSegmentType.MiddleLeft
    | RectangleSegmentType.MiddleRight;

export type StrokeMode = "freeform" | "style";


export interface ConnectPointPositionPair {
    source: ConnectPointPosition;
    target: ConnectPointPosition;
}


// Interface to hold all segments of a rectangle
export interface RectangleSegmentMap {
    [RectangleSegmentType.TopLeft]: Coordinates;
    [RectangleSegmentType.TopCenter]: Coordinates;
    [RectangleSegmentType.TopRight]: Coordinates;
    [RectangleSegmentType.MiddleLeft]: Coordinates;
    [RectangleSegmentType.MiddleCenter]: Coordinates;
    [RectangleSegmentType.MiddleRight]: Coordinates;
    [RectangleSegmentType.BottomLeft]: Coordinates;
    [RectangleSegmentType.BottomCenter]: Coordinates;
    [RectangleSegmentType.BottomRight]: Coordinates;
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