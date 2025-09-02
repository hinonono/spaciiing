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
export async function create(
    lr: CatalogueLocalizationResources,
    form: StyleForm,
    items: FrameNode[],
    title: string,
    titleSecondary: string,
    fontName: FontName,
    modes?: string[]
) {
    const freeUserBanner = await createFreeUserBanner(fontName, lr);

    const dateString = createDateString(lr);
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
    const wrapperFrame = utils.node.createAutolayoutFrame(
        [
            ...(freeUserBanner ? [freeUserBanner] : []),
            titleWrapper,
            itemsFrame,
        ],
        semanticTokens.spacing.xlarge,
        "VERTICAL"
    );
    titleWrapper.layoutSizingHorizontal = "FILL";

    if (freeUserBanner) {
        freeUserBanner.layoutSizingHorizontal = "FILL";
        freeUserBanner.layoutSizingVertical = "HUG";
    }

    utils.node.setPadding(wrapperFrame, {
        top: semanticTokens.padding.xlarge,
        bottom: semanticTokens.padding.xlarge,
        left: semanticTokens.padding.xlarge,
        right: semanticTokens.padding.xlarge,
    });

    const frameWidth = determineFrameWidth(modes);
    wrapperFrame.resize(frameWidth, wrapperFrame.height);

    items.forEach((item) => {
        item.layoutSizingHorizontal = "FILL";
    });

    wrapperFrame.setRelaunchData(({ [utils.relaunchCommand.updateCatalogueDesc.name]: utils.relaunchCommand.updateCatalogueDesc.desc }))

    const viewport = utils.editor.getCurrentViewport();
    wrapperFrame.fills = [
        {
            type: "SOLID",
            color: semanticTokens.background.primary,
        },
    ];

    wrapperFrame.name = `Catalogue`;

    wrapperFrame.cornerRadius = 16;
    wrapperFrame.primaryAxisSizingMode = "AUTO";
    wrapperFrame.counterAxisSizingMode = "FIXED";

    wrapperFrame.x = viewport.x;
    wrapperFrame.y = viewport.y;

    return wrapperFrame;
}

function createDateString(
    lr: CatalogueLocalizationResources,
): string {
    const localeFormat = lr.lang === "enUS" ? "western" : "eastern";
    const formattedDate = utils.data.getFormattedDate("fullDateTime", localeFormat);
    let text = lr.module["createdAt"].replace("$TIME$", formattedDate);
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

async function createFreeUserBanner(fontName: FontName, lr: CatalogueLocalizationResources): Promise<FrameNode | null> {
    const userTier = await utils.license.getUserTier();

    // 當為免費用戶時，製作宣導訂閱Banner於型錄中
    if (userTier === "FREE") {
        const freeUserBannerTextNode = utils.node.createTextNode(lr.module["freeUserSubscribeEncourage"], fontName, semanticTokens.fontSize.small, [{ type: "SOLID", color: semanticTokens.text.white }]);
        freeUserBannerTextNode.lineHeight = { unit: "PERCENT", value: 150 };
        freeUserBannerTextNode.hyperlink = { type: "URL", value: "https://hsiehchengyi.gumroad.com/l/spaciiing-pro" };

        const freeUserBanner = utils.node.createAutolayoutFrame([freeUserBannerTextNode], 0, "HORIZONTAL");
        freeUserBanner.name = "Please consider to upgrade";
        freeUserBanner.fills = [{ type: "SOLID", color: semanticTokens.backgroundSpecial.primary }];
        utils.node.setPadding(freeUserBanner, {
            top: semanticTokens.padding.large,
            bottom: semanticTokens.padding.large,
            left: semanticTokens.padding.large,
            right: semanticTokens.padding.large,
        });
        freeUserBanner.cornerRadius = semanticTokens.cornerRadius.xsmall;
        freeUserBannerTextNode.layoutSizingHorizontal = "FILL";
        freeUserBannerTextNode.layoutSizingVertical = "FILL";
        freeUserBannerTextNode.textAlignVertical = "CENTER";

        return freeUserBanner;
    } else {
        return null;
    }
}