import { StyleListItemFrontEnd } from "../types/General";
import {
  ExternalMessageUpdatePaintStyleList,
  MessageStyleIntroducer,
  StyleMode,
  StyleModeForFigmaStyle,
  StyleModeForFigmaVariable,
} from "../types/Messages/MessageStyleIntroducer";
import * as util from "./util";
import * as typeChecking from "./typeChecking";
import * as explanation from "./explanation";
import { semanticTokens } from "./tokens";

export const reception = async (message: MessageStyleIntroducer) => {
  if (message.phase === "Init") {
    if (message.form === "STYLE") {
      if (!isStyleModeForFigmaStyle(message.styleMode)) {
        throw new Error(
          `Invalid styleMode: styleMode must be of type StyleModeForFigmaStyle. Current type is ${message.styleMode}`
        );
      }

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
      if (!isStyleModeForFigmaVariable(message.styleMode)) {
        throw new Error(
          `Invalid styleMode: styleMode must be of type StyleModeForFigmaVariable. Current type is ${message.styleMode}`
        );
      }

      // 获取变量列表
      const variableList = await getVariableList(message.styleMode);
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
    if (message.form === "STYLE") {
      applyStyleIntroducer(message);
    } else if (message.form === "VARIABLE") {
      applyStyleIntroducerForVariable(message);
    }
  }
};

// Type guard function for StyleModeForFigmaStyle
function isStyleModeForFigmaStyle(
  mode: StyleMode
): mode is StyleModeForFigmaStyle {
  return mode === "COLOR" || mode === "EFFECT" || mode === "TEXT";
}

// Type guard function for StyleModeForFigmaVariable
function isStyleModeForFigmaVariable(
  mode: StyleMode
): mode is StyleModeForFigmaVariable {
  return mode === "COLOR" || mode === "FLOAT";
}

async function getStyleList(
  styleType: StyleModeForFigmaStyle
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

async function getVariableList(
  styleType: StyleModeForFigmaVariable
): Promise<StyleListItemFrontEnd[]> {
  let variableList: Variable[] | null = null;

  if (styleType === "COLOR") {
    variableList = await figma.variables.getLocalVariablesAsync("COLOR");
  } else {
    variableList = await figma.variables.getLocalVariablesAsync("FLOAT");
  }

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

        // const explanationItem = util.createExplanationItem(
        //   member.name.split("/").pop() || "",
        //   member.description,
        //   fontName,
        //   "COLOR",
        //   {
        //     r: solidPaint.color.r,
        //     g: solidPaint.color.g,
        //     b: solidPaint.color.b,
        //   }
        // );

        const explanationItem = explanation.createExplanationItem(
          "STYLE",
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
      // const explanationItem = util.createExplanationItem(
      //   member.name.split("/").pop() || "",
      //   member.description,
      //   fontName,
      //   "TEXT",
      //   undefined,
      //   undefined,
      //   member
      // );
      const explanationItem = explanation.createExplanationItem(
        "STYLE",
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
      const effects = [...member.effects]; // Create a copy of the readonly array
      // const explanationItem = util.createExplanationItem(
      //   member.name.split("/").pop() || "",
      //   member.description,
      //   fontName,
      //   "EFFECT",
      //   undefined,
      //   effects
      // );
      const explanationItem = explanation.createExplanationItem(
        "STYLE",
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

  // const explanationWrapper = util.createExplanationWrapper(
  //   explanationItems,
  //   title == "" ? "Styles" : title,
  //   "Usage Definition",
  //   { family: "Inter", style: "Semi Bold" }
  // );

  const explanationWrapper = explanation.createExplanationWrapper(
    "STYLE",
    explanationItems,
    title == "" ? "Styles" : title,
    "Usage Definition",
    { family: "Inter", style: "Semi Bold" }
  );

  explanationWrapper.fills = [
    {
      type: "SOLID",
      color: semanticTokens.background.primary,
    },
  ];

  explanationWrapper.name = `Usage Definition`;

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
      const aliasName: string[] = [];

      const values = (
        await Promise.all(
          Object.entries(variable.valuesByMode).map(async ([modeId, value]) => {
            if (typeChecking.isVariableAliasType(value)) {
              const aliasVariable = await figma.variables.getVariableByIdAsync(
                value.id
              );
              if (!aliasVariable) {
                throw new Error("Termination due to aliasVariable is null.");
              }
              aliasName.push(aliasVariable.name);

              const aliasValuesByMode = Object.entries(
                aliasVariable.valuesByMode
              );
              // Check if aliasValuesByMode contains the same modeId
              const matchedMode = aliasValuesByMode.find(
                ([aliasModeId]) => aliasModeId === modeId
              );

              if (matchedMode) {
                return [matchedMode[1]]; // Return the single value corresponding to the matched modeId
              } else {
                return aliasValuesByMode.map(([, aliasValue]) => aliasValue);
              }
            }
            return [value];
          })
        )
      )
        .flat()
        .filter(typeChecking.isRGBAType);

      if (values.length === 0) {
        throw new Error("Termination due to values of variable is undefined.");
      }

      const explanationItem = explanation.createExplanationItem(
        "VARIABLE",
        variable.name.split("/").pop() || "",
        variable.description,
        fontName,
        "COLOR",
        values,
        undefined,
        undefined,
        undefined,
        aliasName,
        modeNames
      );

      explanationItem.primaryAxisSizingMode = "AUTO";
      explanationItem.counterAxisSizingMode = "AUTO";

      explanationItems.push(explanationItem);
      console.log("Explanation Item", explanationItem);
    }
  } else if (styleMode === "FLOAT") {
    for (const variable of selectedVariables) {
      const aliasName: string[] = [];

      const values = (
        await Promise.all(
          Object.values(variable.valuesByMode).map(async (value) => {
            if (typeChecking.isVariableAliasType(value)) {
              const aliasVariable = await figma.variables.getVariableByIdAsync(
                value.id
              );
              if (!aliasVariable) {
                throw new Error("Termination due to aliasVariable is null.");
              }
              aliasName.push(aliasVariable.name);
              return Object.values(aliasVariable.valuesByMode);
            }
            return [value];
          })
        )
      )
        .flat()
        .filter(typeChecking.isFloatType);

      if (values.length === 0) {
        throw new Error("Termination due to values of variable is undefined.");
      }

      // Variable模式，建立數字用的說明物件
      const explanationItem = explanation.createExplanationItem(
        "VARIABLE",
        variable.name.split("/").pop() || "",
        variable.description,
        fontName,
        "FLOAT",
        undefined,
        undefined,
        undefined,
        values,
        aliasName
      );

      explanationItem.primaryAxisSizingMode = "AUTO";
      explanationItem.counterAxisSizingMode = "AUTO";

      explanationItems.push(explanationItem);
      console.log("Explanation Item", explanationItem);
    }
  }

  if (explanationItems.length === 0) {
    throw new Error("Termination due to explanationItems length is 0.");
  }

  const explanationWrapper = explanation.createExplanationWrapper(
    "VARIABLE",
    explanationItems,
    title == "" ? "Variables" : title,
    "Usage Definition",
    { family: "Inter", style: "Semi Bold" },
    modeNames
  );

  explanationWrapper.fills = [
    {
      type: "SOLID",
      color: semanticTokens.background.primary,
    },
  ];

  explanationWrapper.name = `Usage Definition`;

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
