import { useContextMenuStore } from "@/store/contextMenu-store";
import { Menu, Portal } from "@chakra-ui/react";
import { ContextMenuList } from "./ContextMenuList";

export const ContextMenu = () => {
    console.log("%cRender ContextMenu", "color: white; background: purple;");
    const { context, updateContext } = useContextMenuStore((state) => state);
    const { apiPath, x, y, visible } = context;

    return (
        <Menu.Root
            open={visible}
            onOpenChange={(e) => updateContext({ visible: e.open })}
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
