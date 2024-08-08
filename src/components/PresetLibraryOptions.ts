import {
  InstantiateForm,
  InstantiaterSupportedBrand,
  InstantiaterTarget,
} from "../types/Message";

type AvailableOption = {
  value: InstantiaterTarget;
  label: string;
  brands: InstantiaterSupportedBrand[];
  forms: InstantiateForm[];
};

const iosOptions: AvailableOption[] = [
  {
    value: "iosSystemColorsLight",
    label: "System colors (Light)",
    brands: ["ios"],
    forms: ["style", "variable"],
  },
  {
    value: "iosSystemColorsDark",
    label: "System colors (Dark)",
    brands: ["ios"],
    forms: ["style", "variable"],
  },
  {
    value: "iosSystemGrayColorsLight",
    label: "System gray colors (Light)",
    brands: ["ios"],
    forms: ["style", "variable"],
  },
  {
    value: "iosSystemGrayColorsDark",
    label: "System gray colors (Dark)",
    brands: ["ios"],
    forms: ["style", "variable"],
  },
  {
    value: "iosEffectDefaultDropShadow",
    label: "Drop shadow",
    brands: ["ios"],
    forms: ["style"],
  },
  {
    value: "iosTypographyLarge",
    label: "Typography large",
    brands: ["ios"],
    forms: ["style"],
  },
];

const materialDesignOptions: AvailableOption[] = [
  {
    value: "m3BaselinePrimaryLight",
    label: "Baseline primary (Light)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselinePrimaryDark",
    label: "Baseline primary (Dark)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineSecondaryLight",
    label: "Baseline secondary (Light)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineSecondaryDark",
    label: "Baseline secondary (Dark)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineTertiaryLight",
    label: "Baseline tertiary (Light)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineTertiaryDark",
    label: "Baseline tertiary (Dark)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineNeutralLight",
    label: "Baseline neutral (Light)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineNeutralDark",
    label: "Baseline neutral (Dark)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineErrorLight",
    label: "Baseline error (Light)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineErrorDark",
    label: "Baseline error (Dark)",
    brands: ["materialDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "m3ElevationLight",
    label: "Elevation (Light)",
    brands: ["materialDesign"],
    forms: ["style"],
  },
  {
    value: "m3ElevationDark",
    label: "Elevation (Dark)",
    brands: ["materialDesign"],
    forms: ["style"],
  },
];

const antDesignOptions: AvailableOption[] = [
  {
    value: "antDesignNeutralColorLight",
    label: "Neutral color (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignNeutralColorDark",
    label: "Neutral color (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDustRedLight",
    label: "Dust red (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDustRedDark",
    label: "Dust red (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignVolcanoLight",
    label: "Volcano (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignVolcanoDark",
    label: "Volcano (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunsetOrangeLight",
    label: "Sunset orange (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunsetOrangeDark",
    label: "Sunset orange (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCalendulaGoldLight",
    label: "Calendula gold (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCalendulaGoldDark",
    label: "Calendula gold (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunriseYellowLight",
    label: "Sunrise yellow (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunriseYellowDark",
    label: "Sunrise yellow (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignLimeLight",
    label: "Lime (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignLimeDark",
    label: "Lime (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignPolarGreenLight",
    label: "Polar green (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignPolarGreenDark",
    label: "Polar green (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCyanLight",
    label: "Cyan (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCyanDark",
    label: "Cyan (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDaybreakBlueLight",
    label: "Daybreak blue (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDaybreakBlueDark",
    label: "Daybreak blue (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGeekBlueLight",
    label: "Geek blue (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGeekBlueDark",
    label: "Geek blue (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGoldenPurpleLight",
    label: "Golden purple (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGoldenPurpleDark",
    label: "Golden purple (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignMagentaLight",
    label: "Magenta (Light)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
  {
    value: "antDesignMagentaDark",
    label: "Magenta (Dark)",
    brands: ["antDesign"],
    forms: ["style", "variable"],
  },
];

const tailwindOptions: AvailableOption[] = [
  {
    value: "tailwindSlate",
    label: "Slate",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindGray",
    label: "Gray",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindZinc",
    label: "Zinc",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindNeutral",
    label: "Neutral",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindStone",
    label: "Stone",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindRed",
    label: "Red",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindOrange",
    label: "Orange",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindAmber",
    label: "Amber",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindYellow",
    label: "Yellow",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindLime",
    label: "Lime",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindGreen",
    label: "Green",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindEmerald",
    label: "Emerald",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindTeal",
    label: "Teal",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindCyan",
    label: "Cyan",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindSky",
    label: "Sky",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindBlue",
    label: "Blue",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindIndigo",
    label: "Indigo",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindViolet",
    label: "Violet",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindPurple",
    label: "Purple",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindFuchsia",
    label: "Fuchsia",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindPink",
    label: "Pink",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
  {
    value: "tailwindRose",
    label: "Rose",
    brands: ["tailwind"],
    forms: ["style", "variable"],
  },
];

/**
 * 用於Preset Library模組，列出所有可選擇的選項
 */
const allOptions: AvailableOption[] = [
  ...iosOptions,
  ...materialDesignOptions,
  ...antDesignOptions,
  ...tailwindOptions,
];

export const getOptionsForSelectedBrandAndForm = (
  selectedBrand: InstantiaterSupportedBrand,
  form: InstantiateForm
) => {
  return allOptions.filter(
    (option) =>
      option.brands.includes(selectedBrand) && option.forms.includes(form)
  );
};
