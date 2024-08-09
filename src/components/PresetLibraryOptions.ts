import {
  InstantiateForm,
  InstantiaterCategory,
  InstantiaterSupportedBrand,
  InstantiaterTarget,
} from "../types/Message";

type AvailableOption = {
  value: InstantiaterTarget;
  label: string;
  brands: InstantiaterSupportedBrand[];
  category: InstantiaterCategory;
  forms: InstantiateForm[];
};

const iosOptions: AvailableOption[] = [
  {
    value: "iosSystemColorsLight",
    label: "System colors (Light)",
    brands: ["ios"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "iosSystemColorsDark",
    label: "System colors (Dark)",
    brands: ["ios"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "iosSystemGrayColorsLight",
    label: "System gray colors (Light)",
    brands: ["ios"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "iosSystemGrayColorsDark",
    label: "System gray colors (Dark)",
    brands: ["ios"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "iosEffectDefaultDropShadow",
    label: "Drop shadow",
    brands: ["ios"],
    category: "effect",
    forms: ["style"],
  },
  {
    value: "iosTypographyLarge",
    label: "Typography large",
    brands: ["ios"],
    category: "typography",
    forms: ["style"],
  },
];

const materialDesignOptions: AvailableOption[] = [
  {
    value: "m3BaselinePrimaryLight",
    label: "Baseline primary (Light)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselinePrimaryDark",
    label: "Baseline primary (Dark)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineSecondaryLight",
    label: "Baseline secondary (Light)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineSecondaryDark",
    label: "Baseline secondary (Dark)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineTertiaryLight",
    label: "Baseline tertiary (Light)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineTertiaryDark",
    label: "Baseline tertiary (Dark)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineNeutralLight",
    label: "Baseline neutral (Light)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineNeutralDark",
    label: "Baseline neutral (Dark)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineErrorLight",
    label: "Baseline error (Light)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineErrorDark",
    label: "Baseline error (Dark)",
    brands: ["materialDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "m3ElevationLight",
    label: "Elevation (Light)",
    brands: ["materialDesign"],
    category: "effect",
    forms: ["style"],
  },
  {
    value: "m3ElevationDark",
    label: "Elevation (Dark)",
    brands: ["materialDesign"],
    category: "effect",
    forms: ["style"],
  },
];

const antDesignOptions: AvailableOption[] = [
  {
    value: "antDesignNeutralColorLight",
    label: "Neutral color (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignNeutralColorDark",
    label: "Neutral color (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDustRedLight",
    label: "Dust red (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDustRedDark",
    label: "Dust red (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignVolcanoLight",
    label: "Volcano (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignVolcanoDark",
    label: "Volcano (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunsetOrangeLight",
    label: "Sunset orange (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunsetOrangeDark",
    label: "Sunset orange (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCalendulaGoldLight",
    label: "Calendula gold (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCalendulaGoldDark",
    label: "Calendula gold (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunriseYellowLight",
    label: "Sunrise yellow (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunriseYellowDark",
    label: "Sunrise yellow (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignLimeLight",
    label: "Lime (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignLimeDark",
    label: "Lime (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignPolarGreenLight",
    label: "Polar green (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignPolarGreenDark",
    label: "Polar green (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCyanLight",
    label: "Cyan (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCyanDark",
    label: "Cyan (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDaybreakBlueLight",
    label: "Daybreak blue (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDaybreakBlueDark",
    label: "Daybreak blue (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGeekBlueLight",
    label: "Geek blue (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGeekBlueDark",
    label: "Geek blue (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGoldenPurpleLight",
    label: "Golden purple (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGoldenPurpleDark",
    label: "Golden purple (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignMagentaLight",
    label: "Magenta (Light)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignMagentaDark",
    label: "Magenta (Dark)",
    brands: ["antDesign"],
    category: "color",
    forms: ["style", "variable"],
  },
];

const tailwindOptions: AvailableOption[] = [
  {
    value: "tailwindSlate",
    label: "Slate",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindGray",
    label: "Gray",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindZinc",
    label: "Zinc",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindNeutral",
    label: "Neutral",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindStone",
    label: "Stone",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindRed",
    label: "Red",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindOrange",
    label: "Orange",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindAmber",
    label: "Amber",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindYellow",
    label: "Yellow",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindLime",
    label: "Lime",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindGreen",
    label: "Green",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindEmerald",
    label: "Emerald",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindTeal",
    label: "Teal",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindCyan",
    label: "Cyan",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindSky",
    label: "Sky",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindBlue",
    label: "Blue",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindIndigo",
    label: "Indigo",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindViolet",
    label: "Violet",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindPurple",
    label: "Purple",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindFuchsia",
    label: "Fuchsia",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindPink",
    label: "Pink",
    brands: ["tailwind"],
    category: "color",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindRose",
    label: "Rose",
    brands: ["tailwind"],
    category: "color",
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
  category: InstantiaterCategory,
  form: InstantiateForm
) => {
  return allOptions.filter(
    (option) =>
      option.brands.includes(selectedBrand) &&
      option.category.includes(category) &&
      option.forms.includes(form)
  );
};
