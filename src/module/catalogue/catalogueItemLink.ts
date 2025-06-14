import { CatalogueItemDescriptionSchema } from "../../types/CatalogueItemShema";
import * as util from "../util";
import * as CLUtil from "./catalogueUtil";
import * as styledTextSegments from "../styledTextSegments";
import { semanticTokens } from "../tokens";
import { createCatalogueLocalizationResource } from "./catalogueLocalization";

// 檢查是否啟用cataloge item link功能
// 啟用的話，當產生型錄物件時，可以透過alias物件來連結回參照的物件那裡
export function checkCatalogueItemLinkFeatureAvailability(): { availability: boolean, url: string | null } {
    //是否啟用cataloge item link功能
    const editorPreference = util.readEditorPreference();

    if (editorPreference.exampleFileUrl) {
        return { availability: true, url: editorPreference.exampleFileUrl };
    } else {
        return { availability: false, url: null };
    }
}

// 將型錄的描述寫回Figma的原生欄位
export async function writeCatalogueDescBackToFigma(lang: string) {
    const selection = util.getCurrentSelection();

    if (selection.length !== 1) {
        figma.notify("❌ Please select only one catalogue frame.");
        throw new Error("Please select only one catalogue frame.");
    }

    if (selection[0].type !== "FRAME") {
        figma.notify("❌ Please select a frame.");
        throw new Error("Please select a frame.");
    }

    const catalogueFrame = selection[0] as FrameNode;

    const titleWrapper = catalogueFrame.findOne(node => node.name === "Title Wrapper");
    if (!titleWrapper || titleWrapper.type !== "FRAME" || !titleWrapper.layoutMode) {
        figma.notify("❌ Title Wrapper not found. Please try to regenerate catalogue again.");
        throw new Error("Title Wrapper is not an AutoLayout frame.");
    }

    const descriptionNodes = catalogueFrame.findAllWithCriteria({
        types: ['TEXT'],
    }).filter(node => node.getPluginData("catalogue-item-schema"));

    if (descriptionNodes.length === 0) {
        figma.notify("❌ No description nodes found.");
        throw new Error("No description nodes found.");
    }

    const fontsToLoad = [
        { family: "Inter", style: "Regular" },
        { family: "Inter", style: "Semi Bold" },
    ];
    await Promise.all(fontsToLoad.map(font => figma.loadFontAsync(font)));

    let updatedCount = 0;

    // Process each description node
    for (const node of descriptionNodes) {
        if (node.characters === "(blank)") continue; // Skip empty descriptions

        const catalogueItemSchema = node.getPluginData("catalogue-item-schema");
        const decodedCatalogueItemSchema = JSON.parse(catalogueItemSchema) as CatalogueItemDescriptionSchema;

        if (decodedCatalogueItemSchema.format === "STYLE") {
            const matchingStyle = await CLUtil.findStyleById(decodedCatalogueItemSchema.id);

            if (!matchingStyle) {
                figma.notify(`❌ Style with ID ${decodedCatalogueItemSchema.id} not found.`);
                continue;
            }

            // Update the style description with the text content of the node
            matchingStyle.description = (node as TextNode).characters;

            const richStyle = styledTextSegments.getNodeCatalogueItemRichStyle(node);
            styledTextSegments.writeCatalogueItemRichStyleToRoot(decodedCatalogueItemSchema.id, richStyle);

            updatedCount++;
        } else if (decodedCatalogueItemSchema.format === "VARIABLE") {
            const matchingVariable = await CLUtil.findVariableById(decodedCatalogueItemSchema.id);

            if (!matchingVariable) {
                figma.notify(`❌ Variable with ID ${decodedCatalogueItemSchema.id} not found.`);
                continue;
            }

            // Update the variable description with the text content of the node
            matchingVariable.description = (node as TextNode).characters;

            const richStyle = styledTextSegments.getNodeCatalogueItemRichStyle(node);
            styledTextSegments.writeCatalogueItemRichStyleToRoot(decodedCatalogueItemSchema.id, richStyle);

            updatedCount++;
        } else {
            figma.notify(`❌ Unsupported format: ${decodedCatalogueItemSchema.format}`);
        }
    }

    const dateString = createUpdatedString(lang);
    const wroteBackDateNode = util.createTextNode(
        dateString,
        { family: "Inter", style: "Semi Bold" },
        semanticTokens.fontSize.xsmall,
        [{ type: "SOLID", color: semanticTokens.text.tertiary }]
    );

    titleWrapper.insertChild(0, wroteBackDateNode);
    titleWrapper.children.forEach((element) => {
        if ("layoutSizingHorizontal" in element) {
            element.layoutSizingHorizontal = "FILL";
        }
    });

    wroteBackDateNode.textAlignHorizontal = "RIGHT";

    figma.notify(`✅ ${updatedCount} styles/variables have been updated successfully.`);
}

function createUpdatedString(lang: string) {
    const lr = createCatalogueLocalizationResource(lang);
    const format = lr.lang === "enUS" ? "western" : "eastern"

    return lr.module["descriptionUpdatedBack"].replace("$TIME", util.getFormattedDate("fullDateTime", format));
}