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
} from "./util";

/**
 * Creates an explanation item frame based on the provided format and style mode.
 *
 * @param {("STYLE" | "VARIABLE")} format - The format of the explanation item, either "STYLE" or "VARIABLE".
 * @param {string} title - The title text for the explanation item.
 * @param {string} description - The description text for the explanation item.
 * @param {FontName} fontName - The font name for the title and description.
 * @param {StyleMode} styleMode - The style mode of the explanation item (e.g., COLOR, TEXT, EFFECT).
 * @param {RGBA[]} [colors] - An optional array of RGBA color values for the COLOR style mode.
 * @param {Effect[]} [effects] - An optional array of effects for the EFFECT style mode.
 * @param {TextStyle} [textStyle] - An optional text style object for the TEXT style mode.
 * @param {string} [aliasName] - An optional alias name for the VARIABLE format.
 * @returns {FrameNode} The frame node representing the explanation item.
 * @throws Will throw an error if required parameters for specific style modes are not provided.
 */
export function createExplanationItem(
  format: "STYLE" | "VARIABLE",
  title: string,
  description: string,
  fontName: FontName,
  styleMode: StyleMode,
  colors?: RGBA[],
  effects?: Effect[],
  textStyle?: TextStyle,
  numbers?: number[],
  aliasNames?: string[]
) {
  const titleNode = createTextNode(
    title,
    { family: fontName.family, style: "Semi Bold" },
    semanticTokens.fontSize.base * 1.25
  );
  const descriptionNode = createTextNode(
    description == "" ? "(blank)" : description,
    fontName,
    semanticTokens.fontSize.base * 0.75,
    [{ type: "SOLID", color: semanticTokens.text.secondary }]
  );

  let explanationTextsWrapperNode: FrameNode;
  let aliasNameWrapperNode: FrameNode | null = null;
  const itemsToPutInTitleWrapper: SceneNode[] = [];

  //當format是VARIABLE時，處理aliasNames
  if (aliasNames && aliasNames.length > 0 && format === "VARIABLE") {
    aliasNameWrapperNode = handleAliasNameWrapperNode(aliasNames, fontName);
    itemsToPutInTitleWrapper.push(aliasNameWrapperNode);
  }

  itemsToPutInTitleWrapper.push(titleNode);

  //依據StyleMode處理包含於TitleWrapper的Nodes
  if (styleMode === "COLOR") {
    // 處理顏色樣式
    if (!colors) {
      throw new Error("Color is required for color type.");
    }

    if (colors.length === 0) {
      throw new Error("Termination due to color.length is 0.");
    }

    const colorHexNode = createColorHexNode(
      format,
      colors,
      fontName,
      semanticTokens.fontSize.base * 0.75
    );
    itemsToPutInTitleWrapper.push(colorHexNode);

    const titleWrapper = createAutolayoutFrame(
      itemsToPutInTitleWrapper,
      semanticTokens.spacing.xsmall,
      "VERTICAL"
    );
    colorHexNode.layoutSizingHorizontal = "FILL";
    titleWrapper.name = "Explanation Item Title Wrapper";
    titleNode.layoutSizingHorizontal = "FILL";

    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleWrapper, descriptionNode],
      semanticTokens.spacing.base,
      "VERTICAL"
    );
    titleWrapper.layoutSizingHorizontal = "FILL";
  } else if (styleMode === "FLOAT") {
    if (!numbers) {
      throw new Error("Number is required for number type.");
    }

    if (numbers.length === 0) {
      throw new Error("Termination due to number.length is 0.");
    }

    const titleWrapper = createAutolayoutFrame(
      itemsToPutInTitleWrapper,
      semanticTokens.spacing.xsmall,
      "VERTICAL"
    );
    titleWrapper.name = "Explanation Item Title Wrapper";
    titleNode.layoutSizingHorizontal = "FILL";

    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleWrapper, descriptionNode],
      semanticTokens.spacing.base,
      "VERTICAL"
    );
    titleWrapper.layoutSizingHorizontal = "FILL";
  } else if (styleMode === "TEXT") {
    // 處理文字樣式
    if (!textStyle) {
      throw new Error("Text style is required for text type.");
    }

    const textPropertiesWrappers = createTextPropertiesWrappers(
      textStyle,
      fontName
    );

    const titleWrapper = createAutolayoutFrame(
      [titleNode, ...textPropertiesWrappers],
      semanticTokens.padding.xsmall,
      "VERTICAL"
    );
    titleWrapper.name = "Explanation Item Title Wrapper";
    titleNode.layoutSizingHorizontal = "FILL";
    textPropertiesWrappers.forEach((wrapper) => {
      wrapper.layoutSizingHorizontal = "FILL";
    });

    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleWrapper, descriptionNode],
      semanticTokens.spacing.base,
      "VERTICAL"
    );

    titleWrapper.layoutSizingHorizontal = "FILL";
  } else if (styleMode === "EFFECT") {
    // 處理效果樣式
    if (!effects) {
      throw new Error("Effects is required for effect type.");
    }

    const effectWrappers = createEffectPropertiesWrappers(effects, fontName);

    const titleWrapper = createAutolayoutFrame(
      [titleNode, ...effectWrappers],
      semanticTokens.spacing.large,
      "VERTICAL"
    );
    titleWrapper.name = "Explanation Item Title Wrapper";
    titleNode.layoutSizingHorizontal = "FILL";
    effectWrappers.forEach((wrapper) => {
      wrapper.layoutSizingHorizontal = "FILL";
    });

    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleWrapper, descriptionNode],
      semanticTokens.spacing.base,
      "VERTICAL"
    );

    titleWrapper.layoutSizingHorizontal = "FILL";
  } else {
    // 預設
    explanationTextsWrapperNode = createAutolayoutFrame(
      [titleNode, descriptionNode],
      semanticTokens.spacing.base,
      "VERTICAL"
    );

    titleNode.layoutSizingHorizontal = "FILL";
    descriptionNode.layoutSizingHorizontal = "FILL";
  }

  titleNode.layoutSizingHorizontal = "FILL";
  descriptionNode.layoutSizingHorizontal = "FILL";
  explanationTextsWrapperNode.name = "Explanation Item Texts Wrapper";

  if (aliasNameWrapperNode) {
    aliasNameWrapperNode.layoutSizingHorizontal = "FILL";
    aliasNameWrapperNode.layoutSizingVertical = "HUG";
  }

  let explanationItemWrapperNode: FrameNode;
  //依據不同的格式處理要放進去的內容（色塊、效果等）
  if (styleMode === "COLOR") {
    // 處理顏色樣式
    if (!colors) {
      throw new Error("Color is required for color type.");
    }

    const colorFrames: FrameNode[] = [];
    colors.forEach((color) => {
      const colorFrame = createColorFrame(color);

      if (format === "STYLE") {
        colorFrame.cornerRadius = semanticTokens.cornerRadius.infinite;
      } else {
        colorFrame.cornerRadius = semanticTokens.cornerRadius.small;
      }
      colorFrames.push(colorFrame);
    });

    // 將色塊們包裝入一個AutolayoutFrame中
    const swatchesWrapper = createAutolayoutFrame(
      colorFrames,
      semanticTokens.spacing.xsmall,
      "HORIZONTAL"
    );
    swatchesWrapper.name = "Swatches Wrapper";

    const item = createAutolayoutFrame(
      [swatchesWrapper, explanationTextsWrapperNode],
      semanticTokens.spacing.base,
      "HORIZONTAL"
    );

    swatchesWrapper.layoutSizingHorizontal = "HUG";
    swatchesWrapper.layoutSizingVertical = "HUG";

    explanationItemWrapperNode = item;
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
  } else if (styleMode === "EFFECT") {
    // 處理效果樣式
    if (!effects) {
      throw new Error("Effects are required for effect type.");
    }
    const effectFrame = createEffectFrame(effects);

    const item = createAutolayoutFrame(
      [effectFrame, explanationTextsWrapperNode],
      semanticTokens.spacing.base,
      "HORIZONTAL"
    );

    explanationItemWrapperNode = item;
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
  } else if (styleMode === "FLOAT") {
    // 處理數字樣式
    if (!numbers) {
      throw new Error("Number is required for float type.");
    }

    const numberFrames: FrameNode[] = [];
    numbers.forEach((number) => {
      const numberFrame = createNumberFrame(number, fontName);
      numberFrames.push(numberFrame);
    });

    // 將數字框框們包裝入一個AutolayoutFrame中
    const swatchesWrapper = createAutolayoutFrame(
      numberFrames,
      semanticTokens.spacing.xsmall,
      "HORIZONTAL"
    );
    swatchesWrapper.name = "Numbers Wrapper";

    const item = createAutolayoutFrame(
      [swatchesWrapper, explanationTextsWrapperNode],
      semanticTokens.spacing.base,
      "HORIZONTAL"
    );

    swatchesWrapper.layoutSizingHorizontal = "HUG";
    swatchesWrapper.layoutSizingVertical = "HUG";

    explanationItemWrapperNode = item;
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
  } else {
    // 預設
    explanationItemWrapperNode = createAutolayoutFrame(
      [explanationTextsWrapperNode],
      0,
      "VERTICAL"
    );
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
  }

  explanationItemWrapperNode.name = "Explanation Item";
  explanationItemWrapperNode.clipsContent = false;

  // Set height to hug content
  explanationItemWrapperNode.primaryAxisSizingMode = "AUTO";

  setPadding(explanationItemWrapperNode, {
    top: semanticTokens.padding.large,
    bottom: semanticTokens.padding.large,
    left: semanticTokens.padding.xsmall,
    right: semanticTokens.padding.xsmall,
  });

  // Set border properties for top edge only
  setStroke(explanationItemWrapperNode, semanticTokens.dividerColor, {
    top: 1,
    bottom: 0,
    left: 0,
    right: 0,
  });

  // Center items to the top
  explanationItemWrapperNode.counterAxisAlignItems = "MIN";

  return explanationItemWrapperNode;
}

