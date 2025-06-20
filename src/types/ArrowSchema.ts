import { ConnectPointPosition } from "./ArrowCreator";
import { CYStroke } from "./CYStroke";
import { Direction } from "./General";

export type ArrowSchema = {
    objectType: string,
    arrowNodeId: string,
    annotationNodeId?: string,
    direction: Direction
    sourceNodeId: string;
    sourceItemConnectPoint: ConnectPointPosition;
    targetNodeId: string;
    targetItemConnectPoint: ConnectPointPosition,
    offset: number,
    strokeStyle: CYStroke,
    hasAnnotation: boolean
}