import { StyleListItemFrontEnd } from "../types/General";
import {
  ExternalMessageUpdatePaintStyleList,
  MessageStyleIntroducer,
  StyleMode,
} from "../types/Messages/MessageStyleIntroducer";
import * as util from "./util";

export const reception = async (message: MessageStyleIntroducer) => {
  if (message.phase === "Init") {
    if (message.form === "STYLE") {
      const styleList = await getStyleList(message.styleMode);

      const externalMessage: ExternalMessageUpdatePaintStyleList = {
        module: "StyleIntroducer",
        mode: "UpdateStyleList",
        styleList: styleList,
        direction: "Outer",
        phase: "Init",
      };
      util.sendMessageBack(externalMessage);

    } else if (message.form === "VARIABLE") {
      // 获取变量列表
      const variableList = await getVariableList();
      const externalMessage: ExternalMessageUpdatePaintStyleList = {
        module: "StyleIntroducer",
        mode: "UpdateStyleList",
        styleList: variableList,
        direction: "Outer",
        phase: "Init",
      };
      util.sendMessageBack(externalMessage);
    }
  }

  if (message.phase === "Actual") {
    applyStyleIntroducer(message);
  }
};

async function getStyleList(
  styleType: StyleMode
): Promise<StyleListItemFrontEnd[]> {
  let styleList;
  switch (styleType) {
    case "COLOR":
      styleList = await figma.getLocalPaintStylesAsync();
      break;
    case "TEXT":
      styleList = await figma.getLocalTextStylesAsync();
      break;
    case "EFFECT":
      styleList = await figma.getLocalEffectStylesAsync();
      break;
    default:
      throw new Error("Invalid style type");
  }

  return styleList.map((style) => ({
    id: style.id,
    name: style.name,
  }));
}

async function getVariableList(): Promise<StyleListItemFrontEnd[]> {
  const variableList = await figma.variables.getLocalVariablesAsync("COLOR");

  return variableList.map((variable) => ({
    id: variable.id,
    name: variable.name,
  }));
}

async function applyStyleIntroducer(message: MessageStyleIntroducer) {
  const { styleSelection, styleMode } = message;

  if (!styleSelection) {
    throw new Error("styleSelection is required");
  }
  const { title, scopes } = styleSelection;

  const viewport = util.getCurrentViewport();
  const fontsToLoad = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Semi Bold" },
  ];
  await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));

  const fontName = { family: "Inter", style: "Regular" };
  // create explanation items
  const explanationItems: FrameNode[] = [];

  let styleList;
  switch (styleMode) {
    case "COLOR":
      styleList = await figma.getLocalPaintStylesAsync();
      break;
    case "TEXT":
      styleList = await figma.getLocalTextStylesAsync();
      break;
    case "EFFECT":
      styleList = await figma.getLocalEffectStylesAsync();
      break;
    default:
      throw new Error("Invalid style type");
  }
  const selectedStyleList = styleList.filter((style) =>
    scopes.includes(style.id)
  );

  if (styleMode === "COLOR") {
    const paintStyleList = selectedStyleList as PaintStyle[];

    paintStyleList.forEach((member) => {
      const paint = member.paints[0];
      if (paint.type === "SOLID") {
        const solidPaint = paint as SolidPaint;

        const explanationItem = util.createExplanationItem(
          member.name.split("/").pop() || "",
          member.description,
          fontName,
          "COLOR",
          {
            r: solidPaint.color.r,
            g: solidPaint.color.g,
            b: solidPaint.color.b,
          }
        );
        explanationItem.primaryAxisSizingMode = "AUTO";
        explanationItem.counterAxisSizingMode = "AUTO";

        explanationItems.push(explanationItem);
      }
    });
  } else if (styleMode === "TEXT") {
    const textStyleList = selectedStyleList as TextStyle[];
    textStyleList.forEach((member) => {
      const explanationItem = util.createExplanationItem(
        member.name.split("/").pop() || "",
        member.description,
        fontName,
        "TEXT",
        undefined,
        undefined
      );
      explanationItem.primaryAxisSizingMode = "AUTO";
      explanationItem.counterAxisSizingMode = "AUTO";

      explanationItems.push(explanationItem);
    });
  } else if (styleMode === "EFFECT") {
    const effectStyleList = selectedStyleList as EffectStyle[];

    effectStyleList.forEach((member) => {
      const effects = [...member.effects]; // Create a copy of the readonly array
      const explanationItem = util.createExplanationItem(
        member.name.split("/").pop() || "",
        member.description,
        fontName,
        "EFFECT",
        undefined,
        effects
      );
      explanationItem.primaryAxisSizingMode = "AUTO";
      explanationItem.counterAxisSizingMode = "AUTO";

      explanationItems.push(explanationItem);
    });
  }

  const explanationWrapper = util.createExplanationWrapper(
    explanationItems,
    title,
    "Usage Definition",
    { family: "Inter", style: "Semi Bold" }
  );

  explanationWrapper.fills = [
    {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 },
    },
  ];

  explanationWrapper.name = `Usage Definition of ${title}`;

  // Set corner radius
  explanationWrapper.cornerRadius = 16;
  // Set the width and height to hug contents
  explanationWrapper.primaryAxisSizingMode = "AUTO"; // This makes the height hug the content
  explanationWrapper.counterAxisSizingMode = "FIXED"; // This ensures the width is fixed

  // Set the fixed width and initial height
  explanationWrapper.resize(480, explanationWrapper.height);

  explanationWrapper.x = viewport.x;
  explanationWrapper.y = viewport.y;

  figma.currentPage.appendChild(explanationWrapper);
  figma.currentPage.selection = [explanationWrapper];
}
