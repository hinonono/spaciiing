import * as util from "./util";
import * as colors from "../assets/colors";
import iosTypographyLargeData from "../assets/typography/iosTypographyLarge.json";
import { utils } from "./utils";

import {
  ColorCollection,
  ColorType,
  EffectCollection,
  NumberCollection,
  TypographyCollection,
} from "../types/ColorCollection";
import {
  m3ElevationDarkData,
  m3ElevationLightData,
  iosDefaultDropShadowData,
  antDesignDropShadowData,
  tailwindShadowData,
} from "../assets/effects";
import {
  tailwindBorderData,
  tailwindBorderRadiusData,
  tailwindContainerData,
  tailwindFontSizeData,
  tailwindOpacityData,
  tailwindSizeData,
  // Ant Design
  antDesignBreakpointsData,
  antDesignFontSizeData,
  antDesignLineHeightData,
  antDesignPaddingData,
  // Bootstrap
  bootstrapBorderRadiusData,
  bootstrapBreakpointsData,
  // Carbon
  carbonBreakpointsData,
  carbonSpacingData,
  carbonTypographyScaleData,
  // Polaris
  polarisBorderRadiusData,
  polarisBreakpointsData,
  polarisFontSizeData,
  polarisHeightData,
  polarisLineHeightData,
  polarisSpaceData,
  polarisWidthData,
} from "../assets/numbers";

import {
  InstantiaterTarget,
  MessageInstantiater,
} from "../types/Messages/MessageInstantiater";

const iosSystemColors: ColorCollection = colors.iosSystemColorsData;
const iosSystemGrayColors: ColorCollection = colors.iosSystemGrayColorsData;

// Material
const m3BaselinePrimary: ColorCollection = colors.m3BaselinePrimaryData;
const m3BaselineSecondary: ColorCollection = colors.m3BaselineSecondaryData;
const m3BaselineTertiary: ColorCollection = colors.m3BaselineTertiaryData;
const m3BaselineNeutral: ColorCollection = colors.m3BaselineNeutralData;
const m3BaselineError: ColorCollection = colors.m3BaselineErrorData;

// Ant Design
const antNeutralColor: ColorCollection = colors.antDesignNeutralColorData;
const antDustRed: ColorCollection = colors.antDesignDustRedData;
const antVolcano: ColorCollection = colors.antDesignVolcanoData;
const antSunsetOrange: ColorCollection = colors.antDesignSunsetOrangeData;
const antCalendulaGold: ColorCollection =
  colors.antDesignCalendulaGoldData;
const antSunriseYellow: ColorCollection =
  colors.antDesignSunriseYellowData;
const antLime: ColorCollection = colors.antDesignLimeData;
const antPolarGreen: ColorCollection = colors.antDesignPolarGreenData;
const antCyan: ColorCollection = colors.antDesignCyanData;
const antDaybreakBlue: ColorCollection = colors.antDesignDaybreakBlueData;
const antGeekBlue: ColorCollection = colors.antDesignGeekBlueData;
const antGoldenPurple: ColorCollection = colors.antDesignGoldenPurpleData;
const antMagenta: ColorCollection = colors.antDesignMagentaData;
const antBreakpoints: NumberCollection = antDesignBreakpointsData;
const antFontSize: NumberCollection = antDesignFontSizeData;
const antLineHeight: NumberCollection = antDesignLineHeightData;
const antPadding: NumberCollection = antDesignPaddingData;

// Tailwind CSS
const twSlate: ColorCollection = colors.tailwindSlateData;
const twGray: ColorCollection = colors.tailwindGrayData;
const twZinc: ColorCollection = colors.tailwindZincData;
const twNeutral: ColorCollection = colors.tailwindNeutralData;
const twStone: ColorCollection = colors.tailwindStoneData;
const twRed: ColorCollection = colors.tailwindRedData;
const twOrange: ColorCollection = colors.tailwindOrangeData;
const twAmber: ColorCollection = colors.tailwindAmberData;
const twYellow: ColorCollection = colors.tailwindYellowData;
const twLime: ColorCollection = colors.tailwindLimeData;
const twGreen: ColorCollection = colors.tailwindGreenData;
const twEmerald: ColorCollection = colors.tailwindEmeraldData;
const twTeal: ColorCollection = colors.tailwindTealData;
const twCyan: ColorCollection = colors.tailwindCyanData;
const twSky: ColorCollection = colors.tailwindSkyData;
const twBlue: ColorCollection = colors.tailwindBlueData;
const twIndigo: ColorCollection = colors.tailwindIndigoData;
const twViolet: ColorCollection = colors.tailwindVioletData;
const twPurple: ColorCollection = colors.tailwindPurpleData;
const twFuchsia: ColorCollection = colors.tailwindFuchsiaData;
const twPink: ColorCollection = colors.tailwindPinkData;
const twRose: ColorCollection = colors.tailwindRoseData;
const twBorder: NumberCollection = tailwindBorderData;
const twBorderRadius: NumberCollection = tailwindBorderRadiusData;
const twContainer: NumberCollection = tailwindContainerData;
const twFontSize: NumberCollection = tailwindFontSizeData;
const twOpacity: NumberCollection = tailwindOpacityData;
const twSize: NumberCollection = tailwindSizeData;

