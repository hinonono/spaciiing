import { CollectionExplanationable, ColorCollection, NumberCollection } from "../../types/ColorCollection";

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