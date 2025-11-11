import { useContextMenuStore } from "@/store/contextMenu-store";
import { Menu, Portal } from "@chakra-ui/react";
import { useNodeStore } from "./store/node-store";

export const ContextMenu = () => {
    const { updateContext } = useContextMenuStore.getState();
    const { apiPath, x, y, visible } = useContextMenuStore(
        (state) => state.sch
    );
    const removeNode = useNodeStore.getState().removeNode;
    console.log(apiPath);
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
                            <Menu.ItemGroupLabel>
                                {apiPath?.attrs.id}
                            </Menu.ItemGroupLabel>
                            <Menu.Item
                                value="delete"
                                color="fg.error"
                                _hover={{ bg: "bg.error", color: "fg.error" }}
                                onClick={() => removeNode(apiPath?.attrs.id)}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
