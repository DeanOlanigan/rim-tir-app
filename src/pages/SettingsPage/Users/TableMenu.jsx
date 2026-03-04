import { Menu, VStack } from "@chakra-ui/react";
import { DeletePopover } from "./Popovers/DeletePopover";
import { useEditStore } from "../user-edit-store";
import { EditPopover } from "./Popovers/EditPopover";
import { EditPassword } from "./Popovers/editPasswordPopover";

export const TableMenu = ({ children }) => {
    const menuOpen = useEditStore((s) => s.menuOpen);
    const setMenuOpen = useEditStore.getState().setMenuOpen;
    return (
        <Menu.Root
            closeOnSelect={false}
            variant={"subtle"}
            open={menuOpen}
            onOpenChange={(e) => {
                setMenuOpen(e.open);
            }}
            unmountOnExit
            lazyMount
            skipAnimationOnMount
        >
            <Menu.ContextTrigger>{children}</Menu.ContextTrigger>
            <Menu.Positioner>
                <Menu.Content>
                    <VStack w={"100%"} alignItems={"flex-start"}>
                        <Menu.Item asChild>
                            <EditPopover />
                        </Menu.Item>
                        <Menu.Item asChild>
                            <EditPassword />
                        </Menu.Item>
                        <Menu.Item asChild>
                            <DeletePopover />
                        </Menu.Item>
                    </VStack>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    );
};
