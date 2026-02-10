import { useContextMenuStore } from "@/store/contextMenu-store";
import { Menu, Portal } from "@chakra-ui/react";
import { useNodeStore } from "./store/node-store";
import { useActionsStore } from "./store/actions-store";
import { HOTKEYS, LAYERS_OPS, LOCALE } from "./constants";

export const ContextMenu = ({ tools }) => {
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
                                    value="cut"
                                    onClick={() =>
                                        useNodeStore.getState().cutToClipboard()
                                    }
                                    ps={8}
                                >
                                    {LOCALE.cut}
                                    <Menu.ItemCommand size={"xs"}>
                                        {HOTKEYS.cut.keyLabel}
                                    </Menu.ItemCommand>
                                </Menu.Item>
                                <Menu.Item
                                    value="copy"
                                    onClick={() =>
                                        useNodeStore
                                            .getState()
                                            .copyToClipboard()
                                    }
                                    ps={8}
                                >
                                    {LOCALE.copy}
                                    <Menu.ItemCommand size={"xs"}>
                                        {HOTKEYS.copy.keyLabel}
                                    </Menu.ItemCommand>
                                </Menu.Item>
                                <PasteMenuItem tools={tools} />
                                <Menu.Separator />
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
                                    ps={8}
                                >
                                    {LOCALE.moveToTop}
                                    <Menu.ItemCommand size={"xs"}>
                                        {HOTKEYS.moveToTop.keyLabel}
                                    </Menu.ItemCommand>
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
                                    ps={8}
                                >
                                    {LOCALE.moveUp}
                                    <Menu.ItemCommand size={"xs"}>
                                        {HOTKEYS.moveUp.keyLabel}
                                    </Menu.ItemCommand>
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
                                    ps={8}
                                >
                                    {LOCALE.moveDown}
                                    <Menu.ItemCommand size={"xs"}>
                                        {HOTKEYS.moveDown.keyLabel}
                                    </Menu.ItemCommand>
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
                                    ps={8}
                                >
                                    {LOCALE.moveToBottom}
                                    <Menu.ItemCommand size={"xs"}>
                                        {HOTKEYS.moveToBottom.keyLabel}
                                    </Menu.ItemCommand>
                                </Menu.Item>
                                <Menu.Separator />
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
                                    ps={8}
                                >
                                    {LOCALE.delete}
                                    <Menu.ItemCommand size={"xs"}>
                                        {HOTKEYS.delete.keyLabel}
                                    </Menu.ItemCommand>
                                </Menu.Item>
                            </Menu.ItemGroup>
                        ) : (
                            <Menu.ItemGroup>
                                <PasteMenuItem tools={tools} />
                                <Menu.Separator />
                                <Menu.CheckboxItem
                                    value="showGrid"
                                    checked={showGrid}
                                    onCheckedChange={() =>
                                        useActionsStore
                                            .getState()
                                            .setShowGrid(!showGrid)
                                    }
                                >
                                    {LOCALE.toggleGrid}
                                    <Menu.ItemIndicator />
                                    <Menu.ItemCommand size={"xs"}>
                                        {HOTKEYS.toggleGrid.keyLabel}
                                    </Menu.ItemCommand>
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
                                    {LOCALE.debugMode}
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

const PasteMenuItem = ({ tools }) => {
    return (
        <Menu.Item
            value="paste"
            onClick={() => {
                const snapToGrid = useActionsStore.getState().snapToGrid;
                const gridSize = useActionsStore.getState().gridSize;
                const grid = snapToGrid ? gridSize : 1;
                const pos = tools.api.getStage().getRelativePointerPosition();
                useNodeStore.getState().pasteFromClipboard(pos.x, pos.y, grid);
            }}
            ps={8}
        >
            {LOCALE.paste}
            <Menu.ItemCommand size={"xs"}>
                {HOTKEYS.paste.keyLabel}
            </Menu.ItemCommand>
        </Menu.Item>
    );
};
