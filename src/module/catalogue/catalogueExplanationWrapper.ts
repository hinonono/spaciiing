// 2025-04-09
// V25: 重構原先 explanation.ts 裡頭已經混亂得不得了的func

import { StyleForm, } from "../../types/Messages/MessageStyleIntroducer";
import { semanticTokens } from "../tokens";
import { CatalogueLocalizationResources } from "../../types/CatalogueLocalization";
import { utils } from "../utils";

/**
 * Create wrapper for explanation items (New version).
 * 
 * @param form  - Either "STYLE" or "VARIABLE"
 * @param items - Explanation items
 * @param title 
 * @param titleSecondary 
 * @param fontName 
 * @param isItemLinkEnabled 
 * @param modes - String array for mode names
 * @returns 
 */
export function createExplanationWrapper(
    lr: CatalogueLocalizationResources,
    form: StyleForm,
    items: FrameNode[],
    title: string,
    titleSecondary: string,
    fontName: FontName,
    // isItemLinkEnabled: boolean = false,
    modes?: string[]
) {
    const dateString = createDateString(lr, true);

    const dateNode = utils.node.createTextNode(dateString, fontName, semanticTokens.fontSize.xsmall, [{ type: "SOLID", color: semanticTokens.text.tertiary }]);
    dateNode.textAlignHorizontal = "RIGHT";

    const titleNode = utils.node.createTextNode(title, fontName, semanticTokens.fontSize.xxlarge);
    const titleSecondaryNode = utils.node.createTextNode(titleSecondary, fontName, semanticTokens.fontSize.base, [{ type: "SOLID", color: semanticTokens.text.secondary }]);

    const titleWrapperContents = [dateNode, titleSecondaryNode, titleNode];

    if (form === "VARIABLE") {
        if (!modes) { throw new Error("Modes are required for variable type."); }
        pushAdditionalContent(lr, modes, fontName, titleWrapperContents)
    }

    const titleWrapper = utils.node.createAutolayoutFrame(titleWrapperContents, semanticTokens.spacing.xsmall, "VERTICAL");
    titleWrapper.name = "Title Wrapper";
    dateNode.layoutSizingHorizontal = "FILL";
    titleNode.layoutSizingHorizontal = "FILL";
    titleSecondaryNode.layoutSizingHorizontal = "FILL";

    const itemsFrame = createItemsFrame(items);
    const wrapperFrame = utils.node.createAutolayoutFrame([titleWrapper, itemsFrame], semanticTokens.spacing.xlarge, "VERTICAL");
    titleWrapper.layoutSizingHorizontal = "FILL";

    utils.node.setPadding(wrapperFrame, {
        top: semanticTokens.padding.xlarge,
        bottom: semanticTokens.padding.xlarge,
        left: semanticTokens.padding.xlarge,
        right: semanticTokens.padding.xlarge,
    });
    wrapperFrame.primaryAxisSizingMode = "AUTO";
    wrapperFrame.counterAxisSizingMode = "FIXED";

    const frameWidth = determineFrameWidth(modes);
    wrapperFrame.resize(frameWidth, wrapperFrame.height);

    items.forEach((item) => {
        item.layoutSizingHorizontal = "FILL";
    });

    wrapperFrame.setRelaunchData(({ updateCatalogueDesc: 'Update description back to styles or variables' }))

    return wrapperFrame;
}

function createDateString(lr: CatalogueLocalizationResources, isItemLinkEnabled: boolean): string {
    const localeFormat = lr.lang === "enUS" ? "western" : "eastern";
    const formattedDate = utils.data.getFormattedDate("fullDateTime", localeFormat);

    let text = lr.module["createdAt"].replace("$TIME$", formattedDate);

    if (isItemLinkEnabled) {
        text += lr.module["crossCatalogueReferenceEnabled"];
    }

    return text;
}

function pushAdditionalContent(
    lr: CatalogueLocalizationResources,
    modes: string[],
    fontName: FontName,
    target: SceneNode[]
) {
    const modesText = modes.length === 1
        ? lr.term["variableModes"].replace("$VALUE$", modes[0])
        : lr.term["variableModes"].replace("$VALUE$", modes.join(", "));

    const modesNode = utils.node.createTextNode(modesText, fontName, semanticTokens.fontSize.base);

    target.push(modesNode);
}

function createItemsFrame(items: FrameNode[]) {
    const itemsFrame = utils.node.createAutolayoutFrame(items, 0, "VERTICAL");
    itemsFrame.name = "Explanation Items";
    itemsFrame.clipsContent = false;
    itemsFrame.layoutSizingHorizontal = "HUG";
    itemsFrame.layoutSizingVertical = "HUG";
    itemsFrame.primaryAxisSizingMode = "AUTO";
    itemsFrame.counterAxisSizingMode = "AUTO";
    itemsFrame.layoutAlign = "STRETCH";

    return itemsFrame;
}

function determineFrameWidth(modes?: string[]): number {
    const basicWidth = 640;

    if (modes && modes.length > 2) {
        const additionalModes = modes.length - 2;
        return basicWidth + Math.ceil(additionalModes / 2) * 160;
    } else {
        return basicWidth;
    }
}

export function setUpWrapper(wrapper: FrameNode, viewport: Vector) {
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