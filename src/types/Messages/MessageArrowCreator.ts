import { ConnectPointPositionPair } from '../ArrowCreator';
import { CYStroke } from '../CYStroke';
import { Message } from './Message';

export interface MessageArrowCreator extends Message {
    safeMargin: number;
    connectPointPositionPair: ConnectPointPositionPair;
    stroke: CYStroke;
}