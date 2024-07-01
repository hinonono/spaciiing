import {
  InstantiaterTarget,
  MessageInstantiater,
  SpacingMode,
} from "../types/Message";
import * as util from "./util";
import * as spaciiing from "./spaciiing";

import {
  iosSystemColorsData,
  iosSystemGrayColorsData,
  m3BaselinePrimaryData,
  m3BaselineSecondaryData,
  m3BaselineTertiaryData,
  m3BaselineNeutralData,
  m3BaselineErrorData,
  antDesignNeutralColorData,
  antDesignDustRedData,
  antDesignVolcanoData,
  antDesignSunsetOrangeData,
  antDesignCalendulaGoldData,
  antDesignSunriseYellowData,
  antDesignLimeData,
  antDesignPolarGreenData,
  antDesignCyanData,
  antDesignDaybreakBlueData,
  antDesignGeekBlueData,
  antDesignGoldenPurpleData,
  antDesignMagentaData,
} from "../assets/colors";
import iosDefaultDropShadowData from "../assets/effects/iosDefaultDropShadow.json";
import iosTypographyLargeData from "../assets/typography/iosTypographyLarge.json";

import {
  CollectionExplanationable,
  ColorCollection,
  ColorType,
  EffectCollection,
  TypographyCollection,
} from "../types/ColorCollection";
import { m3ElevationDarkData, m3ElevationLightData } from "../assets/effects";

const iosSystemColors: ColorCollection = iosSystemColorsData;
const iosSystemGrayColors: ColorCollection = iosSystemGrayColorsData;
const m3BaselinePrimary: ColorCollection = m3BaselinePrimaryData;
const m3BaselineSecondary: ColorCollection = m3BaselineSecondaryData;
const m3BaselineTertiary: ColorCollection = m3BaselineTertiaryData;
const m3BaselineNeutral: ColorCollection = m3BaselineNeutralData;
const m3BaselineError: ColorCollection = m3BaselineErrorData;
const antDesignNeutralColor: ColorCollection = antDesignNeutralColorData;
const antDesignDustRed: ColorCollection = antDesignDustRedData;
const antDesignVolcano: ColorCollection = antDesignVolcanoData;
const antDesignSunsetOrange: ColorCollection = antDesignSunsetOrangeData;
const antDesignCalendulaGold: ColorCollection = antDesignCalendulaGoldData;
const antDesignSunriseYellow: ColorCollection = antDesignSunriseYellowData;
const antDesignLime: ColorCollection = antDesignLimeData;
const antDesignPolarGreen: ColorCollection = antDesignPolarGreenData;
const antDesignCyan: ColorCollection = antDesignCyanData;
const antDesignDaybreakBlue: ColorCollection = antDesignDaybreakBlueData;
const antDesignGeekBlue: ColorCollection = antDesignGeekBlueData;
const antDesignGoldenPurple: ColorCollection = antDesignGoldenPurpleData;
const antDesignMagenta: ColorCollection = antDesignMagentaData;

// Effect資料
const iosDefaultDropShadow: EffectCollection =
  iosDefaultDropShadowData as EffectCollection;
const m3ElevationLight: EffectCollection =
  m3ElevationLightData as EffectCollection;
const m3ElevationDark: EffectCollection =
  m3ElevationDarkData as EffectCollection;

// 字型資料
const iosTypographyLarge: TypographyCollection = iosTypographyLargeData;

/**
 * 依據Target決定要生成哪個Color Style
 */
