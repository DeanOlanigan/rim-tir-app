import { Tree } from "react-arborist";
import styles from "../../../components/TreeView/TreeView.module.css";
import { memo, forwardRef } from "react";
import { AutoSizer } from "react-virtualized";

import { DropCursor } from "../../../components/TreeView/DropCursor";
import { ContextMenuWrapper } from "./ContextMenuWrapper";
import Node from "./Node";
import { useCallback } from "react";
import { useVariablesStore } from "../../../store/variables-store";
import { v4 as uuid4 } from "uuid";
import { Box } from "@chakra-ui/react";

export const TreeView = memo(
    forwardRef(function TreeView(props, ref) {
        console.log("%cRender NEW TreeView", "color: white; background: red;");
        const addNode = useVariablesStore((state) => state.addNode);
        const updateNode = useVariablesStore((state) => state.updateNode);
        const removeNode = useVariablesStore((state) => state.removeNode);
        const moveNode = useVariablesStore((state) => state.moveNode);

        const setSettings = useVariablesStore((state) => state.setSettings);

        const setSelectedIds = useVariablesStore(
            (state) => state.setSelectedIds
        );

        const handleRenameNode = useCallback(
            ({ id, name }) => {
                updateNode(id, { name });
            },
            [updateNode]
        );

        // Формируй данные перед отправкой в стор, иначе дерево ебланит
        const handleCreateNode = useCallback(
            ({ parentId, index, type }) => {
                if (type === "leaf" || type === "internal") return;
                console.log("create", parentId, index, type);
                if (type === "folder") {
                    const id = uuid4();
                    const node = {
                        id: id,
                        type: "folder",
                        name: "Новая папка",
                        ignoreChildren: false,
                        children: [],
                    };
                    const setting = {
                        id: id,
                        description: "Описание",
                        group: "",
                        alias: "",
                        tags: [],
                    };
                    addNode(parentId, node);
                    setSettings(node.id, setting);
                    return node;
                }
                if (type === "variable") {
                    const id = uuid4();
                    const node = {
                        id: id,
                        type: "variable",
                        name: "Новая переменная",
                    };
                    const setting = {
                        id: id,
                        isSpecial: false,
                        type: "bit",
                        isLua: false,
                        description: "Lorem ipsum dolor sit amet consectetur",
                        cmd: true,
                        archive: true,
                        group: "noGroup",
                        measurement: null,
                        coefficient: "",
                        luaExpression: "",
                        specialCycleDelay: null,
                    };
                    addNode(parentId, node);
                    setSettings(node.id, setting);
                    return node;
                }
            },
            [addNode, setSettings]
        );

        const handleDeleteNode = useCallback(
            ({ ids }) => {
                removeNode(ids);
            },
            [removeNode]
        );

        const handleMoveNode = useCallback(
            ({ dragIds, parentId, index }) => {
                moveNode(dragIds, parentId, index);
            },
            [moveNode]
        );

        return (
            <Box w={"100%"} h={"100%"}>
                <AutoSizer>
                    {({ height, width }) => (
                        <ContextMenuWrapper
                            apiPath={ref?.current}
                            type={props.type}
                        >
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
                                onSelect={() => {
                                    if (ref?.current.selectedIds.size === 0) {
                                        ref?.current.root.focus();
                                        ref?.current.root.select();
                                    }
                                    setSelectedIds(ref?.current.selectedIds);
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    ref?.current.root.focus();
                                    ref?.current.root.select();
                                }}
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
