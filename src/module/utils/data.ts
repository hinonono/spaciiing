import { EditorPreference } from "../../types/EditorPreference";
import { Module } from "../../types/Module";
import loremText from "../../assets/loremText.json";
import { ExternalMessageUpdateEditorPreference } from "../../types/Messages/MessageEditorPreference";
import { utils } from "../utils";
import { defaultEp } from "../../assets/const/editorPreference";

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
    // const dataKey = "editor-preferences";

    if (!figma.currentUser?.id) {
        throw new Error("User must be logged in to save preferences.");
    }

    const userId = figma.currentUser.id;
    const rawData = figma.root.getPluginData(utils.dataKeys.EDITOR_PREFERENCES);

    let decoded: EditorPreference[] = [];
    if (rawData) {
        try {
            decoded = JSON.parse(rawData) as EditorPreference[];
            if (!Array.isArray(decoded)) {
                console.warn("Editor preferences data is not an array. Resetting.");
                decoded = [];
            }
        } catch (e) {
            console.error("Failed to parse editor preferences. Resetting.", e);
            decoded = [];
        }
    }

    const existedIndex = decoded.findIndex((item) => item.userId === userId);

    if (existedIndex === -1) {
        decoded.push(editorPreference);
    } else {
        decoded[existedIndex] = editorPreference;
    }

    figma.root.setPluginData(utils.dataKeys.EDITOR_PREFERENCES, JSON.stringify(decoded));
}

function createEditorPreference(): EditorPreference {
    if (!figma.currentUser?.id) {
        throw new Error("In order to use this plugin, please log in.")
    }

    const userId = figma.currentUser.id;

    const createdEditorPreference: EditorPreference = {
        ...defaultEp,
        userId: userId
    };

    return createdEditorPreference;
}

/**
 * Reads the editor preference from the root plugin data.
 *
 * @returns {EditorPreference} The decoded editor preference if it exists, otherwise a new empty EditorPreference object.
 */
export function readEditorPreference(): EditorPreference {
    // const dataKey = "editor-preferences";

    if (!figma.currentUser?.id) {
        throw new Error("User must be logged in to load preferences.");
    }

    const userId = figma.currentUser.id;
    const rawData = figma.root.getPluginData(utils.dataKeys.EDITOR_PREFERENCES);

    let decoded: EditorPreference[] = [];
    if (rawData) {
        try {
            decoded = JSON.parse(rawData) as EditorPreference[];
            if (!Array.isArray(decoded)) {
                console.warn("Editor preferences is not an array. Resetting.");
                decoded = [];
            }
        } catch (error) {
            console.error("Error parsing editor preferences. Resetting.", error);
            decoded = [];
        }
    }

    const preference = decoded.find((item) => item.userId === userId);

    if (!preference) {
        const newPref = createEditorPreference();
        saveEditorPreference(newPref);
        return newPref;
    } else {
        const defaultPref = createEditorPreference();
        return {
            ...defaultPref,
            ...preference,
        };
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