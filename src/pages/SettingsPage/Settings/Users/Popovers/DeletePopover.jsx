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
                                    query={["нельзя будет отменить!"]}
                                    styles={{
                                        px: 0.5,
                                        bg: "red.600",
                                        borderRadius: "4px",
                                        color: "fg.inverted",
                                    }}
                                >
                                    Вы уверены? Последствия этого действия
                                    нельзя будет отменить!
                                </Highlight>
                            </Text>
                        </Popover.Body>
                        <Popover.Footer justifyContent={"right"}>
                            <Button
                                size={"xs"}
                                variant={"outline"}
                                colorPalette={"red"}
                                color={"red.600"}
                                onClick={() => {
                                    useTableStore.getState().deleteUsers(id);
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
