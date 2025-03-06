import { Tree } from "react-arborist";
import styles from "../../../components/TreeView/TreeView.module.css";
import { memo, forwardRef } from "react";
import { AutoSizer } from "react-virtualized";

import { DropCursor } from "../../../components/TreeView/DropCursor";
import { ContextMenuWrapper } from "./ContextMenuWrapper";
import Node from "./Node";
import { Box } from "@chakra-ui/react";
import { useTreeViewHandlers } from "../../../hooks/useTreeViewHandlers";

// TODO Вынести логику в хук
export const TreeView = memo(
    forwardRef(function TreeView(props, ref) {
        console.log("%cRender NEW TreeView", "color: white; background: red;");

        const {
            handleRenameNode,
            handleCreateNode,
            handleDeleteNode,
            handleMoveNode,
            handleContextMenu,
            handleSelect,
        } = useTreeViewHandlers(props.treeType, ref);

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
                                onRename={handleRenameNode}
                                onCreate={handleCreateNode}
                                onDelete={handleDeleteNode}
                                onMove={handleMoveNode}
                                onContextMenu={handleContextMenu}
                                onSelect={handleSelect}
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
