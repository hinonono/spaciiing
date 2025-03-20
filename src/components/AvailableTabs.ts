import { Module } from "../types/Module"
import {
    SvgDefaultStyleLibrary,
    SvgPropertyClipboard,
    SvgRenamer,
    SvgSelectionFilter,
    SvgSetting,
    SvgShortcut,
    SvgSpaciiing,
    SvgVariableEditor,
    SvgVirtualProfile,
    SvgAspectRatioHelper,
    SvgCatalogue,
    SvgDrawArrows
} from "../assets/icons";
import { EditorType } from "../types/EditorType";

type AvailableTabs = {
    tabName: Module;
    svgComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    supportedEditorTypes: EditorType[];
}

const availableTabs: AvailableTabs[] = [
    {
        tabName: "Spaciiing",
        svgComponent: SvgSpaciiing,
        supportedEditorTypes: ["figma", "slides"]
    },
    {
        tabName: "ArrowCreator",
        svgComponent: SvgDrawArrows,
        supportedEditorTypes: ["figma"]
    },
    {
        tabName: "PropertyClipboard",
        svgComponent: SvgPropertyClipboard,
        supportedEditorTypes: ["figma", "slides"]
    },
    {
        tabName: "VirtualProfile",
        svgComponent: SvgVirtualProfile,
        supportedEditorTypes: ["figma", "slides"]
    },
    {
        tabName: "SelectionFilter",
        svgComponent: SvgSelectionFilter,
        supportedEditorTypes: ["figma", "slides"]
    },

    {
        tabName: "AspectRatioHelper",
        svgComponent: SvgAspectRatioHelper,
        supportedEditorTypes: ["figma", "slides"]
    },

    {
        tabName: "StyleIntroducer",
        svgComponent: SvgCatalogue,
        supportedEditorTypes: ["figma"]
    },

    {
        tabName: "Shortcut",
        svgComponent: SvgShortcut,
        supportedEditorTypes: ["figma", "slides"]
    },
    {
        tabName: "Renamer",
        svgComponent: SvgRenamer,
        supportedEditorTypes: ["figma", "slides"]
    },
    {
        tabName: "VariableEditor",
        svgComponent: SvgVariableEditor,
        supportedEditorTypes: ["figma"]
    },
    {
        tabName: "Instantiater",
        svgComponent: SvgDefaultStyleLibrary,
        supportedEditorTypes: ["figma"]
    },

    {
        tabName: "PluginSetting",
        svgComponent: SvgSetting,
        supportedEditorTypes: ["figma", "slides"]
    }
];

export function getAvailableTabs(editorType: EditorType): AvailableTabs[] {
    return availableTabs.filter(tab => tab.supportedEditorTypes.includes(editorType));
}