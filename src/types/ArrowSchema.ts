import { ConnectPointPosition } from "./ArrowCreator";
import { CYStroke } from "./CYStroke";
import { Direction } from "./General";

export type ArrowSchema = {
    objectType: string,
    arrowNodeId: string,
    annotationNodeId?: string,
    direction: Direction
    startNodeId: string;
    startConnectPoint: ConnectPointPosition;
    endNodeId: string;
    endConnectPoint: ConnectPointPosition,
    offset: number,
    strokeStyle: CYStroke,
    hasAnnotation: boolean
}