import * as util from "./util";

import * as colors from "../assets/colors";
import iosTypographyLargeData from "../assets/typography/iosTypographyLarge.json";

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
} from "../assets/effects";
import { tailwindBorderRadiusData } from "../assets/numbers";

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
const antDesignNeutralColor: ColorCollection = colors.antDesignNeutralColorData;
const antDesignDustRed: ColorCollection = colors.antDesignDustRedData;
const antDesignVolcano: ColorCollection = colors.antDesignVolcanoData;
const antDesignSunsetOrange: ColorCollection = colors.antDesignSunsetOrangeData;
const antDesignCalendulaGold: ColorCollection =
  colors.antDesignCalendulaGoldData;
const antDesignSunriseYellow: ColorCollection =
  colors.antDesignSunriseYellowData;
const antDesignLime: ColorCollection = colors.antDesignLimeData;
const antDesignPolarGreen: ColorCollection = colors.antDesignPolarGreenData;
const antDesignCyan: ColorCollection = colors.antDesignCyanData;
const antDesignDaybreakBlue: ColorCollection = colors.antDesignDaybreakBlueData;
const antDesignGeekBlue: ColorCollection = colors.antDesignGeekBlueData;
const antDesignGoldenPurple: ColorCollection = colors.antDesignGoldenPurpleData;
const antDesignMagenta: ColorCollection = colors.antDesignMagentaData;

// Tailwind CSS
const tailwindSlate: ColorCollection = colors.tailwindSlateData;
const tailwindGray: ColorCollection = colors.tailwindGrayData;
const tailwindZinc: ColorCollection = colors.tailwindZincData;
const tailwindNeutral: ColorCollection = colors.tailwindNeutralData;
const tailwindStone: ColorCollection = colors.tailwindStoneData;
const tailwindRed: ColorCollection = colors.tailwindRedData;
const tailwindOrange: ColorCollection = colors.tailwindOrangeData;
const tailwindAmber: ColorCollection = colors.tailwindAmberData;
const tailwindYellow: ColorCollection = colors.tailwindYellowData;
const tailwindLime: ColorCollection = colors.tailwindLimeData;
const tailwindGreen: ColorCollection = colors.tailwindGreenData;
const tailwindEmerald: ColorCollection = colors.tailwindEmeraldData;
const tailwindTeal: ColorCollection = colors.tailwindTealData;
const tailwindCyan: ColorCollection = colors.tailwindCyanData;
const tailwindSky: ColorCollection = colors.tailwindSkyData;
const tailwindBlue: ColorCollection = colors.tailwindBlueData;
const tailwindIndigo: ColorCollection = colors.tailwindIndigoData;
const tailwindViolet: ColorCollection = colors.tailwindVioletData;
const tailwindPurple: ColorCollection = colors.tailwindPurpleData;
const tailwindFuchsia: ColorCollection = colors.tailwindFuchsiaData;
const tailwindPink: ColorCollection = colors.tailwindPinkData;
const tailwindRose: ColorCollection = colors.tailwindRoseData;
const tailwindBorderRadius: NumberCollection = tailwindBorderRadiusData;

// Bootstrap
const bootstrapBlue: ColorCollection = colors.bootstrapBlue;
const bootstrapIndigo: ColorCollection = colors.bootstrapIndigo;
const bootstrapPurple: ColorCollection = colors.bootstrapPurple;
const bootstrapPink: ColorCollection = colors.bootstrapPink;
const bootstrapRed: ColorCollection = colors.bootstrapRed;
const bootstrapOrange: ColorCollection = colors.bootstrapOrange;
const bootstrapYellow: ColorCollection = colors.bootstrapYellow;
const bootstrapGreen: ColorCollection = colors.bootstrapGreen;
const bootstrapTeal: ColorCollection = colors.bootstrapTeal;
const bootstrapCyan: ColorCollection = colors.bootstrapCyan;
const bootstrapGray: ColorCollection = colors.bootstrapGray;

