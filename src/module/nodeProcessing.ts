export function getProcessedNodes(
    nodes: readonly SceneNode[],
    options: {
        skipLocked?: boolean;
        skipHidden?: boolean;
        findCriteria?: string;
        includeParentLayer?: boolean;
    }
): SceneNode[] {
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

    let processed = [...nodes];
    if (options.skipHidden) {
        processed = skipHiddenLayersAndChildren(processed);
    }
    if (options.skipLocked) {
        processed = skipLockLayersAndChildren(processed);
    }
    if (options.findCriteria) {
        processed = filterByName(processed, options.findCriteria);
    }

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