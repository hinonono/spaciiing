import { MessageResize } from "../types/Messages/MessageResize";

export function reception(message: MessageResize) {
  const { width, height } = message;
  resize(width, height);
}

function resize(width: number, height: number) {
  const minWidth = 204;
  const minHeight = 48;

  const maxWidth = 640;
  const maxHeight = 720;

  const newWidth = Math.round(Math.max(minWidth, Math.min(width, maxWidth)));
  const newHeight = Math.round(Math.max(minHeight, Math.min(height, maxHeight)));

  figma.ui.resize(newWidth, newHeight);
}