// Bootstrap
const bsBlue: ColorCollection = colors.bootstrapBlue;
const bsIndigo: ColorCollection = colors.bootstrapIndigo;
const bsPurple: ColorCollection = colors.bootstrapPurple;
const bsPink: ColorCollection = colors.bootstrapPink;
const bsRed: ColorCollection = colors.bootstrapRed;
const bsOrange: ColorCollection = colors.bootstrapOrange;
const bsYellow: ColorCollection = colors.bootstrapYellow;
const bsGreen: ColorCollection = colors.bootstrapGreen;
const bsTeal: ColorCollection = colors.bootstrapTeal;
const bsCyan: ColorCollection = colors.bootstrapCyan;
const bsGray: ColorCollection = colors.bootstrapGray;
const bsBorderRadius: NumberCollection = bootstrapBorderRadiusData;
const bsBreakpoints: NumberCollection = bootstrapBreakpointsData;

// Polaris
const pRose: ColorCollection = colors.polarisRose;
const pMagenta: ColorCollection = colors.polarisMagenta;
const pPurple: ColorCollection = colors.polarisPurple;
const pBlue: ColorCollection = colors.polarisBlue;
const pAzure: ColorCollection = colors.polarisAzure;
const pTeal: ColorCollection = colors.polarisTeal;
const pCyan: ColorCollection = colors.polarisCyan;
const pGreen: ColorCollection = colors.polarisGreen;
const pLime: ColorCollection = colors.polarisLime;
const pYellow: ColorCollection = colors.polarisYellow;
const pOrange: ColorCollection = colors.polarisOrange;
const pRed: ColorCollection = colors.polarisRed;
const pBorderRadius: NumberCollection = polarisBorderRadiusData;
const pBreakpoints: NumberCollection = polarisBreakpointsData;
const pFontSize: NumberCollection = polarisFontSizeData;
const pHeight: NumberCollection = polarisHeightData;
const pLineHeight: NumberCollection = polarisLineHeightData;
const pSpace: NumberCollection = polarisSpaceData;
const pWidth: NumberCollection = polarisWidthData;

// Carbon
const cBlue: ColorCollection = colors.carbonBlue;
const cCoolGray: ColorCollection = colors.carbonCoolGray;
const cCyan: ColorCollection = colors.carbonCyan;
const cGray: ColorCollection = colors.carbonGray;
const cGreen: ColorCollection = colors.carbonGreen;
const cMagenta: ColorCollection = colors.carbonMagenta;
const cOrange: ColorCollection = colors.carbonOrange;
const cPurple: ColorCollection = colors.carbonPurple;
const cRed: ColorCollection = colors.carbonRed;
const cTeal: ColorCollection = colors.carbonTeal;
const cWarmGray: ColorCollection = colors.carbonWarmGray;
const cYellow: ColorCollection = colors.carbonYellow;
const cBreakpoints: NumberCollection = carbonBreakpointsData;
const cSpacing: NumberCollection = carbonSpacingData;
const cTypographyScale: NumberCollection = carbonTypographyScaleData;

// Effect資料
const iosDefaultDropShadow: EffectCollection =
  iosDefaultDropShadowData as EffectCollection;
const antDesignDropShadow: EffectCollection =
  antDesignDropShadowData as EffectCollection;
const m3ElevationLight: EffectCollection =
  m3ElevationLightData as EffectCollection;
const m3ElevationDark: EffectCollection =
  m3ElevationDarkData as EffectCollection;
