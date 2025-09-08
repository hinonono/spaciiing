import { AliasResources, PreviewResources, StyleForm, StyleMode } from "../../../types/Messages/MessageStyleIntroducer";
import { semanticTokens } from "../../tokens";
import { CatalogueLocalizationResources } from "../../../types/CatalogueLocalization";
import { utils } from "../../utils";

import { CatalogueKit } from "../index";
import { CYAliasVariable } from "../../../types/CYAliasVariable";

export function pushInfoAreaAdditionalContent(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    previewResources: PreviewResources,
    aliasResources: AliasResources,
    target: SceneNode[],
    lr?: CatalogueLocalizationResources
) {
    if (styleMode === "COLOR") {
        if (!previewResources.colors) { throw new Error("Colors is required for this style mode.") }

        if (previewResources.colors.type === "SOLID") {
            if (!previewResources.colors.colors) { throw new Error("Unable to generate preview info due to previewResources.colors.colors is undefined."); }
            const items = createPropertiesForColor(
                form,
                fontName,
                previewResources.colors.colors,
                aliasResources.cyAliasVariables,
                aliasResources.variableModes,
                lr
            )
            target.push(...items);
        } else {
            if (!previewResources.colors.gradientStops || !previewResources.colors.gradientTransform) { throw new Error("Unable to generate preview info due to previewResources.colors.gradientStops or previewResources.colors.gradientTransform is undefined."); }
            const items = createPropertiesForGradient(
                form,
                fontName,
                previewResources.colors.type,
                previewResources.colors.gradientTransform[0],
                previewResources.colors.gradientStops[0],
                lr
            )
            target.push(...items);
        }

    } else if (styleMode === "FLOAT") {
        if (!previewResources.numbers) { throw new Error("Number is required for number type."); }
        const items = createPropertiesForNumber(
            form,
            fontName,
            previewResources.numbers,
            aliasResources.cyAliasVariables,
            aliasResources.variableModes,
        )
        target.push(...items);

    } else if (styleMode === "TEXT") {
        if (!previewResources.textStyle) { throw new Error("Missing text style."); }
        if (!lr) { throw new Error("Localization resource is require for STLYE type TEXT.") }
        const items = createPropertiesForText(lr, form, fontName, previewResources.textStyle);
        target.push(...items);

    } else if (styleMode === "EFFECT") {
        if (!previewResources.effects) { throw new Error("Missing effect style."); }
        if (!lr) { throw new Error("Localization resource is require for STLYE type EFFECT.") }
        const items = createPropertiesForEffect(lr, form, fontName, previewResources.effects);
        target.push(...items);

    } else if (styleMode === "STRING") {
        if (!previewResources.strings) { throw new Error("Strings is required for number type."); }
        const items = createPropertiesForString(
            form,
            fontName,
            previewResources.strings,
            aliasResources.cyAliasVariables,
            aliasResources.variableModes,
        )
        target.push(...items);

    } else {
        console.log(`Nothing is pushed to target.`);
    }
}

// 右側資訊區設定
export function setUpInfoWrapperLayout(
    styleMode: StyleMode,
    itemsToPutInTitleWrapper: SceneNode[],
    titleNode: TextNode,
    descNode: TextNode,
): FrameNode {
    const spacing = styleMode === "EFFECT" ? semanticTokens.spacing.base : semanticTokens.spacing.small
    const titleWrapper = utils.node.createAutolayoutFrame(itemsToPutInTitleWrapper, spacing, "VERTICAL");
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

    const explanationTextsWrapperNode = utils.node.createAutolayoutFrame(
        [titleWrapper, descNode],
        semanticTokens.spacing.base,
        "VERTICAL"
    );
    explanationTextsWrapperNode.name = "Info Wrapper";

    titleWrapper.layoutSizingHorizontal = "FILL";
    titleWrapper.layoutSizingVertical = "HUG";

    titleNode.layoutSizingHorizontal = "FILL";
    descNode.layoutSizingHorizontal = "FILL";

    return explanationTextsWrapperNode;
}

