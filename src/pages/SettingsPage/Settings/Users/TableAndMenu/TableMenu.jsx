import { Menu, Text, VStack } from "@chakra-ui/react";
import { UsersTable } from "./UsersTable";
import { DeletePopover } from "../Popovers/DeletePopover";
import { useEditStore } from "../../SettingsStore/user-edit-store";
import { EditPopover } from "../Popovers/EditPopover";
import { useTableStore } from "../../SettingsStore/tablestore";

export const TableMenu = () => {
    const login = useEditStore((s) => s.selectedUser?.data?.login);
    const selectedUsers = useTableStore.getState().selectedRows;
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
            <Menu.ContextTrigger>
                <UsersTable />
            </Menu.ContextTrigger>
            <Menu.Positioner>
                <Menu.Content>
                    <VStack w={"100%"} alignItems={"flex-start"}>
                        <Text fontSize="xs" fontWeight={"medium"}>
                            {selectedUsers.length > 0
                                ? `Выбрано пользователей: ${selectedUsers.length}`
                                : `Пользователь ${login}`}
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
