import * as FUND from "./fundamental-module";

export async function makeLorem(mode: string, length: string) {
  // if (figma.currentPage.selection.length === 0) {
  //   return;
  // }

  // const selectedNode = figma.currentPage.selection[0];
  // if (selectedNode.type !== "TEXT") {
  //   figma.notify("請選中單一文字圖層");
  //   return;
  // }

  // const temp = [selectedNode];

  const selection = FUND.makeCurrentSelection();
  if (selection == null) {
    return;
  }

  const textNodes = selection.filter(
    (node) => node.type === "TEXT"
  ) as Array<TextNode>;

  if (textNodes == null) {
    return;
  }

  loadFonts(textNodes)
    .then(() => {
      const EN_LOREM_IPSUM =
        "Design is akin to playing an elegant melody, teeming with endless possibilities. Every designer, akin to a musician, weaves elements into beautiful chords, crafting unforgettable visual experiences. Each design begins with an ostensibly insignificant 'note', the cornerstone of the entire melody. Designers harmonise lines and shapes, much like musicians composing symphonies. Challenges encountered give designs depth and the melody tension, much like the highs and lows in music. Each amendment is like seeking the perfect timbre on piano keys. When the final design is unveiled, it resonates like a perfect melody, reflecting the effort behind each note. Design isn't merely visual art; it's an expression of emotion, thought, and soul, akin to the most touching melody, resonating with our hearts.";
      const CN_LOREM_IPSUM =
        "設計，就像是彈奏一首優雅的旋律，充滿著無窮的可能與創新。每一個設計師，猶如一位音樂家，將不同元素、色彩和形狀編織成美麗的和弦，創造出難以忘懷的視覺經驗。每個設計的開始，就如同那第一個音符，可能微不足道，但卻是構成整體旋律的關鍵。設計師利用獨特的視野，悉心調和線條和形狀，猶如精心安排每個音符，形成和諧而動聽的樂章。過程中，設計師面對的挑戰和困難，就如同音樂家在彈奏中遇到的高低起伏。這些挑戰使設計變得更有深度和意義，使旋律更具張力與動感。每次修正，每次調整，都像是在琴鍵上滑動指尖，悉心地尋找那最和諧的音色。當最終設計成形，就像一首完美的樂曲在空氣中回盪，觀者可以感受到其背後的努力和汗水，就如同聆聽到每一個精心演繹的音符。設計不僅是創造視覺的藝術，更是情感、思考和靈魂的表達，就像那最動人的旋律，讓人心神共鳴。";

      textNodes.forEach((node) => {
        if (typeof node.fontName === "symbol") {
          return;
        }
        if (typeof node.fontSize === "symbol") {
          return;
        }
        if (typeof node.fontWeight === "symbol") {
          return;
        }
        if (typeof node.letterSpacing === "symbol") {
          return;
        }
        if (typeof node.lineHeight === "symbol") {
          return;
        }

        let text = "";
        let subLength;
        let textNodeWidth = node.width;

        switch (mode) {
          case "cn":
            text = CN_LOREM_IPSUM;
            break;
          case "en":
          default:
            text = EN_LOREM_IPSUM;
            break;
        }

        switch (length) {
          case "short":
            subLength = 100;
            break;
          case "medium":
            subLength = 200;
            break;
          case "long":
          default:
            subLength = text.length;
            break;
        }

        const result = text.slice(0, subLength);
        node.characters = result;
        node.textAutoResize = "NONE";
        node.textTruncation = "ENDING";
      });
    })
    .catch((error) => {
      console.error("Error loading fonts", error);
    });

  //   console.log("Hello from lorem");
}

async function loadFonts(nodes: Array<TextNode>) {
  const fontLoadPromises = nodes.map(async (node) => {
    if ("fontName" in node && typeof node.fontName !== "symbol") {
      await figma.loadFontAsync(node.fontName);
    }
  });

  return Promise.all(fontLoadPromises);
}