export function createPropertiesForColor(
    form: StyleForm,
    fontName: FontName,
    colors: RGBA[],
    cyAliasVariables: (CYAliasVariable | null)[],
    variableModes?: string[],
    lr?: CatalogueLocalizationResources,
): SceneNode[] {
    if (colors.length === 0) { throw new Error("Termination due to color.length is 0."); }

    if (form === "STYLE" && colors.length == 1) {
        if (!lr) { throw new Error("Localization resource is required for STYLE type COLOR.") }
        const colorHexNode = CatalogueKit.explanationItemKit.explainer.createStyleColorHexNode(
            lr,
            colors,
            fontName
        );

        return [colorHexNode];
    } else {
        // if (!aliasNames) { throw new Error("Alias names are required for variable type."); }
        // if (!aliasVariableIds) { throw new Error("Alias variable ids are required for variable type."); }

        const colorHexNodes = CatalogueKit.explanationItemKit.explainer.createVariableColorHexNodes(
            colors,
            fontName,
            cyAliasVariables,
            variableModes
        );
        return [...colorHexNodes]
    }
}

export function createPropertiesForGradient(
    form: StyleForm,
    fontName: FontName,
    gradientType: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND",
    gradientTransform: Transform,
    gradientStops: ColorStop[],
    lr?: CatalogueLocalizationResources,
): SceneNode[] {
    if (gradientStops.length === 0) { throw new Error("Termination due to color.length is 0."); }

    if (form === "STYLE") {
        if (!lr) { throw new Error("Localization resource is require for STYLE type GRADIENT.") }
        const gradientNodes = CatalogueKit.explanationItemKit.explainer.createStyleGradientNode(
            gradientType,
            gradientTransform,
            gradientStops,
            fontName,
            semanticTokens.fontSize.small,
            lr
        );

        return gradientNodes;
    } else {
        throw new Error("Gradient is not supported in variables mode.")
    }
}

export function createPropertiesForNumber(
    form: StyleForm,
    fontName: FontName,
    numbers: number[],
    cyAliasVariables: (CYAliasVariable | null)[],
    variableModes?: string[],
): SceneNode[] {
    if (numbers.length === 0) { throw new Error("Termination due to number.length is 0."); }
    if (!variableModes) { throw new Error("Variable modes are required for number type."); }
    if (form === "STYLE") { throw new Error("STYLE is not supported for number style."); }

    const numberNodes = CatalogueKit.explanationItemKit.explainer.createVariableNumberNodes(
        numbers,
        fontName,
        cyAliasVariables,
        variableModes
    );
    return [...numberNodes]
}

export function createPropertiesForText(
    lr: CatalogueLocalizationResources,
    form: StyleForm,
    fontName: FontName,
    textStyle: TextStyle,
): SceneNode[] {
    if (form === "VARIABLE") { throw new Error("Text style is not supported on VARIRABLE type.") }

    const textPropertiesWrappers = CatalogueKit.explanationItemKit.explainer.createTextPropertiesWrappers(lr, textStyle, fontName);
    return textPropertiesWrappers;
}

export function createPropertiesForEffect(
    lr: CatalogueLocalizationResources,
    form: StyleForm,
    fontName: FontName,
    effects: Effect[],
): SceneNode[] {
    if (form === "VARIABLE") { throw new Error("Text style is not supported on VARIRABLE type.") }

    const effectWrappers = CatalogueKit.explanationItemKit.explainer.createEffectPropertiesWrappers(lr, effects, fontName);
    return effectWrappers;
}

export function createPropertiesForString(
    form: StyleForm,
    fontName: FontName,
    strings: string[],
    cyAliasVariables: (CYAliasVariable | null)[],
    variableModes?: string[],
): SceneNode[] {
    if (strings.length === 0) { throw new Error("Termination due to string.length is 0."); }
    if (!variableModes) { throw new Error("Variable modes are required for string type."); }
    if (form === "STYLE") { throw new Error("STYLE is not supported for string style."); }

    const stringNodes = CatalogueKit.explanationItemKit.explainer.createVariableStringNodes(
        strings,
        fontName,
        cyAliasVariables,
        variableModes
    );
    return [...stringNodes]
}