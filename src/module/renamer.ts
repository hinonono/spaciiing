import { MessageRenamer } from "../types/Message";
import * as util from "./util";

export function renameSelectedObjects(message: MessageRenamer) {
  const selection = util.getCurrentSelection();
  // Use the children of the top-level selected nodes for filtering if present,
  // otherwise use the selection itself
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

  if (message.docOptions.skipLockedLayer) {
    filteredSelection = skipLockLayersAndChildren(filteredSelection);
  }

  if (filteredSelection.length === 0) {
    figma.notify("❌ Please select at least one object.");
    return;
  }

  const predefinedNames = {
    image: "Image",
    text: "Text",
    frame: "Frame",
    group: "Group",
    rectangle: "Rectangle",
    ellipse: "Ellipse",
    line: "Line",
    polygon: "Polygon",
    star: "Star",
    vector: "Vector",
    auto_layout_horizontal: "H Auto Layout",
    auto_layout_vertical: "V Auto Layout",
  };

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

  function shouldRenameNode(node: SceneNode): boolean {
    if (message.docOptions.skipLockedLayer && node.locked) {
      return false;
    }

    if (node.name.startsWith("%") && node.name.endsWith("%")) {
      // Skip custom variable format
      return false;
    }

    return true;
  }

  function getNewName(node: SceneNode): string | null {
    if (message.renameTarget.includes("TEXT") && node.type === "TEXT") {
      return (node as TextNode).characters;
    } else if (
      message.renameTarget.includes("IMAGE") &&
      node.type === "RECTANGLE" &&
      util.hasImageFill(node as RectangleNode)
    ) {
      return predefinedNames.image;
    } else if (
      message.renameTarget.includes("FRAME") &&
      node.type === "FRAME"
    ) {
      if (node.layoutMode === "HORIZONTAL") {
        return predefinedNames.auto_layout_horizontal;
      } else if (node.layoutMode === "VERTICAL") {
        return predefinedNames.auto_layout_vertical;
      } else {
        return predefinedNames.frame;
      }
    } else if (
      message.renameTarget.includes("GROUP") &&
      node.type === "GROUP"
    ) {
      return predefinedNames.group;
    } else if (
      message.renameTarget.includes("RECTANGLE") &&
      node.type === "RECTANGLE"
    ) {
      return predefinedNames.rectangle;
    } else if (
      message.renameTarget.includes("ELLIPSE") &&
      node.type === "ELLIPSE"
    ) {
      return predefinedNames.ellipse;
    } else if (message.renameTarget.includes("LINE") && node.type === "LINE") {
      return predefinedNames.line;
    } else if (
      message.renameTarget.includes("POLYGON") &&
      node.type === "POLYGON"
    ) {
      return predefinedNames.polygon;
    } else if (message.renameTarget.includes("STAR") && node.type === "STAR") {
      return predefinedNames.star;
    } else if (
      message.renameTarget.includes("VECTOR") &&
      node.type === "VECTOR"
    ) {
      return predefinedNames.vector;
    }

    return null;
  }

  function renameNode(node: SceneNode, isTopLevel: boolean) {
    if (isTopLevel && !message.docOptions.includeParentLayer) {
      // Skip renaming the top-level node if includeParentLayer is false
      if ("children" in node) {
        for (const child of node.children) {
          renameNode(child, false);
        }
      }
      return;
    }

    if (shouldRenameNode(node)) {
      const newName = getNewName(node);
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
    if (message.docOptions.deleteHiddenLayer) {
      deleteHiddenLayers(selectedNode);
    } else {
      renameNode(selectedNode, false);
    }
  });

  topLevelNodesWithChildren.forEach((topLevelNode) => {
    if (message.docOptions.includeParentLayer) {
      const newName = getNewName(topLevelNode);
      if (newName !== null) {
        topLevelNode.name = newName;
      }
    }
  });

  figma.notify("✅ The selected object has been renamed.");
}
