import { EditorPreference } from "../../types/EditorPreference";
import { Module } from "../../types/Module";
import loremText from "../../assets/loremText.json";
import { ExternalMessageUpdateEditorPreference } from "../../types/Messages/MessageEditorPreference";
import { utils } from "../utils";

/**
 * Saves the editor preference to the current page's plugin data.
 *
 * @param {EditorPreference} editorPreference - The editor preference to save.
 * @param {Module} [source] - Optional source of the call, used for logging purposes.
 */
export function saveEditorPreference(
    editorPreference: EditorPreference,
    source?: Module
) {
    figma.root.setPluginData(
        "editor-preference",
        JSON.stringify(editorPreference)
    );
    console.log(
        `😍使用者偏好已儲存，呼叫自${source !== undefined ? String(source) : "未知"
        }`, editorPreference
    );
}

function createEditorPreference(): EditorPreference {
    const createdEditorPreference: EditorPreference = {
        magicObjects: {
            noteId: "",
            tagId: "",
            sectionId: "",
        },
        lorem: loremText.en,
        iconFrame: {
            innerFrame: 20,
            outerFrame: 24,
        },
        strokeStyles: [],
        savedClicks: 0
    };

    return createdEditorPreference;
}

/**
 * Reads the editor preference from the root plugin data.
 *
 * @returns {EditorPreference} The decoded editor preference if it exists, otherwise a new empty EditorPreference object.
 */
export function readEditorPreference(): EditorPreference {
    const editorPreference = figma.root.getPluginData("editor-preference");

    if (!editorPreference) {
        // 當之前未建立過Preference物件時，新建一個
        const createdEditorPreference: EditorPreference = createEditorPreference();

        saveEditorPreference(createdEditorPreference);

        return createdEditorPreference;
    } else {
        // 當之前已建立過Preference物件時，進行解碼
        const decodedEditorPreference = JSON.parse(
            editorPreference
        ) as EditorPreference;

        // Merge with default preferences to ensure all properties are present
        const defaultEditorPreference = createEditorPreference();
        const mergedEditorPreference = {
            ...defaultEditorPreference,
            ...decodedEditorPreference,
        };

        return mergedEditorPreference;
    }
}

/**
 * Updates the editor preference by sending the updated preference back as a message.
 *
 * @param {EditorPreference} editorPreference - The updated editor preference to send.
 * @param {Module} [source] - Optional source of the call, used for logging purposes.
 */
export function updateEditorPreference(
    editorPreference: EditorPreference,
    source?: Module
) {
    const message: ExternalMessageUpdateEditorPreference = {
        editorPreference: editorPreference,
        module: "PluginSetting",
        mode: "UpdateEditorPreference",
        phase: "Init",
    };
    utils.communication.sendMessageBack(message);
}