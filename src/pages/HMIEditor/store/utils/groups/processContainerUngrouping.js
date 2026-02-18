import { reparentChildrenToNewParent } from "./reparentChildrenToNewParent";
import { replaceGroupWithChildren } from "./replaceGroupWithChildren";

/**
 * Основная логика разгруппировки для одного контейнера.
 * Сортирует группы справа налево и заменяет их на детей.
 */
export function processContainerUngrouping({
    parentId,
    containerIds,
    groupsToUngroup,
    nodes,
}) {
    let currentContainerIds = containerIds;
    // Работаем с копией nodes (или мутируем переданную, если это допустимо в контексте COW)
    // Здесь мутируем переданную копию newNodes из основной функции для простоты
    const updatedNodes = nodes;
    const newChildIds = [];

    // Сортируем справа налево, чтобы индексы не смещались при заменах
    const orderedGroups = groupsToUngroup
        .map((gid) => ({ gid, idx: currentContainerIds.indexOf(gid) }))
        .filter((x) => x.idx !== -1)
        .sort((a, b) => b.idx - a.idx);

    for (const { gid } of orderedGroups) {
        const groupNode = updatedNodes[gid];
        if (!groupNode) continue;

        const childrenIds = groupNode.childrenIds ?? [];

        // 1. Перенос детей в систему координат нового родителя
        reparentChildrenToNewParent(updatedNodes, groupNode, parentId);

        // 2. Замена ID группы на ID детей в массиве контейнера
        const rep = replaceGroupWithChildren(
            currentContainerIds,
            gid,
            childrenIds,
        );

        if (rep) {
            currentContainerIds = rep.nextContainerIds;
            newChildIds.push(...childrenIds);
        }

        // 3. Удаление самой группы
        delete updatedNodes[gid];
    }

    return {
        containerIds: currentContainerIds,
        nodes: updatedNodes,
        newChildIds,
    };
}
