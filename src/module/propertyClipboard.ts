import { MessagePropertyClipboard } from "../types/Messages/MessagePropertyClipboard";
import * as util from "./util";

export function reception(message: MessagePropertyClipboard) {
  const { action } = message;

  switch (action) {
    case "setReferenceObject":
      setReferenceObject();
      break;

    default:
      break;
  }
}

function setReferenceObject() {
  const selection = util.getCurrentSelection();

  if (selection.length !== 1) {
    figma.notify("Please select exactly one object.");
    return;
  }

  const selectedObjectId = selection[0].id;
  const selectedObjectName = selection[0].name;

  const newEditorPreference = util.readEditorPreference();
  newEditorPreference.referenceObject = {
    id: selectedObjectId,
    name: selectedObjectName,
  };

  util.saveEditorPreference(newEditorPreference);
  util.updateEditorPreference(newEditorPreference, "PropertyClipboard");
}