// Polaris
const polarisRose: ColorCollection = colors.polarisRose;
const polarisMagenta: ColorCollection = colors.polarisMagenta;
const polarisPurple: ColorCollection = colors.polarisPurple;
const polarisBlue: ColorCollection = colors.polarisBlue;
const polarisAzure: ColorCollection = colors.polarisAzure;
const polarisTeal: ColorCollection = colors.polarisTeal;
const polarisCyan: ColorCollection = colors.polarisCyan;
const polarisGreen: ColorCollection = colors.polarisGreen;
const polarisLime: ColorCollection = colors.polarisLime;
const polarisYellow: ColorCollection = colors.polarisYellow;
const polarisOrange: ColorCollection = colors.polarisOrange;
const polarisRed: ColorCollection = colors.polarisRed;

// Carbon
const carbonBlue: ColorCollection = colors.carbonBlue;
const carbonCoolGray: ColorCollection = colors.carbonCoolGray;
const carbonCyan: ColorCollection = colors.carbonCyan;
const carbonGray: ColorCollection = colors.carbonGray;
const carbonGreen: ColorCollection = colors.carbonGreen;
const carbonMagenta: ColorCollection = colors.carbonMagenta;
const carbonOrange: ColorCollection = colors.carbonOrange;
const carbonPurple: ColorCollection = colors.carbonPurple;
const carbonRed: ColorCollection = colors.carbonRed;
const carbonTeal: ColorCollection = colors.carbonTeal;
const carbonWarmGray: ColorCollection = colors.carbonWarmGray;
const carbonYellow: ColorCollection = colors.carbonYellow;

// Effect資料
const iosDefaultDropShadow: EffectCollection =
  iosDefaultDropShadowData as EffectCollection;
