import { PaintStyleFrontEnd, StyleSelection } from "../General";
import { ExternalMessage, Message } from "../Message";

export interface MessageStyleIntroducer extends Message {
  styleSelection: StyleSelection;
}

export interface ExternalMessageUpdatePaintStyleList extends ExternalMessage {
  paintStyleList: PaintStyleFrontEnd[];
}