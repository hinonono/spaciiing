import { EditorPreference } from "../../types/EditorPreference";
import { Module } from "../../types/Module";
import loremText from "../../assets/loremText.json";
import { ExternalMessageUpdateEditorPreference } from "../../types/Messages/MessageEditorPreference";
import { utils } from "../utils";
import { defaultEp } from "../../assets/const/editorPreference";
import { SyncedResourceType } from "../../types/Messages/MessageSaveSyncedResource";
import { RuntimeSyncedResources } from "../../types/RuntimeSyncedResources";
import { CYStrokeStyle } from "../../types/CYStrokeStyle";
import { ExternalMessageUpdateRuntimeSyncedResources } from "../../types/Messages/MessageRuntimeSyncedResources";
import { VirtualProfileGroup } from "../../types/VirtualProfile";
import { TimeComponent } from "../../types/TimeComponent";

export function saveSyncedResource(type: SyncedResourceType, resource: RuntimeSyncedResources) {
    switch (type) {
        case "strokeStyles":
            figma.root.setPluginData(utils.dataKeys.ARROW_STYLES, JSON.stringify(resource.strokeStyles));
            break;
        case "virtualProfiles":
            figma.root.setPluginData(utils.dataKeys.VIRTUAL_PROFILE_GROUPS, JSON.stringify(resource.virtualProfiles));
            break;
        default:
            break;
    }
}

export function compileSyncedResources(): RuntimeSyncedResources {
    const strokeStyles = readStrokeStyles();
    const virtualProfiles = readVirtualProfileGroups();

    return {
        strokeStyles: strokeStyles,
        virtualProfiles: virtualProfiles,
    }
}

function readVirtualProfileGroups(): VirtualProfileGroup[] {
    const rawData = figma.root.getPluginData(utils.dataKeys.VIRTUAL_PROFILE_GROUPS);
    let decoded: VirtualProfileGroup[] = [];

    if (rawData) {
        try {
            decoded = JSON.parse(rawData) as VirtualProfileGroup[];
            if (!Array.isArray(decoded)) {
                console.warn("Virtural profile groups is not an array. Resetting.");
                decoded = [];
            }
        } catch (error) {
            console.error("Error parsing strokestyles. Resetting.", error);
            decoded = [];
            throw new Error("Error parsing stroke styles.")
        }
    }

    return decoded;
}

export function updateRuntimeSyncedResources(
    resources: RuntimeSyncedResources,
    source?: Module
) {
    const message: ExternalMessageUpdateRuntimeSyncedResources = {
        runtimeSyncedResources: resources,
        module: "PluginSetting",
        mode: "UpdateRuntimeSyncedResources",
        phase: "Init",
    };
    utils.communication.sendMessageBack(message);
}

function readStrokeStyles(): CYStrokeStyle[] {
    const rawStrokeStyles = figma.root.getPluginData(utils.dataKeys.ARROW_STYLES);

    let decodedStrokeStyles: CYStrokeStyle[] = [];
    if (rawStrokeStyles) {
        try {
            decodedStrokeStyles = JSON.parse(rawStrokeStyles) as CYStrokeStyle[];
            if (!Array.isArray(decodedStrokeStyles)) {
                console.warn("strokestyles is not an array. Resetting.");
                decodedStrokeStyles = [];
            }
        } catch (error) {
            console.error("Error parsing strokestyles. Resetting.", error);
            decodedStrokeStyles = [];
            throw new Error("Error parsing stroke styles.")
        }
    }

    return decodedStrokeStyles;
}

// export function readCrossCatalogueReferenceURL(): string {
//     const rawURL = figma.root.getPluginData(utils.dataKeys.CROSS_CATALOGUE_REFERENCE_URL);

//     if (rawURL) {
//         return rawURL;
//     } else {
//         return "";
//     }
// }

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

export function getCurrentTime(comp: TimeComponent): string {
    const date = new Date();

    switch (comp) {
        case "YEAR":
            return date.getFullYear().toString();
        case "MONTH":
            return String(date.getMonth() + 1).padStart(2, "0");
        case "DAY":
            return String(date.getDate()).padStart(2, "0");
        case "HOUR":
            return String(date.getHours()).padStart(2, "0");
        case "MIN":
            return String(date.getMinutes()).padStart(2, "0");
        case "SECOND":
            return String(date.getSeconds()).padStart(2, "0");
        default:
            throw new Error(`Time component ${comp} is not supported.`);
    }
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

    const year = getCurrentTime("YEAR");
    const month = getCurrentTime("MONTH");
    const day = getCurrentTime("DAY")

    const hours = getCurrentTime("HOUR");
    const minutes = getCurrentTime("MIN");
    const seconds = getCurrentTime("SECOND");

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