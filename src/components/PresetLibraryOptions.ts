import {
  InstantiaterTarget,
  InstantiaterSupportedBrand,
  InstantiaterCategory,
  InstantiateForm,
} from "../types/Messages/MessageInstantiater";

type AvailableOption = {
  value: InstantiaterTarget;
  label: string;
  brands: InstantiaterSupportedBrand[];
  category: InstantiaterCategory[];
  forms: InstantiateForm[];
  thumbnailColor?: string;
  count?: number;
};

const iosOptions: AvailableOption[] = [
  {
    value: "iosSystemColorsLight",
    label: "System colors (Light)",
    brands: ["ios"],
    category: ["color"],
    thumbnailColor:
      "conic-gradient(rgba(255,56,60,1), rgba(255,204,0,1), rgba(0,136,255,1), rgba(203,48,224,1))",
    forms: ["style", "variable"],
    count: 12,
  },
  {
    value: "iosSystemColorsDark",
    label: "System colors (Dark)",
    brands: ["ios"],
    category: ["color"],
    thumbnailColor:
      "conic-gradient(rgba(255, 66, 69, 1), rgba(255, 214, 0, 1), rgba(0, 145, 255, 1), rgba(219, 52, 242, 1))",
    forms: ["style", "variable"],
    count: 12,
  },
  {
    value: "iosSystemGrayColorsLight",
    label: "System gray colors (Light)",
    brands: ["ios"],
    category: ["color"],
    thumbnailColor:
      "conic-gradient(rgba(142, 142, 147, 1), rgba(199, 199, 204, 1), rgba(229, 229, 234, 1), rgba(242, 242, 247, 1))",
    forms: ["style", "variable"],
    count: 8,
  },
  {
    value: "iosSystemGrayColorsDark",
    label: "System gray colors (Dark)",
    brands: ["ios"],
    category: ["color"],
    thumbnailColor:
      "conic-gradient(rgba(142, 142, 147, 1), rgba(72, 72, 74, 1), rgba(44, 44, 46, 1), rgba(28, 28, 30, 1))",
    forms: ["style", "variable"],
    count: 8,
  },
  {
    value: "iosEffectDefaultDropShadow",
    label: "Drop shadow",
    brands: ["ios"],
    category: ["effect"],
    forms: ["style"],
    count: 3,
  },
  {
    value: "iosTypographyLarge",
    label: "Typography large",
    brands: ["ios"],
    category: ["typography"],
    forms: ["style"],
    count: 11,
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
    count: 13,
  },
  {
    value: "m3BaselineSecondary",
    label: "Baseline secondary",
    brands: ["materialDesign"],
    category: ["color"],
    thumbnailColor: "rgb(149,141,165)",
    forms: ["style", "variable"],
    count: 13,
  },
  {
    value: "m3BaselineTertiary",
    label: "Baseline tertiary",
    brands: ["materialDesign"],
    category: ["color"],
    thumbnailColor: "rgb(181,131,146)",
    forms: ["style", "variable"],
    count: 13,
  },
  {
    value: "m3BaselineNeutral",
    label: "Baseline neutral",
    brands: ["materialDesign"],
    category: ["color"],
    thumbnailColor: "rgb(147,144,144)",
    forms: ["style", "variable"],
    count: 13,
  },
  {
    value: "m3BaselineError",
    label: "Baseline error",
    brands: ["materialDesign"],
    category: ["color"],
    thumbnailColor: "rgb(230,106,99)",
    forms: ["style", "variable"],
    count: 13,
  },
  {
    value: "m3ElevationLight",
    label: "Elevation (Light)",
    brands: ["materialDesign"],
    category: ["effect"],
    forms: ["style"],
    count: 5,
  },
  {
    value: "m3ElevationDark",
    label: "Elevation (Dark)",
    brands: ["materialDesign"],
    category: ["effect"],
    forms: ["style"],
    count: 5,
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
    count: 13,
  },
  {
    value: "antDesignNeutralColorDark",
    label: "Neutral color (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(140,140,140)",
    forms: ["style", "variable"],
    count: 13,
  },
  {
    value: "antDesignDustRedLight",
    label: "Dust red (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(207,19,34)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignDustRedDark",
    label: "Dust red (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(207,19,34)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignVolcanoLight",
    label: "Volcano (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(216,56,13)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignVolcanoDark",
    label: "Volcano (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(216,56,13)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignSunsetOrangeLight",
    label: "Sunset orange (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,107,8)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignSunsetOrangeDark",
    label: "Sunset orange (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,107,8)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignCalendulaGoldLight",
    label: "Calendula gold (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,136,6)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignCalendulaGoldDark",
    label: "Calendula gold (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,136,6)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignSunriseYellowLight",
    label: "Sunrise yellow (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,177,6)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignSunriseYellowDark",
    label: "Sunrise yellow (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(212,177,6)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignLimeLight",
    label: "Lime (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(124,179,5)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignLimeDark",
    label: "Lime (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(124,179,5)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignPolarGreenLight",
    label: "Polar green (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(56,158,13)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignPolarGreenDark",
    label: "Polar green (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(56,158,13)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignCyanLight",
    label: "Cyan (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(8,151,156)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignCyanDark",
    label: "Cyan (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(8,151,156)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignDaybreakBlueLight",
    label: "Daybreak blue (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(9,109,217)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignDaybreakBlueDark",
    label: "Daybreak blue (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(9,109,217)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignGeekBlueLight",
    label: "Geek blue (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(29,57,196)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignGeekBlueDark",
    label: "Geek blue (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(29,57,196)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignGoldenPurpleLight",
    label: "Golden purple (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(83,29,171)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignGoldenPurpleDark",
    label: "Golden purple (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(83,29,171)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignMagentaLight",
    label: "Magenta (Light)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(196,29,127)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignMagentaDark",
    label: "Magenta (Dark)",
    brands: ["antDesign"],
    category: ["color"],
    thumbnailColor: "rgb(196,29,127)",
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "antDesignDropShadow",
    label: "Drop shadow",
    brands: ["antDesign"],
    category: ["effect"],
    forms: ["style"],
    count: 12,
  },
  {
    value: "antDesignBreakpoints",
    label: "Breakpoints",
    brands: ["antDesign"],
    category: ["other"],
    forms: ["variable"],
    count: 6,
  },
  {
    value: "antDesignFontSize",
    label: "Font size",
    brands: ["antDesign"],
    category: ["typography"],
    forms: ["variable"],
    count: 6,
  },
  {
    value: "antDesignLineHeight",
    label: "Line height",
    brands: ["antDesign"],
    category: ["typography"],
    forms: ["variable"],
    count: 6,
  },
  {
    value: "antDesignPadding",
    label: "Padding",
    brands: ["antDesign"],
    category: ["other"],
    forms: ["variable"],
    count: 3,
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
    count: 11,
  },
  {
    value: "tailwindOrange",
    label: "Orange",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(249,115,22)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindAmber",
    label: "Amber",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(245,158,11)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindYellow",
    label: "Yellow",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(234,179,8)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindLime",
    label: "Lime",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(132,204,22)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindGreen",
    label: "Green",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(34,197,94)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindEmerald",
    label: "Emerald",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(16,185,129)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindTeal",
    label: "Teal",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(20,184,166)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindCyan",
    label: "Cyan",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(6,182,212)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindSky",
    label: "Sky",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(14,165,233)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindBlue",
    label: "Blue",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(59,130,246)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindIndigo",
    label: "Indigo",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(99,102,241)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindViolet",
    label: "Violet",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(139,92,246)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindPurple",
    label: "Purple",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(168,85,247)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindFuchsia",
    label: "Fuchsia",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(217,70,239)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindPink",
    label: "Pink",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(236,72,153)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindSlate",
    label: "Slate",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(100,116,139)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindZinc",
    label: "Zinc",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(113,113,122)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindGray",
    label: "Gray",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(107,114,128)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindStone",
    label: "Stone",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(120,113,108)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindNeutral",
    label: "Neutral",
    brands: ["tailwind"],
    category: ["color"],
    thumbnailColor: "rgb(115,115,115)",
    forms: ["style", "variable"],
    count: 11,
  },
  {
    value: "tailwindBorder",
    label: "Border",
    brands: ["tailwind"],
    category: ["other"],
    forms: ["variable"],
    count: 5,
  },
  {
    value: "tailwindBorderRadius",
    label: "Border radius",
    brands: ["tailwind"],
    category: ["other"],
    forms: ["variable"],
    count: 9,
  },
  {
    value: "tailwindContainer",
    label: "Container",
    brands: ["tailwind"],
    category: ["other"],
    forms: ["variable"],
    count: 5,
  },
  {
    value: "tailwindFontSize",
    label: "Font size",
    brands: ["tailwind"],
    category: ["typography"],
    forms: ["variable"],
    count: 13,
  },
  {
    value: "tailwindOpacity",
    label: "Opacity",
    brands: ["tailwind"],
    category: ["other"],
    forms: ["variable"],
    count: 21,
  },
  {
    value: "tailwindSize",
    label: "Size",
    brands: ["tailwind"],
    category: ["other"],
    forms: ["variable"],
    count: 35,
  },
  {
    value: "tailwindShadow",
    label: "Shadow",
    brands: ["tailwind"],
    category: ["effect"],
    forms: ["style"],
    count: 7,
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
    count: 9,
  },
  {
    value: "bootstrapOrange",
    label: "Orange",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(253, 126, 20)", // Orange 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapYellow",
    label: "Yellow",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(255, 193, 7)", // Yellow 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapGreen",
    label: "Green",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(25, 135, 84)", // Green 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapTeal",
    label: "Teal",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(32, 201, 151)", // Teal 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapCyan",
    label: "Cyan",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(13, 202, 240)", // Cyan 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapBlue",
    label: "Blue",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(13, 110, 253)", // Blue 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapIndigo",
    label: "Indigo",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(102, 16, 242)", // Indigo 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapPurple",
    label: "Purple",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(111, 66, 193)", // Purple 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapPink",
    label: "Pink",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(214, 51, 132)", // Pink 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapGray",
    label: "Gray",
    brands: ["bootstrap"],
    category: ["color"],
    thumbnailColor: "rgb(173, 181, 189)", // Gray 500
    forms: ["style", "variable"],
    count: 9,
  },
  {
    value: "bootstrapBorderRadius",
    label: "Border radius",
    brands: ["bootstrap"],
    category: ["other"],
    forms: ["variable"],
    count: 6,
  },
  {
    value: "bootstrapBreakpoints",
    label: "Breakpoints",
    brands: ["bootstrap"],
    category: ["other"],
    forms: ["variable"],
    count: 5,
  },
];

