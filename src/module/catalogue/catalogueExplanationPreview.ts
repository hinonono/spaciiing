import { PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import { semanticTokens } from "../tokens";
import * as util from "../util";
import { utils } from "../utils";
import { createColorFrame, createEffectFrame, createGradientFrame, createNumberFrame } from "./cataloguePreview";

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
        const colorFrame = createGradientFrame(gradientType, transform[i], stops[i], opacity);

        if (form === "STYLE") {
            colorFrame.cornerRadius = semanticTokens.cornerRadius.infinite;
        } else {
            colorFrame.cornerRadius = semanticTokens.cornerRadius.small;
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
        const colorFrame = createColorFrame(color);

        if (form === "STYLE") {
            colorFrame.cornerRadius = semanticTokens.cornerRadius.infinite;
        } else {
            colorFrame.cornerRadius = semanticTokens.cornerRadius.small;
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
    const effectFrame = createEffectFrame(effects);

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
        const numberFrame = createNumberFrame(number, { family: fontName.family, style: "Semi Bold" });
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