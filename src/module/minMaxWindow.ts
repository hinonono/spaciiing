import { MessageMinMaxWindow } from './../types/Messages/MessageMinMaxWindow';

export function reception(message: MessageMinMaxWindow) {
  const { toggle } = message;
  toggleWindow(toggle);
}

function toggleWindow(shouldMinimize: boolean) {

  if (shouldMinimize) {
    figma.ui.resize(204, 50);
  } else {
    figma.ui.resize(360, 480);
  }
}
