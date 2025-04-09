import { CatalogueItemDescriptionSchema } from "../types/CatalogueItemShema";
import { StyleMode } from "../types/Messages/MessageStyleIntroducer";
import { semanticTokens } from "./tokens";
import {
  createAutolayoutFrame,
  createTextNode,
  isWhite,
  rgbToHex,
  setPadding,
  setStroke,
  formatNumberToDecimals,
  getFormattedDate,
  readEditorPreference,
} from "./util";
import * as styledTextSegments from "./styledTextSegments";


/**
 * Creates an auto-layout frame containing a title and content node.
 *
 * @param {string} title - The title text to be displayed.
 * @param {TextNode | FrameNode} content - The content node to be displayed next to the title.
 * @param {FontName} fontName - The font name to be used for the title text.
 * @returns {FrameNode} - An auto-layout frame containing the title and content nodes.
 *
 * The function creates a TextNode for the title with specified font and styles.
 * It then creates an auto-layout frame (wrapper) that contains the title node and the content node.
 * The wrapper is styled with padding, background color, and corner radius.
 * The title node and content node are set to fill the available space and align vertically to the center.
 */
export function createExplanationSinglePropertyItem(
  title: string,
  content: TextNode | FrameNode,
  fontName: FontName
) {
  const titleNode = createTextNode(title, fontName, 12);
  titleNode.fills = [{ type: "SOLID", color: semanticTokens.text.primary }];
  titleNode.lineHeight = { unit: "PIXELS", value: 12 * 1.5 };

  const wrapper = createAutolayoutFrame(
    [titleNode, content],
    semanticTokens.spacing.xsmall,
    "HORIZONTAL"
  );
  wrapper.name = "Single Property";
  wrapper.layoutGrow = 1;
  wrapper.verticalPadding = 6;
  wrapper.horizontalPadding = 12;
  wrapper.fills = [
    { type: "SOLID", color: semanticTokens.background.secondary },
  ];
  wrapper.cornerRadius = semanticTokens.cornerRadius.xsmall;
  wrapper.minHeight = 32;
  wrapper.layoutSizingVertical = "HUG";

  if (content.type === "FRAME") {
    wrapper.paddingRight = 6;
  }

  // Autolayout 內元素排版
  titleNode.layoutSizingHorizontal = "FILL";
  titleNode.layoutSizingVertical = "FILL";
  titleNode.textAlignVertical = "CENTER";

  if (content.type === "TEXT") {
    content.layoutSizingHorizontal = "FILL";
    content.layoutSizingVertical = "FILL";
    content.textAlignVertical = "CENTER";
  }

  return wrapper;
}

export function createColorFrame(color: RGBA): FrameNode {
  const colorFrame = figma.createFrame();
  colorFrame.resize(64, 64);
  colorFrame.name = "Swatch";
  const newPaint = figma.util.solidPaint(color);
  colorFrame.fills = [newPaint];

  if (isWhite(color)) {
    colorFrame.strokes = [{ type: "SOLID", color: semanticTokens.strokeColor }];
    colorFrame.strokeWeight = 1;
  }

  return colorFrame;
}

export function createNumberFrame(number: number, fontName: FontName): FrameNode {
  let limitedNumber: string;

  if (Number.isInteger(number)) {
    limitedNumber = number.toString(); // Keep whole numbers as they are
  } else {
    limitedNumber = number.toFixed(2); // Limit to 2 decimal places for non-integers
  }

  const numberTextNode = createTextNode(
    limitedNumber,
    fontName,
    semanticTokens.fontSize.base,
    [{ type: "SOLID", color: semanticTokens.text.secondary }]
  );

  numberTextNode.lineHeight = {
    value: semanticTokens.fontSize.base,
    unit: "PIXELS",
  };
  numberTextNode.textAlignHorizontal = "CENTER";

  // Create the frame
  const numberFrame = figma.createFrame();
  numberFrame.name = "Number";
  numberFrame.fills = [{ type: "SOLID", color: semanticTokens.background.primary }];
  numberFrame.cornerRadius = semanticTokens.cornerRadius.small;
  setStroke(numberFrame, semanticTokens.strokeColor, { top: 1, bottom: 1, left: 1, right: 1 });

  // Set layout mode for centering
  numberFrame.layoutMode = "VERTICAL"; // Vertical stack layout
  numberFrame.primaryAxisAlignItems = "CENTER"; // Center horizontally
  numberFrame.counterAxisAlignItems = "CENTER"; // Center vertically
  numberFrame.paddingLeft = 0;
  numberFrame.paddingRight = 0;
  numberFrame.paddingTop = 0;
  numberFrame.paddingBottom = 0;
  numberFrame.resize(64, 48);

  // Add the text node to the frame
  numberFrame.appendChild(numberTextNode);

  return numberFrame;
}

