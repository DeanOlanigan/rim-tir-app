import { useVariablesStore } from "../store/variables-store";
import { useCallback } from "react";
import { v4 as uuid4 } from "uuid";
import {
    DEFAULT_CONFIGURATION_DATA,
    DEFAULT_DATA_OBJECT_SETTING,
} from "../config/constants";
import { getParentType } from "../utils/utils";

export function useTreeViewHandlers(treeType, ref) {
    const addNode = useVariablesStore((state) => state.addNode);
    const renameNode = useVariablesStore((state) => state.renameNode);
    const removeNode = useVariablesStore((state) => state.removeNode);
    const moveNode = useVariablesStore((state) => state.moveNode);
    const createSetting = useVariablesStore((state) => state.createSetting);
    const updateSelectedIds = useVariablesStore(
        (state) => state.updateSelectedIds
    );

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
                const parentType = getParentType(parentId, ref?.current);
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
            removeNode(treeType, ids);
        },
        [removeNode, treeType]
    );
    const handleMoveNode = useCallback(
        ({ dragIds, parentId, index }) => {
            console.log(dragIds, parentId, index);
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
        },
        [ref]
    );
    const handleSelect = useCallback(() => {
        if (ref?.current.selectedIds.size === 0) {
            ref?.current.root.focus();
            ref?.current.root.select();
        }
        updateSelectedIds(
            treeType === "send" || treeType === "receive"
                ? "connections"
                : treeType,
            ref?.current.selectedIds
        );
    }, [updateSelectedIds, treeType, ref]);

    return {
        handleRenameNode,
        handleCreateNode,
        handleDeleteNode,
        handleMoveNode,
        handleContextMenu,
        handleSelect,
    };
}
