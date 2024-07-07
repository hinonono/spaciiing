import { MessageSelectionFilter } from "../types/Message";
import * as util from "./util";

export function reception(message: MessageSelectionFilter) {
  if (message.phase == "Actual") {
    filterSelection(message);
  }
}

function filterSelection(message: MessageSelectionFilter) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ No layers selected.");
    return;
  }

  // Function to check if a node is an image (rectangle with image fill)
  function isImageNode(node: SceneNode): boolean {
    if (node.type === "RECTANGLE" && node.fills) {
      return util.hasImageFill(node);
    }
    return false;
  }

  // Function to check if a node has auto layout applied
  function hasAutoLayout(node: SceneNode): boolean {
    return (
      node.type === "FRAME" &&
      (node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL")
    );
  }

  // Recursive function to find all nodes of specified types within the selection
  function findAllMatchingNodes(nodes: readonly SceneNode[]): SceneNode[] {
    let matchingNodes: SceneNode[] = [];

    for (const node of nodes) {
      if (
        message.filterScopes.includes(node.type) ||
        (message.filterScopes.includes("IMAGE") && isImageNode(node)) ||
        (message.filterScopes.includes("AUTO_LAYOUT") && hasAutoLayout(node))
      ) {
        matchingNodes.push(node);
      }

      if ("children" in node) {
        matchingNodes = matchingNodes.concat(
          findAllMatchingNodes(node.children)
        );
      }
    }

    return matchingNodes;
  }

  function skipLockLayersAndChildren(nodes: readonly SceneNode[]): SceneNode[] {
    let result: SceneNode[] = [];

    for (const node of nodes) {
      if (!node.locked) {
        if ("children" in node && node.children.length > 0) {
          const filteredChildren = skipLockLayersAndChildren(node.children);
          result = result.concat(filteredChildren);
        }
        result.push(node);
      }
    }

    return result;
  }

  function skipHiddenLayersAndChildren(
    nodes: readonly SceneNode[],
    parentVisible: boolean = true
  ): SceneNode[] {
    let result: SceneNode[] = [];

    for (const node of nodes) {
      const nodeVisible = parentVisible && node.visible;

      if (!nodeVisible) {
        continue; // Skip nodes that are not visible due to their parent being hidden
      }

      result.push(node);

      if ("children" in node) {
        result = result.concat(
          skipHiddenLayersAndChildren(node.children, nodeVisible)
        );
      }
    }

    return result;
  }

  // Use the children of the top-level selected nodes for filtering if present,
  // otherwise use the selection itself
  let filteredSelection: SceneNode[] = [];
  let hasChildren = false;

  for (const node of selection) {
    if ("children" in node) {
      hasChildren = true;
      filteredSelection = filteredSelection.concat(node.children);
    }
  }

  if (!hasChildren) {
    filteredSelection = selection;
  }

  if (message.additionalFilterOptions.skipLockLayers) {
    filteredSelection = skipLockLayersAndChildren(filteredSelection);
    console.log("");
    filteredSelection.forEach((i) => {
      console.log(i.name);
    });
  }

  if (message.additionalFilterOptions.skipHiddenLayers) {
    filteredSelection = skipHiddenLayersAndChildren(filteredSelection);
    console.log("");
    filteredSelection.forEach((i) => {
      console.log(i.name);
    });
  }

  // Find all matching nodes from the filtered selection
  filteredSelection = findAllMatchingNodes(filteredSelection);
  console.log("");
  filteredSelection.forEach((i) => {
    console.log(i.name);
  });

  if (filteredSelection.length === 0) {
    figma.notify("❌ No layers match the specified types.");
    return;
  }

  // Further filter by name if findCriteria is not empty
  if (message.additionalFilterOptions.findWithName) {
    filteredSelection = filteredSelection.filter(
      (node) => node.name === message.additionalFilterOptions.findCriteria
    );

    if (filteredSelection.length === 0) {
      figma.notify("❌ No layers match the specified name.");
      return;
    }
  }

  // Set the filtered selection as the user's new current selection
  figma.currentPage.selection = filteredSelection;

  // Notify the user of the number of matching layers
  figma.notify(
    `✅ Found ${filteredSelection.length} layer(s) matching the criteria.`
  );
}
