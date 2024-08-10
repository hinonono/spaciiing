import { MessageResize } from "../types/Message";

export function reception(message: MessageResize) {
  const { width, height } = message;
  resize(width, height);
}

function resize(width: number, height: number) {
  const newWidth = width < 380 ? 380 : width;
  const newHeight = height < 500 ? 500 : height;
  figma.ui.resize(newWidth, newHeight);
}
