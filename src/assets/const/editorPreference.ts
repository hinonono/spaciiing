import { EditorPreference } from "../../types/EditorPreference";

export const defaultEp: EditorPreference = {
    schemaVersion: 3,
    magicObjects: {
        noteId: "",
        tagId: "",
        sectionId: "",
    },
    lorem: "",
    iconFrame: {
        innerFrame: 0,
        outerFrame: 0,
    },
    savedClicks: 0,
    savedSecs: 0,
}