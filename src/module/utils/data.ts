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
        savedClicks: 0,
        savedSecs: 0
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

/**
 * Formats the current date and time into a specified format.
 *
 * @export
 * @function getFormattedDate
 * @param {("shortDate" | "fullDateTime")} format - Specifies the date format:
 *   - "shortDate": Returns the date in "DD/MM" format.
 *   - "fullDateTime": Returns the full date and time in "DD/MM/YYYY HOUR:MINUTE:SECOND" format.
 * @returns {string} A formatted date string in the specified format.
 *
 * @throws {Error} If the provided format is unsupported.
 */
export function getFormattedDate(
    format: "shortDate" | "fullDateTime",
    preferredStyle: "western" | "eastern"
): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    if (format === "shortDate") {
        return preferredStyle === "western" ? `${day}/${month}` : `${month}/${day}`;
    } else if (format === "fullDateTime") {
        return preferredStyle === "western" ? `${day}/${month}/${year} ${hours}:${minutes}:${seconds}` : `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    } else {
        throw new Error("Unsupported format");
    }
}

/**
 * Adds a specified number of hours to the given date.
 * @param date The original date.
 * @param hours The number of hours to add.
 * @returns A new date object with the hours added.
 */
export function addHours(date: Date, hours: number): Date {
    // Create a new date object based on the provided date
    const resultDate = new Date(date);
    // Add the specified number of hours
    resultDate.setHours(resultDate.getHours() + hours);
    // Return the modified date
    return resultDate;
}

export function convertUTCStringToDate(utcString: string) {
    return new Date(utcString);
}

export const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};