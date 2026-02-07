import { CollectionExplanationable, ColorCollection, NumberCollection } from "../../types/PresetCollection";
import { CornerRadiusNode } from "../../types/NodeCornerRadius";
import { SingleCornerRadiusNode } from "../../types/NodeSingleCornerRadius";

export function isColorCollection(
    collection: CollectionExplanationable
): collection is ColorCollection {
    return (collection as ColorCollection).members[0]?.color !== undefined;
}

export function isNumberCollection(
    collection: CollectionExplanationable
): collection is NumberCollection {
    return (collection as NumberCollection).members[0]?.value !== undefined;
}

export function isNodeSupportSingleCornerRadius(
    node: SceneNode
): node is SingleCornerRadiusNode {
    return (
        node.type === "COMPONENT" ||
        node.type === "COMPONENT_SET" ||
        node.type === "FRAME" ||
        node.type === "INSTANCE" ||
        node.type === "RECTANGLE"
    );
}

export function isNodeSupportCornerRadius(
    node: SceneNode
): node is CornerRadiusNode {
    return (
        node.type === "BOOLEAN_OPERATION" ||
        node.type === "COMPONENT" ||
        node.type === "COMPONENT_SET" ||
        node.type === "FRAME" ||
        node.type === "INSTANCE" ||
        node.type === "RECTANGLE" ||
        node.type === "STAR" ||
        node.type === "VECTOR"
    );
}