export function determineGenerateColorStyle(target: InstantiaterTarget) {
  switch (target) {
    case "iosEffectDefaultDropShadow":
      generateEffectStyle(iosDefaultDropShadow);
      break;
    case "m3ElevationLight":
      generateEffectStyle(m3ElevationLight);
      break;
    case "m3ElevationDark":
      generateEffectStyle(m3ElevationDark);
      break;
    case "iosTypographyLarge":
      generateTextNode(iosTypographyLarge);
      break;
    case "iosSystemColorsLight":
      generateColorStyle(iosSystemColors, "light");
      break;
    case "iosSystemColorsDark":
      generateColorStyle(iosSystemColors, "dark");
      break;
    case "iosSystemGrayColorsLight":
      generateColorStyle(iosSystemGrayColors, "light");
      break;
    case "iosSystemGrayColorsDark":
      generateColorStyle(iosSystemGrayColors, "dark");
      break;
    case "m3BaselinePrimaryLight":
      generateColorStyle(m3BaselinePrimary, "light");
      break;
    case "m3BaselinePrimaryDark":
      generateColorStyle(m3BaselinePrimary, "dark");
      break;
    case "m3BaselineSecondaryLight":
      generateColorStyle(m3BaselineSecondary, "light");
      break;
    case "m3BaselineSecondaryDark":
      generateColorStyle(m3BaselineSecondary, "dark");
      break;
    case "m3BaselineTertiaryLight":
      generateColorStyle(m3BaselineTertiary, "light");
      break;
    case "m3BaselineTertiaryDark":
      generateColorStyle(m3BaselineTertiary, "dark");
      break;
    case "m3BaselineNeutralLight":
      generateColorStyle(m3BaselineNeutral, "light");
      break;
    case "m3BaselineNeutralDark":
      generateColorStyle(m3BaselineNeutral, "dark");
      break;
    case "m3BaselineErrorLight":
      generateColorStyle(m3BaselineError, "light");
      break;
    case "m3BaselineErrorDark":
      generateColorStyle(m3BaselineError, "dark");
      break;
    case "antDesignNeutralColorLight":
      generateColorStyle(antDesignNeutralColor, "light");
      break;
    case "antDesignNeutralColorDark":
      generateColorStyle(antDesignNeutralColor, "dark");
      break;
    case "antDesignDustRedLight":
      generateColorStyle(antDesignDustRed, "light");
      break;
    case "antDesignDustRedDark":
      generateColorStyle(antDesignDustRed, "dark");
      break;
    case "antDesignVolcanoLight":
      generateColorStyle(antDesignVolcano, "light");
      break;
    case "antDesignVolcanoDark":
      generateColorStyle(antDesignVolcano, "dark");
      break;
    case "antDesignSunsetOrangeLight":
      generateColorStyle(antDesignSunsetOrange, "light");
      break;
    case "antDesignSunsetOrangeDark":
      generateColorStyle(antDesignSunsetOrange, "dark");
      break;
    case "antDesignCalendulaGoldLight":
      generateColorStyle(antDesignCalendulaGold, "light");
      break;
    case "antDesignCalendulaGoldDark":
      generateColorStyle(antDesignCalendulaGold, "dark");
      break;
    case "antDesignSunriseYellowLight":
      generateColorStyle(antDesignSunriseYellow, "light");
      break;
    case "antDesignSunriseYellowDark":
      generateColorStyle(antDesignSunriseYellow, "dark");
      break;
    case "antDesignLimeLight":
      generateColorStyle(antDesignLime, "light");
      break;
    case "antDesignLimeDark":
      generateColorStyle(antDesignLime, "dark");
      break;
    case "antDesignPolarGreenLight":
      generateColorStyle(antDesignPolarGreen, "light");
      break;
    case "antDesignPolarGreenDark":
      generateColorStyle(antDesignPolarGreen, "dark");
      break;
    case "antDesignCyanLight":
      generateColorStyle(antDesignCyan, "light");
      break;
    case "antDesignCyanDark":
      generateColorStyle(antDesignCyan, "dark");
      break;
    case "antDesignDaybreakBlueLight":
      generateColorStyle(antDesignDaybreakBlue, "light");
      break;
    case "antDesignDaybreakBlueDark":
      generateColorStyle(antDesignDaybreakBlue, "dark");
      break;
    case "antDesignGeekBlueLight":
      generateColorStyle(antDesignGeekBlue, "light");
      break;
    case "antDesignGeekBlueDark":
      generateColorStyle(antDesignGeekBlue, "dark");
      break;
    case "antDesignGoldenPurpleLight":
      generateColorStyle(antDesignGoldenPurple, "light");
      break;
    case "antDesignGoldenPurpleDark":
      generateColorStyle(antDesignGoldenPurple, "dark");
      break;
    case "antDesignMagentaLight":
      generateColorStyle(antDesignMagenta, "light");
      break;
    case "antDesignMagentaDark":
      generateColorStyle(antDesignMagenta, "dark");
      break;
    default:
      // handle default case
      break;
  }
}

