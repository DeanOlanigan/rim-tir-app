import { Tree } from "react-arborist";
import styles from "@/components/TreeView/TreeView.module.css";
import { memo, useCallback } from "react";
import { AutoSizer } from "react-virtualized";
import { DropCursor } from "@/components/TreeView/DropCursor";
import { Node } from "./Node";
import { Box } from "@chakra-ui/react";
import { useTreeViewHandlers } from "@/hooks/useTreeViewHandlers";
import { NODE_TYPES } from "@/config/constants";
import { useTreeRegistry } from "@/store/tree-registry-store";

export const TreeView = memo(function TreeView({ data, treeType }) {
    console.log("%cRender NEW TreeView", "color: white; background: red;");
    const { setApi } = useTreeRegistry.getState();
    const {
        handleRenameNode,
        handleCreateNode,
        handleDeleteNode,
        handleMoveNode,
        handleContextMenu,
        handleSelect,
        handleDisableDrop,
    } = useTreeViewHandlers(treeType);

    const registerApi = useCallback(
        (api) => {
            setApi("config", treeType, api);
        },
        [setApi, treeType]
    );

    // TODO Улучшать хоткеи, вынести в отдельный хук, ограничить вставку
    // react-hotkeys-hook
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
        <Box w={"100%"} h={"100%"} position={"relative"}>
            <AutoSizer>
                {({ height, width }) => (
                    <Tree
                        ref={registerApi}
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
                        disableEdit={(data) => data.type === NODE_TYPES.root}
                    >
                        {Node}
                    </Tree>
                )}
            </AutoSizer>
        </Box>
    );
});
