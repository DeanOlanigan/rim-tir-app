import { useContextMenuStore } from "@/store/contextMenu-store";
import { Menu, Portal } from "@chakra-ui/react";

export const ContextMenu = () => {
    const { updateContext } = useContextMenuStore.getState();
    const { apiPath, x, y, visible } = useContextMenuStore(
        (state) => state.sch
    );

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
                        <Menu.Item value="new-txt">{apiPath?._id}</Menu.Item>
                        <Menu.Item value="new-file">New File...</Menu.Item>
                        <Menu.Item value="new-win">New Window</Menu.Item>
                        <Menu.Item value="open-file">Open File...</Menu.Item>
                        <Menu.Item value="export">Export</Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
