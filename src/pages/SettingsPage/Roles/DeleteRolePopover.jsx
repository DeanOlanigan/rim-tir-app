import {
    Button,
    Highlight,
    IconButton,
    Popover,
    Portal,
    Text,
} from "@chakra-ui/react";
import { useRoleDeleteMutation } from "./hooks/mutations/useRoleDeleteMutation";
import { useRightsAndRolesStore } from "./store/rights-and-roles-store";
import { useTableStore } from "../tablestore";
import { LuX } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";

export const DeleteRolePopover = ({ id }) => {
    const deleteRoleMutation = useRoleDeleteMutation();

    function handleDelete() {
        useRightsAndRolesStore.getState().delRole(id);
        deleteRoleMutation.mutate(id);
        useTableStore.getState().filterDeletedRole(id);
    }

    return (
        <Popover.Root>
            <Popover.Trigger>
                <Tooltip showArrow content={"Удалить роль"}>
                    <IconButton
                        size={"2xs"}
                        variant={"ghost"}
                        colorPalette={"red"}
                        borderLeftRadius={"0"}
                    >
                        <LuX />
                    </IconButton>
                </Tooltip>
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
                                loading={deleteRoleMutation.isPending}
                                size={"2xs"}
                                variant={"outline"}
                                colorPalette={"red"}
                                color={"red.600"}
                                onClick={() => handleDelete()}
                            >
                                Удалить
                            </Button>
                            <Button size={"2xs"} variant={"outline"}>
                                Отменить
                            </Button>
                        </Popover.Footer>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
