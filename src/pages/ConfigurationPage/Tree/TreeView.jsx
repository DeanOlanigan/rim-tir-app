import { Tree } from "react-arborist";
import styles from "../../../components/TreeView/TreeView.module.css";
import { memo, forwardRef } from "react";
import { AutoSizer } from "react-virtualized";
import { DropCursor } from "../../../components/TreeView/DropCursor";
import { Node } from "./Node";
import { Box } from "@chakra-ui/react";
import { useTreeViewHandlers } from "../../../hooks/useTreeViewHandlers";
import { CONSTANT_VALUES } from "../../../config/constants";
import { useDragDropManager } from "react-dnd";

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

        return (
            <Box
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
                            disableEdit={(data) =>
                                data.type ===
                                CONSTANT_VALUES.NODE_TYPES.dataObject
                            }
                        >
                            {Node}
                        </Tree>
                    )}
                </AutoSizer>
            </Box>
        );
    })
);
