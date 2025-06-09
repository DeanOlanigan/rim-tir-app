import { Tree } from "react-arborist";
import styles from "@/components/TreeView/TreeView.module.css";
import { memo, useRef } from "react";
import { AutoSizer } from "react-virtualized";
import { DropCursor } from "@/components/TreeView/DropCursor";
import { Node } from "./Node";
import { Box } from "@chakra-ui/react";
import { useTreeViewHandlers } from "@/hooks/useTreeViewHandlers";
import { useConfigTreeApiStore } from "@/store/config-tree-api-store";
import { CONSTANT_VALUES } from "@/config/constants";

export const TreeView = memo(function TreeView({ data, treeType }) {
    console.log("%cRender NEW TreeView", "color: white; background: red;");
    const variableTreeRef = useRef(null);
    useConfigTreeApiStore
        .getState()
        .setConfigTreeApi(treeType, variableTreeRef);

    const {
        handleRenameNode,
        handleCreateNode,
        handleDeleteNode,
        handleMoveNode,
        handleContextMenu,
        handleSelect,
        handleDisableDrop,
    } = useTreeViewHandlers(treeType, variableTreeRef);

    // TODO Улучшать хоткеи, вынести в отдельный хук, ограничить вставку
    /* const cutRef = useHotkeys("ctrl+x", () => {
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
        }); */

    return (
        <Box
            //ref={combineRefs(cutRef, copyRef, pasteRef)}
            w={"100%"}
            h={"100%"}
            position={"relative"}
        >
            <AutoSizer>
                {({ height, width }) => (
                    <Tree
                        ref={variableTreeRef}
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
                        onContextMenu={handleContextMenu}
                        disableDrop={handleDisableDrop}
                        disableEdit={(data) =>
                            data.type === CONSTANT_VALUES.NODE_TYPES.root
                        }
                    >
                        {Node}
                    </Tree>
                )}
            </AutoSizer>
        </Box>
    );
});
