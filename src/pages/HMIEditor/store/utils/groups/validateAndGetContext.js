import { pruneNestedSelection } from "./pruneNestedSelection";

/**
 * Валидирует, что:
 * 1. Выбрано минимум 2 объекта.
 * 2. Все объекты имеют одного и того же родителя.
 */
export function validateAndGetContext(ids, nodes) {
    const flatIds = pruneNestedSelection(ids, nodes);
    if (flatIds.length < 2) return null;

    const first = nodes[flatIds[0]];
    if (!first) return null;

    const parentId = first.parentId ?? null;

    for (const id of flatIds) {
        const n = nodes[id];
        if (!n) return null;
        if ((n.parentId ?? null) !== parentId) return null;
    }

    return { flatIds, parentId };
}
