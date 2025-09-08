import { AliasResources, MessageStyleIntroducer, PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import { CatalogueLocalizationResources } from "../../types/CatalogueLocalization";
import { utils } from "../utils";
import { CatalogueKit } from "../catalogue";
import { semanticTokens } from "../tokens";

export async function applyStyleIntroducer(
    message: MessageStyleIntroducer
) {
    const { styleSelection, styleMode, form, lang } = message;

    if (!styleSelection) { throw new Error("styleSelection is required"); }
    const { title, scopes } = styleSelection;

    await utils.editor.loadFont([
        semanticTokens.fontFamily.regular,
        semanticTokens.fontFamily.semiBold
    ]);

    const lr: CatalogueLocalizationResources = CatalogueKit.localizer.createLocalizationResource(lang);
    const selectedStyleList = await getSelectedStyleList(scopes, styleMode);

    // Explanation Items
    const explanationItems = createExplanationItemsHandler(lr, form, styleMode, semanticTokens.fontFamily.regular, selectedStyleList)

    // Wrapper
    const wrapperTitle = title == "" ? lr.term["style"] : title
    const titleSecondary = lr.module["moduleCatalogue"];
    const explanationWrapper = await CatalogueKit.wrapper.create(
        lr,
        form,
        explanationItems,
        wrapperTitle,
        titleSecondary,
        semanticTokens.fontFamily.semiBold
    )

    figma.currentPage.appendChild(explanationWrapper);
    figma.currentPage.selection = [explanationWrapper];
}

async function getSelectedStyleList(scopes: string[], styleMode: StyleMode) {
    let styleList;
    switch (styleMode) {
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
    const selectedStyleList = styleList.filter((style) =>
        scopes.includes(style.id)
    );

    return selectedStyleList;
}

function createExplanationItemsHandler(
    lr: CatalogueLocalizationResources,
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    styleList: (PaintStyle | TextStyle | EffectStyle)[]
): FrameNode[] {
    if (styleMode === "COLOR") {
        const items = createItemColor(
            lr,
            styleList as PaintStyle[],
            form,
            styleMode,
            fontName
        );
        return items;

    } else if (styleMode === "TEXT") {
        const items = createItemText(
            lr,
            styleList as TextStyle[],
            form,
            styleMode,
            fontName
        );
        return items;

    } else if (styleMode === "EFFECT") {
        const items = createItemEffect(
            lr,
            styleList as EffectStyle[],
            form,
            styleMode,
            fontName
        );
        return items;

    } else {
        throw new Error(`${styleMode} is not supported on STYLE type.`)
    }
}

function createGenericItems<T extends PaintStyle | TextStyle | EffectStyle>(
    lr: CatalogueLocalizationResources,
    styleList: T[],
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    getPreviewResources: (style: T) => PreviewResources
): FrameNode[] {
    const explanationItems: FrameNode[] = [];

    styleList.forEach((member) => {
        const { id, description, name } = member;
        const title = name.split("/").pop() || "";

        const previewResources = getPreviewResources(member);
        const aliasResources: AliasResources = { cyAliasVariables: [] };

        const explanationItem = CatalogueKit.explanationItemKit.main.createExplanationItem(
            form,
            styleMode,
            id,
            title,
            description,
            fontName,
            previewResources,
            aliasResources,
            lr
        );

        explanationItem.primaryAxisSizingMode = "AUTO";
        explanationItem.counterAxisSizingMode = "AUTO";

        explanationItems.push(explanationItem);
    });

    return explanationItems;
}


function createItemColor(
    lr: CatalogueLocalizationResources,
    styleList: PaintStyle[],
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName
): FrameNode[] {
    return createGenericItems(lr, styleList, form, styleMode, fontName, (style) => {
        const paint = style.paints[0];

        if (!paint) {
            return {
                colors: undefined
            };
        }

        switch (paint.type) {
            case "SOLID":
                if (!paint.opacity) { throw new Error("Opacity is required.") }
                const { r, g, b } = (paint as SolidPaint).color;

                return {
                    colors: {
                        type: "SOLID",
                        colors: [{ r, g, b, a: paint.opacity }],
                        opacity: 1
                    }
                };

            case "GRADIENT_LINEAR":
            case "GRADIENT_RADIAL":
            case "GRADIENT_ANGULAR":
            case "GRADIENT_DIAMOND":
                if (!paint.opacity) { throw new Error("Opacity is required.") }

                const gradientPaint = paint as GradientPaint;
                const stops = [...gradientPaint.gradientStops];
                return {
                    colors: {
                        type: paint.type,
                        opacity: paint.opacity,
                        gradientTransform: [gradientPaint.gradientTransform],
                        gradientStops: [stops]
                    }
                };

            default:
                return {
                    colors: undefined
                };
        }
    });
}

function createItemText(
    lr: CatalogueLocalizationResources,
    styleList: TextStyle[],
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName
): FrameNode[] {
    return createGenericItems(lr, styleList, form, styleMode, fontName, (style) => ({
        textStyle: style
    }));
}

function createItemEffect(
    lr: CatalogueLocalizationResources,
    styleList: EffectStyle[],
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName
): FrameNode[] {
    return createGenericItems(lr, styleList, form, styleMode, fontName, (style) => ({
        effects: [...style.effects]
    }));
}