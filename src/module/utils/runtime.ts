import { EditorType } from "../../types/EditorType";
import { ExternalMessage } from "../../types/Messages/ExternalMessage";
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