export function createEffectFrame(effects: Effect[]): FrameNode {
  const effectFrame = figma.createFrame();
  effectFrame.resize(64, 64);
  effectFrame.name = "Effect";
  effectFrame.fills = [
    { type: "SOLID", color: semanticTokens.background.primary },
  ];
  effectFrame.cornerRadius = semanticTokens.cornerRadius.small;
  effectFrame.effects = effects;

  return effectFrame;
}

export function createTextPropertiesWrappers(
  textStyle: TextStyle,
  fontName: FontName
): FrameNode[] {
  const fontNameContent = `${textStyle.fontName.family} ${textStyle.fontName.style}`;
  const fontSizeContent = formatNumberToDecimals(textStyle.fontSize, 2);
  const lineHeightContent = textStyle.lineHeight.unit == "AUTO" ? "Auto" : formatNumberToDecimals(textStyle.lineHeight.value, 2);
  const letterSpacingContent = formatNumberToDecimals(textStyle.letterSpacing.value, 2);
  const paragraphSpacingContent = formatNumberToDecimals(textStyle.paragraphSpacing, 2);
  const textCaseContent = textStyle.textCase.charAt(0).toUpperCase() + textStyle.textCase.slice(1).toLowerCase();

  const textPropertiesToCreate = [
    {
      title: "Font Name",
      content: fontNameContent
    },
    {
      title: "Font Size",
      content: fontSizeContent,
    },
    {
      title: "Line Height",
      content: lineHeightContent,
    },
    {
      title: "Letter Spacing",
      content: letterSpacingContent
    },
    {
      title: "Paragraph Spacing",
      content: paragraphSpacingContent
    },
    {
      title: "Text Case",
      content: textCaseContent,
    }
  ]

  let textPropertiesNodes: FrameNode[] = [];

  textPropertiesToCreate.forEach((property) => {
    const contentNode = createTextNode(property.content, fontName, 12, [{ type: "SOLID", color: semanticTokens.text.secondary }], { unit: "PIXELS", value: 12 * 1.5 })
    contentNode.textAlignHorizontal = "RIGHT";

    const propertyNode = createExplanationSinglePropertyItem(property.title, contentNode, fontName);
    textPropertiesNodes.push(propertyNode);
  });

  const groupedPropertyNodes: FrameNode[] = [];
  for (let i = 0; i < textPropertiesNodes.length; i += 2) {
    const pair = textPropertiesNodes.slice(i, i + 2);
    const pairWrapper = createAutolayoutFrame(pair, semanticTokens.spacing.xsmall, "HORIZONTAL");
    pairWrapper.name = "Properties";
    pairWrapper.layoutSizingVertical = "HUG";

    groupedPropertyNodes.push(pairWrapper);
  }

  textPropertiesNodes.forEach((n) => {
    n.layoutSizingHorizontal = "FILL";
    n.layoutSizingVertical = "HUG";
  });

  return groupedPropertyNodes;
}

