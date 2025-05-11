import { NodeRenamable } from './../types/NodeRenamable';
import { MessageRenamer, PredifinedNames } from "../types/Messages/MessageRenamer";
import * as util from "./util";
import jaJPData from "../assets/renamer/ja-JP.json"
import enUSData from "../assets/renamer/en-US.json"

export function renameSelectedObjects(message: MessageRenamer) {
  const selection = util.getCurrentSelection();
  let filteredSelection: SceneNode[] = [];
  let hasChildren = false;
  const topLevelNodesWithChildren: SceneNode[] = [];

  for (const node of selection) {
    if ("children" in node) {
      hasChildren = true;
      filteredSelection = filteredSelection.concat(node.children);
    }
  }

  for (let i = 0; i < selection.length; i++) {
    topLevelNodesWithChildren.push(selection[i]);
    console.log(selection[i].name);
  }

  if (!hasChildren) {
    filteredSelection = selection;
  }

  if (message.options.skipLockedLayer) {
    filteredSelection = skipLockLayersAndChildren(filteredSelection);
  }

  if (filteredSelection.length === 0) {
    figma.notify("❌ Please select at least one object.");
    return;
  }

  const predefinedNames = getPredefinedName(message.lang);

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

  function renameNode(node: SceneNode, isTopLevel: boolean) {
    if (isTopLevel && !message.options.includeParentLayer) {
      // Skip renaming the top-level node if includeParentLayer is false
      if ("children" in node) {
        for (const child of node.children) {
          renameNode(child, false);
        }
      }
      return;
    }

    if (shouldRenameNode(message.options.skipLockedLayer, node)) {
      const newName = getNewName(message.renameTarget, predefinedNames, node);
      if (newName !== null) {
        node.name = newName;
      }
    }

    if ("children" in node) {
      for (const child of node.children) {
        renameNode(child, false);
      }
    }
  }

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

  topLevelNodesWithChildren.forEach((topLevelNode) => {
    if (message.options.includeParentLayer) {
      const newName = getNewName(message.renameTarget, predefinedNames, topLevelNode);
      if (newName !== null) {
        topLevelNode.name = newName;
      }
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

function getNewName(renameTarget: NodeRenamable[], predefinedNames: PredifinedNames, node: SceneNode): string | null {
  if (renameTarget.includes("TEXT") && node.type === "TEXT") {
    return (node as TextNode).characters;
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
    }
  } else if (
    renameTarget.includes("AUTO_LAYOUT") &&
    node.type === "FRAME"
  ) {
    if (node.layoutMode === "HORIZONTAL") {
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