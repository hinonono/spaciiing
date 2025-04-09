// 2025-04-09
// V25: 重構原先 explanation.ts 裡頭已經混亂得不得了的func

import { StyleForm } from "../../types/Messages/MessageStyleIntroducer";
import * as util from "../util";
import * as STS from "../styledTextSegments";
import { semanticTokens } from "../tokens";
import { CatalogueItemDescriptionSchema } from "../../types/CatalogueItemShema";

/**
 * Create a explanation item (New version).
 * 
 * @param form - Either "STYLE" or "VARIABLE"
 * @param referId - The style's or variable's id which this explantion item is refer to
 * @param title
 * @param description 
 */
function createExplanationItem(
    form: StyleForm,
    referId: string,
    title: string,
    description: string,
    fontName: FontName
) {
    const titleNode = createTitle(title, fontName);
    const descNode = createDescription(description, fontName);

    setItemSchema(form, referId, descNode);
    checkAndApplyRichStyle(referId, descNode);
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