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
  category: InstantiaterCategory[];
  forms: InstantiateForm[];
  thumbnailColor?: string;
};

const iosOptions: AvailableOption[] = [
  {
    value: "iosSystemColorsLight",
    label: "System colors (Light)",
    brands: ["ios"],
    category: ["color"],
    thumbnailColor:
      "conic-gradient(rgba(255,52,143,1), rgba(255,197,65,1), rgba(0,212,255,1), rgba(207,0,255,1))",
    forms: ["style", "variable"],
  },
  {
    value: "iosSystemColorsDark",
    label: "System colors (Dark)",
    brands: ["ios"],
    category: ["color"],
    thumbnailColor:
      "conic-gradient(rgba(190, 45, 110, 1), rgba(189, 147, 47, 1), rgba(0, 146, 176, 1), rgba(131, 1, 160, 1))",
    forms: ["style", "variable"],
  },
  {
    value: "iosSystemGrayColorsLight",
    label: "System gray colors (Light)",
    brands: ["ios"],
    category: ["color"],
    thumbnailColor: "rgb(199,199,204)",
    forms: ["style", "variable"],
  },
  {
    value: "iosSystemGrayColorsDark",
    label: "System gray colors (Dark)",
    brands: ["ios"],
    category: ["color"],
    thumbnailColor: "rgb(72,72,74)",
    forms: ["style", "variable"],
  },
  {
    value: "iosEffectDefaultDropShadow",
    label: "Drop shadow",
    brands: ["ios"],
    category: ["effect"],
    forms: ["style"],
  },
  {
    value: "iosTypographyLarge",
    label: "Typography large",
    brands: ["ios"],
    category: ["typography"],
    forms: ["style"],
  },
];

const materialDesignOptions: AvailableOption[] = [
  {
    value: "m3BaselinePrimary",
    label: "Baseline primary",
    brands: ["materialDesign"],
    category: ["color"],
    thumbnailColor: "rgb(154,131,219)",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineSecondary",
    label: "Baseline secondary",
    brands: ["materialDesign"],
    category: ["color"],
    thumbnailColor: "rgb(149,141,165)",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineTertiary",
    label: "Baseline tertiary",
    brands: ["materialDesign"],
    category: ["color"],
    thumbnailColor: "rgb(181,131,146)",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineNeutral",
    label: "Baseline neutral",
    brands: ["materialDesign"],
    category: ["color"],
    thumbnailColor: "rgb(147,144,144)",
    forms: ["style", "variable"],
  },
  {
    value: "m3BaselineError",
    label: "Baseline error",
    brands: ["materialDesign"],
    category: ["color"],
    thumbnailColor: "rgb(230,106,99)",
    forms: ["style", "variable"],
  },
  {
    value: "m3ElevationLight",
    label: "Elevation (Light)",
    brands: ["materialDesign"],
    category: ["effect"],
    forms: ["style"],
  },
  {
    value: "m3ElevationDark",
    label: "Elevation (Dark)",
    brands: ["materialDesign"],
    category: ["effect"],
    forms: ["style"],
  },
];

