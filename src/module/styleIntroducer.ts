import {
  ExternalMessageUpdatePaintStyleList,
  MessageStyleIntroducer,
} from "../types/Messages/MessageStyleIntroducer";
import * as util from "./util";
import * as typeChecking from "./typeChecking";
import * as explanation from "./explanation";
import * as styledTextSegments from "./styledTextSegments";

import * as CLItemLink from "./catalogue/catalogueItemLink"
import * as CLUtil from "./catalogue/catalogueUtil";
import * as CLVar from "./catalogue/catalogueVariable";

import { semanticTokens } from "./tokens";

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
  util.sendMessageBack(externalMessage);


  // if (form === "STYLE") {
  //   if (!isStyleModeForFigmaStyle(styleMode)) {
  //     throw new Error(
  //       `Invalid styleMode: styleMode must be of type StyleModeForFigmaStyle. Current type is ${styleMode}`
  //     );
  //   }

  //   const styleList = await getStyleList(styleMode);

  //   const externalMessage: ExternalMessageUpdatePaintStyleList = {
  //     module: "StyleIntroducer",
  //     mode: "UpdateStyleList",
  //     styleList: styleList,
  //     direction: "Outer",
  //     phase: "Init",
  //   };
  //   util.sendMessageBack(externalMessage);

  // } else if (form === "VARIABLE") {
  //   if (!isStyleModeForFigmaVariable(styleMode)) {
  //     throw new Error(
  //       `Invalid styleMode: styleMode must be of type StyleModeForFigmaVariable. Current type is ${styleMode}`
  //     );
  //   }

  //   // 获取变量列表
  //   const variableList = await getVariableList(styleMode);

  //   const externalMessage: ExternalMessageUpdatePaintStyleList = {
  //     module: "StyleIntroducer",
  //     mode: "UpdateStyleList",
  //     styleList: variableList,
  //     direction: "Outer",
  //     phase: "Init",
  //   };
  //   util.sendMessageBack(externalMessage);
  // }
}

function actualStageHandler(message: MessageStyleIntroducer) {
  if (message.form === "STYLE") {
    applyStyleIntroducer(message);
  } else if (message.form === "VARIABLE") {
    applyStyleIntroducerForVariable(message);
  }
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

        const explanationItem = explanation.createExplanationItem(
          "STYLE",
          member.id,
          member.name.split("/").pop() || "",
          member.description,
          fontName,
          "COLOR",
          [
            {
              r: solidPaint.color.r,
              g: solidPaint.color.g,
              b: solidPaint.color.b,
              a: 1,
            },
          ],
          undefined,
          undefined,
          undefined,
          undefined
        );

        explanationItem.primaryAxisSizingMode = "AUTO";
        explanationItem.counterAxisSizingMode = "AUTO";

        explanationItems.push(explanationItem);
      }
    });
  } else if (styleMode === "TEXT") {
    const textStyleList = selectedStyleList as TextStyle[];
    textStyleList.forEach((member) => {
      const explanationItem = explanation.createExplanationItem(
        "STYLE",
        member.id,
        member.name.split("/").pop() || "",
        member.description,
        fontName,
        "TEXT",
        undefined,
        undefined,
        member,
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
      const effects = [...member.effects];
      const explanationItem = explanation.createExplanationItem(
        "STYLE",
        member.id,
        member.name.split("/").pop() || "",
        member.description,
        fontName,
        "EFFECT",
        undefined,
        effects,
        undefined,
        undefined,
        undefined
      );

      explanationItem.primaryAxisSizingMode = "AUTO";
      explanationItem.counterAxisSizingMode = "AUTO";

      explanationItems.push(explanationItem);
    });
  }

  const explanationWrapper = explanation.createExplanationWrapper(
    "STYLE",
    explanationItems,
    title == "" ? "Styles" : title,
    "Catalogue",
    { family: "Inter", style: "Semi Bold" }
  );

  explanationWrapper.fills = [
    {
      type: "SOLID",
      color: semanticTokens.background.primary,
    },
  ];

  explanationWrapper.name = `Catalogue`;

  // Set corner radius
  explanationWrapper.cornerRadius = 16;
  // Set the width and height to hug contents
  explanationWrapper.primaryAxisSizingMode = "AUTO"; // This makes the height hug the content
  explanationWrapper.counterAxisSizingMode = "FIXED"; // This ensures the width is fixed

  explanationWrapper.x = viewport.x;
  explanationWrapper.y = viewport.y;

  figma.currentPage.appendChild(explanationWrapper);
  figma.currentPage.selection = [explanationWrapper];
}