const tailwindShadow: EffectCollection = tailwindShadowData as EffectCollection;

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
    case "antDesignDropShadow":
      generateEffectStyle(antDesignDropShadow);
      break;
    case "m3ElevationLight":
      generateEffectStyle(m3ElevationLight);
      break;
    case "m3ElevationDark":
      generateEffectStyle(m3ElevationDark);
      break;
    case "iosTypographyLarge":
      generateTextStyleNode(iosTypographyLarge);
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
    case "m3BaselinePrimary":
      generateColorStyle(m3BaselinePrimary, "none");
      break;
    case "m3BaselineSecondary":
      generateColorStyle(m3BaselineSecondary, "none");
      break;
    case "m3BaselineTertiary":
      generateColorStyle(m3BaselineTertiary, "none");
      break;
    case "m3BaselineNeutral":
      generateColorStyle(m3BaselineNeutral, "none");
      break;
    case "m3BaselineError":
      generateColorStyle(m3BaselineError, "none");
      break;
    case "antDesignNeutralColorLight":
      generateColorStyle(antNeutralColor, "light");
      break;
    case "antDesignNeutralColorDark":
      generateColorStyle(antNeutralColor, "dark");
      break;
    case "antDesignDustRedLight":
      generateColorStyle(antDustRed, "light");
      break;
    case "antDesignDustRedDark":
      generateColorStyle(antDustRed, "dark");
      break;
    case "antDesignVolcanoLight":
      generateColorStyle(antVolcano, "light");
      break;
    case "antDesignVolcanoDark":
      generateColorStyle(antVolcano, "dark");
      break;
    case "antDesignSunsetOrangeLight":
      generateColorStyle(antSunsetOrange, "light");
      break;
    case "antDesignSunsetOrangeDark":
      generateColorStyle(antSunsetOrange, "dark");
      break;
    case "antDesignCalendulaGoldLight":
      generateColorStyle(antCalendulaGold, "light");
      break;
    case "antDesignCalendulaGoldDark":
      generateColorStyle(antCalendulaGold, "dark");
      break;
    case "antDesignSunriseYellowLight":
      generateColorStyle(antSunriseYellow, "light");
      break;
    case "antDesignSunriseYellowDark":
      generateColorStyle(antSunriseYellow, "dark");
      break;
    case "antDesignLimeLight":
      generateColorStyle(antLime, "light");
      break;
    case "antDesignLimeDark":
      generateColorStyle(antLime, "dark");
      break;
    case "antDesignPolarGreenLight":
      generateColorStyle(antPolarGreen, "light");
      break;
    case "antDesignPolarGreenDark":
      generateColorStyle(antPolarGreen, "dark");
      break;
    case "antDesignCyanLight":
      generateColorStyle(antCyan, "light");
      break;
    case "antDesignCyanDark":
      generateColorStyle(antCyan, "dark");
      break;
    case "antDesignDaybreakBlueLight":
      generateColorStyle(antDaybreakBlue, "light");
      break;
    case "antDesignDaybreakBlueDark":
      generateColorStyle(antDaybreakBlue, "dark");
      break;
    case "antDesignGeekBlueLight":
      generateColorStyle(antGeekBlue, "light");
      break;
    case "antDesignGeekBlueDark":
      generateColorStyle(antGeekBlue, "dark");
      break;
    case "antDesignGoldenPurpleLight":
      generateColorStyle(antGoldenPurple, "light");
      break;
    case "antDesignGoldenPurpleDark":
      generateColorStyle(antGoldenPurple, "dark");
      break;
    case "antDesignMagentaLight":
      generateColorStyle(antMagenta, "light");
      break;
    case "antDesignMagentaDark":
      generateColorStyle(antMagenta, "dark");
      break;
    case "tailwindSlate":
      generateColorStyle(twSlate, "none");
      break;
    case "tailwindGray":
      generateColorStyle(twGray, "none");
      break;
    case "tailwindZinc":
      generateColorStyle(twZinc, "none");
      break;
    case "tailwindNeutral":
      generateColorStyle(twNeutral, "none");
      break;
    case "tailwindStone":
      generateColorStyle(twStone, "none");
      break;
    case "tailwindRed":
      generateColorStyle(twRed, "none");
      break;
    case "tailwindOrange":
      generateColorStyle(twOrange, "none");
      break;
    case "tailwindAmber":
      generateColorStyle(twAmber, "none");
      break;
    case "tailwindYellow":
      generateColorStyle(twYellow, "none");
      break;
    case "tailwindLime":
      generateColorStyle(twLime, "none");
      break;
    case "tailwindGreen":
      generateColorStyle(twGreen, "none");
      break;
    case "tailwindEmerald":
      generateColorStyle(twEmerald, "none");
      break;
    case "tailwindTeal":
      generateColorStyle(twTeal, "none");
      break;
    case "tailwindCyan":
      generateColorStyle(twCyan, "none");
      break;
    case "tailwindSky":
      generateColorStyle(twSky, "none");
      break;
    case "tailwindBlue":
      generateColorStyle(twBlue, "none");
      break;
    case "tailwindIndigo":
      generateColorStyle(twIndigo, "none");
      break;
    case "tailwindViolet":
      generateColorStyle(twViolet, "none");
      break;
    case "tailwindPurple":
      generateColorStyle(twPurple, "none");
      break;
    case "tailwindFuchsia":
      generateColorStyle(twFuchsia, "none");
      break;
    case "tailwindPink":
      generateColorStyle(twPink, "none");
      break;
    case "tailwindRose":
      generateColorStyle(twRose, "none");
      break;
    case "tailwindShadow":
      generateEffectStyle(tailwindShadow);
      break;
    case "bootstrapBlue":
      generateColorStyle(bsBlue, "none");
      break;
    case "bootstrapIndigo":
      generateColorStyle(bsIndigo, "none");
      break;
    case "bootstrapPurple":
      generateColorStyle(bsPurple, "none");
      break;
    case "bootstrapPink":
      generateColorStyle(bsPink, "none");
      break;
    case "bootstrapRed":
      generateColorStyle(bsRed, "none");
      break;
    case "bootstrapOrange":
      generateColorStyle(bsOrange, "none");
      break;
    case "bootstrapYellow":
      generateColorStyle(bsYellow, "none");
      break;
    case "bootstrapGreen":
      generateColorStyle(bsGreen, "none");
      break;
    case "bootstrapTeal":
      generateColorStyle(bsTeal, "none");
      break;
    case "bootstrapCyan":
      generateColorStyle(bsCyan, "none");
      break;
    case "bootstrapGray":
      generateColorStyle(bsGray, "none");
      break;
    case "polarisRose":
      generateColorStyle(pRose, "none");
      break;
    case "polarisMagenta":
      generateColorStyle(pMagenta, "none");
      break;
    case "polarisPurple":
      generateColorStyle(pPurple, "none");
      break;
    case "polarisBlue":
      generateColorStyle(pBlue, "none");
      break;
    case "polarisAzure":
      generateColorStyle(pAzure, "none");
      break;
    case "polarisTeal":
      generateColorStyle(pTeal, "none");
      break;
    case "polarisCyan":
      generateColorStyle(pCyan, "none");
      break;
    case "polarisGreen":
      generateColorStyle(pGreen, "none");
      break;
    case "polarisLime":
      generateColorStyle(pLime, "none");
      break;
    case "polarisYellow":
      generateColorStyle(pYellow, "none");
      break;
    case "polarisOrange":
      generateColorStyle(pOrange, "none");
      break;
    case "polarisRed":
      generateColorStyle(pRed, "none");
      break;
    case "carbonBlue":
      generateColorStyle(cBlue, "none");
      break;
    case "carbonCoolGray":
      generateColorStyle(cCoolGray, "none");
      break;
    case "carbonCyan":
      generateColorStyle(cCyan, "none");
      break;
    case "carbonGray":
      generateColorStyle(cGray, "none");
      break;
    case "carbonGreen":
      generateColorStyle(cGreen, "none");
      break;
    case "carbonMagenta":
      generateColorStyle(cMagenta, "none");
      break;
    case "carbonOrange":
      generateColorStyle(cOrange, "none");
      break;
    case "carbonPurple":
      generateColorStyle(cPurple, "none");
      break;
    case "carbonRed":
      generateColorStyle(cRed, "none");
      break;
    case "carbonTeal":
      generateColorStyle(cTeal, "none");
      break;
    case "carbonWarmGray":
      generateColorStyle(cWarmGray, "none");
      break;
    case "carbonYellow":
      generateColorStyle(cYellow, "none");
      break;
    default:
      // handle default case
      break;
  }
}

