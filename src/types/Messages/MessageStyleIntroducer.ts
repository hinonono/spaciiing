import { StyleListItemFrontEnd, StyleSelection } from "../General";
import { Message } from "./Message";
import { ExternalMessage } from "./ExternalMessage";

export type StyleModeForFigmaStyle = "COLOR" | "EFFECT" | "TEXT";
export type StyleModeForFigmaVariable = "COLOR" | "FLOAT" | "STRING";
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

export interface ColorPreviewResources {
  type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND",
  opacity: number,
  colors?: RGBA[],
  gradientTransform?: Transform[],
  gradientStops?: ColorStop[][]
}

export interface PreviewResources {
  colors?: ColorPreviewResources,
  effects?: Effect[],
  textStyle?: TextStyle,
  numbers?: number[],
  strings?: string[],
}

export interface AliasResources {
  aliasNames?: (string | undefined)[],
  variableModes?: string[],
  aliasVariableIds?: (string | undefined)[]
}