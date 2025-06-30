import { EditorType } from "../../types/EditorType";
import { ExternalMessage } from "../../types/Messages/ExternalMessage";
import { MessageShortcut } from "../../types/Messages/MessageShortcut";
import { executeShortcut } from "../shortcut";
import { utils } from "../utils";

export function updateEditorType(editorType: EditorType) {
    const message: ExternalMessage = {
        module: "Init",
        direction: "Outer",
        phase: "Actual",
        editorType: editorType,
    };
    utils.communication.sendMessageBack(message);
}

/**
 * Update command that triggered plugin launch.
 */
export function updateTriggeredCommand() {
    const message: ExternalMessage = {
        module: "Init",
        direction: "Outer",
        phase: "Actual",
        triggeredCommand: figma.command
    };
    utils.communication.sendMessageBack(message);
    console.log(figma.command);
}

export function directlyExecuteCommand() {
    if (figma.command === utils.relaunchCommand.updateArrowsPosition.name) {
        const uapm: MessageShortcut = {
            action: "updateArrowPosition",
            module: "Shortcut",
            phase: "Actual",
            direction: "Inner",
        }

        executeShortcut(uapm);
    }
}