const antDesignDropShadow: EffectCollection =
  antDesignDropShadowData as EffectCollection;
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
    case "tailwindSlate":
      generateColorStyle(tailwindSlate, "none");
      break;
    case "tailwindGray":
      generateColorStyle(tailwindGray, "none");
      break;
    case "tailwindZinc":
      generateColorStyle(tailwindZinc, "none");
      break;
    case "tailwindNeutral":
      generateColorStyle(tailwindNeutral, "none");
      break;
    case "tailwindStone":
      generateColorStyle(tailwindStone, "none");
      break;
    case "tailwindRed":
      generateColorStyle(tailwindRed, "none");
      break;
    case "tailwindOrange":
      generateColorStyle(tailwindOrange, "none");
      break;
    case "tailwindAmber":
      generateColorStyle(tailwindAmber, "none");
      break;
    case "tailwindYellow":
      generateColorStyle(tailwindYellow, "none");
      break;
    case "tailwindLime":
      generateColorStyle(tailwindLime, "none");
      break;
    case "tailwindGreen":
      generateColorStyle(tailwindGreen, "none");
      break;
    case "tailwindEmerald":
      generateColorStyle(tailwindEmerald, "none");
      break;
    case "tailwindTeal":
      generateColorStyle(tailwindTeal, "none");
      break;
    case "tailwindCyan":
      generateColorStyle(tailwindCyan, "none");
      break;
    case "tailwindSky":
      generateColorStyle(tailwindSky, "none");
      break;
    case "tailwindBlue":
      generateColorStyle(tailwindBlue, "none");
      break;
    case "tailwindIndigo":
      generateColorStyle(tailwindIndigo, "none");
      break;
    case "tailwindViolet":
      generateColorStyle(tailwindViolet, "none");
      break;
    case "tailwindPurple":
      generateColorStyle(tailwindPurple, "none");
      break;
    case "tailwindFuchsia":
      generateColorStyle(tailwindFuchsia, "none");
      break;
    case "tailwindPink":
      generateColorStyle(tailwindPink, "none");
      break;
    case "tailwindRose":
      generateColorStyle(tailwindRose, "none");
      break;
    case "bootstrapBlue":
      generateColorStyle(bootstrapBlue, "none");
      break;
    case "bootstrapIndigo":
      generateColorStyle(bootstrapIndigo, "none");
      break;
    case "bootstrapPurple":
      generateColorStyle(bootstrapPurple, "none");
      break;
    case "bootstrapPink":
      generateColorStyle(bootstrapPink, "none");
      break;
    case "bootstrapRed":
      generateColorStyle(bootstrapRed, "none");
      break;
    case "bootstrapOrange":
      generateColorStyle(bootstrapOrange, "none");
      break;
    case "bootstrapYellow":
      generateColorStyle(bootstrapYellow, "none");
      break;
    case "bootstrapGreen":
      generateColorStyle(bootstrapGreen, "none");
      break;
    case "bootstrapTeal":
      generateColorStyle(bootstrapTeal, "none");
      break;
    case "bootstrapCyan":
      generateColorStyle(bootstrapCyan, "none");
      break;
    case "bootstrapGray":
      generateColorStyle(bootstrapGray, "none");
      break;
    case "polarisRose":
      generateColorStyle(polarisRose, "none");
      break;
    case "polarisMagenta":
      generateColorStyle(polarisMagenta, "none");
      break;
    case "polarisPurple":
      generateColorStyle(polarisPurple, "none");
      break;
    case "polarisBlue":
      generateColorStyle(polarisBlue, "none");
      break;
    case "polarisAzure":
      generateColorStyle(polarisAzure, "none");
      break;
    case "polarisTeal":
      generateColorStyle(polarisTeal, "none");
      break;
    case "polarisCyan":
      generateColorStyle(polarisCyan, "none");
      break;
    case "polarisGreen":
      generateColorStyle(polarisGreen, "none");
      break;
    case "polarisLime":
      generateColorStyle(polarisLime, "none");
      break;
    case "polarisYellow":
      generateColorStyle(polarisYellow, "none");
      break;
    case "polarisOrange":
      generateColorStyle(polarisOrange, "none");
      break;
    case "polarisRed":
      generateColorStyle(polarisRed, "none");
      break;
    case "carbonBlue":
      generateColorStyle(carbonBlue, "none");
      break;
    case "carbonCoolGray":
      generateColorStyle(carbonCoolGray, "none");
      break;
    case "carbonCyan":
      generateColorStyle(carbonCyan, "none");
      break;
    case "carbonGray":
      generateColorStyle(carbonGray, "none");
      break;
    case "carbonGreen":
      generateColorStyle(carbonGreen, "none");
      break;
    case "carbonMagenta":
      generateColorStyle(carbonMagenta, "none");
      break;
    case "carbonOrange":
      generateColorStyle(carbonOrange, "none");
      break;
    case "carbonPurple":
      generateColorStyle(carbonPurple, "none");
      break;
    case "carbonRed":
      generateColorStyle(carbonRed, "none");
      break;
    case "carbonTeal":
      generateColorStyle(carbonTeal, "none");
      break;
    case "carbonWarmGray":
      generateColorStyle(carbonWarmGray, "none");
      break;
    case "carbonYellow":
      generateColorStyle(carbonYellow, "none");
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
    case "iosSystemColorsLight":
      return iosSystemColors;
    case "iosSystemColorsDark":
      return iosSystemColors;
    case "iosSystemGrayColorsLight":
      return iosSystemGrayColors;
    case "iosSystemGrayColorsDark":
      return iosSystemGrayColors;
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
    case "antDesignNeutralColorLight":
      return antDesignNeutralColor;
    case "antDesignNeutralColorDark":
      return antDesignNeutralColor;
    case "antDesignDustRedLight":
      return antDesignDustRed;
    case "antDesignDustRedDark":
      return antDesignDustRed;
    case "antDesignVolcanoLight":
      return antDesignVolcano;
    case "antDesignVolcanoDark":
      return antDesignVolcano;
    case "antDesignSunsetOrangeLight":
      return antDesignSunsetOrange;
    case "antDesignSunsetOrangeDark":
      return antDesignSunsetOrange;
    case "antDesignCalendulaGoldLight":
      return antDesignCalendulaGold;
    case "antDesignCalendulaGoldDark":
      return antDesignCalendulaGold;
    case "antDesignSunriseYellowLight":
      return antDesignSunriseYellow;
    case "antDesignSunriseYellowDark":
      return antDesignSunriseYellow;
    case "antDesignLimeLight":
      return antDesignLime;
    case "antDesignLimeDark":
      return antDesignLime;
    case "antDesignPolarGreenLight":
      return antDesignPolarGreen;
    case "antDesignPolarGreenDark":
      return antDesignPolarGreen;
    case "antDesignCyanLight":
      return antDesignCyan;
    case "antDesignCyanDark":
      return antDesignCyan;
    case "antDesignDaybreakBlueLight":
      return antDesignDaybreakBlue;
    case "antDesignDaybreakBlueDark":
      return antDesignDaybreakBlue;
    case "antDesignGeekBlueLight":
      return antDesignGeekBlue;
    case "antDesignGeekBlueDark":
      return antDesignGeekBlue;
    case "antDesignGoldenPurpleLight":
      return antDesignGoldenPurple;
    case "antDesignGoldenPurpleDark":
      return antDesignGoldenPurple;
    case "antDesignMagentaLight":
      return antDesignMagenta;
    case "antDesignMagentaDark":
      return antDesignMagenta;
    case "tailwindSlate":
      return tailwindSlate;
    case "tailwindGray":
      return tailwindGray;
    case "tailwindZinc":
      return tailwindZinc;
    case "tailwindNeutral":
      return tailwindNeutral;
    case "tailwindStone":
      return tailwindStone;
    case "tailwindRed":
      return tailwindRed;
    case "tailwindOrange":
      return tailwindOrange;
    case "tailwindAmber":
      return tailwindAmber;
    case "tailwindYellow":
      return tailwindYellow;
    case "tailwindLime":
      return tailwindLime;
    case "tailwindGreen":
      return tailwindGreen;
    case "tailwindEmerald":
      return tailwindEmerald;
    case "tailwindTeal":
      return tailwindTeal;
    case "tailwindCyan":
      return tailwindCyan;
    case "tailwindSky":
      return tailwindSky;
    case "tailwindBlue":
      return tailwindBlue;
    case "tailwindIndigo":
      return tailwindIndigo;
    case "tailwindViolet":
      return tailwindViolet;
    case "tailwindPurple":
      return tailwindPurple;
    case "tailwindFuchsia":
      return tailwindFuchsia;
    case "tailwindPink":
      return tailwindPink;
    case "tailwindRose":
      return tailwindRose;
    case "tailwindBorderRadius":
      return tailwindBorderRadius;
    case "bootstrapBlue":
      return bootstrapBlue;
    case "bootstrapIndigo":
      return bootstrapIndigo;
    case "bootstrapPurple":
      return bootstrapPurple;
    case "bootstrapPink":
      return bootstrapPink;
    case "bootstrapRed":
      return bootstrapRed;
    case "bootstrapOrange":
      return bootstrapOrange;
    case "bootstrapYellow":
      return bootstrapYellow;
    case "bootstrapGreen":
      return bootstrapGreen;
    case "bootstrapTeal":
      return bootstrapTeal;
    case "bootstrapCyan":
      return bootstrapCyan;
    case "bootstrapGray":
      return bootstrapGray;
    case "polarisRose":
      return polarisRose;
    case "polarisMagenta":
      return polarisMagenta;
    case "polarisPurple":
      return polarisPurple;
    case "polarisBlue":
      return polarisBlue;
    case "polarisAzure":
      return polarisAzure;
    case "polarisTeal":
      return polarisTeal;
    case "polarisCyan":
      return polarisCyan;
    case "polarisGreen":
      return polarisGreen;
    case "polarisLime":
      return polarisLime;
    case "polarisYellow":
      return polarisYellow;
    case "polarisOrange":
      return polarisOrange;
    case "polarisRed":
      return polarisRed;
    case "carbonBlue":
      return carbonBlue;
    case "carbonCoolGray":
      return carbonCoolGray;
    case "carbonCyan":
      return carbonCyan;
    case "carbonGray":
      return carbonGray;
    case "carbonGreen":
      return carbonGreen;
    case "carbonMagenta":
      return carbonMagenta;
    case "carbonOrange":
      return carbonOrange;
    case "carbonPurple":
      return carbonPurple;
    case "carbonRed":
      return carbonRed;
    case "carbonTeal":
      return carbonTeal;
    case "carbonWarmGray":
      return carbonWarmGray;
    case "carbonYellow":
      return carbonYellow;
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

        if (util.isNumberCollection(collectionToBeUse)) {
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

async function generateTextStyleNode(collection: TypographyCollection) {
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
