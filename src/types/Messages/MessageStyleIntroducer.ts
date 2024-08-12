import { PaintStyleFrontEnd } from "../General";
import { ExternalMessage, Message } from "../Message";

export interface MessageStyleIntroducer extends Message {}

export interface ExternalMessageUpdatePaintStyleList extends ExternalMessage {
  paintStyleList: PaintStyleFrontEnd[];
}