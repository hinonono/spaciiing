import { semanticTokens } from "./tokens";
import {
  createAutolayoutFrame,
  createTextNode,
  rgbToHex,
  setPadding,
  formatNumberToDecimals,
  capitalizeFirstLetter
} from "./util";
import * as styledTextSegments from "./styledTextSegments";
import { SinglePropertyString } from "../types/SinglePropertyString";


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

  if (content.type === "TEXT") {
    content.textAlignHorizontal = "RIGHT"
  }

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

function pairNodesByTwo(source: FrameNode[]): FrameNode[] {
  const grouped: FrameNode[] = [];

  for (let i = 0; i < source.length; i += 2) {
    const pair = source.slice(i, i + 2);
    const pairWrapper = createAutolayoutFrame(pair, semanticTokens.spacing.xsmall, "HORIZONTAL");
    pairWrapper.name = "Properties";
    pairWrapper.layoutSizingVertical = "HUG";

    grouped.push(pairWrapper);
  }

  source.forEach((n) => {
    n.layoutSizingHorizontal = "FILL";
    n.layoutSizingVertical = "HUG";
  });

  return grouped;
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

  const textPropertiesToCreate: SinglePropertyString[] = [
    {
      title: "Font Name",
      content: fontNameContent,
      show: true
    },
    {
      title: "Font Size",
      content: fontSizeContent,
      show: true
    },
    {
      title: "Line Height",
      content: lineHeightContent,
      show: true
    },
    {
      title: "Letter Spacing",
      content: letterSpacingContent,
      show: true
    },
    {
      title: "Paragraph Spacing",
      content: paragraphSpacingContent,
      show: true
    },
    {
      title: "Text Case",
      content: textCaseContent,
      show: true
    }
  ]

  let textPropertiesNodes: FrameNode[] = [];

  textPropertiesToCreate.forEach((property) => {
    const contentNode = createTextNode(property.content, fontName, 12, [{ type: "SOLID", color: semanticTokens.text.secondary }], { unit: "PIXELS", value: 12 * 1.5 })
    contentNode.textAlignHorizontal = "RIGHT";

    const propertyNode = createExplanationSinglePropertyItem(property.title, contentNode, fontName);
    textPropertiesNodes.push(propertyNode);
  });

  const groupedPropertyNodes = pairNodesByTwo(textPropertiesNodes);

  return groupedPropertyNodes;
}

function createGenericEffectTitle(
  effect: Effect,
  index: number,
  fontName: FontName,
) {
  let title: string;
  switch (effect.type) {
    case "DROP_SHADOW":
      title = `Layer ${index + 1} - Drop Shadow`
      break;
    case "INNER_SHADOW":
      title = `Layer ${index + 1} - Inner Shadow`
      break;
    case "LAYER_BLUR":
      if (effect.blurType === "NORMAL") {
        // Uniform
        title = `Layer ${index + 1} - Layer Blur (Uniform)`
      } else {
        // Progressive
        title = `Layer ${index + 1} - Layer Blur (Progressive)`
      }
      break;
    case "BACKGROUND_BLUR":
      if (effect.blurType === "NORMAL") {
        // Uniform
        title = `Layer ${index + 1} - Background Blur (Uniform)`
      } else {
        // Progressive
        title = `Layer ${index + 1} - Background Blur (Progressive)`
      }
      break;
    case "NOISE":
      if (effect.noiseType === "MONOTONE") {
        title = `Layer ${index + 1} - Noise (Mono)`
      } else if (effect.noiseType === "DUOTONE") {
        title = `Layer ${index + 1} - Noise (Duo)`
      } else {
        title = `Layer ${index + 1} - Noise (Multi)`
      }
      break;
    case "TEXTURE":
      title = `Layer ${index + 1} - Texture`
      break;
    default:
      throw new Error("Unsupported effect type.")
  }

  const node = createTextNode(
    title,
    { family: fontName.family, style: "Semi Bold" },
    semanticTokens.fontSize.small,
    [{ type: "SOLID", color: semanticTokens.text.secondary }]
  )

  return node
}

