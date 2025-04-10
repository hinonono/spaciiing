import { PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import { semanticTokens } from "../tokens";
import * as util from "../util";
import { createColorFrame, createEffectFrame, createNumberFrame } from "./cataloguePreview";

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
    const wrapper = util.createAutolayoutFrame(
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
    const wrapper = util.createAutolayoutFrame(
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
    const wrapper = util.createAutolayoutFrame(
        numberFrames,
        semanticTokens.spacing.xsmall,
        "HORIZONTAL"
    );
    wrapper.name = "Numbers Wrapper";

    return wrapper;
}