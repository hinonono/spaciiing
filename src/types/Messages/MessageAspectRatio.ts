import { Dimension } from "../General";
import { Message } from "./Message";

export interface MessageAspectRatio extends Message {
  lockedDimension: Dimension;
  isCustomAspectRatio: boolean;
  widthRatio: number;
  heightRatio: number;
}
