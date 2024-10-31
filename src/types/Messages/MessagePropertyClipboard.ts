import { PropertyClipboardSupportedProperty } from "../PropertClipboard";
import { Message } from "./Message";

export interface MessagePropertyClipboard extends Message {
  action: PropertyClipboardAction;
  property?: PropertyClipboardSupportedProperty[];
  behavior?: PasteBehavior;
}

export type PropertyClipboardAction =
  | "setReferenceObject"
  | "pastePropertyToObject";

export type PasteBehavior = "pasteToIncrement" | "pasteToReplace";
