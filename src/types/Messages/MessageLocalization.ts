import { ExternalMessage, Message } from "../Message";

export interface MessageLocalization extends Message {
  lang: string;
}

export interface ExternalMessageLocalization extends ExternalMessage {
  lang: string;
}
