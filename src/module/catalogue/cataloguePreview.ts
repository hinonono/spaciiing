import { semanticTokens } from "../tokens";
import * as util from "../util"

export function createGradientFrame(
    gradientType: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND",
    transform: Transform,
    stops: ColorStop[],
    opacity: number,
): FrameNode {
    const colorFrame = figma.createFrame();
    colorFrame.resize(64, 64);
    colorFrame.name = "Swatch";

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
    const colorFrame = figma.createFrame();
    colorFrame.resize(64, 64);
    colorFrame.name = "Swatch";
    const newPaint = figma.util.solidPaint(color);
    colorFrame.fills = [newPaint];

    if (util.isWhite(color)) {
        colorFrame.strokes = [{ type: "SOLID", color: semanticTokens.strokeColor }];
        colorFrame.strokeWeight = 1;
    }

    return colorFrame;
}

export function createEffectFrame(effects: Effect[]): FrameNode {
    const effectFrame = figma.createFrame();
    effectFrame.resize(64, 64);
    effectFrame.name = "Effect";
    effectFrame.fills = [
        { type: "SOLID", color: semanticTokens.background.primary },
    ];
    effectFrame.cornerRadius = semanticTokens.cornerRadius.small;
    effectFrame.effects = effects;

    return effectFrame;
}

export function createNumberFrame(number: number, fontName: FontName): FrameNode {
    let limitedNumber: string;

    if (Number.isInteger(number)) {
        limitedNumber = number.toString(); // Keep whole numbers as they are
    } else {
        limitedNumber = number.toFixed(2); // Limit to 2 decimal places for non-integers
    }

    const numberTextNode = util.createTextNode(
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
    const numberFrame = figma.createFrame();
    numberFrame.name = "Number";
    numberFrame.fills = [{ type: "SOLID", color: semanticTokens.background.primary }];
    numberFrame.cornerRadius = semanticTokens.cornerRadius.small;
    util.setStroke(numberFrame, semanticTokens.strokeColor, { top: 1, bottom: 1, left: 1, right: 1 });

    // Set layout mode for centering
    numberFrame.layoutMode = "VERTICAL"; // Vertical stack layout
    numberFrame.primaryAxisAlignItems = "CENTER"; // Center horizontally
    numberFrame.counterAxisAlignItems = "CENTER"; // Center vertically
    numberFrame.paddingLeft = 0;
    numberFrame.paddingRight = 0;
    numberFrame.paddingTop = 0;
    numberFrame.paddingBottom = 0;
    numberFrame.resize(64, 48);

    // Add the text node to the frame
    numberFrame.appendChild(numberTextNode);

    return numberFrame;
}