export function createEffectPropertiesWrappers(
  effects: Effect[],
  fontName: FontName
): FrameNode[] {
  let results: FrameNode[] = [];

  for (let i = 0; i < effects.length; i++) {
    const effect = effects[i];
    let countNode: TextNode;

    if (effect.type === "DROP_SHADOW") {
      countNode = createTextNode(
        `Layer ${i + 1} - Drop Shadow`,
        { family: fontName.family, style: "Semi Bold" },
        semanticTokens.fontSize.small,
        [{ type: "SOLID", color: semanticTokens.text.secondary }]
      );
    } else if (effect.type === "INNER_SHADOW") {
      countNode = createTextNode(
        `Layer ${i + 1} - Inner Shadow`,
        { family: fontName.family, style: "Semi Bold" },
        semanticTokens.fontSize.small,
        [{ type: "SOLID", color: semanticTokens.text.secondary }]
      );
    } else if (effect.type === "BACKGROUND_BLUR") {
      countNode = createTextNode(
        `Layer ${i + 1} - Background Blur`,
        { family: fontName.family, style: "Semi Bold" },
        semanticTokens.fontSize.small,
        [{ type: "SOLID", color: semanticTokens.text.secondary }]
      );
    } else {
      countNode = createTextNode(
        `Layer ${i + 1} - Layer Blur`,
        { family: fontName.family, style: "Semi Bold" },
        semanticTokens.fontSize.small,
        [{ type: "SOLID", color: semanticTokens.text.secondary }]
      );
    }

    let effectWrapper = createAutolayoutFrame(
      [countNode],
      semanticTokens.spacing.xsmall,
      "VERTICAL"
    );
    effectWrapper.name = "Effects";
    countNode.layoutSizingHorizontal = "FILL";

    if (effect.type === "DROP_SHADOW" || effect.type == "INNER_SHADOW") {
      // 處理陰影類型的properties
      const effectPropertiesToCreate = [
        {
          title: "Color",
          content: rgbToHex(effect.color.r, effect.color.g, effect.color.b),
        },
        {
          title: "Opacity",
          content: `${formatNumberToDecimals(effect.color.a * 100)}%`,
        },
        {
          title: "X",
          content: `${effect.offset.x}`,
        },
        {
          title: "Y",
          content: `${effect.offset.y}`,
        },
        {
          title: "Blur",
          content: `${effect.radius}`,
        },
        {
          title: "Spread",
          content: effect.spread ? `${effect.spread}` : "0",
        }
      ]

      let effectPropertiesNodes: FrameNode[] = [];
      effectPropertiesToCreate.forEach((property) => {
        const contentNode = createTextNode(property.content, fontName, 12, [{ type: "SOLID", color: semanticTokens.text.secondary }], { unit: "PIXELS", value: 12 * 1.5 })
        contentNode.textAlignHorizontal = "RIGHT";

        const propertyNode = createExplanationSinglePropertyItem(property.title, contentNode, fontName);
        effectPropertiesNodes.push(propertyNode);
      });

      let groupedPropertyNodes: FrameNode[] = [];
      // Separate into 2 and 4 elements
      const firstGroup = effectPropertiesNodes.slice(0, 2);
      const secondGroup = effectPropertiesNodes.slice(2, 6);

      // Create pairs for the first group (2 elements and 4 elements)
      const firstGroupWrapper = createAutolayoutFrame(firstGroup, semanticTokens.spacing.xsmall, "HORIZONTAL");
      const secondGroupWrapper = createAutolayoutFrame(secondGroup, semanticTokens.spacing.xsmall, "HORIZONTAL");

      effectPropertiesNodes.forEach(
        (n) => {
          n.layoutSizingHorizontal = "FILL";
          n.layoutSizingVertical = "HUG";
        }
      );

      groupedPropertyNodes.push(firstGroupWrapper, secondGroupWrapper);

      groupedPropertyNodes.forEach((n) => {
        effectWrapper.appendChild(n);

        n.name = "Properties";
        n.layoutSizingVertical = "HUG";
        n.layoutSizingHorizontal = "FILL";
      });

    } else {
      // 處理blur類型的properties
      const effectPropertiesToCreate = [
        {
          title: "Blur",
          content: `${effect.radius}`,
        },
        {
          title: "Place Holder",
          content: "0",
        }
      ]

      let effectPropertiesNodes: FrameNode[] = [];
      effectPropertiesToCreate.forEach((property) => {
        const contentNode = createTextNode(property.content, fontName, 12, [{ type: "SOLID", color: semanticTokens.text.secondary }], { unit: "PIXELS", value: 12 * 1.5 })
        contentNode.textAlignHorizontal = "RIGHT";

        const propertyNode = createExplanationSinglePropertyItem(property.title, contentNode, fontName);
        if (property.title === "Place Holder") {
          propertyNode.opacity = 0;
        }

        effectPropertiesNodes.push(propertyNode);
      });

      const tempWrapper1 = createAutolayoutFrame(
        [...effectPropertiesNodes],
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
      );

      effectPropertiesNodes.forEach((n) => {
        n.layoutSizingHorizontal = "FILL";
        n.layoutSizingVertical = "HUG";
      });

      effectWrapper.appendChild(tempWrapper1);

      [tempWrapper1].forEach((n) => {
        n.name = "Properties";
        n.layoutSizingVertical = "HUG";
        n.layoutSizingHorizontal = "FILL";
      });

    }

    results.push(effectWrapper);
  }

  return results;
}


/**
 * Creates a TextNode with a hexadecimal color representation.
 *
 * @param {RGBA[]} colors - An array of RGBA color objects. Only the first color is used.
 * @param {FontName} fontName - The font name to be used for the TextNode.
 * @param {number} fontSize - The font size to be used for the TextNode.
 * @returns {TextNode} - A TextNode containing the hexadecimal color representation.
 *
 * The function converts the first RGBA color to a hexadecimal string. If the alpha
 * value is not 1, it appends the alpha percentage to the hex string. It then creates
 * a TextNode with the hex string, specified font name, and font size. The text case
 * of the node is set to uppercase.
 */
