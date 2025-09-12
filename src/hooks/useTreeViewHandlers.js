import { useVariablesStore } from "@/store/variables-store";
import { useCallback } from "react";
import { getParentType, initDefaultDataByPath } from "@/utils/utils";
import { useContextMenuStore } from "@/store/contextMenu-store";
import { TREE_TYPES } from "@/config/constants";
import { useTreeRegistry } from "@/store/tree-registry-store";

export function useTreeViewHandlers(treeType) {
    const {
        addNode,
        renameNode,
        removeNode,
        moveNode,
        createSetting,
        updateSelectedIds,
    } = useVariablesStore.getState();
    const { updateContext } = useContextMenuStore.getState();
    const api = useTreeRegistry(
        useCallback((s) => s.apis["config"]?.[treeType] ?? null, [treeType]),
        Object.is
    );

    const settingType =
        treeType === TREE_TYPES.send || treeType === TREE_TYPES.receive
            ? "connections"
            : treeType;

    const handleRenameNode = useCallback(
        ({ id, name }) => {
            renameNode(id, name);
        },
        [renameNode]
    );
    const handleCreateNode = useCallback(
        ({ parentId, type }) => {
            if (type === "leaf" || type === "internal") return;
            const trueParentId = parentId || treeType;
            const treeNodes = [];
            const flatNodes = [];
            for (let i = 0; i < type.times; i++) {
                const { treeNode, flatNode } = initDefaultDataByPath(
                    type.path,
                    trueParentId
                );
                flatNode.rootId = treeType;
                treeNodes.push(treeNode);
                flatNodes.push(flatNode);
            }
            addNode(treeType, trueParentId, treeNodes);
            createSetting(flatNodes);
        },
        [addNode, createSetting, treeType]
    );
    const handleDeleteNode = useCallback(
        ({ ids }) => {
            const rootIds = new Set(Object.values(TREE_TYPES));
            if (ids.some((id) => rootIds.has(id))) {
                api.focus(ids[0]);
            } else {
                removeNode(treeType, ids);
            }
            api.deselectAll();
        },
        [removeNode, treeType, api]
    );
    const handleMoveNode = useCallback(
        ({ dragIds, parentId, index }) => {
            console.log("handleMoveNode", dragIds, parentId, index);
            moveNode(treeType, dragIds, parentId, index);
        },
        [moveNode, treeType]
    );
    const handleContextMenu = useCallback(
        (e) => {
            if (!api) return;
            e.preventDefault();
            e.stopPropagation();
            api.root.focus();
            api.root.select();
            updateContext({
                apiPath: api,
                x: e.clientX,
                y: e.clientY,
                visible: true,
            });
        },
        [api, updateContext]
    );
    const handleSelect = useCallback(() => {
        if (!api) return;
        if (api.hasNoSelection) {
            api.root.children[0].focus();
        }

        // Проверка на разность типов узлов,
        // оставлять только один выбранный узел, если типы разные
        if (api?.selectedIds?.size > 1) {
            const selectedNodes = Array.from(api?.selectedIds).map((id) =>
                api?.get(id)
            );
            const firstPath = selectedNodes[0].data.path;
            const isSamePath = selectedNodes.every(
                (node) => node.data.path === firstPath
            );
            if (!isSamePath) {
                const lastNodeId = selectedNodes[selectedNodes.length - 1].id;
                api?.select(lastNodeId);
                api?.focus(lastNodeId);
            }
        }

        updateSelectedIds(settingType, api?.selectedIds);
    }, [updateSelectedIds, api, settingType]);

    const handleDisableDrop = useCallback(({ parentNode, dragNodes }) => {
        if (!parentNode || dragNodes.length === 0) return true;
        const isDragNodesTypeSame = dragNodes.every(
            (node) => node.data.path === dragNodes[0].data.path
        );
        if (!isDragNodesTypeSame) return true;
        const dragParentType = getParentType({
            checkNode: dragNodes[0].parent,
        });
        const parentType = getParentType({ checkNode: parentNode });
        return parentType !== dragParentType;
    }, []);

    return {
        handleRenameNode,
        handleCreateNode,
        handleDeleteNode,
        handleMoveNode,
        handleContextMenu,
        handleSelect,
        handleDisableDrop,
    };
}
