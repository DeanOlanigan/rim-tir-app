import {
    Field,
    Fieldset,
    Group,
    Icon,
    IconButton,
    Input,
    Popover,
    Portal,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useEditStore } from "../../user-edit-store";
import { LuCheck, LuUserPen, LuX } from "react-icons/lu";
import { RoleSelector } from "../../Roles/RoleSelector";
import { useTableStore } from "../../tablestore";
import { toaster } from "@/components/ui/toaster";
import { useUsersPutMutation } from "../hooks/mutations/useUsersPutMutation";
import { errors } from "../../errors";
import { Tooltip } from "@/components/ui/tooltip";

const fieldNames = {
    name: "Имя",
    surname: "Фамилия",
    grandname: "Отчество (Необязательно)",
    position: "Должность",
    role: "Роль",
};

export const EditPopover = () => {
    const user = useEditStore((s) => s.tempUser?.data);
    const login = useEditStore((s) => s.selectedUser?.data?.login);
    const id = useEditStore((s) => s.selectedUser?.id);
    const popoverOpen = useEditStore((s) => s.edit);
    const setOpen = useEditStore.getState().setPopoversOpen;
    const editTempUser = useEditStore.getState().editTempUser;
    const selectedUsers = useTableStore.getState().selectedRows;
    const setTemp = useEditStore.getState().setTempUser;
    const isSelected = selectedUsers.length > 1;
    const putMutation = useUsersPutMutation();

    function getTargetUsers(selected, id) {
        return isSelected ? selected : [id];
    }

    function handleEdit() {
        const usersToEdit = getTargetUsers(selectedUsers, id);
        try {
            useTableStore.getState().editUser(usersToEdit, user);
        } catch (err) {
            toaster.create({
                type: "error",
                description: `Ошибка редактирования пользователя: ${errors[err.message]}`,
                closable: true,
            });
            return;
        }
        putMutation.mutate({ ids: usersToEdit, newData: user });
        setOpen("edit", false);
        useEditStore.getState().setMenuOpen(false);
    }

    return (
        <Popover.Root
            open={popoverOpen}
            onOpenChange={(e) => {
                isSelected ? setTemp(false) : setTemp(true);
                setOpen("edit", e.open);
            }}
            positioning={{ placement: "right" }}
            lazyMount
            unmountOnExit
        >
            <Popover.Trigger
                cursor="pointer"
                _hover={{ bg: "var(--global-color-border)" }}
                borderRadius={"xs"}
                width="100%"
            >
                <Group attached w={"100%"} paddingLeft={"4px"}>
                    <Icon>
                        <LuUserPen />
                    </Icon>
                    <Text
                        fontSize={"xs"}
                        margin={"4px"}
                        fontWeight={"medium"}
                        alignSelf={"flex-start"}
                    >
                        Редактировать
                        {isSelected ? " множество пользователей" : ` ${login}`}
                    </Text>
                </Group>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Fieldset.Root>
                            <Stack margin={"10px"}>
                                <Fieldset.Legend>
                                    Редактирование
                                    {isSelected
                                        ? " множества пользователей"
                                        : ` ${login}`}
                                </Fieldset.Legend>
                                <Fieldset.HelperText>
                                    Внесите нужные изменения
                                </Fieldset.HelperText>
                            </Stack>
                            <Fieldset.Content
                                alignSelf={"center"}
                                maxW={"90%"}
                                paddingBottom={"5%"}
                            >
                                {Object.keys(user).map((data) => {
                                    if (
                                        data != "login" &&
                                        data != "role" &&
                                        data != "password"
                                    ) {
                                        return (
                                            <Field.Root key={data}>
                                                <Field.Label>
                                                    {fieldNames[data]}
                                                </Field.Label>
                                                <Input
                                                    value={user[data]}
                                                    size={"xs"}
                                                    onChange={(e) => {
                                                        editTempUser(
                                                            data,
                                                            e.target.value,
                                                        );
                                                    }}
                                                />
                                            </Field.Root>
                                        );
                                    }
                                })}
                                <Field.Root>
                                    <Field.Label>{fieldNames.role}</Field.Label>
                                    <RoleSelector isEditing={true} />
                                </Field.Root>
                            </Fieldset.Content>
                        </Fieldset.Root>
                        <Group
                            attached
                            paddingBottom={"4px"}
                            paddingRight={"4px"}
                            justifyContent={"flex-end"}
                        >
                            <Tooltip
                                showArrow
                                content={<Text>Применить изменения</Text>}
                            >
                                <IconButton
                                    size={"xs"}
                                    variant={"subtle"}
                                    color={"fg.success"}
                                    colorPalette={"green"}
                                    onClick={() => {
                                        handleEdit();
                                    }}
                                    borderRightRadius={"0"}
                                >
                                    <LuCheck />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                showArrow
                                content={<Text>Отменить изменения</Text>}
                            >
                                <IconButton
                                    onClick={() => {
                                        setOpen("edit", false);
                                    }}
                                    size={"xs"}
                                    variant={"subtle"}
                                    color={"fg.error"}
                                    colorPalette={"red"}
                                    borderLeftRadius={"0"}
                                >
                                    <LuX />
                                </IconButton>
                            </Tooltip>
                        </Group>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
