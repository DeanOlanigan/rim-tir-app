import { Tree } from "react-arborist";
import styles from "../../../components/TreeView/TreeView.module.css";
import { memo, forwardRef, useState } from "react";
import { AutoSizer } from "react-virtualized";

import { DropCursor } from "../../../components/TreeView/DropCursor";
import { ContextMenuWrapper } from "./ContextMenuWrapper";
import { Node } from "./Node";
import { Box } from "@chakra-ui/react";
import { useTreeViewHandlers } from "../../../hooks/useTreeViewHandlers";
import { useDragDropManager } from "react-dnd";

export const TreeView = memo(
    forwardRef(function TreeView(props, ref) {
        //console.log("%cRender NEW TreeView", "color: white; background: red;");
        //const dragDropManager = useDragDropManager();
        const {
            handleRenameNode,
            handleCreateNode,
            handleDeleteNode,
            handleMoveNode,
            handleContextMenu,
            handleSelect,
            handleDisableDrop,
        } = useTreeViewHandlers(props.treeType, ref);

        const [contextMenuState, setContextMenuState] = useState({
            isOpen: false,
            items: [],
            position: { x: 0, y: 0 },
            target: null,
        });
        const onContextMenuHandler = (e, target) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenuState({
                ...contextMenuState,
                isOpen: true,
                position: { x: e.clientX, y: e.clientY },
                target: target,
            });
        };

        return (
            <Box
                w={"100%"}
                h={"100%"}
                bg={"red.800"}
                onContextMenu={(e) => onContextMenuHandler(e, null)}
            >
                <ContextMenuWrapper
                    apiPath={ref?.current}
                    contextMenuState={contextMenuState}
                    closeMenu={() =>
                        setContextMenuState((prev) => ({
                            ...prev,
                            isOpen: false,
                        }))
                    }
                />
                <AutoSizer>
                    {({ height, width }) => (
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
                            onContextMenu={onContextMenuHandler}
                            onSelect={handleSelect}
                            disableDrop={handleDisableDrop}
                            //dndManager={dragDropManager}
                            disableEdit={(data) => data.type === "dataObject"}
                        >
                            {Node}
                        </Tree>
                    )}
                </AutoSizer>
            </Box>
        );
    })
);
