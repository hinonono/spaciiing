import { AliasResources, MessageStyleIntroducer, PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import * as util from "../util"
import * as CLExplanationItem from "../catalogue/catalogueExplanationItem"
import * as CLExplanationWrapper from "../catalogue/catalogueExplanationWrapper";
import { semanticTokens } from "../tokens";

export async function applyStyleIntroducer(
    message: MessageStyleIntroducer
) {
    const { styleSelection, styleMode, form } = message;

    if (!styleSelection) { throw new Error("styleSelection is required"); }
    const { title, scopes } = styleSelection;
    const viewport = util.getCurrentViewport();

    const fontNameRegular = { family: "Inter", style: "Regular" };
    const fontNameSemi = { family: "Inter", style: "Semi Bold" };
    const fontsToLoad = [fontNameRegular, fontNameSemi];
    await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));

    const selectedStyleList = await getSelectedStyleList(scopes, styleMode);
    const explanationItems = createExplanationItemsHandler(form, styleMode, fontNameRegular, selectedStyleList)

    const wrapperTitle = title == "" ? "Styles" : title
    const titleSecondary = "Catalogue";
    const explanationWrapper = CLExplanationWrapper.createExplanationWrapper(
        form,
        explanationItems,
        wrapperTitle,
        titleSecondary,
        fontNameSemi
    )
    setUpWrapper(explanationWrapper, viewport);

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
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    styleList: (PaintStyle | TextStyle | EffectStyle)[]
): FrameNode[] {
    if (styleMode === "COLOR") {
        const items = createItemColor(
            styleList as PaintStyle[],
            form,
            styleMode,
            fontName
        );
        return items;

    } else if (styleMode === "TEXT") {
        const items = createItemText(
            styleList as TextStyle[],
            form,
            styleMode,
            fontName
        );
        return items;

    } else if (styleMode === "EFFECT") {
        const items = createItemEffect(
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

function createItemColor(
    styleList: PaintStyle[],
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
): FrameNode[] {
    const explanationItems: FrameNode[] = [];

    styleList.forEach((member) => {
        const paint = member.paints[0];
        const { id, description, name } = member;

        if (paint.type === "SOLID") {
            const solidPaint = paint as SolidPaint;

            const title = name.split("/").pop() || ""
            const { r, g, b } = solidPaint.color;
            const previewResources: PreviewResources = {
                colors: [
                    {
                        r: r, g: g, b: b, a: 1,
                    },
                ]
            }
            const aliasResources: AliasResources = {}
            const explanationItem = CLExplanationItem.createExplanationItem(
                form,
                styleMode,
                id,
                title,
                description,
                fontName,
                previewResources,
                aliasResources
            )

            explanationItem.primaryAxisSizingMode = "AUTO";
            explanationItem.counterAxisSizingMode = "AUTO";

            explanationItems.push(explanationItem);
        }
    });

    return explanationItems;
}

function createItemText(
    styleList: TextStyle[],
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
) {
    const explanationItems: FrameNode[] = [];

    styleList.forEach((member) => {
        const { id, description, name } = member;
        const title = name.split("/").pop() || ""
        const previewResources: PreviewResources = {
            textStyle: member
        }
        const aliasResources: AliasResources = {}
        const explanationItem = CLExplanationItem.createExplanationItem(
            form,
            styleMode,
            id,
            title,
            description,
            fontName,
            previewResources,
            aliasResources
        )

        explanationItem.primaryAxisSizingMode = "AUTO";
        explanationItem.counterAxisSizingMode = "AUTO";

        explanationItems.push(explanationItem);
    });

    return explanationItems;
}

function createItemEffect(
    styleList: EffectStyle[],
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
) {
    const explanationItems: FrameNode[] = [];

    styleList.forEach((member) => {
        const { id, description, name } = member;
        const title = name.split("/").pop() || ""
        const previewResources: PreviewResources = {
            effects: [...member.effects]
        }
        const aliasResources: AliasResources = {}
        const explanationItem = CLExplanationItem.createExplanationItem(
            form,
            styleMode,
            id,
            title,
            description,
            fontName,
            previewResources,
            aliasResources
        )

        explanationItem.primaryAxisSizingMode = "AUTO";
        explanationItem.counterAxisSizingMode = "AUTO";

        explanationItems.push(explanationItem);
    });

    return explanationItems;
}

function setUpWrapper(wrapper: FrameNode, viewport: Vector) {
    wrapper.fills = [
        {
            type: "SOLID",
            color: semanticTokens.background.primary,
        },
    ];

    wrapper.name = `Catalogue`;

    wrapper.cornerRadius = 16;
    wrapper.primaryAxisSizingMode = "AUTO";
    wrapper.counterAxisSizingMode = "FIXED";

    wrapper.x = viewport.x;
    wrapper.y = viewport.y;
}