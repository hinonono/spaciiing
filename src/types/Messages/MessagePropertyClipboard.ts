import { PropertyClipboardSupportedProperty } from "../PropertClipboard";
import { Message } from "./Message";

export interface MessagePropertyClipboard extends Message {
  action: PropertyClipboardAction;
  property?: PropertyClipboardSupportedProperty[];
}

export type PropertyClipboardAction =
  | "setReferenceObject"
  | "pastePropertyToObject";
