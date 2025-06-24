import { utils } from ".";
import { EditorPreference } from "../../types/EditorPreference";

export function incrementSavedClicks(incrementBy: number) {
    const ep = utils.data.readEditorPreference()
    const newEp: EditorPreference = { ...ep, savedClicks: ep.savedClicks + incrementBy };

    utils.data.saveEditorPreference(newEp, "General")
    utils.data.updateEditorPreference(newEp);
}