const polarisOptions: AvailableOption[] = [
  {
    value: "polarisRed",
    label: "Red",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(229, 28, 0)", // Red step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisOrange",
    label: "Orange",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(255, 184, 0)", // Orange step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisYellow",
    label: "Yellow",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(255, 230, 0)", // Yellow step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisLime",
    label: "Lime",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(56, 254, 62)", // Lime step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisGreen",
    label: "Green",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(46, 211, 137)", // Green step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisCyan",
    label: "Cyan",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(23, 199, 167)", // Cyan step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisTeal",
    label: "Teal",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(30, 199, 188)", // Teal step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisAzure",
    label: "Azure",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(0, 148, 213)", // Azure step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisBlue",
    label: "Blue",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(0, 113, 233)", // Blue step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisPurple",
    label: "Purple",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(128, 81, 255)", // Purple step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisMagenta",
    label: "Magenta",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(197, 48, 197)", // Magenta step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisRose",
    label: "Rose",
    brands: ["polaris"],
    category: ["color"],
    thumbnailColor: "rgb(227, 12, 118)", // Rose step 8
    forms: ["style", "variable"],
    count: 16,
  },
  {
    value: "polarisBorderRadius",
    label: "Border radius",
    brands: ["polaris"],
    category: ["other"],
    forms: ["variable"],
    count: 14,
  },
  {
    value: "polarisBreakpoints",
    label: "Breakpoints",
    brands: ["polaris"],
    category: ["other"],
    forms: ["variable"],
    count: 4,
  },
  {
    value: "polarisFontSize",
    label: "Font size",
    brands: ["polaris"],
    category: ["typography"],
    forms: ["variable"],
    count: 13,
  },
  {
    value: "polarisHeight",
    label: "Height",
    brands: ["polaris"],
    category: ["other"],
    forms: ["variable"],
    count: 19,
  },
  {
    value: "polarisWidth",
    label: "Width",
    brands: ["polaris"],
    category: ["other"],
    forms: ["variable"],
    count: 19,
  },
  {
    value: "polarisLineHeight",
    label: "Line height",
    brands: ["polaris"],
    category: ["typography"],
    forms: ["variable"],
    count: 8,
  },
  {
    value: "polarisSpace",
    label: "Space",
    brands: ["polaris"],
    category: ["other"],
    forms: ["variable"],
    count: 19,
  },
];

