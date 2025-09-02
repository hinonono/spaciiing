import { MessageResize } from "../types/Messages/MessageResize";
import info from "../info.json";

export function reception(message: MessageResize) {
  const { width, height } = message;
  resize(width, height);
}

function resize(width: number, height: number) {
  const compactWindowSize = info.windowSize.compact;
  const expandedWindowSize = info.windowSize.expanded;

  const newWidth = Math.round(Math.max(compactWindowSize.width, Math.min(width, expandedWindowSize.width)));
  const newHeight = Math.round(Math.max(compactWindowSize.height, Math.min(height, expandedWindowSize.height)));

  figma.ui.resize(newWidth, newHeight);
}
