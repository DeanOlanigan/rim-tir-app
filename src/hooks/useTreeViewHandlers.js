import { useVariablesStore } from "@/store/variables-store";
import { useCallback } from "react";
import { getParentType, initDefaultData } from "@/utils/utils";
import { useContextMenuStore } from "@/store/contextMenu-store";
import { CONSTANT_VALUES } from "@/config/constants";

export function useTreeViewHandlers(treeType, ref) {
    const addNode = useVariablesStore((state) => state.addNode);
    const renameNode = useVariablesStore((state) => state.renameNode);
    const removeNode = useVariablesStore((state) => state.removeNode);
    const moveNode = useVariablesStore((state) => state.moveNode);
    const createSetting = useVariablesStore((state) => state.createSetting);
    const updateSelectedIds = useVariablesStore(
        (state) => state.updateSelectedIds
    );
    const unbindVariable = useVariablesStore((state) => state.unbindVariable);
    const updateContext = useContextMenuStore((state) => state.updateContext);

    const settingType =
        treeType === CONSTANT_VALUES.TREE_TYPES.send ||
        treeType === CONSTANT_VALUES.TREE_TYPES.receive
            ? "connections"
            : treeType;

    const handleRenameNode = useCallback(
        ({ id, name }) => {
            /* const uniqueName = getUniqueName(
                ref?.current.root.children,
                name,
                id
            );
            if (uniqueName !== name) {
                toaster.create({
                    title: "Внимание",
                    description: `Такое имя уже существует, взято "${uniqueName}"`,
                    type: "warning",
                });
            } */
            renameNode(treeType, id, name);
        },
        [renameNode, treeType /* ref */]
    );
    const handleCreateNode = useCallback(
        ({ parentId, index, type }) => {
            if (type.nodeType === "leaf" || type.nodeType === "internal")
                return;
            console.log("create", parentId, index, type, treeType);
            const nodes = [];
            const settings = [];
            for (let i = 0; i < type.times; i++) {
                const { node, setting } = initDefaultData(
                    type.nodeType,
                    parentId || treeType,
                    ref?.current
                );
                const name = `${node.name} ${node.id.slice(0, 8)}`;
                /* const name = getUniqueName(
                    ref?.current.root.children,
                    node.name
                ); */
                node.name = name;
                setting.name = name;
                setting.rootId = treeType;
                nodes.push(node);
                settings.push(setting);
            }
            console.log(nodes, settings);
            addNode(treeType, parentId || treeType, nodes);
            createSetting(settings);
            //return node;
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
            e.stopPropagation();
            ref?.current.root.focus();
            ref?.current.root.select();
            updateContext({
                apiPath: ref?.current,
                treeType: treeType,
                type: null,
                subType: null,
                x: e.clientX,
                y: e.clientY,
                visible: true,
            });
        },
        [ref, treeType, updateContext]
    );
    const handleSelect = useCallback(() => {
        if (ref?.current?.selectedIds?.size === 0) {
            ref?.current?.root?.focus();
            ref?.current?.root?.select();
        }
        updateSelectedIds(settingType, ref?.current?.selectedIds);
    }, [updateSelectedIds, ref, settingType]);

    const handleDisableDrop = useCallback(({ parentNode, dragNodes }) => {
        if (!parentNode || dragNodes.length === 0) return true;
        const isDragNodesTypeSame = dragNodes.every(
            (node) => node.data.type === dragNodes[0].data.type
        );
        if (!isDragNodesTypeSame) return true;
        const dragParentType = getParentType({
            checkNode: dragNodes[0].parent,
        });
        const parentType = getParentType({ checkNode: parentNode });
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
