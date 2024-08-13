import { Message } from "../Message";

// Lorem Generator專用的基底屬性
export type LoremSupportedLang = "zh-tw" | "en";
export type LoremLength = "short" | "medium" | "long";
export interface MessageLoremGenerator extends Message {
  lang: LoremSupportedLang;
  length: LoremLength;
}
