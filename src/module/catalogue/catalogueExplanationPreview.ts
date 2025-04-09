import { PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import { semanticTokens } from "../tokens";
import * as util from "../util";
import { createColorFrame, createEffectFrame, createNumberFrame } from "../explanation";

export function createPreviewHandler(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    previewResources: PreviewResources,
) {
    if (styleMode === "COLOR") {
        if (!previewResources.colors) { throw new Error("Color is required for creating preview."); }
        return createPreviewForColor(form, previewResources.colors);

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
    const swatchesWrapper = util.createAutolayoutFrame(
        colorFrames,
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
    );
    swatchesWrapper.name = "Swatches Wrapper";

    return swatchesWrapper;

    // const item = util.createAutolayoutFrame(
    //     [swatchesWrapper, explanationTextsWrapperNode],
    //     semanticTokens.spacing.base,
    //     "HORIZONTAL"
    // );

    // swatchesWrapper.layoutSizingHorizontal = "HUG";
    // swatchesWrapper.layoutSizingVertical = "HUG";

    // // explanationItemWrapperNode = item;
    // explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
    // previewFinalSetUp(item);
}

function createPreviewForEffect(
    form: StyleForm,
    effects: Effect[],
) {
    const effectFrame = createEffectFrame(effects);
    return effectFrame;

    // const item = util.createAutolayoutFrame(
    //     [effectFrame, explanationTextsWrapperNode],
    //     semanticTokens.spacing.base,
    //     "HORIZONTAL"
    // );

    // explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
    // previewFinalSetUp(item);
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
    const swatchesWrapper = util.createAutolayoutFrame(
        numberFrames,
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
    );
    swatchesWrapper.name = "Numbers Wrapper";

    return swatchesWrapper;

    // const item = util.createAutolayoutFrame(
    //     [swatchesWrapper, explanationTextsWrapperNode],
    //     semanticTokens.spacing.base,
    //     "HORIZONTAL"
    // );

    // swatchesWrapper.layoutSizingHorizontal = "HUG";
    // swatchesWrapper.layoutSizingVertical = "HUG";

    // explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
    // previewFinalSetUp(item);
}