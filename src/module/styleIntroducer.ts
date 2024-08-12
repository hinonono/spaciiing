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
};

async function getPaintStyleList(): Promise<PaintStyleFrontEnd[]> {
  const paintStyleList = await figma.getLocalPaintStylesAsync();

  return paintStyleList.map((paintStyle) => ({
    id: paintStyle.id,
    name: paintStyle.name,
  }));
}
