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
      const aliasName: (string | undefined)[] = [];


      const values = (
        await Promise.all(
          Object.entries(variable.valuesByMode).map(async ([, value]) => {
            // Start resolving from the current value
            return await resolveToActualValue(value, aliasName);
          })
        )
      ).filter((v): v is RGBA => v !== null); // Filter out null values

      if (values.length === 0) {
        throw new Error("Termination due to values of variable is undefined.");
      }

      const explanationItem = explanation.createExplanationItem(
        "VARIABLE",
        variable.id,
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
        variable.id,
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

// 將型錄的描述寫回Figma的原生欄位
export async function writeCatalogueDescBackToFigma() {
  const selection = util.getCurrentSelection();

  if (selection.length !== 1) {
    figma.notify("❌ Please select only one catalogue frame.");
    throw new Error("Please select only one catalogue frame.");
  }

  // Check if the selection is a frame
  if (selection[0].type !== "FRAME") {
    figma.notify("❌ Please select a frame.");
    throw new Error("Please select a frame.");
  }

  const catalogueFrame = selection[0] as FrameNode;

  const titleWrapper = catalogueFrame.findOne(node => node.name === "Title Wrapper");
  if (!titleWrapper) {
    figma.notify("❌ Title Wrapper not found. Please try to regenerate catalogue again.");
    throw new Error("Title Wrapper not found. Please try to regenerate catalogue again.");
  } else if (titleWrapper.type !== "FRAME" || !titleWrapper.layoutMode) {
    throw new Error("Title Wrapper is not an AutoLayout frame.");
  }

  // Find all text nodes with the required plugin data
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
  await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));

  // Retrieve all styles and variables once
  const styles = await figma.getLocalPaintStylesAsync();
  const styleMap = new Map(styles.map(style => [style.id, style]));

  const variables = await figma.variables.getLocalVariablesAsync();
  const variableMap = new Map(variables.map(variable => [variable.id, variable]));

  let updatedCount = 0;

  // Process each description node
  descriptionNodes.forEach(node => {
    if (node.characters === "(blank)") {
      return; // Skip this node if the text content is "(blank)"
    }

    const catalogueItemSchema = node.getPluginData("catalogue-item-schema");
    const decodedCatalogueItemSchema = JSON.parse(catalogueItemSchema) as CatalogueItemDescriptionSchema;

    if (decodedCatalogueItemSchema.format === "STYLE") {
      const matchingStyle = styleMap.get(decodedCatalogueItemSchema.id);

      if (!matchingStyle) {
        figma.notify(`❌ Style with ID ${decodedCatalogueItemSchema.id} not found.`);
        return; // Skip this node if no matching style
      }

      // Update the style description with the text content of the node
      matchingStyle.description = (node as TextNode).characters;

      // 將使用者在description文字中設定的豐富文字樣式紀錄至該頁的plugin data中
      const richStyle = styledTextSegments.getNodeCatalogueItemRichStyle(node);
      styledTextSegments.writeCatalogueItemRichStyleToRoot(decodedCatalogueItemSchema.id, richStyle);

      updatedCount++;
    } else if (decodedCatalogueItemSchema.format === "VARIABLE") {
      const matchingVariable = variableMap.get(decodedCatalogueItemSchema.id);

      if (!matchingVariable) {
        figma.notify(`❌ Variable with ID ${decodedCatalogueItemSchema.id} not found.`);
        return; // Skip this node if no matching variable
      }

      // Update the variable description with the text content of the node
      matchingVariable.description = (node as TextNode).characters;

      // 將使用者在description文字中設定的豐富文字樣式紀錄至該頁的plugin data中
      const richStyle = styledTextSegments.getNodeCatalogueItemRichStyle(node);
      styledTextSegments.writeCatalogueItemRichStyleToRoot(decodedCatalogueItemSchema.id, richStyle);

      updatedCount++;
    } else {
      figma.notify(`❌ Unsupported format: ${decodedCatalogueItemSchema.format}`);
    }
  });

  const dateString = `Update description back to figma at ${util.getFormattedDate("fullDateTime")}`;
  const wroteBackDateNode = util.createTextNode(
    dateString,
    { family: "Inter", style: "Semi Bold" },
    semanticTokens.fontSize.xsmall,
    [{ type: "SOLID", color: semanticTokens.text.tertiary }]
  );

  // Add the wroteBackDateNode to the front of the titleWrapper
  titleWrapper.insertChild(0, wroteBackDateNode);
  // Set layoutSizingHorizontal to "FILL" for every child inside titleWrapper
  titleWrapper.children.forEach((element) => {
    if ("layoutSizingHorizontal" in element) {
      element.layoutSizingHorizontal = "FILL";
    }
  });

  wroteBackDateNode.textAlignHorizontal = "RIGHT";

  figma.notify(`✅ ${updatedCount} styles/variables has been updated successfully.`);
}

async function resolveToActualValue(
  value: any,
  aliasNames: (string | undefined)[] = []
): Promise<RGBA | null> {
  if (typeChecking.isVariableAliasType(value)) {
    // Fetch the aliased variable
    const aliasVariable = await figma.variables.getVariableByIdAsync(value.id);
    if (!aliasVariable) {
      console.warn(`Alias variable with ID ${value.id} not found.`);
      aliasNames.push(undefined); // Push undefined if alias is not found
      return null;
    }

    // Push the alias name for the top-level variable
    aliasNames.push(aliasVariable.name);

    // Resolve the actual value from the first mode
    const firstModeValue = Object.values(aliasVariable.valuesByMode)[0];
    if (!firstModeValue) {
      console.warn(`Alias variable ${aliasVariable.name} has no valid modes.`);
      return null;
    }

    // Recursively resolve the first mode value without modifying aliasNames further
    return await resolveToActualValue(firstModeValue);
  } else if (typeChecking.isRGBType(value) || typeChecking.isRGBAType(value)) {
    // Push undefined for non-alias values
    aliasNames.push(undefined);

    // Normalize RGB to RGBA or return RGBA directly
    return typeChecking.isRGBType(value) ? { ...value, a: 1 } : value;
  } else {
    console.warn(`Unexpected value type encountered: ${JSON.stringify(value)}`);
    aliasNames.push(undefined); // Handle unexpected value gracefully
    return null;
  }
}