import { useContextMenuStore } from "@/store/contextMenu-store";
import { Menu, Portal } from "@chakra-ui/react";
import { useNodeStore } from "./store/node-store";
import { useActionsStore } from "./store/actions-store";
import { LAYERS_OPS } from "./constants";

export const ContextMenu = () => {
    const {
        apiPath: ids,
        x,
        y,
        visible,
    } = useContextMenuStore((state) => state.sch);
    const showGrid = useActionsStore((state) => state.showGrid);
    const debugMode = useActionsStore((state) => state.debugMode);

    return (
        <Menu.Root
            open={visible}
            onOpenChange={(e) =>
                useContextMenuStore
                    .getState()
                    .updateContext("sch", { visible: e.open })
            }
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
                        {ids && ids.length > 0 ? (
                            <Menu.ItemGroup>
                                <Menu.Item
                                    value="moveToTop"
                                    onClick={() =>
                                        useNodeStore
                                            .getState()
                                            .reorderLayers(
                                                ids,
                                                LAYERS_OPS.moveToTop,
                                            )
                                    }
                                >
                                    Move to top
                                </Menu.Item>
                                <Menu.Item
                                    value="moveUp"
                                    onClick={() =>
                                        useNodeStore
                                            .getState()
                                            .reorderLayers(
                                                ids,
                                                LAYERS_OPS.moveUp,
                                            )
                                    }
                                >
                                    Move up
                                </Menu.Item>
                                <Menu.Item
                                    value="moveDown"
                                    onClick={() =>
                                        useNodeStore
                                            .getState()
                                            .reorderLayers(
                                                ids,
                                                LAYERS_OPS.moveDown,
                                            )
                                    }
                                >
                                    Move down
                                </Menu.Item>
                                <Menu.Item
                                    value="moveToBottom"
                                    onClick={() =>
                                        useNodeStore
                                            .getState()
                                            .reorderLayers(
                                                ids,
                                                LAYERS_OPS.moveToBottom,
                                            )
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
                                        useNodeStore
                                            .getState()
                                            .removeNodes(ids);
                                    }}
                                >
                                    Delete
                                </Menu.Item>
                            </Menu.ItemGroup>
                        ) : (
                            <Menu.ItemGroup>
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
                            </Menu.ItemGroup>
                        )}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
