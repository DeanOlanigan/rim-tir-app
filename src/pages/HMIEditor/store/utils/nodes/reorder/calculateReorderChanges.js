import { arraysEqual } from "@/utils/utils";
import { reorderRootIds } from "./reorderRootIds";

/**
 * Основная логика вычисления перестановок.
 * Проходит по сгруппированным ID и формирует новые списки.
 */
export function calculateReorderChanges({
    byParent,
    stateNodes,
    currentRootIds,
    dir,
}) {
    let newRootIds = currentRootIds ?? [];
    let nodesPatch = null;
    let hasChanges = false;

    for (const [parentId, moveIds] of byParent.entries()) {
        // Логика для Root
        if (parentId === null) {
            const nextRootIds = reorderRootIds(newRootIds, moveIds, dir);
            if (!arraysEqual(nextRootIds, newRootIds)) {
                newRootIds = nextRootIds;
                hasChanges = true;
            }
            continue;
        }

        // Логика для обычных нод (контейнеров)
        const parentNode = nodesPatch?.[parentId] ?? stateNodes[parentId];
        if (!parentNode) continue;

        const prevChildren = parentNode.childrenIds ?? [];
        const nextChildren = reorderRootIds(prevChildren, moveIds, dir);

        if (!arraysEqual(nextChildren, prevChildren)) {
            // Ленивая инициализация nodesPatch (Copy-On-Write)
            if (!nodesPatch) nodesPatch = { ...stateNodes };

            nodesPatch[parentId] = {
                ...parentNode,
                childrenIds: nextChildren,
            };
            hasChanges = true;
        }
    }

    return { newRootIds, nodesPatch, hasChanges };
}