const carbonOptions: AvailableOption[] = [
  {
    value: "carbonRed",
    label: "Red",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(218, 30, 40)", // Red - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonOrange",
    label: "Orange",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(186, 78, 0)", // Orange - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonYellow",
    label: "Yellow",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(142, 106, 0)", // Yellow - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonGreen",
    label: "Green",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(25, 128, 56)", // Green - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonTeal",
    label: "Teal",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(0, 125, 121)", // Teal - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonCyan",
    label: "Cyan",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(0, 114, 195)", // Cyan - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonBlue",
    label: "Blue",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(15, 98, 254)", // Blue - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonPurple",
    label: "Purple",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(138, 63, 252)", // Purple - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonMagenta",
    label: "Magenta",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(208, 38, 112)", // Magenta - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonGray",
    label: "Gray",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(111, 111, 111)", // Gray - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonCoolGray",
    label: "Cool Gray",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(105, 112, 119)", // Cool Gray - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonWarmGray",
    label: "Warm Gray",
    brands: ["carbon"],
    category: ["color"],
    thumbnailColor: "rgb(114, 110, 110)", // Warm Gray - shade 60
    forms: ["style", "variable"],
    count: 10,
  },
  {
    value: "carbonBreakpoints",
    label: "Breakpoints",
    brands: ["carbon"],
    category: ["other"],
    forms: ["variable"],
    count: 5,
  },
  {
    value: "carbonSpacing",
    label: "Spacing",
    brands: ["carbon"],
    category: ["other"],
    forms: ["variable"],
    count: 13,
  },
  {
    value: "carbonTypographyScale",
    label: "Typography scale",
    brands: ["carbon"],
    category: ["typography"],
    forms: ["variable"],
    count: 17,
  },
];

/**
 * 用於Preset Library模組，列出所有可選擇的選項
 */
const allOptions: AvailableOption[] = [
  {
    value: "all",
    label: "ALL",
    brands: [
      "ios",
      "antDesign",
      "materialDesign",
      "tailwind",
      "bootstrap",
      "polaris",
      "carbon",
    ],
    category: ["color", "effect", "typography", "other"],
    forms: ["style", "variable"],
  },
  ...iosOptions,
  ...materialDesignOptions,
  ...antDesignOptions,
  ...tailwindOptions,
  ...bootstrapOptions,
  ...polarisOptions,
  ...carbonOptions,
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


export const getAvailableBrands = (): { value: InstantiaterSupportedBrand, label: string }[] => {
  return [
    {
      value: "antDesign",
      label: "Ant Design"
    },
    {
      value: "bootstrap",
      label: "Bootstrap"
    },
    {
      value: "ios",
      label: "iOS 26"
    },
    {
      value: "carbon",
      label: "IBM Carbon"
    },
    {
      value: "materialDesign",
      label: "Material Design 3 Expressive"
    },
    {
      value: "polaris",
      label: "Shopify Polaris"
    },
    {
      value: "tailwind",
      label: "Tailwind CSS 4.0"
    }
  ]
}
