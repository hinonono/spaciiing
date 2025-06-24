import { utils } from ".";
import { EditorPreference } from "../../types/EditorPreference";
import info from "../../info.json";

export function incrementSavedClicks(incrementBy: number, incrementTime: boolean) {
    const ep = utils.data.readEditorPreference()
    const newEp: EditorPreference = {
        ...ep,
        savedClicks: ep.savedClicks + incrementBy,
        savedSecs: incrementTime === true ? ep.savedSecs + info.freeUserWaitingTime : ep.savedSecs
    };

    utils.data.saveEditorPreference(newEp, "General")
    utils.data.updateEditorPreference(newEp);
}