function getEffectPropertiesToCreate(
  effect: Effect
): SinglePropertyString[] {
  if (effect.type === "DROP_SHADOW" || effect.type == "INNER_SHADOW") {
    const effectPropertiesToCreate: SinglePropertyString[] = [
      {
        title: "Color",
        content: rgbToHex(effect.color.r, effect.color.g, effect.color.b),
        show: true
      },
      {
        title: "Opacity",
        content: `${formatNumberToDecimals(effect.color.a * 100)}%`,
        show: true
      },
      {
        title: "X",
        content: `${effect.offset.x}`,
        show: true
      },
      {
        title: "Y",
        content: `${effect.offset.y}`,
        show: true
      },
      {
        title: "Blur",
        content: `${effect.radius}`,
        show: true
      },
      {
        title: "Spread",
        content: effect.spread ? `${effect.spread}` : "0",
        show: true
      }
    ]
    return effectPropertiesToCreate
  } else if (effect.type === "LAYER_BLUR" || effect.type === "BACKGROUND_BLUR") {
    if (effect.blurType === "NORMAL") {
      // Normal
      const effectPropertiesToCreate: SinglePropertyString[] = [
        {
          title: "Blur Type",
          content: `${effect.blurType}`,
          show: true
        },
        {
          title: "Blur",
          content: `${effect.radius}`,
          show: true
        }
      ]
      return effectPropertiesToCreate

    } else {
      // Progressive
      const effectPropertiesToCreate: SinglePropertyString[] = [
        {
          title: "Blur Type",
          content: `${effect.blurType}`,
          show: true
        },
        {
          title: "Start",
          content: `${effect.startRadius}`,
          show: true
        },
        {
          title: "End",
          content: `${effect.radius}`,
          show: true
        },
        {
          title: "Place Holder",
          content: "0",
          show: false
        }
      ]
      return effectPropertiesToCreate

    }
  } else if (effect.type === "NOISE") {
    if (effect.noiseType === "MONOTONE") {
      const effectPropertiesToCreate: SinglePropertyString[] = [
        {
          title: "Noise Type",
          content: `${effect.noiseType}`,
          show: true
        },
        {
          title: "Noise Size",
          content: `${effect.noiseSize}`,
          show: true
        },
        {
          title: "Density",
          content: `${effect.density}`,
          show: true
        },
        {
          title: "Color",
          //@ts-ignore
          content: rgbToHex(effect.color.r, effect.color.g, effect.color.b),
          show: true
        },
        {
          title: "Opacity",
          //@ts-ignore
          content: `${formatNumberToDecimals(effect.color.a * 100)}%`,
          show: true
        },
        {
          title: "Placeholder",
          content: "0",
          show: false
        }
      ]

      return effectPropertiesToCreate
    } else if (effect.noiseType === "DUOTONE") {
      const effectPropertiesToCreate: SinglePropertyString[] = [
        {
          title: "Noise Type",
          content: `${effect.noiseType}`,
          show: true
        },
        {
          title: "Noise Size",
          content: `${effect.noiseSize}`,
          show: true
        },
        {
          title: "Density",
          content: `${effect.density}`,
          show: true
        },
        {
          title: "Color 1",
          //@ts-ignore
          content: rgbToHex(effect.color.r, effect.color.g, effect.color.b),
          show: true
        },
        {
          title: "Opacity (Color 1)",
          //@ts-ignore
          content: `${formatNumberToDecimals(effect.color.a * 100)}%`,
          show: true
        },
        {
          title: "Color 2",
          content: rgbToHex(effect.secondaryColor.r, effect.secondaryColor.g, effect.secondaryColor.b),
          show: true
        },
        {
          title: "Opacity (Color 2)",
          content: `${formatNumberToDecimals(effect.secondaryColor.a * 100)}%`,
          show: true
        },
        {
          title: "Placeholder",
          content: "0",
          show: false
        }
      ]

      return effectPropertiesToCreate
    } else {
      const effectPropertiesToCreate: SinglePropertyString[] = [
        {
          title: "Noise Type",
          content: `${effect.noiseType}`,
          show: true
        },
        {
          title: "Noise Size",
          content: `${effect.noiseSize}`,
          show: true
        },
        {
          title: "Density",
          content: `${effect.density}`,
          show: true
        },
        {
          title: "Opacity",
          content: `${formatNumberToDecimals(effect.opacity * 100)}%`,
          show: true
        },
      ]

      return effectPropertiesToCreate
    }

  } else if (effect.type === "TEXTURE") {
    const effectPropertiesToCreate: SinglePropertyString[] = [
      {
        title: "Size",
        content: `${effect.noiseSize}`,
        show: true
      },
      {
        title: "Radius",
        content: `${effect.radius}`,
        show: true
      },
      {
        title: "Clip To Shape",
        content: capitalizeFirstLetter(`${effect.clipToShape}`),
        show: true
      },
      {
        title: "Placeholder",
        content: "0",
        show: false
      }
    ]

    return effectPropertiesToCreate
  } else {
    const effectPropertiesToCreate: SinglePropertyString[] = [
      {
        title: "NOT SUPPORTED",
        content: "0",
        show: false
      }
    ]

    return effectPropertiesToCreate
  }
}

