import { Message } from "../Message";

// Framer模組專用的基底屬性
export type FramerMode = "topAndBottom" | "leftAndRight" | "all";
export interface MessageFramer extends Message {
  mode: FramerMode;
}
