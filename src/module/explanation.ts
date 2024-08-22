import { StyleMode } from "../types/Messages/MessageStyleIntroducer";
import { semanticTokens } from "./tokens";
import {
  createAutolayoutFrame,
  createTextNode,
  isWhite,
  rgbToHex,
  setPadding,
  setStroke,
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
  let aliasNameWrapperNode: FrameNode = figma.createFrame();
  const itemsToPutInTitleWrapper: SceneNode[] = [];

  //當format是VARIABLE時，處理aliasName
  if (aliasNames && format === "VARIABLE") {
    const aliasNameWrappers: FrameNode[] = [];
    for (const aliasName of aliasNames) {
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
  } else {
    // 預設 或 類型是EFFECT
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
  aliasNameWrapperNode.layoutSizingHorizontal = "FILL";
  aliasNameWrapperNode.layoutSizingVertical = "HUG";

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
      colorFrames.push(colorFrame);
    });

    const item = createAutolayoutFrame(
      [...colorFrames, explanationTextsWrapperNode],
      semanticTokens.spacing.base,
      "HORIZONTAL"
    );

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

  // Set the fixed width and initial height
  wrapperFrame.resize(640, wrapperFrame.height);

  // Ensure explanation items fill the container width
  explanationItems.forEach((item) => {
    item.layoutSizingHorizontal = "FILL";
  });

  return wrapperFrame;
}

export function createExplanationTextPropertyItem(
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
  wrapper.name = "Text Property Item";
  wrapper.layoutGrow = 1;
  wrapper.paddingTop = 4;
  wrapper.paddingBottom = 4;

  // 筆畫
  wrapper.strokes = [{ type: "SOLID", color: semanticTokens.dividerColor }];
  wrapper.strokeTopWeight = 0;
  wrapper.strokeBottomWeight = 1;
  wrapper.strokeLeftWeight = 0;
  wrapper.strokeRightWeight = 0;

  // Autolayout 內元素排版
  titleNode.layoutSizingHorizontal = "FILL";
  valueNode.layoutSizingHorizontal = "FILL";

  return wrapper;
}

function createColorFrame(color: RGBA): FrameNode {
  const colorFrame = figma.createFrame();
  colorFrame.resize(64, 64);
  colorFrame.name = "Swatch";
  colorFrame.fills = [
    { type: "SOLID", color: { r: color.r, g: color.g, b: color.b } },
  ];
  colorFrame.cornerRadius = semanticTokens.cornerRadius.small;
  colorFrame.opacity = color.a;

  if (isWhite(color)) {
    colorFrame.strokes = [{ type: "SOLID", color: semanticTokens.strokeColor }];
    colorFrame.strokeWeight = 1;
  }

  return colorFrame;
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
  const fontNameNode = createExplanationTextPropertyItem(
    "Font Name",
    `${textStyle.fontName.family} ${textStyle.fontName.style}`,
    fontName
  );
  const fontSizeNode = createExplanationTextPropertyItem(
    "Font Size",
    `${textStyle.fontSize}`,
    fontName
  );

  const lineHeightNode = createExplanationTextPropertyItem(
    "Line Height",
    `${
      textStyle.lineHeight.unit == "AUTO" ? "Auto" : textStyle.lineHeight.value
    }`,
    fontName
  );

  const letterSpacingNode = createExplanationTextPropertyItem(
    "Letter Spacing",
    `${textStyle.letterSpacing.value}`,
    fontName
  );

  const paragraphSpacingNode = createExplanationTextPropertyItem(
    "Paragraph Spacing",
    `${textStyle.paragraphSpacing}`,
    fontName
  );

  const textCaseNode = createExplanationTextPropertyItem(
    "Text Case",
    `${textStyle.textCase}`,
    fontName
  );

  const tempWrapper1 = createAutolayoutFrame(
    [fontNameNode, fontSizeNode],
    semanticTokens.spacing.base,
    "HORIZONTAL"
  );

  const tempWrapper2 = createAutolayoutFrame(
    [lineHeightNode, letterSpacingNode],
    semanticTokens.spacing.base,
    "HORIZONTAL"
  );

  const tempWrapper3 = createAutolayoutFrame(
    [paragraphSpacingNode, textCaseNode],
    semanticTokens.spacing.base,
    "HORIZONTAL"
  );

  tempWrapper1.name = "Text Property Items Wrapper";
  tempWrapper2.name = "Text Property Items Wrapper";
  tempWrapper3.name = "Text Property Items Wrapper";

  tempWrapper1.layoutSizingVertical = "HUG";
  tempWrapper2.layoutSizingVertical = "HUG";
  tempWrapper3.layoutSizingVertical = "HUG";

  fontNameNode.layoutSizingHorizontal = "FILL";
  fontSizeNode.layoutSizingHorizontal = "FILL";
  lineHeightNode.layoutSizingHorizontal = "FILL";
  letterSpacingNode.layoutSizingHorizontal = "FILL";
  paragraphSpacingNode.layoutSizingHorizontal = "FILL";
  textCaseNode.layoutSizingHorizontal = "FILL";

  fontNameNode.layoutSizingVertical = "FILL";
  fontSizeNode.layoutSizingVertical = "FILL";
  lineHeightNode.layoutSizingVertical = "FILL";
  letterSpacingNode.layoutSizingVertical = "FILL";
  paragraphSpacingNode.layoutSizingVertical = "FILL";
  textCaseNode.layoutSizingVertical = "FILL";

  return [tempWrapper1, tempWrapper2, tempWrapper3];
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

    // 處理樣式樣式
    colorHexNode = createTextNode(
      rgbToHex(color.r, color.g, color.b, true),
      fontName,
      fontSize,
      [{ type: "SOLID", color: semanticTokens.text.secondary }]
    );
  } else {
    // 處理變數樣式
    const hexValues = colors.map((color) =>
      rgbToHex(color.r, color.g, color.b)
    );
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
