// Enum to represent different segments of the rectangular layer
export enum SegmentType {
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
    | SegmentType.TopCenter
    | SegmentType.BottomCenter
    | SegmentType.MiddleLeft
    | SegmentType.MiddleRight;

export type StrokeMode = "freeform" | "style";
export interface ConnectPointPositionPair {
    start: ConnectPointPosition;
    end: ConnectPointPosition;
}


// Interface for a single segment
export interface LayerSegment {
    x: number;
    y: number;
}

// Interface to hold all segments of a rectangle
export interface LayerSegments {
    [SegmentType.TopLeft]: LayerSegment;
    [SegmentType.TopCenter]: LayerSegment;
    [SegmentType.TopRight]: LayerSegment;
    [SegmentType.MiddleLeft]: LayerSegment;
    [SegmentType.MiddleCenter]: LayerSegment;
    [SegmentType.MiddleRight]: LayerSegment;
    [SegmentType.BottomLeft]: LayerSegment;
    [SegmentType.BottomCenter]: LayerSegment;
    [SegmentType.BottomRight]: LayerSegment;
}

// Extended interface to include margins
export interface ConnectPointAxis {
    actual: LayerSegments;
    withMargin: LayerSegments;
}