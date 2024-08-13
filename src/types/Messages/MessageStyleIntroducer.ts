import { StyleListItemFrontEnd, StyleSelection } from "../General";
import { ExternalMessage, Message } from "../Message";

export type StyleMode = "COLOR" | "EFFECT" | "TEXT";
export type StyleForm = "STYLE" | "VARIABLE";

export interface MessageStyleIntroducer extends Message {
  form: StyleForm;
  styleMode: StyleMode;
  styleSelection?: StyleSelection;
}

export interface ExternalMessageUpdatePaintStyleList extends ExternalMessage {
  styleList: StyleListItemFrontEnd[];
}