/**
 * 依據Target決定要生成哪個Color Variable
 */
export function determineGenerateVariable(
  target: InstantiaterTarget
): ColorCollection | NumberCollection {
  switch (target) {
    // iOS
    case "iosSystemColorsLight":
      return iosSystemColors;
    case "iosSystemColorsDark":
      return iosSystemColors;
    case "iosSystemGrayColorsLight":
      return iosSystemGrayColors;
    case "iosSystemGrayColorsDark":
      return iosSystemGrayColors;
    // Material 3
    case "m3BaselinePrimary":
      return m3BaselinePrimary;
    case "m3BaselineSecondary":
      return m3BaselineSecondary;
    case "m3BaselineTertiary":
      return m3BaselineTertiary;
    case "m3BaselineNeutral":
      return m3BaselineNeutral;
    case "m3BaselineError":
      return m3BaselineError;
    // Ant Design
    case "antDesignNeutralColorLight":
      return antNeutralColor;
    case "antDesignNeutralColorDark":
      return antNeutralColor;
    case "antDesignDustRedLight":
      return antDustRed;
    case "antDesignDustRedDark":
      return antDustRed;
    case "antDesignVolcanoLight":
      return antVolcano;
    case "antDesignVolcanoDark":
      return antVolcano;
    case "antDesignSunsetOrangeLight":
      return antSunsetOrange;
    case "antDesignSunsetOrangeDark":
      return antSunsetOrange;
    case "antDesignCalendulaGoldLight":
      return antCalendulaGold;
    case "antDesignCalendulaGoldDark":
      return antCalendulaGold;
    case "antDesignSunriseYellowLight":
      return antSunriseYellow;
    case "antDesignSunriseYellowDark":
      return antSunriseYellow;
    case "antDesignLimeLight":
      return antLime;
    case "antDesignLimeDark":
      return antLime;
    case "antDesignPolarGreenLight":
      return antPolarGreen;
    case "antDesignPolarGreenDark":
      return antPolarGreen;
    case "antDesignCyanLight":
      return antCyan;
    case "antDesignCyanDark":
      return antCyan;
    case "antDesignDaybreakBlueLight":
      return antDaybreakBlue;
    case "antDesignDaybreakBlueDark":
      return antDaybreakBlue;
    case "antDesignGeekBlueLight":
      return antGeekBlue;
    case "antDesignGeekBlueDark":
      return antGeekBlue;
    case "antDesignGoldenPurpleLight":
      return antGoldenPurple;
    case "antDesignGoldenPurpleDark":
      return antGoldenPurple;
    case "antDesignMagentaLight":
      return antMagenta;
    case "antDesignMagentaDark":
      return antMagenta;
    case "antDesignBreakpoints":
      return antBreakpoints;
    case "antDesignFontSize":
      return antFontSize;
    case "antDesignLineHeight":
      return antLineHeight;
    case "antDesignPadding":
      return antPadding;
    // Tailwind
    case "tailwindSlate":
      return twSlate;
    case "tailwindGray":
      return twGray;
    case "tailwindZinc":
      return twZinc;
    case "tailwindNeutral":
      return twNeutral;
    case "tailwindStone":
      return twStone;
    case "tailwindRed":
      return twRed;
    case "tailwindOrange":
      return twOrange;
    case "tailwindAmber":
      return twAmber;
    case "tailwindYellow":
      return twYellow;
    case "tailwindLime":
      return twLime;
    case "tailwindGreen":
      return twGreen;
    case "tailwindEmerald":
      return twEmerald;
    case "tailwindTeal":
      return twTeal;
    case "tailwindCyan":
      return twCyan;
    case "tailwindSky":
      return twSky;
    case "tailwindBlue":
      return twBlue;
    case "tailwindIndigo":
      return twIndigo;
    case "tailwindViolet":
      return twViolet;
    case "tailwindPurple":
      return twPurple;
    case "tailwindFuchsia":
      return twFuchsia;
    case "tailwindPink":
      return twPink;
    case "tailwindRose":
      return twRose;
    case "tailwindBorder":
      return twBorder;
    case "tailwindBorderRadius":
      return twBorderRadius;
    case "tailwindContainer":
      return twContainer;
    case "tailwindFontSize":
      return twFontSize;
    case "tailwindOpacity":
      return twOpacity;
    case "tailwindSize":
      return twSize;
    // Bootstrap
    case "bootstrapBlue":
      return bsBlue;
    case "bootstrapIndigo":
      return bsIndigo;
    case "bootstrapPurple":
      return bsPurple;
    case "bootstrapPink":
      return bsPink;
    case "bootstrapRed":
      return bsRed;
    case "bootstrapOrange":
      return bsOrange;
    case "bootstrapYellow":
      return bsYellow;
    case "bootstrapGreen":
      return bsGreen;
    case "bootstrapTeal":
      return bsTeal;
    case "bootstrapCyan":
      return bsCyan;
    case "bootstrapGray":
      return bsGray;
    case "bootstrapBorderRadius":
      return bsBorderRadius;
    case "bootstrapBreakpoints":
      return bsBreakpoints;
    // Polaris
    case "polarisRose":
      return pRose;
    case "polarisMagenta":
      return pMagenta;
    case "polarisPurple":
      return pPurple;
    case "polarisBlue":
      return pBlue;
    case "polarisAzure":
      return pAzure;
    case "polarisTeal":
      return pTeal;
    case "polarisCyan":
      return pCyan;
    case "polarisGreen":
      return pGreen;
    case "polarisLime":
      return pLime;
    case "polarisYellow":
      return pYellow;
    case "polarisOrange":
      return pOrange;
    case "polarisRed":
      return pRed;
    case "polarisBorderRadius":
      return pBorderRadius;
    case "polarisBreakpoints":
      return pBreakpoints;
    case "polarisFontSize":
      return pFontSize;
    case "polarisHeight":
      return pHeight;
    case "polarisLineHeight":
      return pLineHeight;
    case "polarisSpace":
      return pSpace;
    case "polarisWidth":
      return pWidth;
    // Carbon
    case "carbonBlue":
      return cBlue;
    case "carbonCoolGray":
      return cCoolGray;
    case "carbonCyan":
      return cCyan;
    case "carbonGray":
      return cGray;
    case "carbonGreen":
      return cGreen;
    case "carbonMagenta":
      return cMagenta;
    case "carbonOrange":
      return cOrange;
    case "carbonPurple":
      return cPurple;
    case "carbonRed":
      return cRed;
    case "carbonTeal":
      return cTeal;
    case "carbonWarmGray":
      return cWarmGray;
    case "carbonYellow":
      return cYellow;
    case "carbonBreakpoints":
      return cBreakpoints;
    case "carbonSpacing":
      return cSpacing;
    case "carbonTypographyScale":
      return cTypographyScale;
    default:
      // handle default case
      throw new Error("Unknown target");
  }
}

