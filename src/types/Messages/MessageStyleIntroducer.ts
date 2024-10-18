import { StyleListItemFrontEnd, StyleSelection } from "../General";
import { Message } from "./Message";
import { ExternalMessage } from "./ExternalMessage";

export type StyleModeForFigmaStyle = "COLOR" | "EFFECT" | "TEXT";
export type StyleModeForFigmaVariable = "COLOR" | "FLOAT";
export type StyleMode = StyleModeForFigmaVariable | StyleModeForFigmaStyle;

export type StyleForm = "STYLE" | "VARIABLE";

export interface MessageStyleIntroducer extends Message {
  form: StyleForm;
  styleMode: StyleMode;
  styleSelection?: StyleSelection;
}

export interface ExternalMessageUpdatePaintStyleList extends ExternalMessage {
  styleList: StyleListItemFrontEnd[];
}
