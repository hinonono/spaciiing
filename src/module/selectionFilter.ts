
import { ArrowSchema } from "../types/ArrowSchema";
import { MessageSelectionFilter } from "../types/Messages/MessageSelectionFilter";
import { getProcessedNodes } from "./nodeProcessing";

import { utils } from "./utils";

export function reception(message: MessageSelectionFilter) {
  if (message.phase == "Actual") {
    filterSelection2(message);
  }
}

/**
 * Filters the current selection based on various criteria such as visibility, locked status,
 * name matching, and node type. It uses getProcessedNodes for preprocessing and highlights
 * the resulting matching nodes in the Figma UI.
 */
function filterSelection2(message: MessageSelectionFilter) {
  const afo = message.additionalFilterOptions;

  // Check if a node is an image (rectangle with image fill)
  function isImageNode(node: SceneNode): boolean {
    if (node.type === "RECTANGLE" && node.fills) {
      return utils.node.hasImageFill(node);
    }
    return false;
  }

  // Check if a node is a SPACIIING_ARROW group
  function isSpaciiingArrowNode(node: SceneNode): boolean {
    const schema = getArrowSchema(node);
    if (!schema) { return false };
    return node.type === "GROUP" && schema.objectType === "SPACIIING_ARROW";
  }

  // Check if a node has auto layout
  function hasAutoLayout(node: SceneNode): boolean {
    return (
      node.type === "FRAME" &&
      (node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL")
    );
  }

  // Recursively find nodes that match the requested filter scopes
  function findAllMatchingNodes(nodes: readonly SceneNode[]): SceneNode[] {
    let matchingNodes: SceneNode[] = [];
    for (const node of nodes) {
      // Check if node matches any of the filter scopes
      if (
        message.filterScopes.includes(node.type) ||
        (message.filterScopes.includes("IMAGE") && isImageNode(node)) ||
        (message.filterScopes.includes("AUTO_LAYOUT") && hasAutoLayout(node)) ||
        (message.filterScopes.includes("SPACIIING_ARROW") && isSpaciiingArrowNode(node))
      ) {
        matchingNodes.push(node);
      }
    }
    return matchingNodes;
  }

  // Preprocess the selection using filtering options
  const processedNodes = getProcessedNodes(
    {
      skipHidden: afo.skipHiddenLayers,
      skipLocked: afo.skipLockLayers,
      findCriteria: afo.findWithName ? afo.findCriteria : undefined
    }
  );

  // Find nodes within the processed set that match the defined filter scopes
  let finalSelection = findAllMatchingNodes(processedNodes);

  // If no nodes match the filters, notify and exit
  if (finalSelection.length === 0) {
    figma.notify("❌ No layers match the specified types.");
    return;
  }

  // Set the final result as the current selection and notify the user
  figma.currentPage.selection = finalSelection;
  figma.notify(`✅ Found ${finalSelection.length} layer(s) matching the criteria.`);
}

function getArrowSchema(obj: SceneNode): ArrowSchema | null {
  const key = "arrow-schema"

  const data = obj.getPluginData(key)

  if (data) {
    const decodedData = JSON.parse(data) as ArrowSchema;
    return decodedData;
  } else {
    return null;
  }
}