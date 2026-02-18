import { nanoid } from "nanoid";
import { runCommand } from "../runCommand";
import { createGroupNode } from "../../fabrics";
import {
    createGroupPatch,
    reparentChildrenToGroup,
    replaceChildrenWithGroup,
    validateAndGetContext,
} from "../../utils/groups";

export const groupNodesCommand = (api, ids, bbox) => {
    runCommand(api, "cmd/groups/groupNodes", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        // 1. Валидация и получение контекста (parentId, flatIds)
        const context = validateAndGetContext(ids, state.nodes);
        if (!context) return null;
        const { flatIds, parentId } = context;

        // 2. Получение текущего списка детей контейнера
        const containerIds =
            parentId === null
                ? (page.rootIds ?? [])
                : (state.nodes[parentId]?.childrenIds ?? []);

        // 3. Создание группы и определение порядка
        const groupId = nanoid(12);
        const replaced = replaceChildrenWithGroup(
            containerIds,
            flatIds,
            groupId,
            "max",
        );
        if (!replaced) return null;

        const { nextContainerIds, orderedChildIds } = replaced;

        // 4. Создание объекта новой группы
        const groupNode = createGroupNode(
            groupId,
            bbox,
            orderedChildIds,
            parentId,
        );

        // 5. Пересчет координат детей
        const newNodes = reparentChildrenToGroup({
            nodes: state.nodes,
            groupNode,
            childIds: orderedChildIds,
        });
        if (!newNodes) return null;

        return createGroupPatch({
            state,
            pageId,
            page,
            parentId,
            nextContainerIds,
            newNodes,
            groupId,
        });
    });
};