const antDesignOptions: AvailableOption[] = [
  {
    value: "antDesignNeutralColorLight",
    label: "Neutral color (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(140,140,140)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignNeutralColorDark",
    label: "Neutral color (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(140,140,140)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDustRedLight",
    label: "Dust red (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(207,19,34)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDustRedDark",
    label: "Dust red (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(207,19,34)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignVolcanoLight",
    label: "Volcano (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(216,56,13)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignVolcanoDark",
    label: "Volcano (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(216,56,13)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunsetOrangeLight",
    label: "Sunset orange (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,107,8)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunsetOrangeDark",
    label: "Sunset orange (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,107,8)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCalendulaGoldLight",
    label: "Calendula gold (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,136,6)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCalendulaGoldDark",
    label: "Calendula gold (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,136,6)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunriseYellowLight",
    label: "Sunrise yellow (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,177,6)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignSunriseYellowDark",
    label: "Sunrise yellow (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,177,6)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignLimeLight",
    label: "Lime (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(124,179,5)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignLimeDark",
    label: "Lime (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(124,179,5)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignPolarGreenLight",
    label: "Polar green (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(56,158,13)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignPolarGreenDark",
    label: "Polar green (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(56,158,13)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCyanLight",
    label: "Cyan (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(8,151,156)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignCyanDark",
    label: "Cyan (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(8,151,156)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDaybreakBlueLight",
    label: "Daybreak blue (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(9,109,217)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignDaybreakBlueDark",
    label: "Daybreak blue (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(9,109,217)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGeekBlueLight",
    label: "Geek blue (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(29,57,196)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGeekBlueDark",
    label: "Geek blue (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(29,57,196)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGoldenPurpleLight",
    label: "Golden purple (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(83,29,171)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignGoldenPurpleDark",
    label: "Golden purple (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(83,29,171)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignMagentaLight",
    label: "Magenta (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(196,29,127)",
    forms: ["style", "variable"],
  },
  {
    value: "antDesignMagentaDark",
    label: "Magenta (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(196,29,127)",
    forms: ["style", "variable"],
  },
];

const tailwindOptions: AvailableOption[] = [
  {
    value: "tailwindRed",
    label: "Red",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(239,68,68)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindOrange",
    label: "Orange",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(249,115,22)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindAmber",
    label: "Amber",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(245,158,11)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindYellow",
    label: "Yellow",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(234,179,8)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindLime",
    label: "Lime",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(132,204,22)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindGreen",
    label: "Green",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(34,197,94)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindEmerald",
    label: "Emerald",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(16,185,129)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindTeal",
    label: "Teal",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(20,184,166)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindCyan",
    label: "Cyan",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(6,182,212)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindSky",
    label: "Sky",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(14,165,233)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindBlue",
    label: "Blue",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(59,130,246)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindIndigo",
    label: "Indigo",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(99,102,241)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindViolet",
    label: "Violet",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(139,92,246)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindPurple",
    label: "Purple",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(168,85,247)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindFuchsia",
    label: "Fuchsia",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(217,70,239)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindPink",
    label: "Pink",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(236,72,153)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindSlate",
    label: "Slate",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(100,116,139)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindStone",
    label: "Stone",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(120,113,108)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindZinc",
    label: "Zinc",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(113,113,122)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindNeutral",
    label: "Neutral",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(115,115,115)",
    forms: ["style", "variable"],
  },
  {
    value: "tailwindGray",
    label: "Gray",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(107,114,128)",
    forms: ["style", "variable"],
  },
];

const bootstrapOptions: AvailableOption[] = [
  {
    value: "bootstrapRed",
    label: "Red",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(220, 53, 69)", // Red 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapOrange",
    label: "Orange",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(253, 126, 20)", // Orange 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapYellow",
    label: "Yellow",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(255, 193, 7)", // Yellow 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapGreen",
    label: "Green",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(25, 135, 84)", // Green 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapTeal",
    label: "Teal",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(32, 201, 151)", // Teal 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapCyan",
    label: "Cyan",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(13, 202, 240)", // Cyan 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapBlue",
    label: "Blue",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(13, 110, 253)", // Blue 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapIndigo",
    label: "Indigo",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(102, 16, 242)", // Indigo 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapPurple",
    label: "Purple",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(111, 66, 193)", // Purple 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapPink",
    label: "Pink",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(214, 51, 132)", // Pink 500
    forms: ["style", "variable"],
  },
  {
    value: "bootstrapGray",
    label: "Gray",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(173, 181, 189)", // Gray 500
    forms: ["style", "variable"],
  },
];

/**
 * 用於Preset Library模組，列出所有可選擇的選項
 */
const allOptions: AvailableOption[] = [
  {
    value: "all",
    label: "ALL",
    brands: ["ios", "antDesign", "materialDesign", "tailwind", "bootstrap"],
    category: ["color", "effect", "typography"],
    forms: ["style", "variable"],
  },
  ...iosOptions,
  ...materialDesignOptions,
  ...antDesignOptions,
  ...tailwindOptions,
  ...bootstrapOptions,
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
