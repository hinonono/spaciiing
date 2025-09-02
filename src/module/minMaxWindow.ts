import { MessageMinMaxWindow } from './../types/Messages/MessageMinMaxWindow';
import info from "../info.json";

export function reception(message: MessageMinMaxWindow) {
  const { toggle } = message;
  toggleWindow(toggle);
}

function toggleWindow(shouldMinimize: boolean) {
  const compactWindowSize = info.windowSize.compact;
  const defaultWindowSize = info.windowSize.default;

  if (shouldMinimize) {
    figma.ui.resize(compactWindowSize.width, compactWindowSize.height);
  } else {
    figma.ui.resize(defaultWindowSize.width, defaultWindowSize.height);
  }
}
