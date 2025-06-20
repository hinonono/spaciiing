
import { ArrowSchema } from "../types/ArrowSchema";
import { MessageSelectionFilter } from "../types/Messages/MessageSelectionFilter";
import { getProcessedNodes } from "./nodeProcessing";
import * as util from "./util";

export function reception(message: MessageSelectionFilter) {
  if (message.phase == "Actual") {
    filterSelection2(message);
  }
}

// function filterSelection(message: MessageSelectionFilter) {
//   const selection = util.getCurrentSelection();

//   if (selection.length === 0) {
//     figma.notify("❌ No layers selected.");
//     return;
//   }

//   // Function to check if a node is an image (rectangle with image fill)
//   function isImageNode(node: SceneNode): boolean {
//     if (node.type === "RECTANGLE" && node.fills) {
//       return util.hasImageFill(node);
//     }
//     return false;
//   }

//   function isSpaciiingArrowNode(node: SceneNode): boolean {
//     const schema = getArrowSchema(node);

//     if (!schema) { return false };

//     if (node.type === "GROUP" && schema.objectType === "SPACIIING_ARROW") {
//       return true
//     }
//     return false;
//   }

//   // Function to check if a node has auto layout applied
//   function hasAutoLayout(node: SceneNode): boolean {
//     return (
//       node.type === "FRAME" &&
//       (node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL")
//     );
//   }

//   // Recursive function to find all nodes of specified types within the selection
//   function findAllMatchingNodes(nodes: readonly SceneNode[]): SceneNode[] {
//     let matchingNodes: SceneNode[] = [];
//     console.log(nodes);

//     for (const node of nodes) {
//       if (
//         message.filterScopes.includes(node.type) ||
//         (message.filterScopes.includes("IMAGE") && isImageNode(node)) ||
//         (message.filterScopes.includes("AUTO_LAYOUT") && hasAutoLayout(node)) ||
//         (message.filterScopes.includes("SPACIIING_ARROW") && isSpaciiingArrowNode(node))
//       ) {
//         matchingNodes.push(node);
//       }

//       if (!isSpaciiingArrowNode(node)) {
//         if ("children" in node) {
//           matchingNodes = matchingNodes.concat(
//             findAllMatchingNodes(node.children)
//           );
//         }
//       }
//     }

//     return matchingNodes;
//   }

//   function skipLockLayersAndChildren(nodes: readonly SceneNode[]): SceneNode[] {
//     let result: SceneNode[] = [];

//     for (const node of nodes) {
//       if (!node.locked) {
//         if ("children" in node && node.children.length > 0) {
//           const filteredChildren = skipLockLayersAndChildren(node.children);
//           result = result.concat(filteredChildren);
//         }
//         result.push(node);
//       }
//     }

//     return result;
//   }

//   function skipHiddenLayersAndChildren(
//     nodes: readonly SceneNode[],
//     parentVisible: boolean = true
//   ): SceneNode[] {
//     let result: SceneNode[] = [];

//     for (const node of nodes) {
//       const nodeVisible = parentVisible && node.visible;

//       if (!nodeVisible) {
//         continue; // Skip nodes that are not visible due to their parent being hidden
//       }

//       result.push(node);

//       if ("children" in node) {
//         result = result.concat(
//           skipHiddenLayersAndChildren(node.children, nodeVisible)
//         );
//       }
//     }

//     return result;
//   }

//   function getIntersection(array1: SceneNode[], array2: SceneNode[]): SceneNode[] {
//     const set2 = new Set(array2);
//     return array1.filter(node => set2.has(node));
//   }

//   // Use the children of the top-level selected nodes for filtering if present,
//   // otherwise use the selection itself
//   let filteredSelection: SceneNode[] = [];
//   let hasChildren = false;

//   for (const node of selection) {
//     if ("children" in node) {
//       hasChildren = true;
//       filteredSelection = filteredSelection.concat(node.children);
//     }
//   }

//   if (!hasChildren) {
//     filteredSelection = selection;
//   }

//   // Filter out hidden and locked layers
//   let filteredSelection1: SceneNode[] = filteredSelection;
//   let filteredSelection2: SceneNode[] = filteredSelection;

//   if (message.additionalFilterOptions.skipHiddenLayers) {
//     filteredSelection1 = skipHiddenLayersAndChildren(filteredSelection);
//   }

//   if (message.additionalFilterOptions.skipLockLayers) {
//     filteredSelection2 = skipLockLayersAndChildren(filteredSelection);
//   }

//   const overlappedSelection = getIntersection(filteredSelection1, filteredSelection2);



//   // Find all matching nodes from the filtered selection
//   let finalSelection = findAllMatchingNodes(overlappedSelection);

//   if (finalSelection.length === 0) {
//     figma.notify("❌ No layers match the specified types.");
//     return;
//   }

//   // Further filter by name if findCriteria is not empty
//   if (message.additionalFilterOptions.findWithName) {
//     finalSelection = finalSelection.filter(
//       (node) => node.name === message.additionalFilterOptions.findCriteria
//     );

//     if (finalSelection.length === 0) {
//       figma.notify("❌ No layers match the specified name.");
//       return;
//     }
//   }

//   // Set the filtered selection as the user's new current selection
//   figma.currentPage.selection = finalSelection;

//   // Notify the user of the number of matching layers
//   figma.notify(
//     `✅ Found ${finalSelection.length} layer(s) matching the criteria.`
//   );
// }

/**
 * Filters the current selection based on various criteria such as visibility, locked status,
 * name matching, and node type. It uses getProcessedNodes for preprocessing and highlights
 * the resulting matching nodes in the Figma UI.
 */
function filterSelection2(message: MessageSelectionFilter) {
  const selection = util.getCurrentSelection();
  console.log("selection", selection);

  const afo = message.additionalFilterOptions;

  // If nothing is selected, notify and exit
  if (selection.length === 0) {
    figma.notify("❌ No layers selected.");
    return;
  }

  // Check if a node is an image (rectangle with image fill)
  function isImageNode(node: SceneNode): boolean {
    if (node.type === "RECTANGLE" && node.fills) {
      return util.hasImageFill(node);
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

  // Flatten the selection to the children of selected containers if any
  let filteredSelection: SceneNode[] = [];
  let hasChildren = false;

  for (const node of selection) {
    if ("children" in node) {
      hasChildren = true;
      filteredSelection = filteredSelection.concat(node.children);
    }
  }

  // If no parent containers, fall back to direct selection
  if (hasChildren === false) {
    filteredSelection = selection;
  }

  console.log("filteredSelection", filteredSelection);


  // Preprocess the selection using filtering options
  const processedNodes = getProcessedNodes(
    filteredSelection,
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