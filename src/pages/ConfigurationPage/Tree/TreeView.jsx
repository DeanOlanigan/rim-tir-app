import { Tree } from "react-arborist";
import styles from "@/components/TreeView/TreeView.module.css";
import { memo, useCallback, useRef } from "react";
import { DropCursor } from "@/components/TreeView/DropCursor";
import { Node } from "./Node";
import { useTreeViewHandlers } from "@/hooks/useTreeViewHandlers";
import { NODE_TYPES } from "@/config/constants";
import { useTreeRegistry } from "@/store/tree-registry-store";
import { Box } from "@chakra-ui/react";
import { useTreeHostkeys } from "./useTreeHostkeys";
import { useAuth } from "@/hooks/useAuth";
import { hasRight } from "@/utils/permissions";

export const TreeView = memo(function TreeView({
    data,
    treeType,
    width = 500,
    height = 900,
}) {
    const { user } = useAuth();
    const allowed = hasRight(user, "editor.config");
    const { setApi } = useTreeRegistry.getState();
    const {
        handleRenameNode,
        handleCreateNode,
        handleDeleteNode,
        handleMoveNode,
        handleContextMenu,
        handleSelect,
        handleDisableDrop,
    } = useTreeViewHandlers(treeType, allowed);
    const apiRef = useRef(null);
    const registerApi = useCallback(
        (api) => {
            setApi("config", treeType, api);
            apiRef.current = api;
        },
        [setApi, treeType],
    );
    const hkref = useTreeHostkeys(apiRef?.current);

    return (
        <Box w={"100%"} h={"100%"} ref={hkref} tabIndex={0}>
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
                disableDrag={!allowed}
                disableDrop={handleDisableDrop}
                disableEdit={(data) => data.type === NODE_TYPES.root}
            >
                {({ node, style, dragHandle, tree }) => (
                    <Node
                        node={node}
                        dragHandle={dragHandle}
                        style={style}
                        tree={tree}
                        allowed={allowed}
                    />
                )}
            </Tree>
        </Box>
    );
});
