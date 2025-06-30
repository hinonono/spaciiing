import { CatalogueKit } from './index';
import { CatalogueItemDescriptionSchema } from "../../types/CatalogueItemShema";
import * as styledTextSegments from "../styledTextSegments";
import { semanticTokens } from "../tokens";
import { utils } from "../utils";

// 將型錄的描述寫回Figma的原生欄位
export async function writeCatalogueDescBackToFigma(lang: string) {
    const selection = utils.editor.getCurrentSelection();

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

    await utils.editor.loadFont([
        semanticTokens.fontFamily.regular,
        semanticTokens.fontFamily.semiBold
    ]);

    let updatedCount = 0;

    // Process each description node
    for (const node of descriptionNodes) {
        if (node.characters === "(blank)") continue; // Skip empty descriptions

        const catalogueItemSchema = node.getPluginData("catalogue-item-schema");
        const decodedCatalogueItemSchema = JSON.parse(catalogueItemSchema) as CatalogueItemDescriptionSchema;

        if (decodedCatalogueItemSchema.format === "STYLE") {
            const matchingStyle = await CatalogueKit.util.findStyleById(decodedCatalogueItemSchema.id);

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
            const matchingVariable = await CatalogueKit.util.findVariableById(decodedCatalogueItemSchema.id);

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
    const wroteBackDateNode = utils.node.createTextNode(
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
    const lr = CatalogueKit.localizer.createLocalizationResource(lang);
    const format = lr.lang === "enUS" ? "western" : "eastern"

    return lr.module["descriptionUpdatedBack"].replace("$TIME", utils.data.getFormattedDate("fullDateTime", format));
}