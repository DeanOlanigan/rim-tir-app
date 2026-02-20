import { runCommand } from "../runCommand";
import {
    createUngroupPatch,
    getValidGroupIds,
    groupGroupsByParent,
    processContainerUngrouping,
    recalcGroupsUpwardsCOW,
    updateParentNode,
} from "../../utils/groups";

export const ungroupNodesCommand = (api, ids) => {
    runCommand(api, "cmd/groups/ungroupNodes", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        // 1. Фильтрация: оставляем только группы верхнего уровня выборки
        const groupIds = getValidGroupIds(ids, state.nodes);
        if (!groupIds.length) return null;

        // 2. Группировка по родителям (чтобы обрабатывать контейнеры раздельно)
        // grouping by parent container (root=null or groupId)
        const byParent = groupGroupsByParent(groupIds, state.nodes);

        let newNodes = { ...state.nodes };
        let newRootIds = [...(page.rootIds ?? [])];
        const nextSelection = [];
        const affectedGroups = new Set();

        // 3. Обработка каждого родителя
        for (const [parentId, gids] of byParent.entries()) {
            // Получаем текущий список детей
            const currentContainerIds =
                parentId === null
                    ? newRootIds
                    : (newNodes[parentId]?.childrenIds ?? []);

            // Выполняем разгруппировку внутри этого контейнера
            const result = processContainerUngrouping({
                parentId,
                containerIds: currentContainerIds,
                groupsToUngroup: gids,
                nodes: newNodes,
            });

            // Применяем изменения
            newNodes = result.nodes; // Обновленные ноды (с пересчитанными детьми)
            nextSelection.push(...result.newChildIds);

            if (parentId === null) {
                newRootIds = result.containerIds;
            } else {
                updateParentNode(newNodes, parentId, result.containerIds);
                affectedGroups.add(parentId);
            }
        }

        // 4. Пересчет размеров родительских групп (если разгруппировали внутри другой группы)
        if (affectedGroups.size) {
            newNodes = recalcGroupsUpwardsCOW(newNodes, affectedGroups);
        }

        // 5. Формирование финального патча
        return createUngroupPatch({
            state,
            pageId,
            page,
            newNodes,
            newRootIds,
            deletedGroupIds: groupIds,
            nextSelection,
        });
    });
};
