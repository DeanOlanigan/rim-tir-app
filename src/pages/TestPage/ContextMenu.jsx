import { Menu, Portal } from "@chakra-ui/react";

export const ContextMenu = ({ contextMenu, setContextMenu }) => {
    console.log(contextMenu);
    return (
        <Menu.Root
            open={contextMenu.visible}
            onOpenChange={(e) =>
                setContextMenu({ ...contextMenu, visible: e.open })
            }
            anchorPoint={{ x: contextMenu.x, y: contextMenu.y }}
            positioning={{
                getAnchorRect: () =>
                    DOMRect.fromRect({
                        x: contextMenu.x,
                        y: contextMenu.y,
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
                        <Menu.Item value="new-txt">
                            {contextMenu?.type?._id}
                        </Menu.Item>
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
