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
    nodes: readonly SceneNode[],
    options: {
        skipLocked?: boolean;
        skipHidden?: boolean;
        findCriteria?: string;
        includeParentLayer?: boolean;
    }
): SceneNode[] {
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
    if (options.skipHidden) {
        processed = skipHiddenLayersAndChildren(processed);
    }

    // Apply locked layer filter if requested
    if (options.skipLocked) {
        processed = skipLockLayersAndChildren(processed);
    }

    // Filter by name if criteria is provided
    if (options.findCriteria) {
        processed = filterByName(processed, options.findCriteria);
    }

    // Optionally include parent layers of matched nodes
    if (options.includeParentLayer) {
        const parentSet = new Set<SceneNode>();
        for (const node of processed) {
            let current = node.parent;
            while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
                if (!parentSet.has(current)) {
                    parentSet.add(current);
                }
                current = current.parent;
            }
        }
        processed = [...processed, ...Array.from(parentSet)];
    }

    return processed;
}