export function createEffectPropertiesWrappers(
  effects: Effect[],
  fontName: FontName
): FrameNode[] {
  let results: FrameNode[] = [];

  for (let i = 0; i < effects.length; i++) {
    const effect = effects[i];

    const countNode = createGenericEffectTitle(effect, i, fontName)

    let effectWrapper = createAutolayoutFrame([countNode], semanticTokens.spacing.xsmall, "VERTICAL");
    effectWrapper.name = "Effects";
    countNode.layoutSizingHorizontal = "FILL";


    if (effect.type === "DROP_SHADOW" || effect.type == "INNER_SHADOW") {
      // 處理陰影類型的properties
      const effectPropertiesToCreate = getEffectPropertiesToCreate(effect);

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
      // 處理其他效果類型的properties
      const effectPropertiesToCreate = getEffectPropertiesToCreate(effect);

      let effectPropertiesNodes: FrameNode[] = [];
      effectPropertiesToCreate.forEach((property) => {
        const contentNode = createTextNode(property.content, fontName, 12, [{ type: "SOLID", color: semanticTokens.text.secondary }], { unit: "PIXELS", value: 12 * 1.5 })
        contentNode.textAlignHorizontal = "RIGHT";

        const propertyNode = createExplanationSinglePropertyItem(property.title, contentNode, fontName);
        if (property.show === false) {
          propertyNode.opacity = 0;
        }

        effectPropertiesNodes.push(propertyNode);
      });

      const groupedPropertyNodes = pairNodesByTwo(effectPropertiesNodes)

      effectPropertiesNodes.forEach((n) => {
        n.layoutSizingHorizontal = "FILL";
        n.layoutSizingVertical = "HUG";
      });

      groupedPropertyNodes.forEach((g) => {
        effectWrapper.appendChild(g);
        g.layoutSizingHorizontal = "FILL"
        g.layoutSizingVertical = "HUG"
      })
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

  const groupedPropertyNodes = pairNodesByTwo(singlePropertyNodes);

  return groupedPropertyNodes;
}

export function createStyleGradientNode(
  gradientType: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND",
  gradientTransform: Transform,
  gradientStops: ColorStop[],
  fontName: FontName,
  fontSize: number
): FrameNode[] {

  const typeString = gradientType.replace("GRADIENT_", "");
  const formatted = typeString.charAt(0) + typeString.slice(1).toLowerCase();

  const type = createTextNode(formatted, fontName, fontSize, [
    { type: "SOLID", color: semanticTokens.text.secondary },
  ]);
  const typeNode = createExplanationSinglePropertyItem("Gradient Type", type, fontName);


  const colorsString = colorStopsToString(gradientStops);
  const colors = createTextNode(colorsString, fontName, fontSize, [
    { type: "SOLID", color: semanticTokens.text.secondary },
  ]);
  const colorsNode = createExplanationSinglePropertyItem("Colors", colors, fontName);


  return pairNodesByTwo([typeNode, colorsNode]);
}

function colorStopsToString(colorStops: ColorStop[]): string {
  return `[${colorStops.map(stop => {
    const { r, g, b, a } = stop.color;

    const hex = rgbToHex(stop.color.r, stop.color.g, stop.color.b)
    return `{${hex}, ${(stop.position * 100).toFixed(0)}%}`;
  }).join(", ")}]`;
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

  const groupedPropertyNodes = pairNodesByTwo(singlePropertyNodes);

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

  const groupedPropertyNodes = pairNodesByTwo(singlePropertyNodes);

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