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

export function writeCatalogueItemRichStyleToPage(id: string, style: ReturnType<TextNode["getStyledTextSegments"]>) {
    const encodedStyle = JSON.stringify(style);

    if (encodedStyle.length > 65536) {
        throw new Error("The size of the encoded style exceeds the 64 KB limit.");
    }

    figma.currentPage.setPluginData(`catalogue-item-rich-style_${id}`, encodedStyle);
}

export function getCatalogueItemRichStyleFromPage(id: string): ReturnType<TextNode["getStyledTextSegments"]> | null {
    const style = figma.currentPage.getPluginData(`catalogue-item-rich-style_${id}`);

    if (style) {
        const decodedStyle = JSON.parse(style) as ReturnType<TextNode["getStyledTextSegments"]>;
        return decodedStyle;
    } else {
        return null;
    }
}

export function applyCatalogueItemRichStyle(node: TextNode, style: ReturnType<TextNode["getStyledTextSegments"]>) {
    if ("fontName" in style) {
        
    }

}