export function createStyleColorHexNode(
  colors: RGBA[],
  fontName: FontName,
  fontSize: number
): TextNode {
  const color = colors[0];
  let text = rgbToHex(color.r, color.g, color.b, true);
  if (color.a !== 1) {
    text = `${text}(${Math.round(color.a * 100)}%)`;
  }

  const colorHexNode = createTextNode(text, fontName, fontSize, [
    { type: "SOLID", color: semanticTokens.text.secondary },
  ]);
  colorHexNode.textCase = "UPPER";

  return colorHexNode;
}

/**
 * Creates an array of FrameNodes, each containing TextNodes with hexadecimal color representations.
 *
 * @param {RGBA[]} colors - An array of RGBA color objects.
 * @param {FontName} fontName - The font name to be used for the TextNodes.
 * @param {string[]} [variableModes] - An optional array of variable mode strings corresponding to each color.
 * @returns {FrameNode[]} - An array of FrameNodes, each containing TextNodes with hexadecimal color representations.
 *
 * The function converts each RGBA color to a hexadecimal string. If the alpha value is not 1,
 * it appends the alpha percentage to the hex string. It then creates TextNodes with the hex strings
 * and specified font name. These TextNodes are grouped into pairs and wrapped in FrameNodes.
 */
export function createVariableColorHexNodes(
  colors: RGBA[],
  fontName: FontName,
  aliasNames: (string | undefined)[],
  aliasVariableIds: (string | undefined)[],
  variableModes?: string[],
): FrameNode[] {
  // console.log({ colors: colors, fontName: fontName, aliasNames: aliasNames, variableModes: variableModes });

  const hexValues = colors.map((color) => {
    let hex = rgbToHex(color.r, color.g, color.b, true);
    if (color.a !== 1) {
      hex = `${hex}(${Math.round(color.a * 100)}%)`;
    }
    hex.toUpperCase();
    return hex;
  });

  const singlePropertyNodes = hexValues.map((hexValue, i) => {
    const variableMode = variableModes ? variableModes[i] : "Unknown";
    const aliasName = aliasNames[i];

    if (aliasName != undefined) {
      const aliasNameWrapper = createAliasNameWrapper(
        aliasName,
        fontName,
        semanticTokens.fontSize.base * 0.75,
        aliasVariableIds[i]
      );
      aliasNameWrapper.layoutSizingHorizontal = "HUG";
      aliasNameWrapper.layoutSizingVertical = "HUG";

      const node = createExplanationSinglePropertyItem(variableMode, aliasNameWrapper, fontName);
      node.layoutSizingVertical = "HUG";

      return node;
    } else {
      const hexValueNode = createTextNode(hexValue, fontName, 12, [{ type: "SOLID", color: semanticTokens.text.secondary }], { unit: "PIXELS", value: 12 * 1.5 })
      hexValueNode.textAlignHorizontal = "RIGHT";

      const node = createExplanationSinglePropertyItem(variableMode, hexValueNode, fontName);
      node.layoutSizingVertical = "HUG";

      return node;
    }

  });

  const groupedPropertyNodes: FrameNode[] = [];
  for (let i = 0; i < singlePropertyNodes.length; i += 2) {
    const pair = singlePropertyNodes.slice(i, i + 2);
    const pairWrapper = createAutolayoutFrame(pair, semanticTokens.spacing.xsmall, "HORIZONTAL");
    pairWrapper.name = "Properties";
    groupedPropertyNodes.push(pairWrapper);
  }

  return groupedPropertyNodes;
}

export function createVariableNumberNodes(
  numbers: number[],
  fontName: FontName,
  aliasNames: (string | undefined)[],
  aliasVariableIds: (string | undefined)[],
  variableModes: string[],
): FrameNode[] {
  const singlePropertyNodes = numbers.map((number, i) => {
    const variableMode = variableModes[i];
    const aliasName = aliasNames[i];

    if (aliasName != undefined) {
      const aliasNameWrapper = createAliasNameWrapper(
        aliasName,
        fontName,
        semanticTokens.fontSize.base * 0.75,
        aliasVariableIds[i]
      );
      aliasNameWrapper.layoutSizingHorizontal = "HUG";
      aliasNameWrapper.layoutSizingVertical = "HUG";

      const node = createExplanationSinglePropertyItem(variableMode, aliasNameWrapper, fontName);
      node.layoutSizingVertical = "HUG";

      return node;
    } else {
      const numberNode = createTextNode(
        number.toString(),
        fontName,
        semanticTokens.fontSize.small,
        [{ type: "SOLID", color: semanticTokens.text.secondary }]
      );
      numberNode.textAlignHorizontal = "RIGHT";

      const node = createExplanationSinglePropertyItem(variableMode, numberNode, fontName);

      return node;
    }
  });

  const groupedPropertyNodes: FrameNode[] = [];
  for (let i = 0; i < singlePropertyNodes.length; i += 2) {
    const pair = singlePropertyNodes.slice(i, i + 2);
    const pairWrapper = createAutolayoutFrame(pair, semanticTokens.spacing.xsmall, "HORIZONTAL");
    pairWrapper.name = "Properties";
    groupedPropertyNodes.push(pairWrapper);
  }

  return groupedPropertyNodes;
}