/**
 * Creates an explanation wrapper frame containing a title, secondary title, and a list of explanation items.
 *
 * @param {"STYLE" | "VARIABLE"} format - The format type of the explanation wrapper.
 * @param {FrameNode[]} explanationItems - An array of frame nodes representing the explanation items.
 * @param {string} title - The title text for the explanation wrapper.
 * @param {string} secondaryTitle - The secondary title text for the explanation wrapper.
 * @param {FontName} fontName - The font name for the title and explanation items.
 * @param {string[]} [modes] - An optional array of modes for the variable type.
 * @returns {FrameNode} The main frame node containing the title, secondary title, and explanation items.
 * @throws Will throw an error if the modes are required for the variable type but not provided.
 */
export function createExplanationWrapper(
  format: "STYLE" | "VARIABLE",
  explanationItems: FrameNode[],
  title: string,
  secondaryTitle: string,
  fontName: FontName,
  modes?: string[]
): FrameNode {
  const itemsToPutInTitleWrapper: SceneNode[] = [];

  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formattedDate = `Created at ${currentDate
    .toLocaleString("en-US", options)
    .replace(",", "")}`;

  const createdDateNode = createTextNode(
    formattedDate,
    fontName,
    semanticTokens.fontSize.xsmall,
    [{ type: "SOLID", color: semanticTokens.text.tertiary }]
  );
  const titleNode = createTextNode(
    title,
    fontName,
    semanticTokens.fontSize.xxlarge
  );
  const secondaryTitleNode = createTextNode(
    secondaryTitle,
    fontName,
    semanticTokens.fontSize.base,
    [{ type: "SOLID", color: semanticTokens.text.secondary }]
  );

  itemsToPutInTitleWrapper.push(createdDateNode);
  itemsToPutInTitleWrapper.push(secondaryTitleNode);
  itemsToPutInTitleWrapper.push(titleNode);

  if (format === "VARIABLE") {
    if (!modes) {
      throw new Error("Modes are required for variable type.");
    }

    const modesText =
      modes.length === 1
        ? `Mode: [${modes[0]}]`
        : `Modes: [${modes.join(", ")}]`;

    const modesNode = createTextNode(
      modesText,
      fontName,
      semanticTokens.fontSize.base
    );

    itemsToPutInTitleWrapper.push(modesNode);
  }

  const titleWrapper = createAutolayoutFrame(
    itemsToPutInTitleWrapper,
    semanticTokens.spacing.xsmall,
    "VERTICAL"
  );

  createdDateNode.textAlignHorizontal = "RIGHT";
  createdDateNode.layoutSizingHorizontal = "FILL";
  titleNode.layoutSizingHorizontal = "FILL";
  secondaryTitleNode.layoutSizingHorizontal = "FILL";

  const itemsFrame = createAutolayoutFrame(explanationItems, 0, "VERTICAL");
  itemsFrame.clipsContent = false;
  itemsFrame.layoutSizingHorizontal = "HUG";
  itemsFrame.layoutSizingVertical = "HUG";
  itemsFrame.primaryAxisSizingMode = "AUTO";
  itemsFrame.counterAxisSizingMode = "AUTO";
  itemsFrame.layoutAlign = "STRETCH";

  // Create the main auto-layout frame to contain the title and items frame
  const wrapperFrame = createAutolayoutFrame(
    [titleWrapper, itemsFrame],
    semanticTokens.spacing.xlarge,
    "VERTICAL"
  );

  titleWrapper.layoutSizingHorizontal = "FILL";

  // Set padding for the main frame
  setPadding(wrapperFrame, {
    top: semanticTokens.padding.xlarge,
    bottom: semanticTokens.padding.xlarge,
    left: semanticTokens.padding.xlarge,
    right: semanticTokens.padding.xlarge,
  });

  wrapperFrame.primaryAxisSizingMode = "AUTO"; // This makes the height hug the content
  wrapperFrame.counterAxisSizingMode = "FIXED"; // This ensures the width is fixed

  let frameWidth = 640;

  if (modes) {
    if (modes.length > 2) {
      frameWidth = 640 * (modes.length / 2);
    }
  }

  // Set the fixed width and initial height
  wrapperFrame.resize(frameWidth, wrapperFrame.height);

  // Ensure explanation items fill the container width
  explanationItems.forEach((item) => {
    item.layoutSizingHorizontal = "FILL";
  });

  return wrapperFrame;
}

