import {
    buildReorderResponse,
    calculateReorderChanges,
    groupNodesByParent,
} from "../../utils/nodes";
import { runCommand } from "../runCommand";

export const reorderLayersCommand = (api, ids, dir) => {
    runCommand(api, "cmd/nodes/reorderLayers", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        // 1) группируем выбранные id по parentId
        // parentId|null -> string[]
        const byParent = groupNodesByParent(ids, state.nodes);
        if (byParent.size === 0) return null;

        // 2) для каждого родителя делаем reorder внутри его контейнера
        const changes = calculateReorderChanges({
            byParent,
            stateNodes: state.nodes,
            currentRootIds: page.rootIds ?? [],
            dir,
        });
        if (!changes) return null;

        // 3. Формируем объект ответа
        return buildReorderResponse({
            state,
            pageId,
            page,
            newRootIds: changes.newRootIds,
            nodesPatch: changes.nodesPatch,
        });
    });
};
