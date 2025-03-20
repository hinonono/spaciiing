import { ConnectPointPositionPair } from '../ArrowCreator';
import { CYStroke } from '../CYStroke';
import { Direction } from '../General';
import { Message } from './Message';

export interface MessageArrowCreator extends Message {
    safeMargin: number;
    connectPointPositionPair: ConnectPointPositionPair;
    stroke: CYStroke;
    createAnnotationBox: boolean;
    layoutDirection: Direction;
}