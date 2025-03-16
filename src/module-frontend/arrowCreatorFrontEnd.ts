import { ConnectPointPositionPair } from "../types/ArrowCreator";
import { CYStroke } from "../types/CYStroke";
import { MessageArrowCreator } from "../types/Messages/MessageArrowCreator";

export function applyArrowCreator(
    safeMargin: number,
    connectPointPositionPair: ConnectPointPositionPair,
    stroke: CYStroke
) {
    console.log("applyArrowCreator Frontend");

    const message: MessageArrowCreator = {
        safeMargin: safeMargin,
        connectPointPositionPair: connectPointPositionPair,
        stroke: stroke,
        module: "ArrowCreator",
        phase: "Actual",
        direction: "Inner",
    };

    parent.postMessage(
        {
            pluginMessage: message,
        },
        "*"
    );
}

export const strokePointStyles = [
    {
        type: "none",
        labelKey: "term:none",
    },
    {
        type: "line-arrow",
        labelKey: "term:lineArrow",
    },
    {
        type: "triangle-arrow",
        labelKey: "term:triangleArrow",
    },
    {
        type: "reversed-triangle",
        labelKey: "term:reversedTriangle",
    },
    {
        type: "circle-arrow",
        labelKey: "term:circleArrow",
    },
    {
        type: "diamond-arrow",
        labelKey: "term:diamondArrow",
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
    }
]