import { NodeRenamable } from './../types/NodeRenamable';
import { MessageRenamer, PredifinedNames, RenamerOptions } from "../types/Messages/MessageRenamer";
import { getProcessedNodes } from "./nodeProcessing";
import * as util from "./util";
import jaJPData from "../assets/renamer/ja-JP.json"
import enUSData from "../assets/renamer/en-US.json"

/**
 * Renames selected Figma objects based on the provided naming options.
 * Supports skipping locked layers, including/excluding parent layers,
 * and optionally deleting hidden layers.
 */
export function renameSelectedObjects(message: MessageRenamer) {
  const selection = util.getCurrentSelection();
  // let filteredSelection: SceneNode[] = [];
  // let hasChildren = false;
  const topLevelNodesWithChildren: SceneNode[] = [];

  // Flatten selection to children if any container nodes are selected
  // for (const node of selection) {
  //   if ("children" in node) {
  //     hasChildren = true;
  //     filteredSelection = filteredSelection.concat(node.children);
  //   }
  // }

  // Track all top-level nodes for later use
  for (let i = 0; i < selection.length; i++) {
    topLevelNodesWithChildren.push(selection[i]);
    console.log(selection[i].name);
  }

  // If no container nodes selected, operate on the selection directly
  // if (!hasChildren) {
  //   filteredSelection = selection;
  // }

  // Apply filtering: skip locked layers using shared utility
  const filteredSelection = getProcessedNodes(
    {
      skipLocked: message.options.skipLockedLayer,
      skipHidden: message.options.skipHiddenLayers,
      findCriteria: undefined
    }
  );

  if (filteredSelection.length === 0) {
    figma.notify("❌ Please select at least one object.");
    return;
  }

  const predefinedNames = getPredefinedName(message.lang);

  // Recursive function to rename a node and its children
  function renameNode(node: SceneNode, isTopLevel: boolean) {
    // Skip locked or variable-format layers
    if (shouldRenameNode(message.options.skipLockedLayer, node)) {
      const newName = getNewName(message.renameTarget, predefinedNames, node, message.options);
      if (newName !== null) {
        node.name = newName;
      }
    }
  }

  // Recursively delete hidden nodes
  function deleteHiddenLayers(node: SceneNode) {
    if (node.visible === false) {
      node.remove();
      return;
    }
    if ("children" in node) {
      for (const child of node.children) {
        deleteHiddenLayers(child);
      }
    }
  }

  // Iterate through filtered nodes and rename or delete them
  filteredSelection.forEach((selectedNode) => {
    if (!selectedNode) {
      figma.notify("❌ The selected object is invalid.");
      return;
    }
    if (message.options.deleteHiddenLayer) {
      deleteHiddenLayers(selectedNode);
    } else {
      renameNode(selectedNode, false);
    }
  });

  figma.notify("✅ The selected object has been renamed.");
}

function shouldRenameNode(skipLockedLayer: boolean, node: SceneNode): boolean {
  if (skipLockedLayer && node.locked) {
    return false;
  }

  if (node.name.startsWith("%") && node.name.endsWith("%")) {
    // Skip custom variable format
    return false;
  }

  return true;
}

function getNewName(renameTarget: NodeRenamable[], predefinedNames: PredifinedNames, node: SceneNode, options: RenamerOptions): string | null {
  if (renameTarget.includes("TEXT") && node.type === "TEXT") {
    if (options.useTextLayerContent) {
      return (node as TextNode).characters;
    } else {
      return predefinedNames.text;
    }
  } else if (
    renameTarget.includes("IMAGE") &&
    node.type === "RECTANGLE" &&
    util.hasImageFill(node as RectangleNode)
  ) {
    return predefinedNames.image;
  } else if (
    renameTarget.includes("FRAME") &&
    node.type === "FRAME"
  ) {
    if (node.layoutMode === "NONE") {
      return predefinedNames.frame;
    } else if (node.layoutMode === "HORIZONTAL") {
      return predefinedNames.auto_layout_horizontal;
    } else if (node.layoutMode === "VERTICAL") {
      return predefinedNames.auto_layout_vertical;
    }
  } else if (
    renameTarget.includes("AUTO_LAYOUT") &&
    node.type === "FRAME"
  ) {
    if (node.layoutMode === "NONE") {
      return predefinedNames.frame
    } else if (node.layoutMode === "HORIZONTAL") {
      return predefinedNames.auto_layout_horizontal;
    } else if (node.layoutMode === "VERTICAL") {
      return predefinedNames.auto_layout_vertical;
    }
  } else if (
    renameTarget.includes("GROUP") &&
    node.type === "GROUP"
  ) {
    return predefinedNames.group;
  } else if (
    renameTarget.includes("RECTANGLE") &&
    node.type === "RECTANGLE"
  ) {
    return predefinedNames.rectangle;
  } else if (
    renameTarget.includes("ELLIPSE") &&
    node.type === "ELLIPSE"
  ) {
    return predefinedNames.ellipse;
  } else if (renameTarget.includes("LINE") && node.type === "LINE") {
    return predefinedNames.line;
  } else if (
    renameTarget.includes("POLYGON") &&
    node.type === "POLYGON"
  ) {
    return predefinedNames.polygon;
  } else if (renameTarget.includes("STAR") && node.type === "STAR") {
    return predefinedNames.star;
  } else if (
    renameTarget.includes("VECTOR") &&
    node.type === "VECTOR"
  ) {
    return predefinedNames.vector;
  }

  return null;
}

function getPredefinedName(lang: string): PredifinedNames {
  if (lang === "jaJP") {
    return jaJPData
  } else {
    return enUSData
  }
}