export function instantiateTarget(message: MessageInstantiater) {
  message.targets.forEach((target) => {
    if (target === "all") {
      return;
    }

    if (message.type == "actual") {
      if (message.form == "style") {
        // 生成Style
        determineGenerateColorStyle(target);
      } else {
        // 生成Variable
        const collectionToBeUse = determineGenerateVariable(target);
        if (!message.variableCollectionId) {
          throw new Error("variableCollectionId is required");
        }
        if (!message.newCollectionName) {
          throw new Error("newCollectionName is required");
        }

        if (utils.typeCheck.isNumberCollection(collectionToBeUse)) {
          // 傳回的collection是NumberCollection，生成Number Variable
          generateNumberVariable(
            collectionToBeUse,
            message.newCollectionName,
            message.variableCollectionId
          );
        } else {
          // 傳回的collection是ColorCollection，生成Color Variable
          generateColorVariable(
            collectionToBeUse,
            message.newCollectionName,
            message.variableCollectionId
          );
        }
      }
    }
  });
}

/**
 * Generates number variables based on the provided collection and adds them to a specified variable collection.
 *
 * @param {NumberCollection} collection - The collection of numbers to generate variables from.
 * @param {string} newCollectionName - The name for the new variable collection if a new one is to be created.
 * @param {string} variableCollectionId - The ID of the existing variable collection to add the variables to, or "new" to create a new collection.
 * @throws Will throw an error if the specified variable collection ID is not found.
 */
