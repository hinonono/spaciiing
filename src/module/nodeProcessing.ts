
import { AdditionalFilterOptions } from "../types/Messages/MessageSelectionFilter";

/**
 * Processes a list of SceneNodes by applying various filtering options.
 * 
 * Options:
 * - skipLocked: Exclude locked nodes and their children
 * - skipHidden: Exclude nodes that are not visible (including inherited visibility)
 * - findCriteria: Only include nodes whose name matches the given string
 * - includeParentLayer: Include all parent layers of the resulting nodes
 *
 * Returns a flat array of nodes that match the criteria.
 */
export function getProcessedNodes(
    nodes: SceneNode[],
    options: AdditionalFilterOptions,
): SceneNode[] {
    // const nodes = utils.editor.getCurrentSelection();

    // Recursively exclude locked nodes and their children
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

    // Recursively exclude nodes that are hidden, including inherited visibility from parents
    function skipHiddenLayersAndChildren(
        nodes: readonly SceneNode[],
        parentVisible: boolean = true
    ): SceneNode[] {
        let result: SceneNode[] = [];
        for (const node of nodes) {
            const nodeVisible = parentVisible && node.visible;
            if (!nodeVisible) continue;
            result.push(node);
            if ("children" in node) {
                result = result.concat(
                    skipHiddenLayersAndChildren(node.children, nodeVisible)
                );
            }
        }
        return result;
    }

    // Recursively filter nodes whose name matches the provided findCriteria
    function filterByName(
        nodes: readonly SceneNode[],
        name: string
    ): SceneNode[] {
        const matches: SceneNode[] = [];
        for (const node of nodes) {
            if (node.name === name) {
                matches.push(node);
            }
            if ("children" in node) {
                matches.push(...filterByName(node.children, name));
            }
        }
        return matches;
    }

    // Start with the initial node list
    let processed = [...nodes];

    // Apply visibility filter if requested
    if (options.skipHiddenLayers === true) {
        processed = skipHiddenLayersAndChildren(processed);
    }

    // Apply locked layer filter if requested
    if (options.skipLockLayers === true) {
        processed = skipLockLayersAndChildren(processed);
    }

    // Filter by name if criteria is provided
    if (options.findWithName) {
        processed = filterByName(processed, options.findCriteria);
    }

    const seen = new Set<string>();
    const uniqueNodes = processed.filter(node => {
        if (seen.has(node.id)) return false;
        seen.add(node.id);
        return true;
    });

    return uniqueNodes;
}