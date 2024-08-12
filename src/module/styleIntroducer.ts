import { PaintStyleFrontEnd } from "../types/General";
import {
  ExternalMessageUpdatePaintStyleList,
  MessageStyleIntroducer,
} from "../types/Messages/MessageStyleIntroducer";
import * as util from "./util";

export const reception = async (message: MessageStyleIntroducer) => {
  if (message.phase === "Init") {
    const paintStyleList = await getPaintStyleList();
    const message: ExternalMessageUpdatePaintStyleList = {
      module: "StyleIntroducer",
      mode: "UpdatePaintStyleList",
      paintStyleList: paintStyleList,
      direction: "Outer",
      phase: "Init",
    };
    util.sendMessageBack(message);
  }

  if (message.phase === "Actual") {
    applyStyleIntroducer(message);
  }
};

async function getPaintStyleList(): Promise<PaintStyleFrontEnd[]> {
  const paintStyleList = await figma.getLocalPaintStylesAsync();

  return paintStyleList.map((paintStyle) => ({
    id: paintStyle.id,
    name: paintStyle.name,
  }));
}

async function applyStyleIntroducer(message: MessageStyleIntroducer) {
  const { styleSelection } = message;
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
      const explanationItem = util.createExplanationItem(
        member.name.split("/").pop() || "",
        member.description,
        { family: "Inter", style: "Regular" },
        "color",
        member.id
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
  explanationWrapper.primaryAxisSizingMode = "AUTO";
  explanationWrapper.counterAxisSizingMode = "AUTO";
  explanationWrapper.x = viewport.x;
  explanationWrapper.y = viewport.y;

  figma.currentPage.appendChild(explanationWrapper);
  figma.currentPage.selection = [explanationWrapper];
}
