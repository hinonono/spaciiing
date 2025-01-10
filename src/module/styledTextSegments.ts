// 模組說明：專門處理figma的文字圖層的 文字裝飾樣式相關屬性
// https://www.figma.com/plugin-docs/api/properties/TextNode-getstyledtextsegments/

// 取得文字圖層的文字裝飾樣式
export function getCatalogueItemRichStyle(node: TextNode): ReturnType<TextNode["getStyledTextSegments"]> {
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

export function writeCatalogueItemRichStyleToPage(id: string, styles: ReturnType<TextNode["getStyledTextSegments"]>) {
    const encodedStyles = JSON.stringify(styles);

    if (encodedStyles.length > 65536) {
        throw new Error("The size of the encoded styles exceeds the 64 KB limit.");
    }

    figma.currentPage.setPluginData(`catalogue-item-rich-style_${id}`, encodedStyles);
}

export function getCatalogueItemRichStyleFromPage(id: string): ReturnType<TextNode["getStyledTextSegments"]> | null {
    const styles = figma.currentPage.getPluginData(`catalogue-item-rich-style_${id}`);

    if (styles) {
        const decodedStyle = JSON.parse(styles) as ReturnType<TextNode["getStyledTextSegments"]>;
        return decodedStyle;
    } else {
        return null;
    }
}

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