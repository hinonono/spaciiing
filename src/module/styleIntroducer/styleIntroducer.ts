import {
  ExternalMessageUpdatePaintStyleList,
  MessageStyleIntroducer,
} from "../../types/Messages/MessageStyleIntroducer";
import { utils } from "../utils";

import * as CLUtil from "../catalogue/catalogueUtil";

import * as SIStyle from "./style"
import * as SIVariable from "./variable";


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

  const validateMode = isStyleForm ? CLUtil.isStyleModeForFigmaStyle : CLUtil.isStyleModeForFigmaVariable;

  if (!validateMode(styleMode)) {
    throw new Error(
      `Invalid styleMode: Expected ${isStyleForm ? "StyleModeForFigmaStyle" : "StyleModeForFigmaVariable"}, got ${styleMode}`
    );
  }

  const getList = isStyleForm ? CLUtil.getStyleList : CLUtil.getVariableList;
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
    SIStyle.applyStyleIntroducer(message);
  } else if (form === "VARIABLE") {
    SIVariable.applyStyleIntroducerForVariable(message);
  }
}