import { CatalogueKit } from '../index';
import { PreviewResources, StyleForm, StyleMode } from "../../../types/Messages/MessageStyleIntroducer";
import { semanticTokens } from "../../tokens";
import { utils } from "../../utils";

export function createPreviewHandler(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    previewResources: PreviewResources,
) {
    if (styleMode === "COLOR") {
        if (!previewResources.colors) { throw new Error("Color is required for creating preview."); }

        if (previewResources.colors.type === "SOLID") {
            if (!previewResources.colors.colors) { throw new Error("Unable to create preview due to previewResources.colors.colors is undefined."); }
            return createPreviewForColor(form, previewResources.colors.colors);
        } else {
            if (!previewResources.colors.gradientStops || !previewResources.colors.gradientTransform) { throw new Error("Unable to create preview due to previewResources.colors.gradientStops or previewResources.colors.gradientTransform is undefined."); }
            return createPreviewForGradient(form, previewResources.colors.opacity, previewResources.colors.type, previewResources.colors.gradientTransform, previewResources.colors.gradientStops);
        }

    } else if (styleMode === "EFFECT") {
        if (!previewResources.effects) { throw new Error("Effect is required for creating preview."); }
        return createPreviewForEffect(form, previewResources.effects);

    } else if (styleMode === "FLOAT") {
        if (!previewResources.numbers) { throw new Error("Number is required for creating preview."); }
        return createPreviewForNumber(form, fontName, previewResources.numbers);

    } else {
        return null;
    }
}

function createPreviewForGradient(
    form: StyleForm,
    opacity: number,
    gradientType: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND",
    transform: Transform[],
    stops: ColorStop[][],
) {
    const colorFrames: FrameNode[] = [];

    for (let i = 0; i < stops.length; i++) {
        const colorFrame = CatalogueKit.explanationItemKit.preview.createGradientFrame(gradientType, transform[i], stops[i], opacity);

        if (form === "STYLE") {
            colorFrame.cornerRadius = semanticTokens.cornerRadius.infinite;
        }
        colorFrames.push(colorFrame);
    }

    // 將色塊們包裝入一個AutolayoutFrame中
    const wrapper = utils.node.createAutolayoutFrame(
        colorFrames,
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
    );
    wrapper.name = "Colors Wrapper";

    return wrapper;
}

function createPreviewForColor(
    form: StyleForm,
    colors: RGBA[],
) {
    const colorFrames: FrameNode[] = [];
    colors.forEach((color) => {
        const colorFrame = CatalogueKit.explanationItemKit.preview.createColorFrame(color);

        if (form === "STYLE") {
            colorFrame.cornerRadius = semanticTokens.cornerRadius.infinite;
        }
        colorFrames.push(colorFrame);
    });

    // 將色塊們包裝入一個AutolayoutFrame中
    const wrapper = utils.node.createAutolayoutFrame(
        colorFrames,
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
    );
    wrapper.name = "Colors Wrapper";

    return wrapper;
}

function createPreviewForEffect(
    form: StyleForm,
    effects: Effect[],
) {
    const effectFrame = CatalogueKit.explanationItemKit.preview.createEffectFrame(effects);

    // 將色塊們包裝入一個AutolayoutFrame中
    const wrapper = utils.node.createAutolayoutFrame(
        [effectFrame],
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
    );
    wrapper.name = "Effects Wrapper";
    wrapper.clipsContent = false

    return wrapper;
}

function createPreviewForNumber(
    form: StyleForm,
    fontName: FontName,
    numbers: number[],
) {
    const numberFrames: FrameNode[] = [];
    numbers.forEach((number) => {
        const numberFrame = CatalogueKit.explanationItemKit.preview.createNumberFrame(number, { family: fontName.family, style: "Semi Bold" });
        numberFrames.push(numberFrame);
    });

    // 將數字框框們包裝入一個AutolayoutFrame中
    const wrapper = utils.node.createAutolayoutFrame(
        numberFrames,
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
    );
    wrapper.name = "Numbers Wrapper";

    return wrapper;
}

function createFundamentalFrame(name: string): FrameNode {
    const frame = figma.createFrame();
    frame.resize(64, 64);
    frame.name = name;
    frame.cornerRadius = semanticTokens.cornerRadius.small;

    return frame;
}

export function createGradientFrame(
    gradientType: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND",
    transform: Transform,
    stops: ColorStop[],
    opacity: number,
): FrameNode {
    const colorFrame = createFundamentalFrame("Swatch");

    const gradientPaint: GradientPaint = {
        type: gradientType,
        gradientTransform: transform,
        gradientStops: stops,
        visible: true,
        opacity: opacity
    };

    colorFrame.fills = [gradientPaint];

    return colorFrame;
}

export function createColorFrame(color: RGBA): FrameNode {
    const colorFrame = createFundamentalFrame("Swatch");
    const newPaint = figma.util.solidPaint(color);
    colorFrame.fills = [newPaint];

    if (utils.color.isWhite(color)) {
        colorFrame.strokes = [{ type: "SOLID", color: semanticTokens.strokeColor }];
        colorFrame.strokeWeight = 1;
    }

    return colorFrame;
}



export function createEffectFrame(effects: Effect[]): FrameNode {
    const effectFrame = createFundamentalFrame("Effect");
    effectFrame.fills = [
        { type: "SOLID", color: semanticTokens.background.primary },
    ];
    effectFrame.effects = effects.map(utils.editor.stripBoundVariables);

    return effectFrame;
}

export function createNumberFrame(number: number, fontName: FontName): FrameNode {
    let limitedNumber: string;

    if (Number.isInteger(number)) {
        limitedNumber = number.toString(); // Keep whole numbers as they are
    } else {
        limitedNumber = number.toFixed(2); // Limit to 2 decimal places for non-integers
    }

    const numberTextNode = utils.node.createTextNode(
        limitedNumber,
        fontName,
        semanticTokens.fontSize.base,
        [{ type: "SOLID", color: semanticTokens.text.secondary }]
    );

    numberTextNode.lineHeight = {
        value: semanticTokens.fontSize.base,
        unit: "PIXELS",
    };
    numberTextNode.textAlignHorizontal = "CENTER";

    // Create the frame
    const numberFrame = createFundamentalFrame("Number");
    numberFrame.fills = [{ type: "SOLID", color: semanticTokens.background.primary }];
    utils.node.setStroke(numberFrame, semanticTokens.strokeColor, { top: 1, bottom: 1, left: 1, right: 1 });

    // Set layout mode for centering
    numberFrame.layoutMode = "VERTICAL"; // Vertical stack layout
    numberFrame.primaryAxisAlignItems = "CENTER"; // Center horizontally
    numberFrame.counterAxisAlignItems = "CENTER"; // Center vertically

    utils.node.setPadding(numberFrame, { top: 0, bottom: 0, left: 0, right: 0 });
    numberFrame.resize(64, 48);

    // Add the text node to the frame
    numberFrame.appendChild(numberTextNode);

    return numberFrame;
}
