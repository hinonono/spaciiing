import { AppContextType } from "../AppProvider";
import { checkProFeatureAccessibleForUser } from "./utilFrontEnd";
import * as info from "../info.json";
import { MessageSpaciiing, SpacingMode } from "../types/Messages/MessageSpaciiing";

export function applySpacing(
    appContext: AppContextType,
    isRealCall: boolean,
    space: string | number,
    enteredCustomSpacing: number,
    multiplier: number,
    mode: SpacingMode,
    isChecked: boolean,
    column: number
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: info.freeUserWaitingTime,
                onProceed: () => applySpacing(
                    appContext,
                    true,
                    space,
                    enteredCustomSpacing,
                    multiplier,
                    mode,
                    isChecked,
                    column
                ),
            });
            return;
        }
    }

    let finalSpacing: number;
    let useCustomValue: boolean;

    if (typeof space === "string") {
        // 使用者選擇了自定義間距
        finalSpacing = enteredCustomSpacing;
        useCustomValue = true;
    } else {
        // 預設間距
        finalSpacing = space * multiplier;
        useCustomValue = false;
    }

    if (mode === "grid") {
        const message: MessageSpaciiing = {
            module: "Spaciiing",
            mode: mode,
            spacing: finalSpacing,
            useCustomValue: useCustomValue,
            addAutolayout: isChecked,
            direction: "Inner",
            phase: "Actual",
            shouldSaveEditorPreference: true,
            editorPreference: appContext.editorPreference,
            gridColumn: column,
        };

        parent.postMessage(
            {
                pluginMessage: message,
            },
            "*"
        );
    } else {
        const message: MessageSpaciiing = {
            module: "Spaciiing",
            mode: mode,
            spacing: finalSpacing,
            useCustomValue: useCustomValue,
            addAutolayout: isChecked,
            direction: "Inner",
            phase: "Actual",
            shouldSaveEditorPreference: true,
            editorPreference: appContext.editorPreference,
        };

        parent.postMessage(
            {
                pluginMessage: message,
            },
            "*"
        );
    }
}