/**
 * 依據Target決定要生成哪個Color Variable
 */
export function determineGenerateColorVariable(target: InstantiaterTarget) {
  switch (target) {
    case "iosSystemColorsLight":
      generateColorVariable(iosSystemColors);
      break;
    case "iosSystemColorsDark":
      generateColorVariable(iosSystemColors);
      break;
    case "iosSystemGrayColorsLight":
      generateColorVariable(iosSystemGrayColors);
      break;
    case "iosSystemGrayColorsDark":
      generateColorVariable(iosSystemGrayColors);
      break;
    case "m3BaselinePrimaryLight":
      generateColorVariable(m3BaselinePrimary);
      break;
    case "m3BaselinePrimaryDark":
      generateColorVariable(m3BaselinePrimary);
      break;
    case "m3BaselineSecondaryLight":
      generateColorVariable(m3BaselineSecondary);
      break;
    case "m3BaselineSecondaryDark":
      generateColorVariable(m3BaselineSecondary);
      break;
    case "m3BaselineTertiaryLight":
      generateColorVariable(m3BaselineTertiary);
      break;
    case "m3BaselineTertiaryDark":
      generateColorVariable(m3BaselineTertiary);
      break;
    case "m3BaselineNeutralLight":
      generateColorVariable(m3BaselineNeutral);
      break;
    case "m3BaselineNeutralDark":
      generateColorVariable(m3BaselineNeutral);
      break;
    case "m3BaselineErrorLight":
      generateColorVariable(m3BaselineError);
      break;
    case "m3BaselineErrorDark":
      generateColorVariable(m3BaselineError);
      break;
    case "antDesignNeutralColorLight":
      generateColorVariable(antDesignNeutralColor);
      break;
    case "antDesignNeutralColorDark":
      generateColorVariable(antDesignNeutralColor);
      break;
    case "antDesignDustRedLight":
      generateColorVariable(antDesignDustRed);
      break;
    case "antDesignDustRedDark":
      generateColorVariable(antDesignDustRed);
      break;
    case "antDesignVolcanoLight":
      generateColorVariable(antDesignVolcano);
      break;
    case "antDesignVolcanoDark":
      generateColorVariable(antDesignVolcano);
      break;
    case "antDesignSunsetOrangeLight":
      generateColorVariable(antDesignSunsetOrange);
      break;
    case "antDesignSunsetOrangeDark":
      generateColorVariable(antDesignSunsetOrange);
      break;
    case "antDesignCalendulaGoldLight":
      generateColorVariable(antDesignCalendulaGold);
      break;
    case "antDesignCalendulaGoldDark":
      generateColorVariable(antDesignCalendulaGold);
      break;
    case "antDesignSunriseYellowLight":
      generateColorVariable(antDesignSunriseYellow);
      break;
    case "antDesignSunriseYellowDark":
      generateColorVariable(antDesignSunriseYellow);
      break;
    case "antDesignLimeLight":
      generateColorVariable(antDesignLime);
      break;
    case "antDesignLimeDark":
      generateColorVariable(antDesignLime);
      break;
    case "antDesignPolarGreenLight":
      generateColorVariable(antDesignPolarGreen);
      break;
    case "antDesignPolarGreenDark":
      generateColorVariable(antDesignPolarGreen);
      break;
    case "antDesignCyanLight":
      generateColorVariable(antDesignCyan);
      break;
    case "antDesignCyanDark":
      generateColorVariable(antDesignCyan);
      break;
    case "antDesignDaybreakBlueLight":
      generateColorVariable(antDesignDaybreakBlue);
      break;
    case "antDesignDaybreakBlueDark":
      generateColorVariable(antDesignDaybreakBlue);
      break;
    case "antDesignGeekBlueLight":
      generateColorVariable(antDesignGeekBlue);
      break;
    case "antDesignGeekBlueDark":
      generateColorVariable(antDesignGeekBlue);
      break;
    case "antDesignGoldenPurpleLight":
      generateColorVariable(antDesignGoldenPurple);
      break;
    case "antDesignGoldenPurpleDark":
      generateColorVariable(antDesignGoldenPurple);
      break;
    case "antDesignMagentaLight":
      generateColorVariable(antDesignMagenta);
      break;
    case "antDesignMagentaDark":
      generateColorVariable(antDesignMagenta);
      break;
    default:
      // handle default case
      break;
  }
}