async function generateNumberVariable(
  collection: NumberCollection,
  newCollectionName: string,
  variableCollectionId: string
) {
  let variableCollection: VariableCollection;

  if (variableCollectionId === "new") {
    const newCollection =
      figma.variables.createVariableCollection(newCollectionName);
    variableCollection = newCollection;
  } else {
    const variableCollections =
      await figma.variables.getLocalVariableCollectionsAsync();

    // Find the collection named "Numbers"
    const collection = variableCollections.find(
      (vc) => vc.id === variableCollectionId
    );
    if (!collection) {
      throw new Error(
        "Failed to find variable collection with id: " + variableCollectionId
      );
    }
    variableCollection = collection;
  }

  const defaultModeId = variableCollection.defaultModeId;

  // Iterate over each member in the collection and create variables
  for (const member of collection.members) {
    // Create a new variable for the current number member
    const variable = figma.variables.createVariable(
      `${collection.name}/${member.name}`, // Variable name includes collection name and member name
      variableCollection,
      "FLOAT"
    );

    // Set the description of the variable
    variable.description = member.description;

    // Set the values for default mode
    variable.setValueForMode(defaultModeId, member.value);
  }

  // Notify the user that the variable collection has been created
  figma.notify(`✅ Collection "${collection.name}" created successfully.`);
}

