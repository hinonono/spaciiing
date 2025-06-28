import { StyleListItemFrontEnd } from "../../types/General";
import { StyleMode, StyleModeForFigmaStyle, StyleModeForFigmaVariable } from "../../types/Messages/MessageStyleIntroducer";
import { isRGBAType, isRGBType } from "../typeChecking";
import { utils } from "../utils";

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
            return styleList.map((style) => {
                const firstPaint = style.paints?.[0];
                const isSolid = firstPaint?.type === "SOLID";

                if (isSolid) {
                    const color = utils.color.rgbToHex(firstPaint.color.r, firstPaint.color.g, firstPaint.color.b, firstPaint.opacity ?? 1, true);
                    return {
                        id: style.id,
                        name: style.name,
                        color: color, // or null if you prefer
                    };
                } else {
                    return {
                        id: style.id,
                        name: style.name,
                    };
                }

            });

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

        return variableList.map((variable) => {
            const firstValue = Object.entries(variable.valuesByMode)[0]?.[1];
            let colorValue: string | undefined = undefined;

            if (isRGBType(firstValue)) {
                colorValue = utils.color.rgbToHex(firstValue.r, firstValue.g, firstValue.b, 1, true);
            } else if (isRGBAType(firstValue)) {
                colorValue = utils.color.rgbToHex(firstValue.r, firstValue.g, firstValue.b, firstValue.a);
            }

            return {
                id: variable.id,
                name: variable.name,
                color: colorValue, // will be undefined if not RGB(A)
            };
        });


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


export async function findStyleById(styleId: string) {
    const paintStyles = await figma.getLocalPaintStylesAsync();
    const foundPaint = paintStyles.find(style => style.id === styleId);
    if (foundPaint) return foundPaint;

    const textStyles = await figma.getLocalTextStylesAsync();
    const foundText = textStyles.find(style => style.id === styleId);
    if (foundText) return foundText;

    const effectStyles = await figma.getLocalEffectStylesAsync();
    const foundEffect = effectStyles.find(style => style.id === styleId);
    if (foundEffect) return foundEffect;

    return null;
}

export async function findVariableById(variableId: string) {
    const variables = await figma.variables.getLocalVariablesAsync();
    return variables.find(variable => variable.id === variableId) || null;
}