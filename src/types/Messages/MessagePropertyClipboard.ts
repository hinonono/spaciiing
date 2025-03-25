import { ComponentPropertiesFrontEnd, PropertyClipboardSupportedProperty } from "../PropertClipboard";
import { ExternalMessage } from "./ExternalMessage";
import { Message } from "./Message";

export interface MessagePropertyClipboard extends Message {
  action: PropertyClipboardAction;
  property?: PropertyClipboardSupportedProperty[];
  behavior?: PasteBehavior;
  instanceProperty?: ComponentPropertiesFrontEnd[];
}

export type PropertyClipboardAction =
  | "setReferenceObject"
  | "pastePropertyToObject";

export type PasteBehavior = "pasteToIncrement" | "pasteToReplace";

export interface ExternalMessageShowNestedComponentProperties extends ExternalMessage {
  extractedProperties: ComponentPropertiesFrontEnd[]
}
