import { AppContextType } from "../AppProvider";
import { ConnectPointPositionPair } from "../types/ArrowCreator";
import { CYStroke } from "../types/CYStroke";
import { Direction } from "../types/General";
import { MessageArrowCreator } from "../types/Messages/MessageArrowCreator";
import { checkProFeatureAccessibleForUser } from "./utilFrontEnd";
import * as info from "../info.json";

export function applyArrowCreator(
    isRealCall: boolean,
    appContext: AppContextType,
    safeMargin: number,
    connectPointPositionPair: ConnectPointPositionPair,
    stroke: CYStroke,
    createAnnotationBox: boolean,
    direction: Direction
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: info.freeUserWaitingTime,
                onProceed: () => { applyArrowCreator(true, appContext, safeMargin, connectPointPositionPair, stroke, createAnnotationBox, direction) }, // Re-invoke with the real call
            });
            return;
        }
    }
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
    parent.postMessage({ pluginMessage: message, }, "*");
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