async function applyStyleIntroducerForVariable(
  message: MessageStyleIntroducer
) {
  const { styleSelection, styleMode } = message;
  if (!styleSelection) {
    throw new Error("styleSelection is required");
  }
  const { title, scopes } = styleSelection;

  const viewport = util.getCurrentViewport();
  //是否啟用cataloge item link功能
  const isCatalogueItemLinkFeatureAvailable = CLItemLink.checkCatalogueItemLinkFeatureAvailability();

  const fontsToLoad = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Semi Bold" },
  ];
  await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));

  const fontName = { family: "Inter", style: "Regular" };

  let localVariables;
  switch (styleMode) {
    case "COLOR":
      localVariables = await figma.variables.getLocalVariablesAsync("COLOR");
      break;
    case "FLOAT":
      localVariables = await figma.variables.getLocalVariablesAsync("FLOAT");
      break;
    case "STRING":
      localVariables = await figma.variables.getLocalVariablesAsync("STRING");
      // console.log("Local", localVariables)
      break;
    default:
      throw new Error("Invalid style type");
  }
  if (!localVariables) {
    throw new Error("Termination due to styleList is undefined.");
  }

  // 過濾出所選擇的變數
  const selectedVariables = localVariables.filter((variable) =>
    scopes.includes(variable.id)
  );

  console.log("SELECTED VARIABLES", selectedVariables)

  // 抓取所選擇的變數們他們所屬的Collection ID
  const variableCollectionId =
    selectedVariables[selectedVariables.length - 1].variableCollectionId;

  const variableCollection =
    await figma.variables.getVariableCollectionByIdAsync(variableCollectionId);
  if (!variableCollection) {
    throw new Error("Termination due to variableCollection is null.");
  }

  //
  const modeNames = variableCollection.modes.map((mode) => mode.name);

  // create explanation items
  const explanationItems: FrameNode[] = [];

  if (styleMode === "COLOR") {
    for (const variable of selectedVariables) {
      const aliasName: (string | undefined)[] = [];
      const aliasVariableIds: (string | undefined)[] = [];
      const colorValues: (RGBA | null)[] = [];

      for (const [modeId, value] of Object.entries(variable.valuesByMode)) {
        if (!typeChecking.isVariableAliasType(value)) {
          aliasName.push(undefined);
          aliasVariableIds.push(undefined);
        } else {
          const aliasVariable = localVariables.find((v) => v.id === value.id);
          if (!aliasVariable) {
            throw new Error("Termination due to aliasVariable is null.");
          }
          aliasName.push(aliasVariable.name);
          aliasVariableIds.push(aliasVariable.id);
        }

        const color = await CLVar.resolveToActualRgbaValue(value);
        colorValues.push(color);
      }

      const filteredColorValues = colorValues.filter((v): v is RGBA => v !== null);

      console.log({ filteredColorValues: filteredColorValues, modeNames: modeNames, aliasName: aliasName, aliasVariableIds: aliasVariableIds });

      const explanationItem = explanation.createExplanationItem(
        "VARIABLE",
        variable.id,
        variable.name.split("/").pop() || "",
        variable.description,
        fontName,
        "COLOR",
        filteredColorValues,
        undefined,
        undefined,
        undefined,
        undefined,
        aliasName,
        modeNames,
        aliasVariableIds
      );

      explanationItem.primaryAxisSizingMode = "AUTO";
      explanationItem.counterAxisSizingMode = "AUTO";

      if (isCatalogueItemLinkFeatureAvailable.availability && isCatalogueItemLinkFeatureAvailable.url) {
        const url = styledTextSegments.generateFigmaUrlWithNodeId(isCatalogueItemLinkFeatureAvailable.url, explanationItem.id);
        styledTextSegments.writeCatalogueItemUrlToRoot(variable.id, url);
      }

      explanationItems.push(explanationItem);
      // console.log("Explanation Item", explanationItem);
    }
  } else if (styleMode === "FLOAT") {
    for (const variable of selectedVariables) {
      const aliasName: (string | undefined)[] = [];
      const aliasVariableIds: (string | undefined)[] = [];
      const numberValues: (number | null)[] = [];

      for (const [modeId, value] of Object.entries(variable.valuesByMode)) {
        if (!typeChecking.isVariableAliasType(value)) {
          aliasName.push(undefined);
          aliasVariableIds.push(undefined);
        } else {
          const aliasVariable = localVariables.find((v) => v.id === value.id);
          if (!aliasVariable) {
            throw new Error("Termination due to aliasVariable is null.");
          }
          aliasName.push(aliasVariable.name);
          aliasVariableIds.push(aliasVariable.id);
        }

        const number = await CLVar.resolveToActualNumberValue(value);
        numberValues.push(number);
      }

      const filteredNumberValues = numberValues.filter((v): v is number => v !== null);

      // Variable模式，建立數字用的說明物件

      console.log({ filteredNumberValues: filteredNumberValues, modeNames: modeNames });

      const explanationItem = explanation.createExplanationItem(
        "VARIABLE",
        variable.id,
        variable.name.split("/").pop() || "",
        variable.description,
        fontName,
        "FLOAT",
        undefined,
        undefined,
        undefined,
        filteredNumberValues,
        undefined,
        aliasName,
        modeNames,
        aliasVariableIds
      );

      explanationItem.primaryAxisSizingMode = "AUTO";
      explanationItem.counterAxisSizingMode = "AUTO";

      if (isCatalogueItemLinkFeatureAvailable.availability && isCatalogueItemLinkFeatureAvailable.url) {
        const url = styledTextSegments.generateFigmaUrlWithNodeId(isCatalogueItemLinkFeatureAvailable.url, explanationItem.id);
        styledTextSegments.writeCatalogueItemUrlToRoot(variable.id, url);
      }

      explanationItems.push(explanationItem);
      // console.log("Explanation Item", explanationItem);
    }
  } else if (styleMode === "STRING") {
    console.log("STRING MODE IS HERE")
    for (const variable of selectedVariables) {
      const aliasName: (string | undefined)[] = [];
      const aliasVariableIds: (string | undefined)[] = [];
      const stringValues: (string | null)[] = [];

      for (const [modeId, value] of Object.entries(variable.valuesByMode)) {
        if (!typeChecking.isVariableAliasType(value)) {
          aliasName.push(undefined);
          aliasVariableIds.push(undefined);
        } else {
          const aliasVariable = localVariables.find((v) => v.id === value.id);
          if (!aliasVariable) {
            throw new Error("Termination due to aliasVariable is null.");
          }
          aliasName.push(aliasVariable.name);
          aliasVariableIds.push(aliasVariable.id);
        }

        const string = await CLVar.resolveToActualStringValue(value);
        stringValues.push(string);
      }

      const filteredStringValues = stringValues.filter((v): v is string => v !== null);

      console.log({ filteredStringValues: filteredStringValues, modeNames: modeNames });

      const explanationItem = explanation.createExplanationItem(
        "VARIABLE",
        variable.id,
        variable.name.split("/").pop() || "",
        variable.description,
        fontName,
        "STRING",
        undefined,
        undefined,
        undefined,
        undefined,
        filteredStringValues,
        aliasName,
        modeNames,
        aliasVariableIds
      );

      explanationItem.primaryAxisSizingMode = "AUTO";
      explanationItem.counterAxisSizingMode = "AUTO";

      if (isCatalogueItemLinkFeatureAvailable.availability && isCatalogueItemLinkFeatureAvailable.url) {
        const url = styledTextSegments.generateFigmaUrlWithNodeId(isCatalogueItemLinkFeatureAvailable.url, explanationItem.id);
        styledTextSegments.writeCatalogueItemUrlToRoot(variable.id, url);
      }

      explanationItems.push(explanationItem);
    }
  }

  if (explanationItems.length === 0) {
    throw new Error("Termination due to explanationItems length is 0.");
  }

  const explanationWrapper = explanation.createExplanationWrapper(
    "VARIABLE",
    explanationItems,
    title == "" ? "Variables" : title,
    "Catalogue",
    { family: "Inter", style: "Semi Bold" },
    isCatalogueItemLinkFeatureAvailable.availability,
    modeNames
  );

  explanationWrapper.fills = [
    {
      type: "SOLID",
      color: semanticTokens.background.primary,
    },
  ];

  explanationWrapper.name = `Catalogue`;

  // Set corner radius
  explanationWrapper.cornerRadius = 16;
  // Set the width and height to hug contents
  explanationWrapper.primaryAxisSizingMode = "AUTO"; // This makes the height hug the content
  explanationWrapper.counterAxisSizingMode = "FIXED"; // This ensures the width is fixed

  explanationWrapper.x = viewport.x;
  explanationWrapper.y = viewport.y;

  figma.currentPage.appendChild(explanationWrapper);
  figma.currentPage.selection = [explanationWrapper];
}





