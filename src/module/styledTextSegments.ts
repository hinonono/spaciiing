// 模組說明：專門處理figma的文字圖層的 文字裝飾樣式相關屬性
// https://www.figma.com/plugin-docs/api/properties/TextNode-getstyledtextsegments/

/**
 * 獲取該文字節點身上的StyleTextSegment樣式（內部稱為catalogueItemRichStyle）。Retrieves and logs the rich style information of a TextNode.
 *
 * @param {TextNode} node - The TextNode from which to retrieve styled text segments.
 * @returns {ReturnType<TextNode["getStyledTextSegments"]>} - An array of styled text segments.
 *
 * The function retrieves various style properties of the TextNode, including font size, font name,
 * font weight, text decoration, text case, line height, letter spacing, fills, text style ID, fill style ID,
 * list options, indentation, hyperlink, open type features, bound variables, and text style overrides.
 * It then serializes this information to JSON, calculates the size in bytes, and determines the percentage
 * of the 64 KB limit used. The retrieved styles and size information are logged to the console.
 */
export function getNodeCatalogueItemRichStyle(node: TextNode): ReturnType<TextNode["getStyledTextSegments"]> {
    const styledTextSegments = node.getStyledTextSegments([
        "fontSize",
        "fontName",
        "fontWeight",
        "textDecoration",
        "textCase",
        "lineHeight",
        "letterSpacing",
        "fills",
        "textStyleId",
        "fillStyleId",
        "listOptions",
        "indentation",
        "hyperlink",
        "openTypeFeatures",
        "boundVariables",
        "textStyleOverrides",
        "textDecorationStyle", // Added missing properties
        "textDecorationOffset", // Added missing properties
        "textDecorationThickness", // Added missing properties
        "textDecorationColor", // Added missing properties
        "textDecorationSkipInk",
        "listSpacing",
        "paragraphIndent",
        "paragraphSpacing"
    ]);

    // Serialize to JSON
    const jsonString = JSON.stringify(styledTextSegments);

    // Calculate size in bytes
    const sizeInBytes = jsonString.length;

    // Calculate the percentage of 64 KB limit used
    const percentageOfLimit = (sizeInBytes / 65536) * 100;

    // Log the retrieved styles and size information
    console.log("Styled Text Segments:", styledTextSegments);
    console.log(`Number of segments: ${styledTextSegments.length}`);
    console.log(`Estimated size: ${sizeInBytes} bytes`);
    console.log(`Percentage of 64KB limit used: ${percentageOfLimit.toFixed(2)}%`);

    return styledTextSegments;
}

/**
 * Writes the rich style information of a TextNode to the current page's plugin data.
 *
 * @param {string} id - The identifier for the catalogue item rich style.
 * @param {ReturnType<TextNode["getStyledTextSegments"]>} styles - The styled text segments to be saved.
 * @throws {Error} - Throws an error if the size of the encoded styles exceeds the 64 KB limit.
 *
 * The function serializes the styled text segments to a JSON string and checks its size.
 * If the size exceeds 64 KB, it throws an error. Otherwise, it saves the serialized styles
 * to the current page's plugin data using the key format `catalogue-item-rich-style_${id}`.
 */
export function writeCatalogueItemRichStyleToRoot(id: string, styles: ReturnType<TextNode["getStyledTextSegments"]>) {
    const encodedStyles = JSON.stringify(styles);

    if (encodedStyles.length > 65536) {
        throw new Error("The size of the encoded styles exceeds the 64 KB limit.");
    }

    figma.root.setPluginData(`catalogue-item-rich-style_${id}`, encodedStyles);
}

/**
 * Retrieves the rich style information of a TextNode from the current page's plugin data.
 *
 * @param {string} id - The identifier for the catalogue item rich style.
 * @returns {ReturnType<TextNode["getStyledTextSegments"]> | null} - The styled text segments if found, otherwise null.
 *
 * The function retrieves the plugin data associated with the given ID from the current page.
 * The key format used in getPluginData is `catalogue-item-rich-style_${id}`.
 * If the data exists, it parses the JSON string into an array of styled text segments and returns it.
 * If the data does not exist, it returns null.
 */
