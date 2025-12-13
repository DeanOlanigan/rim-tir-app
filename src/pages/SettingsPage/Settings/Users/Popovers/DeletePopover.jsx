import {
    Button,
    Group,
    Highlight,
    Icon,
    Popover,
    Portal,
    Text,
} from "@chakra-ui/react";
import { LuUserRoundX } from "react-icons/lu";
import { useEditStore } from "../../SettingsStore/user-edit-store";
import { useTableStore } from "../../SettingsStore/tablestore";

export const DeletePopover = () => {
    const id = useEditStore((s) => s.selectedUser?.id);
    const popoverOpen = useEditStore((s) => s.delete);
    const setOpen = useEditStore.getState().setPopoversOpen;
    const selectedUsers = useTableStore.getState().selectedRows;
    return (
        <Popover.Root
            size={"xs"}
            open={popoverOpen}
            onOpenChange={(e) => {
                setOpen("delete", e.open);
            }}
            positioning={{ placement: "bottom" }}
        >
            <Popover.Trigger
                cursor="pointer"
                _hover={{ bg: "bg.error", color: "fg.error" }}
                color="fg.error"
                borderRadius={"xs"}
                width="100%"
            >
                <Group attached paddingLeft={"4px"} w={"100%"}>
                    <Icon>
                        <LuUserRoundX />
                    </Icon>
                    <Text fontSize={"xs"} margin={"4px"} fontWeight={"medium"}>
                        Удалить
                    </Text>
                </Group>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Body>
                            <Text fontWeight={"medium"}>
                                <Highlight
                                    query={["НЕЛЬЗЯ БУДЕТ ОТМЕНИТЬ"]}
                                    styles={{
                                        px: 0.5,
                                        borderRadius: "4px",
                                        color: "fg.error",
                                    }}
                                >
                                    Вы уверены? Последствия этого действия
                                    НЕЛЬЗЯ БУДЕТ ОТМЕНИТЬ!
                                </Highlight>
                            </Text>
                        </Popover.Body>
                        <Popover.Footer justifyContent={"right"}>
                            <Button
                                size={"2xs"}
                                variant={"outline"}
                                colorPalette={"red"}
                                color={"red.600"}
                                onClick={() => {
                                    const usersToDelete =
                                        selectedUsers.length > 0
                                            ? selectedUsers
                                            : [id];
                                    useTableStore
                                        .getState()
                                        .deleteUsers(usersToDelete);
                                    useEditStore
                                        .getState()
                                        .setSelectedUser(undefined, {});
                                    setOpen("delete", false);
                                    useEditStore.getState().setMenuOpen(false);
                                }}
                            >
                                Удалить
                            </Button>
                        </Popover.Footer>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
