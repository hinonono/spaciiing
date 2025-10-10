
import { MessageSelectionFilter } from "../types/Messages/MessageSelectionFilter";
import { utils } from "./utils";

export function reception(message: MessageSelectionFilter) {
  if (message.phase == "Actual") {
    executeFilterSelection(message);
  }
}

/**
 * Filters the current selection based on various criteria such as visibility, locked status,
 * name matching, and node type. It uses getProcessedNodes for preprocessing and highlights
 * the resulting matching nodes in the Figma UI.
 */
function executeFilterSelection(message: MessageSelectionFilter) {
  const selection = utils.editor.getCurrentSelection();
  const finalSelection = utils.editor.filterSelection(selection, message.filterScopes, message.additionalFilterOptions);

  // If no nodes match the filters, notify and exit
  if (finalSelection.length === 0) {
    figma.notify("❌ No layers match the specified types.");
    return;
  }

  // Set the final result as the current selection and notify the user
  figma.currentPage.selection = finalSelection;
  figma.notify(`✅ Found ${finalSelection.length} layer(s) matching the criteria.`);
}