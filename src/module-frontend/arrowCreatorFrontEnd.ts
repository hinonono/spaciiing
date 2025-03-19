import { ConnectPointPositionPair } from "../types/ArrowCreator";
import { CYStroke } from "../types/CYStroke";
import { Direction } from "../types/General";
import { MessageArrowCreator } from "../types/Messages/MessageArrowCreator";

export function applyArrowCreator(
    safeMargin: number,
    connectPointPositionPair: ConnectPointPositionPair,
    stroke: CYStroke,
    createAnnotationBox: boolean,
    direction: Direction
) {
    const message: MessageArrowCreator = {
        safeMargin: safeMargin,
        connectPointPositionPair: connectPointPositionPair,
        stroke: stroke,
        createAnnotationBox: createAnnotationBox,
        layoutDirection: direction,
        module: "ArrowCreator",
        phase: "Actual",
        direction: "Inner",
    };

    console.log("applyArrowCreator Frontend");
    console.log(message);

    parent.postMessage(
        {
            pluginMessage: message,
        },
        "*"
    );
}

interface StrokeCapOption {
    value: StrokeCap;
    labelKey: string;
}

export const strokeCaps: StrokeCapOption[] = [
    {
        value: "NONE",
        labelKey: "term:none",
    },
    {
        value: "ARROW_LINES",
        labelKey: "module:lineArrow",
    },
    {
        value: "ARROW_EQUILATERAL",
        labelKey: "module:triangleArrow",
    },
    {
        value: "ROUND",
        labelKey: "module:round",
    },
    {
        value: "SQUARE",
        labelKey: "module:square",
    },
]

export const strokeStyles = [
    {
        type: "solid",
        labelKey: "term:strokeSolid",
    },
    {
        type: "dash",
        labelKey: "term:strokeDash",
    },
    {
        type: "custom",
        labelKey: "module:custom",
    }
]

export const defaultStroke: CYStroke = {
    color: "#64748B",
    opacity: 1,
    strokeWeight: 6,
    cornerRadius: 16,
    startPointCap: "NONE",
    endPointCap: "ARROW_LINES",
    dashAndGap: [0, 0],
}