/**
 * 依據Target決定要生成哪個Explanation Text
 */
export function determineGenerateExplanationText(target: InstantiaterTarget) {
  switch (target) {
    case "iosEffectDefaultDropShadow":
      generateExplanationText(iosDefaultDropShadow);
      break;
    case "iosTypographyLarge":
      generateExplanationText(iosTypographyLarge);
      break;
    case "iosSystemColorsLight":
      generateExplanationText(iosSystemColors);
      break;
    case "iosSystemColorsDark":
      generateExplanationText(iosSystemColors);
      break;
    case "iosSystemGrayColorsLight":
      generateExplanationText(iosSystemGrayColors);
      break;
    case "iosSystemGrayColorsDark":
      generateExplanationText(iosSystemGrayColors);
      break;
    case "m3BaselinePrimaryLight":
      generateExplanationText(m3BaselinePrimary);
      break;
    case "m3BaselinePrimaryDark":
      generateExplanationText(m3BaselinePrimary);
      break;
    case "m3BaselineSecondaryLight":
      generateExplanationText(m3BaselineSecondary);
      break;
    case "m3BaselineSecondaryDark":
      generateExplanationText(m3BaselineSecondary);
      break;
    case "m3BaselineTertiaryLight":
      generateExplanationText(m3BaselineTertiary);
      break;
    case "m3BaselineTertiaryDark":
      generateExplanationText(m3BaselineTertiary);
      break;
    case "m3BaselineNeutralLight":
      generateExplanationText(m3BaselineNeutral);
      break;
    case "m3BaselineNeutralDark":
      generateExplanationText(m3BaselineNeutral);
      break;
    case "m3BaselineErrorLight":
      generateExplanationText(m3BaselineError);
      break;
    case "m3BaselineErrorDark":
      generateExplanationText(m3BaselineError);
      break;
    case "antDesignNeutralColorLight":
      generateExplanationText(antDesignNeutralColor);
      break;
    case "antDesignNeutralColorDark":
      generateExplanationText(antDesignNeutralColor);
      break;
    case "antDesignDustRedLight":
      generateExplanationText(antDesignDustRed);
      break;
    case "antDesignDustRedDark":
      generateExplanationText(antDesignDustRed);
      break;
    case "antDesignVolcanoLight":
      generateExplanationText(antDesignVolcano);
      break;
    case "antDesignVolcanoDark":
      generateExplanationText(antDesignVolcano);
      break;
    case "antDesignSunsetOrangeLight":
      generateExplanationText(antDesignSunsetOrange);
      break;
    case "antDesignSunsetOrangeDark":
      generateExplanationText(antDesignSunsetOrange);
      break;
    case "antDesignCalendulaGoldLight":
      generateExplanationText(antDesignCalendulaGold);
      break;
    case "antDesignCalendulaGoldDark":
      generateExplanationText(antDesignCalendulaGold);
      break;
    case "antDesignSunriseYellowLight":
      generateExplanationText(antDesignSunriseYellow);
      break;
    case "antDesignSunriseYellowDark":
      generateExplanationText(antDesignSunriseYellow);
      break;
    case "antDesignLimeLight":
      generateExplanationText(antDesignLime);
      break;
    case "antDesignLimeDark":
      generateExplanationText(antDesignLime);
      break;
    case "antDesignPolarGreenLight":
      generateExplanationText(antDesignPolarGreen);
      break;
    case "antDesignPolarGreenDark":
      generateExplanationText(antDesignPolarGreen);
      break;
    case "antDesignCyanLight":
      generateExplanationText(antDesignCyan);
      break;
    case "antDesignCyanDark":
      generateExplanationText(antDesignCyan);
      break;
    case "antDesignDaybreakBlueLight":
      generateExplanationText(antDesignDaybreakBlue);
      break;
    case "antDesignDaybreakBlueDark":
      generateExplanationText(antDesignDaybreakBlue);
      break;
    case "antDesignGeekBlueLight":
      generateExplanationText(antDesignGeekBlue);
      break;
    case "antDesignGeekBlueDark":
      generateExplanationText(antDesignGeekBlue);
      break;
    case "antDesignGoldenPurpleLight":
      generateExplanationText(antDesignGoldenPurple);
      break;
    case "antDesignGoldenPurpleDark":
      generateExplanationText(antDesignGoldenPurple);
      break;
    case "antDesignMagentaLight":
      generateExplanationText(antDesignMagenta);
      break;
    case "antDesignMagentaDark":
      generateExplanationText(antDesignMagenta);
      break;
    default:
      // handle default case
      break;
  }
}

