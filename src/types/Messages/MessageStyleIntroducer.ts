import { StyleListItemFrontEnd, StyleSelection } from "../General";
import { ExternalMessage, Message } from "../Message";

export type StyleMode = "COLOR" | "EFFECT" | "TEXT";

export interface MessageStyleIntroducer extends Message {
  styleSelection?: StyleSelection;
  styleMode: StyleMode;
}

export interface ExternalMessageUpdatePaintStyleList extends ExternalMessage {
  styleList: StyleListItemFrontEnd[];
}