export function createVariableStringNodes(
  strings: string[],
  fontName: FontName,
  aliasNames: (string | undefined)[],
  aliasVariableIds: (string | undefined)[],
  variableModes: string[],
): FrameNode[] {
  const singlePropertyNodes = strings.map((string, i) => {
    const variableMode = variableModes[i];
    const aliasName = aliasNames[i];

    if (aliasName != undefined) {
      const aliasNameWrapper = createAliasNameWrapper(
        aliasName,
        fontName,
        semanticTokens.fontSize.base * 0.75,
        aliasVariableIds[i]
      );
      aliasNameWrapper.layoutSizingHorizontal = "HUG";
      aliasNameWrapper.layoutSizingVertical = "HUG";

      const node = createExplanationSinglePropertyItem(variableMode, aliasNameWrapper, fontName);
      node.layoutSizingVertical = "HUG";

      return node;
    } else {
      const stringNode = createTextNode(
        string,
        fontName,
        semanticTokens.fontSize.small,
        [{ type: "SOLID", color: semanticTokens.text.secondary }]
      );
      stringNode.textAlignHorizontal = "RIGHT";

      const node = createExplanationSinglePropertyItem(variableMode, stringNode, fontName);

      return node;
    }
  });

  const groupedPropertyNodes: FrameNode[] = [];
  for (let i = 0; i < singlePropertyNodes.length; i += 2) {
    const pair = singlePropertyNodes.slice(i, i + 2);
    const pairWrapper = createAutolayoutFrame(pair, semanticTokens.spacing.xsmall, "HORIZONTAL");
    pairWrapper.name = "Properties";
    groupedPropertyNodes.push(pairWrapper);
  }

  return groupedPropertyNodes;
}

// 變數名稱索引專用的樣式
function createAliasNameWrapper(
  aliasName: string,
  fontName: FontName,
  fontSize: number,
  aliasVariableId: string | undefined
): FrameNode {
  const aliasNameNode = createTextNode(
    `→ ${aliasName.replace(/\//g, ".")}`,
    { family: fontName.family, style: "Semi Bold" },
    fontSize,
    [{ type: "SOLID", color: semanticTokens.text.secondary }]
  );

  // Attempt to resolve the provided variable ID
  if (aliasVariableId) {
    const aliasVariableCatalogueItemUrl = styledTextSegments.getCatalogueItemUrlFromRoot(aliasVariableId);

    if (!aliasVariableCatalogueItemUrl) {
      console.warn(`No URL found for ${aliasVariableId}`);
    } else {
      const resolvedCatalogueItemId = styledTextSegments.extractNodeIdFromFigmaUrl(aliasVariableCatalogueItemUrl);
      const resolvedCatalogueItem = figma.currentPage.findOne(
        (node) => node.id === resolvedCatalogueItemId && node.removed === false
      );

      // If resolved catalogue item is not found, skip this block only
      if (resolvedCatalogueItem) {
        aliasNameNode.hyperlink = {
          type: "URL",
          value: aliasVariableCatalogueItemUrl,
        };
        aliasNameNode.textDecoration = "UNDERLINE";
      } else {
        console.warn(`No resolved CatalogueItem found for ${aliasVariableId}`);
      }
    }
  } else {
    console.warn(`No aliasVariableId provided`);
  }

  // Proceed with the rest of the code outside the if-else
  const aliasNameWrapper = createAutolayoutFrame(
    [aliasNameNode],
    0,
    "VERTICAL"
  );
  aliasNameWrapper.layoutSizingHorizontal = "HUG";
  aliasNameWrapper.cornerRadius = semanticTokens.cornerRadius.xxsmall;

  setPadding(aliasNameWrapper, {
    top: 2,
    bottom: 2,
    left: 8,
    right: 8,
  });

  aliasNameWrapper.fills = [
    { type: "SOLID", color: semanticTokens.background.tertiary },
  ];

  aliasNameWrapper.name = "Alias Name";

  return aliasNameWrapper;
}