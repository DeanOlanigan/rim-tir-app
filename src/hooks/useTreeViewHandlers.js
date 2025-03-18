import { useVariablesStore } from "../store/variables-store";
import { useCallback } from "react";
import { v4 as uuid4 } from "uuid";
import {
    DEFAULT_CONFIGURATION_DATA,
    DEFAULT_DATA_OBJECT_SETTING,
} from "../config/constants";
import { getParentType } from "../utils/utils";

export function useTreeViewHandlers(treeType, ref) {
    const {
        addNode,
        renameNode,
        removeNode,
        moveNode,
        createSetting,
        updateSelectedIds,
        unbindVariable,
    } = useVariablesStore((state) => state);

    const handleRenameNode = useCallback(
        ({ id, name }) => {
            console.log(ref?.current.get(id));
            renameNode(treeType, id, name);
        },
        [renameNode, treeType, ref]
    );
    const handleCreateNode = useCallback(
        ({ parentId, index, type }) => {
            if (type === "leaf" || type === "internal") return;
            console.log("create", parentId, index, type);
            const id = uuid4();
            const node = {
                id: id,
                ...DEFAULT_CONFIGURATION_DATA[type].node,
            };
            const setting = {
                id: id,
                parentId,
                ...DEFAULT_CONFIGURATION_DATA[type].setting,
            };
            if (type === "dataObject") {
                const parentType = getParentType({
                    id: parentId,
                    treeApi: ref?.current,
                });
                setting.setting = DEFAULT_DATA_OBJECT_SETTING[parentType];
            }
            addNode(treeType, parentId, node);
            createSetting(id, setting);
            return node;
        },
        [addNode, createSetting, treeType, ref]
    );
    const handleDeleteNode = useCallback(
        ({ ids }) => {
            ids.forEach((value) => {
                unbindVariable(value);
            });
            removeNode(treeType, ids);
        },
        [removeNode, treeType, unbindVariable]
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
            //e.stopPropagation();
            ref?.current.root.focus();
            ref?.current.root.select();
        },
        [ref]
    );
    const handleSelect = useCallback(() => {
        if (ref?.current?.selectedIds?.size === 0) {
            ref?.current?.root?.focus();
            ref?.current?.root?.select();
        }
        updateSelectedIds(
            treeType === "send" || treeType === "receive"
                ? "connections"
                : treeType,
            ref?.current?.selectedIds
        );
    }, [updateSelectedIds, treeType, ref]);

    const handleDisableDrop = useCallback(({ parentNode, dragNodes }) => {
        //console.log("dragNodesType", dragNodes[0]?.data.type);
        if (!parentNode || dragNodes.length === 0) return true;
        const isDragNodesTypeSame = dragNodes.every(
            (node) => node.data.type === dragNodes[0].data.type
        );
        //console.log("isDragNodesTypeSame", isDragNodesTypeSame);
        if (!isDragNodesTypeSame) return true;
        const dragParentType = getParentType({
            checkNode: dragNodes[0].parent,
        });
        const parentType = getParentType({ checkNode: parentNode });
        //console.log("parentType", dragParentType, parentType);
        if (parentType === dragParentType) return false;
        return true;
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
