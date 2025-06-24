
import { MessageLoremGenerator } from "../types/Messages/MessageLoremGenerator";
import { utils } from "./utils";

export async function makeLorem(message: MessageLoremGenerator) {
  const { length } = message;

  let textContent: string = utils.data.readEditorPreference().lorem;

  const requiredLength = {
    short: 100,
    medium: 200,
    long: 400,
  }[length];

  if (!requiredLength) {
    figma.notify("❌ Unknown length type.");
    return;
  }

  // Repeat textContent until it meets the required length
  while (textContent.length < requiredLength) {
    textContent += textContent;
  }
  textContent = textContent.slice(0, requiredLength);

  const selection = utils.editor.getCurrentSelection();

  if (selection.length === 0) {
    // 使用者沒有選擇任何物件
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    const textNode = utils.node.createTextNode(
      textContent,
      {
        family: "Inter",
        style: "Regular",
      },
      16,
      undefined,
      {
        value: 150,
        unit: "PERCENT",
      }
    );
    textNode.resize(300, textNode.height);

    // Position the text node at the center of the current viewport
    const viewport = utils.editor.getCurrentViewport();
    textNode.x = viewport.x;
    textNode.y = viewport.y;

    // Add the text node to the current page
    figma.currentPage.appendChild(textNode);

    figma.notify("✅ Lorem text is generated.");
  } else {
    // 使用者有選中物件
    for (let i = 0; i < selection.length; i++) {
      const element = selection[i];
      // Check if the selected node is a TextNode
      if (element.type === "TEXT") {
        if (element.fontName !== figma.mixed) {
          await figma.loadFontAsync(element.fontName);
          element.characters = textContent;
        } else {
          figma.notify("❌ Mixed fonts are not supported.");
        }
      }
    }
  }
}
