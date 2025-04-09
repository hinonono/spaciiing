import { PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import { semanticTokens } from "../tokens";
import * as util from "../util";
import { createColorFrame, createEffectFrame, createNumberFrame } from "../explanation";

export function createPreviewHandler(
    form: StyleForm,
    styleMode: StyleMode,
    explanationTextsWrapperNode: FrameNode,
    fontName: FontName,
    previewResources: PreviewResources,
) {
    if (styleMode === "COLOR") {
        if (!previewResources.colors) { throw new Error("Color is required for creating preview."); }
        createPreviewForColor(form, explanationTextsWrapperNode, previewResources.colors);

    } else if (styleMode === "EFFECT") {
        if (!previewResources.effects) { throw new Error("Effect is required for creating preview."); }
        createPreviewForEffect(form, explanationTextsWrapperNode, previewResources.effects);

    } else if (styleMode === "FLOAT") {
        if (!previewResources.numbers) { throw new Error("Number is required for creating preview."); }
        createPreviewForNumber(form, explanationTextsWrapperNode, fontName, previewResources.numbers);

    } else {
        createPreviewForDefault(explanationTextsWrapperNode);
    }
}

function createPreviewForColor(
    form: StyleForm,
    explanationTextsWrapperNode: FrameNode,
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

    const item = util.createAutolayoutFrame(
        [swatchesWrapper, explanationTextsWrapperNode],
        semanticTokens.spacing.base,
        "HORIZONTAL"
    );

    swatchesWrapper.layoutSizingHorizontal = "HUG";
    swatchesWrapper.layoutSizingVertical = "HUG";

    // explanationItemWrapperNode = item;
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
    previewFinalSetUp(item);
}

function createPreviewForEffect(
    form: StyleForm,
    explanationTextsWrapperNode: FrameNode,
    effects: Effect[],
) {
    const effectFrame = createEffectFrame(effects);

    const item = util.createAutolayoutFrame(
        [effectFrame, explanationTextsWrapperNode],
        semanticTokens.spacing.base,
        "HORIZONTAL"
    );

    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
    previewFinalSetUp(item);
}

function createPreviewForNumber(
    form: StyleForm,
    explanationTextsWrapperNode: FrameNode,
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

    const item = util.createAutolayoutFrame(
        [swatchesWrapper, explanationTextsWrapperNode],
        semanticTokens.spacing.base,
        "HORIZONTAL"
    );

    swatchesWrapper.layoutSizingHorizontal = "HUG";
    swatchesWrapper.layoutSizingVertical = "HUG";

    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
    previewFinalSetUp(item);
}

function createPreviewForDefault(
    explanationTextsWrapperNode: FrameNode,
) {
    const item = util.createAutolayoutFrame(
        [explanationTextsWrapperNode],
        0,
        "VERTICAL"
    );
    explanationTextsWrapperNode.layoutSizingHorizontal = "FILL";
    previewFinalSetUp(item);
}

function previewFinalSetUp(target: FrameNode) {
    // target = explanationItemWrapperNode

    target.name = `Explanation Item`;
    target.clipsContent = false;

    // Set height to hug content
    target.primaryAxisSizingMode = "AUTO";

    util.setPadding(target, {
        top: semanticTokens.padding.large,
        bottom: semanticTokens.padding.large,
        left: semanticTokens.padding.xsmall,
        right: semanticTokens.padding.xsmall,
    });

    // Set border properties for top edge only
    util.setStroke(target, semanticTokens.dividerColor, {
        top: 1,
        bottom: 0,
        left: 0,
        right: 0,
    });

    // Center items to the top
    target.counterAxisAlignItems = "MIN";

    return target;
}