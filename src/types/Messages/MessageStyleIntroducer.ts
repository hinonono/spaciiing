import { StyleListItemFrontEnd, StyleSelection } from "../General";
import { Message } from "./Message";
import { ExternalMessage } from "./ExternalMessage";

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