export function getCatalogueItemRichStyleFromRoot(id: string): ReturnType<TextNode["getStyledTextSegments"]> | null {
    const styles = figma.root.getPluginData(`catalogue-item-rich-style_${id}`);

    if (styles) {
        const decodedStyle = JSON.parse(styles) as ReturnType<TextNode["getStyledTextSegments"]>;
        return decodedStyle;
    } else {
        return null;
    }
}

/**
 * Applies the rich style information to a TextNode.
 *
 * @param {TextNode} node - The TextNode to which the styles will be applied.
 * @param {ReturnType<TextNode["getStyledTextSegments"]>} styles - The styled text segments to be applied.
 *
 * The function first collects all unique fonts from the styles and loads them asynchronously.
 * It then iterates over each style segment and applies the corresponding styles to the specified
 * range within the TextNode. Supported styles include font size, font name, text decoration, text case,
 * line height, letter spacing, fills, text style ID, fill style ID, list options, indentation, and hyperlink.
 * Note that some properties like openTypeFeatures, boundVariables, and textStyleOverrides are not directly
 * supported by the Figma API and are commented out.
 */
export async function applyCatalogueItemRichStyle(node: TextNode, styles: ReturnType<TextNode["getStyledTextSegments"]>) {
    // Collect unique fonts from the styles
    const uniqueFonts = new Set<FontName>();

    styles.forEach((segment) => {
        if (segment.fontName) {
            uniqueFonts.add(segment.fontName);
        }
    });

    // Load all unique fonts asynchronously
    for (const font of uniqueFonts) {
        await figma.loadFontAsync(font);
    }

    styles.forEach((segment) => {
        const { start, end } = segment;

        if (segment.fontSize) {
            node.setRangeFontSize(start, end, segment.fontSize);
        }
        if (segment.fontName) {
            node.setRangeFontName(start, end, segment.fontName);
        }
        if (segment.textDecoration) {
            node.setRangeTextDecoration(start, end, segment.textDecoration);
        }
        if (segment.textCase) {
            node.setRangeTextCase(start, end, segment.textCase);
        }
        if (segment.lineHeight) {
            node.setRangeLineHeight(start, end, segment.lineHeight);
        }
        if (segment.letterSpacing) {
            node.setRangeLetterSpacing(start, end, segment.letterSpacing);
        }
        if (segment.fills) {
            node.setRangeFills(start, end, segment.fills);
        }
        if (segment.textStyleId) {
            node.setRangeTextStyleId(start, end, segment.textStyleId);
        }
        if (segment.fillStyleId) {
            node.setRangeFillStyleId(start, end, segment.fillStyleId);
        }
        if (segment.listOptions) {
            node.setRangeListOptions(start, end, segment.listOptions);
        }
        if (segment.indentation) {
            node.setRangeIndentation(start, end, segment.indentation);
        }
        if (segment.hyperlink) {
            node.setRangeHyperlink(start, end, segment.hyperlink);
        }
        // if (segment.openTypeFeatures) {
        //     console.warn("openTypeFeatures is present but Figma API does not support applying it directly.");
        // }
        // if (segment.boundVariables) {
        //     node.setRangeBoundVariable(start, end, segment.boundVariables);
        // }
        // if (segment.textStyleOverrides) {
        //     console.warn("textStyleOverrides is present but Figma API does not support applying it directly.");
        // }
    });

}

/**
 * Write the variable's corresponding explanation item id into figma.root under `catalogue-item-url_${variableId}`.
 * @param variableId 
 * @param explanationItemId 
 */
export function writeCatalogueItemId(variableId: string, explanationItemId: string) {
    figma.root.setPluginData(`catalogue-item-url_${variableId}`, explanationItemId);
}

export function getCatalogueItemId(id: string): string | null {
    return figma.root.getPluginData(`catalogue-item-url_${id}`) || null;
}