import {
  ExternalMessageUpdatePaintStyleList,
  MessageStyleIntroducer,
} from "../../types/Messages/MessageStyleIntroducer";
import { CatalogueKit } from "../catalogue";
import { utils } from "../utils";
import { styleIntroducer } from "./index";


export function reception(message: MessageStyleIntroducer) {
  if (message.phase === "Init") {
    initStageHandler(message);
  } else if (message.phase === "Actual") {
    actualStageHandler(message);
  }
};

async function initStageHandler(message: MessageStyleIntroducer) {
  const { form, styleMode } = message;

  const isStyleForm = form === "STYLE";
  const isVariableForm = form === "VARIABLE";

  const validateMode = isStyleForm ? CatalogueKit.util.isStyleModeForFigmaStyle : CatalogueKit.util.isStyleModeForFigmaVariable;

  if (!validateMode(styleMode)) {
    throw new Error(
      `Invalid styleMode: Expected ${isStyleForm ? "StyleModeForFigmaStyle" : "StyleModeForFigmaVariable"}, got ${styleMode}`
    );
  }

  const getList = isStyleForm ? CatalogueKit.util.getStyleList : CatalogueKit.util.getVariableList;
  const styleList = await getList(styleMode as any); // TS needs a hint here

  const externalMessage: ExternalMessageUpdatePaintStyleList = {
    module: "StyleIntroducer",
    mode: "UpdateStyleList",
    styleList: styleList,
    direction: "Outer",
    phase: "Init",
  };
  utils.communication.sendMessageBack(externalMessage);
}

function actualStageHandler(message: MessageStyleIntroducer) {
  const { form } = message

  if (form === "STYLE") {
    styleIntroducer.style.applyStyleIntroducer(message);
  } else if (form === "VARIABLE") {
    styleIntroducer.variable.applyStyleIntroducer(message);
  }
}