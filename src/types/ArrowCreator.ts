export type StrokeMode = "freeform" | "style";
export type ConnectPointPosition = "topCenter" | "bottomCenter" | "centerLeft" | "centerRight";
export interface ConnectPointPositionPair {
    start: ConnectPointPosition;
    end: ConnectPointPosition;
}