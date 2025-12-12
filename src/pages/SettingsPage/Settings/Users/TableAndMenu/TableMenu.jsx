import { Menu, StackSeparator, Text, VStack } from "@chakra-ui/react";
import { UsersTable } from "./UsersTable";
import { DeletePopover } from "../Popovers/DeletePopover";
import { useEditStore } from "../../SettingsStore/user-edit-store";
import { EditPopover } from "../Popovers/EditPopover";

export const TableMenu = () => {
    const login = useEditStore((s) => s.selectedUser?.data?.login);
    const menuOpen = useEditStore((s) => s.menuOpen);
    const setMenuOpen = useEditStore.getState().setMenuOpen;
    return (
        <Menu.Root
            closeOnSelect={false}
            closeOn
            variant={"subtle"}
            open={menuOpen}
            onOpenChange={(e) => {
                setMenuOpen(e.open);
            }}
            unmountOnExit
            lazyMount
            skipAnimationOnMount
        >
            <Menu.ContextTrigger>
                <UsersTable />
            </Menu.ContextTrigger>
            <Menu.Positioner>
                <Menu.Content>
                    <VStack w={"100%"} alignItems={"flex-start"}>
                        <Text fontSize="xs" fontWeight={"medium"}>
                            Пользователь {login}
                        </Text>
                        <Menu.Item asChild>
                            <EditPopover />
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
