import { text } from "@fortawesome/fontawesome-svg-core";
import * as FUND from "./fundamental-module";

export function genTypography() {
  const style = [
    [28, "bold"],
    [22, "bold"],
    [20, "bold"],
    [17, "bold"],
    [16, "bold"],
    [16, "regular"],
    [14, "regular"],
    [14, "bold"],
    [12, "regular"],
  ];
  var texts: Array<any> = [];
  var viewport = FUND.getUserCurrentViewVectior();

  const loadFonts = async () => {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

    console.log("Awaiting the fonts.");
  };

  loadFonts().then(() => {
    for (let i = 0; i < style.length; i++) {
      const text = figma.createText();
      text.characters =
        "PingFang-TC/" + String(style[i][0]) + "_" + String(style[i][1]);

      text.x = viewport.x;
      text.y = viewport.y + 50 * i;
      text.fontSize = Number(style[i][0]);
      text.lineHeight = { value: 150, unit: "PERCENT" };

      if (style[i][1] == "regular") {
        text.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];
      } else {
        text.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
      }
      texts.push(text);
    }
    figma.notify(
      "基於插件限制，請記得使用「Text Style Generator」插件建立Style。"
    );

    // Select the created text node
    figma.currentPage.selection = texts;

    // Zoom to fit the selected node in the viewport
    figma.viewport.scrollAndZoomIntoView(texts);
  });
}

export function genColorStyle(myColors: Array<FUND.myColor>) {
  myColors.forEach((item) => {
    const style = figma.createPaintStyle();
    style.name = `${item.myStyle.series}/${item.myStyle.name}`;
    style.paints = [
      {
        type: "SOLID",
        color: {
          r: mapToUnitRange(item.color.r),
          g: mapToUnitRange(item.color.g),
          b: mapToUnitRange(item.color.b),
        },
        opacity: item.color.a,
      },
    ];
    style.description =
      item.myStyle.comment === undefined ? "" : item.myStyle.comment;
  });
}

function mapToUnitRange(value: number): number {
  if (value < 0) {
    return 0;
  } else if (value > 255) {
    return 1;
  } else {
    return value / 255;
  }
}

export function genDropShadowStyle(styles: Array<FUND.myDropShadowEffect>) {
  styles.forEach((item) => {
    const style = figma.createEffectStyle();
    style.name = `${item.myStyle.series}/${item.myStyle.name}`;
    style.description =
      item.myStyle.comment === undefined ? "" : item.myStyle.comment;
    style.effects = item.effect;
  });
}

export async function genTooltip(
  colors: Array<FUND.myColor> | Array<FUND.myDropShadowEffect>
) {
  const response = await figma.loadFontAsync({
    family: "Inter",
    style: "Regular",
  });

  const viewport = FUND.getUserCurrentViewVectior();
  var text = `【${colors[0].myStyle.series}】使用案例說明：\n\n`;

  for (let i = 0; i < colors.length; i++) {
    var comment =
      colors[i].myStyle.comment == undefined ? "" : colors[i].myStyle.comment;
    var temp = `${colors[i].myStyle.name}：${comment}\n`;
    text += temp;
  }

  // Create a text node
  const textNode = figma.createText();

  // Set the text content
  textNode.characters = text;
  textNode.fontSize = 24;
  textNode.x = viewport.x;
  textNode.y = viewport.y;

  // Add the text node to the current page
  figma.currentPage.appendChild(textNode);

  // Select the created text node
  figma.currentPage.selection = [textNode];

  // Zoom to fit the selected node in the viewport
  figma.viewport.scrollAndZoomIntoView([textNode]);
}

export async function genTextToStyle() {
  console.log("wffwef");
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

        const newTextStyle = figma.createTextStyle();
        newTextStyle.name = node.characters;
        newTextStyle.fontSize = node.fontSize;
        newTextStyle.textDecoration = "NONE";
        newTextStyle.fontName = node.fontName;
        newTextStyle.letterSpacing = node.letterSpacing;
        newTextStyle.lineHeight = node.lineHeight;
      });
    })
    .catch((error) => {
      console.error("Error loading fonts", error);
    });
  figma.notify("Text Style生成成功！");
}

async function loadFonts(nodes: Array<TextNode>) {
  const fontLoadPromises = nodes.map(async (node) => {
    if ("fontName" in node && typeof node.fontName !== "symbol") {
      await figma.loadFontAsync(node.fontName);
    }
  });

  return Promise.all(fontLoadPromises);
}

export function genTextVisible() {
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

        node.characters = "顯形";
      });
    })
    .catch((error) => {
      console.error("Error loading fonts", error);
    });
  figma.notify("文字顯形了！");
}
