import { Tree } from "react-arborist";
import styles from "../../../components/TreeView/TreeView.module.css";
import { memo, forwardRef } from "react";
import { AutoSizer } from "react-virtualized";
import { DropCursor } from "../../../components/TreeView/DropCursor";
import { Node } from "./Node";
import { Box } from "@chakra-ui/react";
import { useTreeViewHandlers } from "../../../hooks/useTreeViewHandlers";
import { combineRefs } from "../../../utils/utils";
import { useDragDropManager } from "react-dnd";
import { useHotkeys } from "react-hotkeys-hook";
import { useVariablesStore } from "../../../store/variables-store";
import { getIdsSetWithoutNested } from "../../../utils/treeUtils";

export const TreeView = memo(
    forwardRef(function TreeView({ data, treeType }, ref) {
        console.log("%cRender NEW TreeView", "color: white; background: red;");
        const dragDropManager = useDragDropManager();
        const {
            handleRenameNode,
            handleCreateNode,
            handleDeleteNode,
            handleMoveNode,
            handleContextMenu,
            handleSelect,
            handleDisableDrop,
        } = useTreeViewHandlers(treeType, ref);

        // TODO Улучшать хоткеи, вынести в отдельный хук, ограничить вставку
        const cutRef = useHotkeys("ctrl+x", () => {
            console.log("cut from hotkey", treeType);
            const baseIds = ref.current.root.children.map((child) => child.id);
            const cutNodeFunc = useVariablesStore.getState().cutNode;
            const copyNode = useVariablesStore.getState().copyNode;
            const ids =
                ref.current.selectedIds.size > 1
                    ? [...ref.current.selectedIds]
                    : ref.current.focusedNode
                    ? [ref.current.focusedNode.data.id]
                    : [];
            cutNodeFunc(ref.current, baseIds, false);
            copyNode(ref.current, ids, true);
            cutNodeFunc(ref.current, ids, true);
        });

        const copyRef = useHotkeys("ctrl+c", () => {
            console.log("copy from hotkey", treeType);
            const baseIds = ref.current.root.children.map((child) => child.id);
            const cutNodeFunc = useVariablesStore.getState().cutNode;
            const copyNode = useVariablesStore.getState().copyNode;
            const ids =
                ref.current.selectedIds.size > 1
                    ? [...ref.current.selectedIds]
                    : ref.current.focusedNode
                    ? [ref.current.focusedNode.data.id]
                    : [];
            cutNodeFunc(ref.current, baseIds, false);
            copyNode(ref.current, ids, true);
            cutNodeFunc(ref.current, ids, true);
        });

        const pasteRef = useHotkeys("ctrl+v", () => {
            console.log("paste from hotkey", treeType);
            const pasteNode = useVariablesStore.getState().pasteNode;
            const removeNode = useVariablesStore.getState().removeNode;
            const { cut, normalized } = useVariablesStore.getState().copyBuffer;
            const ids = Object.keys(normalized);
            const [...clearIds] = getIdsSetWithoutNested(ref.current, ids);
            console.log("isCut", cut, clearIds);
            cut && removeNode(treeType, clearIds);
            pasteNode(ref.current);
        });

        return (
            <Box
                ref={combineRefs(cutRef, copyRef, pasteRef)}
                w={"100%"}
                h={"100%"}
                position={"relative"}
                onContextMenu={handleContextMenu}
            >
                <AutoSizer>
                    {({ height, width }) => (
                        <Tree
                            ref={ref}
                            data={data}
                            treeType={treeType}
                            height={height}
                            width={width}
                            className={styles.tree}
                            openByDefault={true}
                            overscanCount={2}
                            rowHeight={32}
                            indent={16}
                            renderCursor={DropCursor}
                            onRename={handleRenameNode}
                            onCreate={handleCreateNode}
                            onDelete={handleDeleteNode}
                            onMove={handleMoveNode}
                            onSelect={handleSelect}
                            disableDrop={handleDisableDrop}
                            dndManager={dragDropManager}
                            /* disableEdit={(data) =>
                                data.type ===
                                CONSTANT_VALUES.NODE_TYPES.dataObject
                            } */
                        >
                            {Node}
                        </Tree>
                    )}
                </AutoSizer>
            </Box>
        );
    })
);