export function createExplanationSinglePropertyItem(
  title: string,
  value: string,
  fontName: FontName
) {
  const titleNode = createTextNode(title, fontName, 12);
  titleNode.fills = [{ type: "SOLID", color: semanticTokens.text.primary }];
  titleNode.lineHeight = { unit: "PIXELS", value: 12 * 1.5 };

  const valueNode = createTextNode(value, fontName, 12);
  valueNode.fills = [{ type: "SOLID", color: semanticTokens.text.secondary }];
  valueNode.lineHeight = { unit: "PIXELS", value: 12 * 1.5 };
  valueNode.textAlignHorizontal = "RIGHT";

  const wrapper = createAutolayoutFrame(
    [titleNode, valueNode],
    0,
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

  // Autolayout 內元素排版
  titleNode.layoutSizingHorizontal = "FILL";
  valueNode.layoutSizingHorizontal = "FILL";

  return wrapper;
}

function createColorFrame(color: RGBA): FrameNode {
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

function createNumberFrame(number: number, fontName: FontName): FrameNode {
  let limitedNumber: string;

  if (Number.isInteger(number)) {
    limitedNumber = number.toString(); // Keep whole numbers as they are
  } else {
    limitedNumber = number.toFixed(2); // Limit to 2 decimal places for non-integers
  }

  const numberTextNode = createTextNode(
    limitedNumber,
    fontName,
    semanticTokens.fontSize.base
  );

  numberTextNode.lineHeight = {
    value: semanticTokens.fontSize.base,
    unit: "PIXELS",
  };
  numberTextNode.textAlignHorizontal = "CENTER";

  // Create the frame
  const numberFrame = figma.createFrame();
  numberFrame.name = "Number";
  numberFrame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  numberFrame.cornerRadius = semanticTokens.cornerRadius.small;
  numberFrame.strokes = [{ type: "SOLID", color: semanticTokens.strokeColor }];
  numberFrame.strokeWeight = 1;

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

function createEffectFrame(effects: Effect[]): FrameNode {
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

function createTextPropertiesWrappers(
  textStyle: TextStyle,
  fontName: FontName
): FrameNode[] {
  const fontNameNode = createExplanationSinglePropertyItem(
    "Font Name",
    `${textStyle.fontName.family} ${textStyle.fontName.style}`,
    fontName
  );
  const fontSizeNode = createExplanationSinglePropertyItem(
    "Font Size",
    formatNumberToDecimals(textStyle.fontSize, 2),
    fontName
  );

  const lineHeightNode = createExplanationSinglePropertyItem(
    "Line Height",
    `${
      textStyle.lineHeight.unit == "AUTO"
        ? "Auto"
        : formatNumberToDecimals(textStyle.lineHeight.value, 2)
    }`,
    fontName
  );

  const formattedLetterSpacing = formatNumberToDecimals(
    textStyle.letterSpacing.value,
    2
  );

  const letterSpacingNode = createExplanationSinglePropertyItem(
    "Letter Spacing",
    formattedLetterSpacing,
    fontName
  );

  const formattedParagraphSpacing = formatNumberToDecimals(
    textStyle.paragraphSpacing,
    2
  );

  const paragraphSpacingNode = createExplanationSinglePropertyItem(
    "Paragraph Spacing",
    formattedParagraphSpacing,
    fontName
  );

  const textCaseNode = createExplanationSinglePropertyItem(
    "Text Case",
    `${textStyle.textCase}`,
    fontName
  );

  const tempWrapper1 = createAutolayoutFrame(
    [fontNameNode, fontSizeNode],
    semanticTokens.spacing.xsmall,
    "HORIZONTAL"
  );

  const tempWrapper2 = createAutolayoutFrame(
    [lineHeightNode, letterSpacingNode],
    semanticTokens.spacing.xsmall,
    "HORIZONTAL"
  );

  const tempWrapper3 = createAutolayoutFrame(
    [paragraphSpacingNode, textCaseNode],
    semanticTokens.spacing.xsmall,
    "HORIZONTAL"
  );

  [tempWrapper1, tempWrapper2, tempWrapper3].forEach((n) => {
    n.name = "Properties";
    n.layoutSizingVertical = "HUG";
    n.layoutSizingHorizontal = "FILL";
  });

  [
    fontNameNode,
    fontSizeNode,
    lineHeightNode,
    letterSpacingNode,
    paragraphSpacingNode,
    textCaseNode,
  ].forEach((n) => {
    n.layoutSizingHorizontal = "FILL";
    n.layoutSizingVertical = "FILL";
  });

  return [tempWrapper1, tempWrapper2, tempWrapper3];
}

function createEffectPropertiesWrappers(
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
    countNode.layoutSizingHorizontal = "FILL";

    if (effect.type === "DROP_SHADOW" || effect.type == "INNER_SHADOW") {
      // 處理陰影類型的properties
      const colorNode = createExplanationSinglePropertyItem(
        "Color",
        rgbToHex(effect.color.r, effect.color.g, effect.color.b),
        fontName
      );
      const opacityNode = createExplanationSinglePropertyItem(
        "Opacity",
        `${formatNumberToDecimals(effect.color.a * 100)}%`,
        fontName
      );
      const xNode = createExplanationSinglePropertyItem(
        "X",
        `${effect.offset.x}`,
        fontName
      );
      const yNode = createExplanationSinglePropertyItem(
        "Y",
        `${effect.offset.y}`,
        fontName
      );
      const blurNode = createExplanationSinglePropertyItem(
        "Blur",
        `${effect.radius}`,
        fontName
      );
      const spreadNode = createExplanationSinglePropertyItem(
        "Spread",
        effect.spread ? `${effect.spread}` : "0",
        fontName
      );

      const tempWrapper1 = createAutolayoutFrame(
        [colorNode, opacityNode],
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
      );
      const tempWrapper2 = createAutolayoutFrame(
        [xNode, yNode, blurNode, spreadNode],
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
      );

      [colorNode, opacityNode, xNode, yNode, blurNode, spreadNode].forEach(
        (n) => {
          n.layoutSizingHorizontal = "FILL";
          n.layoutSizingVertical = "FILL";
        }
      );

      effectWrapper.appendChild(tempWrapper1);
      effectWrapper.appendChild(tempWrapper2);

      [tempWrapper1, tempWrapper2].forEach((n) => {
        n.name = "Properties";
        n.layoutSizingVertical = "HUG";
        n.layoutSizingHorizontal = "FILL";
      });
    } else {
      // 處理blur類型的properties
      const blurNode = createExplanationSinglePropertyItem(
        "Blur",
        `${effect.radius}`,
        fontName
      );
      const placeHolderNode = createExplanationSinglePropertyItem(
        "Place Holder",
        "0",
        fontName
      );
      placeHolderNode.opacity = 0;

      const tempWrapper1 = createAutolayoutFrame(
        [blurNode, placeHolderNode],
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
      );
      [blurNode, placeHolderNode].forEach((n) => {
        n.layoutSizingHorizontal = "FILL";
        n.layoutSizingVertical = "FILL";
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

function createColorHexNode(
  format: "STYLE" | "VARIABLE",
  colors: RGBA[],
  fontName: FontName,
  fontSize: number
): TextNode {
  let colorHexNode: TextNode;

  if (format === "STYLE" && colors.length == 1) {
    const color = colors[0];
    let text = rgbToHex(color.r, color.g, color.b, true);
    if (color.a !== 1) {
      // 標註透明度
      text = `${text}(${Math.round(color.a * 100)}%)`;
    }

    // 處理樣式樣式
    colorHexNode = createTextNode(text, fontName, fontSize, [
      { type: "SOLID", color: semanticTokens.text.secondary },
    ]);
  } else {
    // 處理變數樣式
    const hexValues = colors.map((color) => {
      let hex = rgbToHex(color.r, color.g, color.b, true);
      if (color.a !== 1) {
        // 標註透明度
        hex = `${hex}(${Math.round(color.a * 100)}%)`;
      }
      return hex;
    });

    colorHexNode = createTextNode(hexValues.join(", "), fontName, fontSize, [
      { type: "SOLID", color: semanticTokens.text.secondary },
    ]);
  }
  colorHexNode.textCase = "UPPER";

  return colorHexNode;
}

function createAliasNameWrapper(
  aliasName: string,
  fontName: FontName,
  fontSize: number
): FrameNode {
  const aliasNameNode = createTextNode(
    `→ ${aliasName.replace(/\//g, ".")}`,
    { family: fontName.family, style: "Semi Bold" },
    fontSize,
    [{ type: "SOLID", color: semanticTokens.text.secondary }]
  );
  const aliasNameWrapper = createAutolayoutFrame(
    [aliasNameNode],
    0,
    "VERTICAL"
  );
  aliasNameWrapper.layoutSizingHorizontal = "HUG";
  aliasNameWrapper.cornerRadius = semanticTokens.cornerRadius.xsmall;

  setPadding(aliasNameWrapper, {
    top: 4,
    bottom: 4,
    left: 8,
    right: 8,
  });

  setStroke(aliasNameWrapper, semanticTokens.strokeColor, {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
  });

  aliasNameWrapper.fills = [
    { type: "SOLID", color: semanticTokens.background.secondary },
  ];

  aliasNameWrapper.name = "Alias Name";

  return aliasNameWrapper;
}

/**
 * Creates a wrapper frame node containing individual alias name wrappers for each alias in the aliasNames array.
 * @param {string[]} aliasNames - List of alias names to be wrapped.
 * @param {FontName} fontName - The font to be used for each alias name.
 * @returns {FrameNode} - A FrameNode containing all alias name wrappers arranged in an auto-layout frame.
 */
function handleAliasNameWrapperNode(
  aliasNames: string[],
  fontName: FontName
): FrameNode {
  let aliasNameWrapperNode: FrameNode;
  const aliasNameWrappers: FrameNode[] = [];

  for (const aliasName of aliasNames) {
    // 每個aliasname都會有一個aliasNameWrapper
    const aliasNameWrapper = createAliasNameWrapper(
      aliasName,
      fontName,
      semanticTokens.fontSize.base * 0.75
    );
    aliasNameWrapper.layoutSizingHorizontal = "HUG";
    aliasNameWrapper.layoutSizingVertical = "HUG";
    aliasNameWrappers.push(aliasNameWrapper);
  }

  aliasNameWrapperNode = createAutolayoutFrame(
    aliasNameWrappers,
    semanticTokens.spacing.xsmall,
    "HORIZONTAL"
  );
  aliasNameWrapperNode.name = "Alias Names Wrapper";

  return aliasNameWrapperNode;
}
