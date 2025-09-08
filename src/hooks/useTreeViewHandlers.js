import { useVariablesStore } from "@/store/variables-store";
import { useCallback } from "react";
import { getParentType, initDefaultDataByPath } from "@/utils/utils";
import { useContextMenuStore } from "@/store/contextMenu-store";
import { TREE_TYPES } from "@/config/constants";

export function useTreeViewHandlers(treeType, ref) {
    const addNode = useVariablesStore((state) => state.addNode);
    const renameNode = useVariablesStore((state) => state.renameNode);
    const removeNode = useVariablesStore((state) => state.removeNode);
    const moveNode = useVariablesStore((state) => state.moveNode);
    const createSetting = useVariablesStore((state) => state.createSetting);
    const updateSelectedIds = useVariablesStore(
        (state) => state.updateSelectedIds
    );
    const updateContext = useContextMenuStore((state) => state.updateContext);

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
            //return node;
        },
        [addNode, createSetting, treeType /* , ref */]
    );
    const handleDeleteNode = useCallback(
        ({ ids }) => {
            removeNode(treeType, ids);
        },
        [removeNode, treeType]
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
            e.preventDefault();
            e.stopPropagation();
            ref?.current.root.focus();
            ref?.current.root.select();
            updateContext({
                apiPath: ref?.current,
                x: e.clientX,
                y: e.clientY,
                visible: true,
            });
        },
        [ref, updateContext]
    );
    const handleSelect = useCallback(() => {
        if (ref?.current?.selectedIds?.size === 0) {
            ref?.current?.root?.focus();
            ref?.current?.root?.select();
        }
        // Проверка на разность типов узлов,
        // оставлять только один выбранный узел, если типы разные
        if (ref?.current?.selectedIds?.size > 1) {
            const selectedNodes = Array.from(ref?.current?.selectedIds).map(
                (id) => ref?.current?.get(id)
            );
            const firstPath = selectedNodes[0].data.path;
            const isSamePath = selectedNodes.every(
                (node) => node.data.path === firstPath
            );
            if (!isSamePath) {
                const lastNodeId = selectedNodes[selectedNodes.length - 1].id;
                ref?.current?.select(lastNodeId);
                ref?.current?.focus(lastNodeId);
            }
        }

        updateSelectedIds(settingType, ref?.current?.selectedIds);
    }, [updateSelectedIds, ref, settingType]);

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
