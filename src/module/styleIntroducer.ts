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
import * as styledTextSegments from "./styledTextSegments";
import { semanticTokens } from "./tokens";
import { CatalogueItemDescriptionSchema } from "../types/CatalogueItemShema";

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

// 檢查是否啟用cataloge item link功能
// 啟用的話，當產生型錄物件時，可以透過alias物件來連結回參照的物件那裡
function checkCatalogueItemLinkFeatureAvailability(): { availability: boolean, url: string | null } {
  //是否啟用cataloge item link功能
  const editorPreference = util.readEditorPreference();

  if (editorPreference.exampleFileUrl) {
    return { availability: true, url: editorPreference.exampleFileUrl };
  } else {
    return { availability: false, url: null };
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
  const isCatalogueItemLinkFeatureAvailable = checkCatalogueItemLinkFeatureAvailability();

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

        const color = await resolveToActualRgbaValue(value);
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

        const number = await resolveToActualNumberValue(value);
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

// 將型錄的描述寫回Figma的原生欄位
// 将型錄的描述写回Figma的原生欄位
export async function writeCatalogueDescBackToFigma() {
  const selection = util.getCurrentSelection();

  if (selection.length !== 1) {
    figma.notify("❌ Please select only one catalogue frame.");
    throw new Error("Please select only one catalogue frame.");
  }

  if (selection[0].type !== "FRAME") {
    figma.notify("❌ Please select a frame.");
    throw new Error("Please select a frame.");
  }

  const catalogueFrame = selection[0] as FrameNode;

  const titleWrapper = catalogueFrame.findOne(node => node.name === "Title Wrapper");
  if (!titleWrapper || titleWrapper.type !== "FRAME" || !titleWrapper.layoutMode) {
    figma.notify("❌ Title Wrapper not found. Please try to regenerate catalogue again.");
    throw new Error("Title Wrapper is not an AutoLayout frame.");
  }

  const descriptionNodes = catalogueFrame.findAllWithCriteria({
    types: ['TEXT'],
  }).filter(node => node.getPluginData("catalogue-item-schema"));

  if (descriptionNodes.length === 0) {
    figma.notify("❌ No description nodes found.");
    throw new Error("No description nodes found.");
  }

  const fontsToLoad = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Semi Bold" },
  ];
  await Promise.all(fontsToLoad.map(font => figma.loadFontAsync(font)));

  let updatedCount = 0;

  // Process each description node
  for (const node of descriptionNodes) {
    if (node.characters === "(blank)") continue; // Skip empty descriptions

    const catalogueItemSchema = node.getPluginData("catalogue-item-schema");
    const decodedCatalogueItemSchema = JSON.parse(catalogueItemSchema) as CatalogueItemDescriptionSchema;

    if (decodedCatalogueItemSchema.format === "STYLE") {
      const matchingStyle = await getStyleById(decodedCatalogueItemSchema.id);

      if (!matchingStyle) {
        figma.notify(`❌ Style with ID ${decodedCatalogueItemSchema.id} not found.`);
        continue;
      }

      // Update the style description with the text content of the node
      matchingStyle.description = (node as TextNode).characters;

      const richStyle = styledTextSegments.getNodeCatalogueItemRichStyle(node);
      styledTextSegments.writeCatalogueItemRichStyleToRoot(decodedCatalogueItemSchema.id, richStyle);

      updatedCount++;
    } else if (decodedCatalogueItemSchema.format === "VARIABLE") {
      const matchingVariable = await getVariableById(decodedCatalogueItemSchema.id);

      if (!matchingVariable) {
        figma.notify(`❌ Variable with ID ${decodedCatalogueItemSchema.id} not found.`);
        continue;
      }

      // Update the variable description with the text content of the node
      matchingVariable.description = (node as TextNode).characters;

      const richStyle = styledTextSegments.getNodeCatalogueItemRichStyle(node);
      styledTextSegments.writeCatalogueItemRichStyleToRoot(decodedCatalogueItemSchema.id, richStyle);

      updatedCount++;
    } else {
      figma.notify(`❌ Unsupported format: ${decodedCatalogueItemSchema.format}`);
    }
  }

  const dateString = `Update description back to Figma at ${util.getFormattedDate("fullDateTime")}`;
  const wroteBackDateNode = util.createTextNode(
    dateString,
    { family: "Inter", style: "Semi Bold" },
    semanticTokens.fontSize.xsmall,
    [{ type: "SOLID", color: semanticTokens.text.tertiary }]
  );

  titleWrapper.insertChild(0, wroteBackDateNode);
  titleWrapper.children.forEach((element) => {
    if ("layoutSizingHorizontal" in element) {
      element.layoutSizingHorizontal = "FILL";
    }
  });

  wroteBackDateNode.textAlignHorizontal = "RIGHT";

  figma.notify(`✅ ${updatedCount} styles/variables have been updated successfully.`);
}

async function resolveToActualRgbaValue(
  value: any
): Promise<RGBA | null> {
  if (typeChecking.isVariableAliasType(value)) {
    // Fetch the aliased variable
    const aliasVariable = await figma.variables.getVariableByIdAsync(value.id);
    if (!aliasVariable) {
      console.warn(`Alias variable with ID ${value.id} not found.`);
      return null;
    }

    // Resolve the actual value from the first mode
    const firstModeValue = Object.values(aliasVariable.valuesByMode)[0];
    if (!firstModeValue) {
      console.warn(`Alias variable ${aliasVariable.name} has no valid modes.`);
      return null;
    }

    // Recursively resolve the first mode value without modifying aliasNames further
    return await resolveToActualRgbaValue(firstModeValue);
  } else if (typeChecking.isRGBType(value) || typeChecking.isRGBAType(value)) {
    // Normalize RGB to RGBA or return RGBA directly
    return typeChecking.isRGBType(value) ? { ...value, a: 1 } : value;
  } else {
    console.warn(`Unexpected value type encountered: ${JSON.stringify(value)}`);
    return null;
  }
}

async function resolveToActualNumberValue(
  value: any
): Promise<number | null> {
  if (typeChecking.isVariableAliasType(value)) {
    // Fetch the aliased variable
    const aliasVariable = await figma.variables.getVariableByIdAsync(value.id);
    if (!aliasVariable) {
      console.warn(`Alias variable with ID ${value.id} not found.`);
      return null;
    }

    // Resolve the actual value from the first mode
    const firstModeValue = Object.values(aliasVariable.valuesByMode)[0];
    if (!firstModeValue) {
      console.warn(`Alias variable ${aliasVariable.name} has no valid modes.`);
      return null;
    }

    // Recursively resolve the first mode value without modifying aliasNames further
    return await resolveToActualNumberValue(firstModeValue);
  } else if (typeChecking.isFloatType(value)) {
    return value;
  } else {
    console.warn(`Unexpected value type encountered: ${JSON.stringify(value)}`);
    return null;
  }
}

// Caches to store fetched styles and variables (module-level)
const paintStyleCache = new Map<string, PaintStyle>();
const textStyleCache = new Map<string, TextStyle>();
const effectStyleCache = new Map<string, EffectStyle>();
const variableCache = new Map<string, Variable>();

// Function to fetch and cache styles on demand
export async function getStyleById(styleId: string) {
  // Check in Paint Styles
  if (paintStyleCache.has(styleId)) return paintStyleCache.get(styleId);
  const paintStyles = await figma.getLocalPaintStylesAsync();
  paintStyles.forEach(style => paintStyleCache.set(style.id, style));
  if (paintStyleCache.has(styleId)) return paintStyleCache.get(styleId);

  // Check in Text Styles
  if (textStyleCache.has(styleId)) return textStyleCache.get(styleId);
  const textStyles = await figma.getLocalTextStylesAsync();
  textStyles.forEach(style => textStyleCache.set(style.id, style));
  if (textStyleCache.has(styleId)) return textStyleCache.get(styleId);

  // Check in Effect Styles
  if (effectStyleCache.has(styleId)) return effectStyleCache.get(styleId);
  const effectStyles = await figma.getLocalEffectStylesAsync();
  effectStyles.forEach(style => effectStyleCache.set(style.id, style));
  if (effectStyleCache.has(styleId)) return effectStyleCache.get(styleId);

  return null;
}

// Function to fetch and cache variables on demand
export async function getVariableById(variableId: string) {
  if (variableCache.has(variableId)) return variableCache.get(variableId);

  const variables = await figma.variables.getLocalVariablesAsync();
  variables.forEach(variable => variableCache.set(variable.id, variable));

  return variableCache.get(variableId);
}