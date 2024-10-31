import { Message } from "./Message";
import { ExternalMessage } from "./ExternalMessage";

export interface MessageLocalization extends Message {
  lang: string;
}

export interface ExternalMessageLocalization extends ExternalMessage {
  lang: string;
}