export function instantiateTarget(message: MessageInstantiater) {
  if (message.type == "actual") {
    if (message.form == "style") {
      determineGenerateColorStyle(message.target);
    } else {
      determineGenerateColorVariable(message.target);
    }
  } else if (message.type == "explanation") {
    determineGenerateExplanationText(message.target);
  }
}

// Define the function
function generateColorVariable(collection: ColorCollection) {
  // Create a new variable collection
  const variableCollection = figma.variables.createVariableCollection(
    collection.name
  );

  // Add "light" and "dark" modes to the collection
  const lightModeId = variableCollection.addMode("Light");
  const darkModeId = variableCollection.addMode("Dark");

  // Iterate over each member in the collection and create variables
  for (const member of collection.members) {
    // Create a new variable for the current color member
    const variable = figma.variables.createVariable(
      member.name,
      variableCollection,
      "COLOR"
    );

    // Set the description of the variable
    variable.description = member.description;

    // Set the values for light and dark modes
    variable.setValueForMode(
      lightModeId,
      util.convertColorRange(member.color.light)
    );
    variable.setValueForMode(
      darkModeId,
      util.convertColorRange(member.color.dark)
    );
  }

  // Remove any modes that are not "Light" or "Dark"
  variableCollection.modes.forEach((mode) => {
    if (mode.modeId !== lightModeId && mode.modeId !== darkModeId) {
      variableCollection.removeMode(mode.modeId);
    }
  });

  // Notify the user that the variable collection has been created
  figma.notify(`✅ Collection "${collection.name}" created successfully.`);
}

