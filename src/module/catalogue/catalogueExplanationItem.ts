// 2025-04-09
// V25: 重構原先 explanation.ts 裡頭已經混亂得不得了的func

import { AliasResources, PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import * as util from "../util";
import * as STS from "../styledTextSegments";
import { semanticTokens } from "../tokens";
import { CatalogueItemDescriptionSchema } from "../../types/CatalogueItemShema";
import * as CLExplanationInfo from "./catalogueExplanationInfo"
import * as CLExplanationPreview from "./catalogueExplanationPreview"
import { CatalogueLocalizationResources } from "../../types/CatalogueLocalization";


/**
 * Create a explanation item (New version).
 * 
 * @param form - Either "STYLE" or "VARIABLE"
 * @param referId - The style's or variable's id which this explantion item is refer to
 * @param title
 * @param description 
 * @param fontName 
 * @param previewResouces - Required resources for different styles or variables. 
 * @param aliasResources  - Required resources for showing variables alias related data.
 */
export function createExplanationItem(
    form: StyleForm,
    styleMode: StyleMode,
    referId: string,
    title: string,
    description: string,
    fontName: FontName,
    previewResouces: PreviewResources,
    aliasResources: AliasResources,
    lr: CatalogueLocalizationResources,
) {
    const titleNode = createTitle(title, fontName);
    const descNode = createDescription(description, fontName);

    setItemSchema(form, referId, descNode);
    checkAndApplyRichStyle(referId, descNode);

    // 建立右側資訊區的內容
    const titleWrapperContents: SceneNode[] = [titleNode];
    CLExplanationInfo.pushInfoAreaAdditionalContent(form, styleMode, fontName, previewResouces, aliasResources, lr, titleWrapperContents)
    const explanationTextsWrapperNode = CLExplanationInfo.setUpInfoWrapperLayout(styleMode, titleWrapperContents, titleNode, descNode)

    // 建立左側預覽區的內容
    const preview = CLExplanationPreview.createPreviewHandler(form, styleMode, fontName, previewResouces);
    const array = preview === null ? [explanationTextsWrapperNode] : [preview, explanationTextsWrapperNode]

    const result = util.createAutolayoutFrame(
        array,
        semanticTokens.spacing.base,
        "HORIZONTAL"
    );

    if (preview) {
        preview.layoutSizingHorizontal = "HUG";
        preview.layoutSizingVertical = "HUG";
    }

    // explanationItemWrapperNode = item;
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
    return finalSetUp(result);
}

function createTitle(
    content: string, fontName: FontName
): TextNode {
    const { family } = fontName;
    const node = util.createTextNode(
        content,
        { family: family, style: "Semi Bold" },
        semanticTokens.fontSize.large
    );

    return node;
}

function createDescription(
    content: string, fontName: FontName
): TextNode {
    const node = util.createTextNode(
        content == "" ? "(blank)" : content,
        fontName,
        semanticTokens.fontSize.small,
        [{ type: "SOLID", color: semanticTokens.text.secondary }],
        { unit: "PERCENT", value: 150 }
    );
    node.name = "Catalogue Description";

    return node;
}

function setItemSchema(form: StyleForm, referId: string, targetNode: SceneNode) {
    const schema: CatalogueItemDescriptionSchema = {
        format: form,
        id: referId,
    }

    // 將該descriptionNode所連結至的style/variable的id存入其自身的pluginData中
    targetNode.setPluginData("catalogue-item-schema", JSON.stringify(schema));
}

function checkAndApplyRichStyle(referId: string, targetNode: TextNode) {
    const richStyle = STS.getCatalogueItemRichStyleFromRoot(referId);
    if (richStyle) {
        STS.applyCatalogueItemRichStyle(targetNode, richStyle);
    }
}

function finalSetUp(target: FrameNode) {
    // target = explanationItemWrapperNode

    target.name = `Explanation Item`;
    target.clipsContent = false;

    // Set height to hug content
    target.primaryAxisSizingMode = "AUTO";

    util.setPadding(target, {
        top: semanticTokens.padding.large,
        bottom: semanticTokens.padding.large,
        left: semanticTokens.padding.xsmall,
        right: semanticTokens.padding.xsmall,
    });

    // Set border properties for top edge only
    util.setStroke(target, semanticTokens.dividerColor, {
        top: 1,
        bottom: 0,
        left: 0,
        right: 0,
    });

    // Center items to the top
    target.counterAxisAlignItems = "MIN";

    return target;
}