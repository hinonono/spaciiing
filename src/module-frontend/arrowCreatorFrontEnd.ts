import { ConnectPointPositionPair } from "../types/ArrowCreator";
import { CYStroke } from "../types/CYStroke";
import { MessageArrowCreator } from "../types/Messages/MessageArrowCreator";

export function applyArrowCreator(
    safeMargin: number,
    connectPointPositionPair: ConnectPointPositionPair,
    stroke: CYStroke,
    createAnnotationBox: boolean,
) {
    const message: MessageArrowCreator = {
        safeMargin: safeMargin,
        connectPointPositionPair: connectPointPositionPair,
        stroke: stroke,
        createAnnotationBox: createAnnotationBox,
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
        labelKey: "term:lineArrow",
    },
    {
        value: "ARROW_EQUILATERAL",
        labelKey: "term:triangleArrow",
    }
]

export const strokeStyles = [
    {
        type: "solid",
        labelKey: "term:solid",
    },
    {
        type: "dash",
        labelKey: "term:dash",
    },
    {
        type: "custom",
        labelKey: "term:custom",
    }
]