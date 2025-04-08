import { StyleListItemFrontEnd } from "../../types/General";
import { StyleMode, StyleModeForFigmaStyle, StyleModeForFigmaVariable } from "../../types/Messages/MessageStyleIntroducer";

// Type guard function for StyleModeForFigmaStyle
export function isStyleModeForFigmaStyle(
    mode: StyleMode
): mode is StyleModeForFigmaStyle {
    return mode === "COLOR" || mode === "EFFECT" || mode === "TEXT";
}

// Type guard function for StyleModeForFigmaVariable
export function isStyleModeForFigmaVariable(
    mode: StyleMode
): mode is StyleModeForFigmaVariable {
    return mode === "COLOR" || mode === "FLOAT" || mode == "STRING";
}

export async function getStyleList(
    styleType: StyleModeForFigmaStyle
): Promise<StyleListItemFrontEnd[]> {
    let styleList;
    switch (styleType) {
        case "COLOR":
            styleList = await figma.getLocalPaintStylesAsync();
            break;
        case "TEXT":
            styleList = await figma.getLocalTextStylesAsync();
            break;
        case "EFFECT":
            styleList = await figma.getLocalEffectStylesAsync();
            break;
        default:
            throw new Error("Invalid style type");
    }

    return styleList.map((style) => ({
        id: style.id,
        name: style.name,
    }));
}

export async function getVariableList(
    styleType: StyleModeForFigmaVariable
): Promise<StyleListItemFrontEnd[]> {
    let variableList: Variable[] | null = null;

    if (styleType === "COLOR") {
        variableList = await figma.variables.getLocalVariablesAsync("COLOR");
    } else if (styleType === "FLOAT") {
        variableList = await figma.variables.getLocalVariablesAsync("FLOAT");
    } else if (styleType === "STRING") {
        variableList = await figma.variables.getLocalVariablesAsync("STRING");
    } else {
        throw new Error("Cannot get local variable due to unsupported type.")
    }

    return variableList.map((variable) => ({
        id: variable.id,
        name: variable.name,
    }));
}