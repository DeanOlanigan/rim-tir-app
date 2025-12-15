import { useContextMenuStore } from "@/store/contextMenu-store";
import { Menu, Portal } from "@chakra-ui/react";
import { useNodeStore } from "./store/node-store";
import { useActionsStore } from "./store/actions-store";
import { layerShift } from "./utils";

export const ContextMenu = () => {
    const { updateContext } = useContextMenuStore.getState();
    const { apiPath, x, y, visible } = useContextMenuStore(
        (state) => state.sch,
    );
    const { removeNode, setSelectedIds } = useNodeStore.getState();
    const showGrid = useActionsStore((state) => state.showGrid);
    const debugMode = useActionsStore((state) => state.debugMode);
    const showNodesTree = useActionsStore((state) => state.showNodesTree);

    return (
        <Menu.Root
            open={visible}
            onOpenChange={(e) => updateContext("sch", { visible: e.open })}
            anchorPoint={{ x, y }}
            positioning={{
                getAnchorRect: () =>
                    DOMRect.fromRect({
                        x,
                        y,
                        width: 1,
                        height: 1,
                    }),
            }}
            unmountOnExit
            lazyMount
            skipAnimationOnMount
            size={"sm"}
        >
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            {apiPath ? (
                                <>
                                    <Menu.ItemGroupLabel>
                                        {apiPath}
                                    </Menu.ItemGroupLabel>
                                    <Menu.Item
                                        value="moveToTop"
                                        onClick={() =>
                                            layerShift(apiPath, "moveToTop")
                                        }
                                    >
                                        Move to top
                                    </Menu.Item>
                                    <Menu.Item
                                        value="moveUp"
                                        onClick={() =>
                                            layerShift(apiPath, "moveUp")
                                        }
                                    >
                                        Move up
                                    </Menu.Item>
                                    <Menu.Item
                                        value="moveDown"
                                        onClick={() =>
                                            layerShift(apiPath, "moveDown")
                                        }
                                    >
                                        Move down
                                    </Menu.Item>
                                    <Menu.Item
                                        value="moveToBottom"
                                        onClick={() =>
                                            layerShift(apiPath, "moveToBottom")
                                        }
                                    >
                                        Move to bottom
                                    </Menu.Item>
                                    <Menu.Item
                                        value="delete"
                                        color="fg.error"
                                        _hover={{
                                            bg: "bg.error",
                                            color: "fg.error",
                                        }}
                                        onClick={() => {
                                            removeNode(apiPath);
                                            setSelectedIds([]);
                                        }}
                                    >
                                        Delete
                                    </Menu.Item>
                                </>
                            ) : (
                                <>
                                    <Menu.CheckboxItem
                                        value="showGrid"
                                        checked={showGrid}
                                        onCheckedChange={() =>
                                            useActionsStore
                                                .getState()
                                                .setShowGrid(!showGrid)
                                        }
                                    >
                                        Show grid
                                        <Menu.ItemIndicator />
                                    </Menu.CheckboxItem>
                                    <Menu.CheckboxItem
                                        value="debugMode"
                                        checked={debugMode}
                                        onCheckedChange={() =>
                                            useActionsStore
                                                .getState()
                                                .setDebugMode(!debugMode)
                                        }
                                    >
                                        Debug mode
                                        <Menu.ItemIndicator />
                                    </Menu.CheckboxItem>
                                    <Menu.CheckboxItem
                                        value="showNodesTree"
                                        checked={showNodesTree}
                                        onCheckedChange={() =>
                                            useActionsStore
                                                .getState()
                                                .setShowNodesTree(
                                                    !showNodesTree,
                                                )
                                        }
                                    >
                                        Show nodes tree
                                        <Menu.ItemIndicator />
                                    </Menu.CheckboxItem>
                                </>
                            )}
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
