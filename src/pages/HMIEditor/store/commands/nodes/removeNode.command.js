import { unindexNodesCOW } from "../../utils/bindings";
import { recalcGroupsUpwardsCOW } from "../../utils/groups";
import {
    collectAffectedGroups,
    collectParentsToFix,
    collectSubtreeIds,
    deleteNodesInSetCOW,
    pruneDeadChildrenCOW,
    pruneEmptyGroupsCascade,
} from "../../utils/nodes";
import { runCommand } from "../runCommand";

export const removeNodesCommand = (api, ids) => {
    runCommand(api, "cmd/nodes/removeNodes", (state) => {
        // page guard
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        // 1) собрать ids поддеревьев
        const deleteSet = collectSubtreeIds(ids, state.nodes);
        if (!deleteSet.size) return null;

        // 2) подготовить patch nodes и контейнеры
        let newNodes = { ...state.nodes };
        let newRootIds = page.rootIds ?? [];

        // rootIds чистим просто по deleteSet (быстро и безопасно)
        newRootIds = newRootIds.filter((id) => !deleteSet.has(id));

        // родители, у которых нужно почистить childrenIds
        const parentsToFix = collectParentsToFix(deleteSet, newNodes);

        // 3) почистить childrenIds у родителей (точечно, без полного прохода)
        newNodes = pruneDeadChildrenCOW(newNodes, parentsToFix, deleteSet);

        // 4) удалить ноды
        newNodes = deleteNodesInSetCOW(newNodes, deleteSet);

        // 5) каскад: удалить группы, которые стали пустыми
        // Политика: если после удаления у группы childrenIds пуст, удаляем группу тоже,
        // и повторяем вверх по parentId.
        const cascadeResult = pruneEmptyGroupsCascade({
            nodes: newNodes,
            rootIds: newRootIds,
            initialQueue: parentsToFix,
            deleteSet,
        });
        newNodes = cascadeResult.nodes;
        newRootIds = cascadeResult.rootIds;
        const extraDeleted = cascadeResult.extraDeleted;

        // 6) пересчет размеров и положения затронутых групп через аффинные преобразования
        const affectedGroups = collectAffectedGroups(parentsToFix, newNodes);
        if (affectedGroups.size) {
            newNodes = recalcGroupsUpwardsCOW(newNodes, affectedGroups);
        }

        // 7) разиндексация (нужно учесть и extraDeleted)
        const allDeleted = [...deleteSet, ...extraDeleted];

        const { varIndex, nodeIndex } = unindexNodesCOW({
            baseNodeIndex: state.nodeIndex,
            baseVarIndex: state.varIndex,
            varIndex: state.varIndex,
            nodeIndex: state.nodeIndex,
            nodeIds: allDeleted,
        });

        // create command patch
        const patch = {
            nodes: newNodes,
            pages: {
                ...state.pages,
                [pageId]: {
                    ...page,
                    rootIds: newRootIds,
                },
            },
            varIndex,
            nodeIndex,
        };

        return {
            patch,
            dirty: true,
            tree: true,
            selection: "clear",
        };
    });
};
