import { useContextMenuStore } from "@/store/contextMenu-store";
import { Menu, Portal } from "@chakra-ui/react";
import { ContextMenuList } from "./ContextMenuList";

export const ContextMenu = () => {
    const { updateContext } = useContextMenuStore.getState();
    const { apiPath, x, y, visible } = useContextMenuStore(
        (state) => state.cfg
    );

    return (
        <Menu.Root
            open={visible}
            onOpenChange={(e) => updateContext("cfg", { visible: e.open })}
            anchorPoint={{ x, y }}
            positioning={{
                getAnchorRect: () =>
                    DOMRect.fromRect({ x, y, width: 1, height: 1 }),
            }}
            unmountOnExit
            lazyMount
            skipAnimationOnMount
            size={"sm"}
        >
            <Portal>
                <Menu.Positioner>
                    <ContextMenuList
                        apiPath={apiPath}
                        updateContext={updateContext}
                    />
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
