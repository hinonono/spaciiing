import { AliasResources, PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import * as util from "../util";
import { createEffectPropertiesWrappers, createStyleColorHexNode, createTextPropertiesWrappers, createVariableColorHexNodes, createVariableNumberNodes, createVariableStringNodes } from "../explanation";
import { semanticTokens } from "../tokens";

export function pushInfoAreaAdditionalContent(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    previewResouces: PreviewResources,
    aliasResources: AliasResources,
    target: SceneNode[]
) {
    if (styleMode === "COLOR") {
        if (!previewResouces.colors) { throw new Error("Colors is required for this style mode.") }
        const items = createPropertiesForColor(
            form,
            fontName,
            previewResouces.colors,
            aliasResources.aliasNames,
            aliasResources.variableModes,
            aliasResources.aliasVariableIds
        )
        target.push(...items);

    } else if (styleMode === "FLOAT") {
        if (!previewResouces.numbers) { throw new Error("Number is required for number type."); }
        const items = createPropertiesForNumber(
            form,
            fontName,
            previewResouces.numbers,
            aliasResources.aliasNames,
            aliasResources.variableModes,
            aliasResources.aliasVariableIds
        )
        target.push(...items);

    } else if (styleMode === "TEXT") {
        if (!previewResouces.textStyle) { throw new Error("Missing text style."); }
        const items = createPropertiesForText(form, fontName, previewResouces.textStyle);
        target.push(...items);

    } else if (styleMode === "EFFECT") {
        if (!previewResouces.effects) { throw new Error("Missing effect style."); }
        const items = createPropertiesForEffect(form, fontName, previewResouces.effects);
        target.push(...items);

    } else if (styleMode === "STRING") {
        if (!previewResouces.strings) { throw new Error("Strings is required for number type."); }
        const items = createPropertiesForString(
            form,
            fontName,
            previewResouces.strings,
            aliasResources.aliasNames,
            aliasResources.variableModes,
            aliasResources.aliasVariableIds
        )
        target.push(...items);

    } else {
        console.log(`Nothing is pushed to target.`);
    }
}

// 右側資訊區設定
export function setUpInfoWrapperLayout(
    itemsToPutInTitleWrapper: SceneNode[],
    titleNode: TextNode,
    descNode: TextNode,
) {
    const titleWrapper = util.createAutolayoutFrame(itemsToPutInTitleWrapper, semanticTokens.spacing.xsmall, "VERTICAL");
    titleWrapper.name = "Title Wrapper";

    itemsToPutInTitleWrapper.forEach((node) => {
        if ("layoutSizingHorizontal" in node) {
            node.layoutSizingHorizontal = "FILL";
        }
        if ("layoutSizingVertical" in node) {
            node.layoutSizingVertical = "HUG";
        }
    });
    titleNode.layoutSizingHorizontal = "FILL";
    // 這裡可能要讓text properties wrapper horizontal = fill

    const explanationTextsWrapperNode = util.createAutolayoutFrame(
        [titleWrapper, descNode],
        semanticTokens.spacing.base,
        "VERTICAL"
    );
    explanationTextsWrapperNode.name = "Info Wrapper";

    titleWrapper.layoutSizingHorizontal = "FILL";
    titleWrapper.layoutSizingVertical = "HUG";

    titleNode.layoutSizingHorizontal = "FILL";
    descNode.layoutSizingHorizontal = "FILL";
}

export function createPropertiesForColor(
    form: StyleForm,
    fontName: FontName,
    colors: RGBA[],
    aliasNames?: (string | undefined)[],
    variableModes?: string[],
    aliasVariableIds?: (string | undefined)[]
): SceneNode[] {
    if (colors.length === 0) { throw new Error("Termination due to color.length is 0."); }

    if (form === "STYLE" && colors.length == 1) {
        const colorHexNode = createStyleColorHexNode(
            colors,
            fontName,
            semanticTokens.fontSize.small
        );
        // itemsToPutInTitleWrapper.push(colorHexNode);

        return [colorHexNode];
    } else {
        if (!aliasNames) { throw new Error("Alias names are required for variable type."); }
        if (!aliasVariableIds) { throw new Error("Alias variable ids are required for variable type."); }

        const colorHexNodes = createVariableColorHexNodes(colors, fontName, aliasNames, aliasVariableIds, variableModes);
        // itemsToPutInTitleWrapper.push(...colorHexNodes);
        return [...colorHexNodes]
    }

    // const titleWrapper = createAutolayoutFrame(
    //     itemsToPutInTitleWrapper,
    //     semanticTokens.spacing.xsmall,
    //     "VERTICAL"
    // );

    // itemsToPutInTitleWrapper.forEach((node) => {
    //     if ("layoutSizingHorizontal" in node) {
    //         node.layoutSizingHorizontal = "FILL";
    //     }
    //     if ("layoutSizingVertical" in node) {
    //         node.layoutSizingVertical = "HUG";
    //     }
    // });

    // titleWrapper.name = "Title Wrapper";
    // titleNode.layoutSizingHorizontal = "FILL";

    // explanationTextsWrapperNode = createAutolayoutFrame(
    //     [titleWrapper, descriptionNode],
    //     semanticTokens.spacing.base,
    //     "VERTICAL"
    // );
    // titleWrapper.layoutSizingHorizontal = "FILL";
    // titleWrapper.layoutSizingVertical = "HUG";

}

export function createPropertiesForNumber(
    form: StyleForm,
    fontName: FontName,
    numbers: number[],
    aliasNames?: (string | undefined)[],
    variableModes?: string[],
    aliasVariableIds?: (string | undefined)[]
): SceneNode[] {
    if (numbers.length === 0) { throw new Error("Termination due to number.length is 0."); }
    if (!variableModes) { throw new Error("Variable modes are required for number type."); }
    if (form === "STYLE") { throw new Error("STYLE is not supported for number style."); }
    if (!aliasNames) { throw new Error("Alias names are required for variable type."); }
    if (!aliasVariableIds) { throw new Error("Alias variable ids are required for variable type."); }

    const numberNodes = createVariableNumberNodes(numbers, fontName, aliasNames, aliasVariableIds, variableModes);
    return [...numberNodes]
}

export function createPropertiesForText(
    form: StyleForm,
    fontName: FontName,
    textStyle: TextStyle,
): SceneNode[] {
    if (form === "VARIABLE") { throw new Error("Text style is not supported on VARIRABLE type.") }

    const textPropertiesWrappers = createTextPropertiesWrappers(textStyle, fontName);
    return textPropertiesWrappers;
}

export function createPropertiesForEffect(
    form: StyleForm,
    fontName: FontName,
    effects: Effect[],
): SceneNode[] {
    if (form === "VARIABLE") { throw new Error("Text style is not supported on VARIRABLE type.") }

    const effectWrappers = createEffectPropertiesWrappers(effects, fontName);
    return effectWrappers;
}

export function createPropertiesForString(
    form: StyleForm,
    fontName: FontName,
    strings: string[],
    aliasNames?: (string | undefined)[],
    variableModes?: string[],
    aliasVariableIds?: (string | undefined)[]
): SceneNode[] {
    if (strings.length === 0) { throw new Error("Termination due to string.length is 0."); }
    if (!variableModes) { throw new Error("Variable modes are required for string type."); }
    if (form === "STYLE") { throw new Error("STYLE is not supported for string style."); }
    if (!aliasNames) { throw new Error("Alias names are required for variable type."); }
    if (!aliasVariableIds) { throw new Error("Alias variable ids are required for variable type."); }

    const stringNodes = createVariableStringNodes(strings, fontName, aliasNames, aliasVariableIds, variableModes);
    return [...stringNodes]
}