import { AppContextType } from "../AppProvider";
import { checkProFeatureAccessibleForUser } from "./utilFrontEnd";
import * as pluginConfig from "../pluginConfig.json";
import { MessageSpaciiing, SpacingMode } from "../types/Messages/MessageSpaciiing";

export function applySpacing(
    appContext: AppContextType,
    isRealCall: boolean,
    spacing: number,
    mode: SpacingMode,
    isChecked: boolean,
    column: number
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime,
                onProceed: () => applySpacing(
                    appContext,
                    true,
                    spacing,
                    mode,
                    isChecked,
                    column
                ),
            });
            return;
        }
    }

    if (mode === "grid") {
        const message: MessageSpaciiing = {
            module: "Spaciiing",
            mode: mode,
            spacing: spacing,
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
            spacing: spacing,
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