async function generateExplanationText(collection: CollectionExplanationable) {
  const viewport = util.getCurrentViewport();
  const baseFontSize = 16;

  // Load all necessary fonts
  const fontsToLoad = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Semi Bold" },
  ];
  await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));

  // 結果
  const results = [];

  // 說明文字
  const explanationTextTitle = `Usage definition of ${collection.brand} - ${collection.name}`;
  const explanationTitleNode = figma.createText();
  explanationTitleNode.fontName = { family: "Inter", style: "Semi Bold" };
  explanationTitleNode.x = viewport.x;
  explanationTitleNode.y = viewport.y;
  explanationTitleNode.characters = explanationTextTitle;
  explanationTitleNode.fontSize = baseFontSize;
  results.push(explanationTitleNode);

  collection.members.forEach((member) => {
    const description =
      member.description == "" ? "(blank)" : member.description;
    const explanation = `${member.name} : ${description}`;
    const explanationNode = figma.createText();
    explanationNode.characters = explanation;
    explanationNode.fontSize = baseFontSize;
    explanationNode.x = viewport.x;
    explanationNode.y = viewport.y;
    results.push(explanationNode);
  });

  results.forEach((item) => {
    figma.currentPage.appendChild(item);
  });

  figma.currentPage.selection = results;
  const spacing = 8;
  const mode: SpacingMode = "vertical";
  const addAutolayout = true;

  const frame = spaciiing.applySpacingToLayers(
    results,
    spacing,
    mode,
    addAutolayout,
    true
  );

  if (frame) {
    // Set the fill to white
    frame.fills = [
      {
        type: "SOLID",
        color: { r: 1, g: 1, b: 1 },
      },
    ];

    frame.name = explanationTextTitle;
    // Set padding for all sides
    frame.paddingTop = 16;
    frame.paddingRight = 16;
    frame.paddingBottom = 16;
    frame.paddingLeft = 16;

    // Set corner radius
    frame.cornerRadius = 8;
    // Set the width and height to hug contents
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
  }
}

function generateColorStyle(collection: ColorCollection, type: ColorType) {
  collection.members.forEach((item) => {
    const style = figma.createPaintStyle();
    const colorType = type === "none" ? "light" : type;
    const color = item.color[colorType];

    style.name =
      type === "none"
        ? `${collection.brand} - ${collection.name}/${item.name}`
        : `${collection.brand} - ${collection.name}/${type}/${item.name}`;

    style.paints = [
      {
        type: "SOLID",
        color: {
          r: util.mapToUnitRange(color.r),
          g: util.mapToUnitRange(color.g),
          b: util.mapToUnitRange(color.b),
        },
        opacity: color.a,
      },
    ];
    style.description = item.description;
  });
}

function generateEffectStyle(collection: EffectCollection) {
  collection.members.forEach((item) => {
    const style = figma.createEffectStyle();
    style.name = `${collection.brand} - ${collection.name}/${item.name}`;
    style.description = item.description;

    // Assuming Effect is defined elsewhere in your codebase
    style.effects = item.effects.map((effect) => ({
      ...effect, // Copy the effect properties
    }));
  });
}

async function generateTextNode(collection: TypographyCollection) {
  const verticalSpacing = 32;
  let currentYPosition = 0;

  const texts: Array<TextNode> = [];
  const viewport = util.getCurrentViewport();

  // Load all necessary fonts
  const fontsToLoad = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Semi Bold" },
  ];
  await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));

  const notificationText = figma.createText();
  notificationText.characters = `Change the typeface of below text layer, then click "Shortcut => Generate Text Style" from plugin.`;
  notificationText.fontSize = 32;
  notificationText.x = viewport.x;
  notificationText.y = currentYPosition;
  notificationText.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];

  currentYPosition += notificationText.height + verticalSpacing;

  for (const item of collection.members) {
    const textNode = figma.createText();

    textNode.characters = `${collection.brand} - ${collection.name}/${item.name}`;
    textNode.fontSize = item.fontSize;
    textNode.lineHeight = { value: item.fontSize, unit: "PIXELS" };

    // Set font properties
    const fontWeightStyle =
      item.fontWeight === "regular" ? "Regular" : "Semi Bold";
    textNode.fontName = { family: "Inter", style: fontWeightStyle };

    textNode.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];

    // Set the position of the text node
    textNode.x = viewport.x;
    textNode.y = currentYPosition;

    // Update the currentYPosition for the next text node
    currentYPosition += textNode.height + verticalSpacing;

    figma.currentPage.appendChild(textNode);
    texts.push(textNode);
  }

  // Select the created text nodes
  figma.currentPage.selection = texts;

  // Zoom to fit the selected nodes in the viewport
  figma.viewport.scrollAndZoomIntoView(texts);
}
