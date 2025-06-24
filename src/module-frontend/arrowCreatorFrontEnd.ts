import { AppContextType } from "../AppProvider";
import { ConnectPointPositionPair } from "../types/ArrowCreator";
import { CYStroke, CYStrokeCap } from "../types/CYStroke";
import { Direction } from "../types/General";
import { MessageArrowCreator } from "../types/Messages/MessageArrowCreator";
import { checkProFeatureAccessibleForUser } from "./utilFrontEnd";
import * as info from "../info.json";
import { CYStrokeStyle } from "../types/CYStrokeStyle";
import { MessageSaveEditorPreference } from "../types/Messages/MessageSaveEditorPreference";

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
    value: CYStrokeCap;
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
    // {
    //     value: "TRIANGLE_FILLED",
    //     labelKey: "module:reversedTriangle",
    // },
    // {
    //     value: "CIRCLE_FILLED",
    //     labelKey: "module:circleArrow",
    // },
    // {
    //     value: "DIAMOND_FILLED",
    //     labelKey: "module:diamondArrow"
    // },
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
        labelKey: "term:custom",
    }
]

export const defaultStroke: CYStroke = {
    color: "#64748B",
    opacity: 1,
    strokeWeight: 5,
    cornerRadius: 16,
    startPointCap: "ROUND",
    endPointCap: "ARROW_LINES",
    dashAndGap: [0, 0],
}

export const defaultOffset: number = 8

export function exportArrowStyle(
    appContext: AppContextType,
    isRealCall: boolean
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: info.freeUserWaitingTime,
                onProceed: () => { exportArrowStyle(appContext, true) }, // Re-invoke with the real call
            });
            return;
        }
    }

    const arrowStyles = appContext.editorPreference.strokeStyles;

    const blob = new Blob([JSON.stringify(arrowStyles, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spaciiing_arrow-styles.json";
    a.click();
    URL.revokeObjectURL(url);
}

export async function importArrowStyle(
    event: React.ChangeEvent<HTMLInputElement>,
    appContext: AppContextType,
    isRealCall: boolean
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: info.freeUserWaitingTime,
                onProceed: () => { importArrowStyle(event, appContext, true) }, // Re-invoke with the real call
            });
            return;
        }
    }

    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const text = await file.text();
        const arrowStyles = JSON.parse(text) as CYStrokeStyle[];

        const existingStyles = appContext.editorPreference.strokeStyles;
        const existingIds = new Set(existingStyles.map(style => style.id));

        // Filter out any styles with conflicting IDs
        const newStyles = arrowStyles.filter(style => !existingIds.has(style.id));

        // Merge safely
        const updatedStyles = [...existingStyles, ...newStyles];
        appContext.editorPreference.strokeStyles = updatedStyles;

        const message: MessageSaveEditorPreference = {
            editorPreference: appContext.editorPreference,
            shouldSaveEditorPreference: true,
            module: "Shortcut",
            phase: "Actual"
        };

        parent.postMessage({ pluginMessage: message }, "*");
        alert(`${newStyles.length} styles has been imported successfully.`);
    } catch (err) {
        alert("Invalid JSON file");
    }
}