// 2025-04-09
// V25: 重構原先 explanation.ts 裡頭已經混亂得不得了的func

import { AliasResources, PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import * as util from "../util";
import * as STS from "../styledTextSegments";
import { semanticTokens } from "../tokens";
import { CatalogueItemDescriptionSchema } from "../../types/CatalogueItemShema";
import * as CLExplanationInfo from "./catalogueExplanationInfo"


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
    styleMode: StyleMode,
    referId: string,
    title: string,
    description: string,
    fontName: FontName,
    previewResouces: PreviewResources,
    aliasResources: AliasResources
) {
    const titleNode = createTitle(title, fontName);
    const descNode = createDescription(description, fontName);

    setItemSchema(form, referId, descNode);
    checkAndApplyRichStyle(referId, descNode);

    // 建立右側資訊區的內容
    const titleWrapperContents: SceneNode[] = [titleNode];
    pushInfoAreaAdditionalContent(form, styleMode, fontName, previewResouces, aliasResources, titleWrapperContents)
    CLExplanationInfo.setUpInfoWrapperLayout(titleWrapperContents, titleNode, descNode)

    // 建立左側預覽區的內容


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

function pushInfoAreaAdditionalContent(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    previewResouces: PreviewResources,
    aliasResources: AliasResources,
    target: SceneNode[]
) {
    if (styleMode === "COLOR") {
        if (!previewResouces.colors) { throw new Error("Colors is required for this style mode.") }
        const items = CLExplanationInfo.createPropertiesForColor(
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
        const items = CLExplanationInfo.createPropertiesForNumber(
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
        const items = CLExplanationInfo.createPropertiesForText(form, fontName, previewResouces.textStyle);
        target.push(...items);

    } else if (styleMode === "EFFECT") {
        if (!previewResouces.effects) { throw new Error("Missing effect style."); }
        const items = CLExplanationInfo.createPropertiesForEffect(form, fontName, previewResouces.effects);
        target.push(...items);

    } else if (styleMode === "STRING") {
        if (!previewResouces.strings) { throw new Error("Strings is required for number type."); }
        const items = CLExplanationInfo.createPropertiesForString(
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

