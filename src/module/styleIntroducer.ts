import { StyleListItemFrontEnd } from "../types/General";
import {
  ExternalMessageUpdatePaintStyleList,
  MessageStyleIntroducer,
  StyleMode,
} from "../types/Messages/MessageStyleIntroducer";
import * as util from "./util";

export const reception = async (message: MessageStyleIntroducer) => {
  if (message.phase === "Init") {
    const styleList = await getStyleList(message.styleMode);

    const externalMessage: ExternalMessageUpdatePaintStyleList = {
      module: "StyleIntroducer",
      mode: "UpdateStyleList",
      styleList: styleList,
      direction: "Outer",
      phase: "Init",
    };
    util.sendMessageBack(externalMessage);
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

async function applyStyleIntroducer(message: MessageStyleIntroducer) {
  const { styleSelection } = message;

  if (!styleSelection) {
    throw new Error("styleSelection is required");
  }
  const { title, scopes } = styleSelection;

  const paintStyleList = await figma.getLocalPaintStylesAsync();
  const selectedPaintStyleList = paintStyleList.filter((paintStyle) =>
    scopes.includes(paintStyle.id)
  );

  const viewport = util.getCurrentViewport();

  // Load all necessary fonts
  const fontsToLoad = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Semi Bold" },
  ];
  await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));

  // create explanation items
  const explanationItems: FrameNode[] = [];
  selectedPaintStyleList.forEach((member) => {
    const paint = member.paints[0];
    if (paint.type === "SOLID") {
      const solidPaint = paint as SolidPaint;

      const explanationItem = util.createExplanationItem(
        member.name.split("/").pop() || "",
        member.description,
        { family: "Inter", style: "Regular" },
        "color",
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