async function generateColorVariable(
  collection: ColorCollection,
  newCollectionName: string,
  variableCollectionId: string
) {
  let variableCollection: VariableCollection;

  if (variableCollectionId === "new") {
    const newCollection =
      figma.variables.createVariableCollection(newCollectionName);
    variableCollection = newCollection;
  } else {
    const variableCollections =
      await figma.variables.getLocalVariableCollectionsAsync();

    // Find the collection named "Colors"
    const collection = variableCollections.find(
      (vc) => vc.id === variableCollectionId
    );
    if (!collection) {
      throw new Error(
        "Failed to find variable collection with id: " + variableCollectionId
      );
    }
    variableCollection = collection;
  }

  // Check if "Light" and "Dark" modes exist, and add them if they don't
  let lightModeId = variableCollection.modes.find(
    (mode) => mode.name === "Light" || mode.name === "light"
  )?.modeId;
  let darkModeId = variableCollection.modes.find(
    (mode) => mode.name === "Dark" || mode.name === "dark"
  )?.modeId;

  if (!lightModeId) {
    lightModeId = variableCollection.addMode("Light");
  }

  if (!darkModeId) {
    darkModeId = variableCollection.addMode("Dark");
  }

  // Iterate over each member in the collection and create variables
  for (const member of collection.members) {
    // Create a new variable for the current color member
    const variable = figma.variables.createVariable(
      `${collection.name}/${member.name}`, // Variable name includes collection name and member name
      variableCollection,
      "COLOR"
    );

    // Set the description of the variable
    variable.description = member.description;

    // Set the values for light and dark modes
    variable.setValueForMode(
      lightModeId,
      utils.color.convertColorRange(member.color.light)
    );
    variable.setValueForMode(
      darkModeId,
      utils.color.convertColorRange(member.color.dark)
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
          r: utils.math.mapToUnitRange(color.r),
          g: utils.math.mapToUnitRange(color.g),
          b: utils.math.mapToUnitRange(color.b),
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

async function generateTextStyleNode(collection: TypographyCollection) {
  const verticalSpacing = 32;
  let currentYPosition = 0;

  const texts: Array<TextNode> = [];
  const viewport = utils.editor.getCurrentViewport();

  // Load all necessary fonts
  const fontsToLoad = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Semi Bold" },
  ];
  await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));

  const notificationText = `Change the typeface of below text layer, then click "Shortcut => Generate Text Style" from plugin.`;
  const notificationTextNode = util.createTextNode(
    notificationText,
    { family: "Inter", style: "Regular" },
    32,
    [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }]
  );

  notificationTextNode.x = viewport.x;
  notificationTextNode.y = currentYPosition;

  currentYPosition += notificationTextNode.height + verticalSpacing;

  collection.members.forEach((item) => {
    const fontWeightStyle =
      item.fontWeight === "regular" ? "Regular" : "Semi Bold";
    const fontName = { family: "Inter", style: fontWeightStyle };

    const textNode = util.createTextNode(
      `${collection.brand} - ${collection.name}/${item.name}`,
      fontName,
      item.fontSize,
      undefined,
      { value: item.fontSize, unit: "PIXELS" }
    );

    // Set the position of the text node
    textNode.x = viewport.x;
    textNode.y = currentYPosition;

    // Update the currentYPosition for the next text node
    currentYPosition += textNode.height + verticalSpacing;

    figma.currentPage.appendChild(textNode);
    texts.push(textNode);
  });

  // Select the created text nodes
  figma.currentPage.selection = texts;

  // Zoom to fit the selected nodes in the viewport
  figma.viewport.scrollAndZoomIntoView(texts);
}
