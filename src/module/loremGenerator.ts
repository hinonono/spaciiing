import { MessageLoremGenerator } from "../types/Message";
import * as util from "./util";
import loremText from "../assets/loremText.json";

export async function makeLorem(message: MessageLoremGenerator) {
  const { lang, length } = message;

  const textContentMap: { [key: string]: string } = loremText;

  let textContent: string = textContentMap[lang];

  switch (length) {
    case "short":
      textContent = textContent.slice(0, 100);
      break;
    case "medium":
      textContent = textContent.slice(0, 200);
      break;
    case "long":
      // use the whole text, no slicing needed
      break;
    default:
      figma.notify("❌ Unknown length type.");
      return;
  }

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // Create a new text node and set its content
  const textNode = figma.createText();
  textNode.characters = textContent;
  textNode.fontSize = 20;

  // Position the text node at the center of the current viewport
  const viewport = util.getCurrentViewport();
  textNode.x = viewport.x;
  textNode.y = viewport.y;

  // Add the text node to the current page
  figma.currentPage.appendChild(textNode);

  figma.notify("✅ Lorem text is generated.");
}
