import { Message } from "../Message";

export interface MessageResize extends Message {
  width: number;
  height: number;
}
