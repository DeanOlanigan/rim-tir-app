import { Tree } from "react-arborist";
import styles from "../../../components/TreeView/TreeView.module.css";
import { memo, forwardRef } from "react";
import { AutoSizer } from "react-virtualized";

import { DropCursor } from "../../../components/TreeView/DropCursor";
import { ContextMenuWrapper } from "./ContextMenuWrapper";
import Node from "./Node";
import { useCallback } from "react";
import { useVariablesStore } from "../../../store/variables-store";
import { shallow } from "zustand/shallow";
import { v4 as uuid4 } from "uuid";
import { Box } from "@chakra-ui/react";
import { DEFAULT_CONFIGURATION_DATA } from "../../../config/constants";

export const TreeView = memo(
    forwardRef(function TreeView(props, ref) {
        console.log("%cRender NEW TreeView", "color: white; background: red;");
        const addNode = useVariablesStore((state) => state.addNode);
        const renameNode = useVariablesStore((state) => state.renameNode);
        const removeNode = useVariablesStore((state) => state.removeNode);
        const moveNode = useVariablesStore((state) => state.moveNode);

        const createSetting = useVariablesStore((state) => state.createSetting);

        const selectedIds = useVariablesStore(
            (state) => state.selectedIds[props.type]
        );
        const setSelectedIds = useVariablesStore(
            (state) => state.setSelectedIds
        );

        const handleRenameNode = useCallback(
            ({ id, name }) => {
                renameNode(props.treeType, id, name);
            },
            [renameNode, props.treeType]
        );
        // Формируй данные перед отправкой в стор, иначе дерево ебланит
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
                addNode(props.treeType, parentId, node);
                createSetting(id, setting);
                return node;

                /* if (type === "variable") {
                    const id = uuid4();
                    const node = {
                        id: id,
                        ...DEFAULT_VARIABLE,
                    };
                    const setting = {
                        id: id,
                        parentId,
                        ...DEFAULT_VARIABLE,
                        setting: { ...DEFAULT_VARIABLE_SETTING },
                    };
                    addNode("variables", parentId, node);
                    createSetting(id, setting);
                    return node;
                } */
            },
            [addNode, createSetting, props.treeType]
        );
        const handleDeleteNode = useCallback(
            ({ ids }) => {
                removeNode(props.treeType, ids);
            },
            [removeNode, props.treeType]
        );
        const handleMoveNode = useCallback(
            ({ dragIds, parentId, index }) => {
                console.log(dragIds, parentId, index);
                moveNode(props.treeType, dragIds, parentId, index);
            },
            [moveNode, props.treeType]
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

            if (shallow(selectedIds, ref?.current.selectedIds)) {
                return;
            }

            setSelectedIds("variables", ref?.current.selectedIds);
        }, [ref, selectedIds, setSelectedIds]);

        return (
            <Box w={"100%"} h={"100%"}>
                <AutoSizer>
                    {({ height, width }) => (
                        <ContextMenuWrapper apiPath={ref?.current}>
                            <Tree
                                ref={ref}
                                {...props}
                                height={height}
                                width={width}
                                className={styles.tree}
                                openByDefault={true}
                                overscanCount={2}
                                rowHeight={32}
                                indent={16}
                                renderCursor={DropCursor}
                                onSelect={handleSelect}
                                onContextMenu={handleContextMenu}
                                onCreate={handleCreateNode}
                                onDelete={handleDeleteNode}
                                onRename={handleRenameNode}
                                onMove={handleMoveNode}
                            >
                                {Node}
                            </Tree>
                        </ContextMenuWrapper>
                    )}
                </AutoSizer>
            </Box>
        );
    })
);
