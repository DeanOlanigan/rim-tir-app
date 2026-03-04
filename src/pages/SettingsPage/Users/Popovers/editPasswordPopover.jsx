import {
    Fieldset,
    Group,
    Icon,
    IconButton,
    Popover,
    Portal,
    Stack,
    Text,
} from "@chakra-ui/react";
import { LuCheck, LuKeyRound, LuX } from "react-icons/lu";
import { useEditStore } from "../../user-edit-store";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { usePasswordMutation } from "../hooks/mutations/usePasswordMutation";
import { validatePassword } from "../validatePassword";

export const EditPassword = () => {
    const login = useEditStore((s) => s.selectedUser?.data?.login);
    const userId = useEditStore((s) => s.selectedUser?.id);
    const passwd = useEditStore((s) => s.passwd);
    const editedPassword = useEditStore((s) => s.editedPassword);
    const setNewPassword = useEditStore.getState().setNewPassword;
    const setPasswdOpen = useEditStore.getState().setPasswdOpen;
    const repeatedPassword = useEditStore((s) => s.repeatedPassword);
    const setRepeatedPassword = useEditStore.getState().setRepeatedPassword;
    const putPassword = usePasswordMutation();

    function passwordChecker() {
        if (editedPassword.length === 0) return;
        const { isValid, errorsArr } = validatePassword(
            editedPassword,
            repeatedPassword,
        );

        if (!isValid) {
            toaster.create({
                type: "error",
                description: `Ошибка изменения пароля: ${errorsArr.join(", ")}`,
            });
        } else {
            putPassword.mutate({ userId, editedPassword });
        }
    }

    return (
        <Popover.Root
            open={passwd}
            onOpenChange={(e) => {
                setPasswdOpen(e.isOpen);
                setRepeatedPassword("");
                setNewPassword("");
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
                        <LuKeyRound />
                    </Icon>
                    <Text
                        fontSize={"xs"}
                        margin={"4px"}
                        fontWeight={"medium"}
                        alignSelf={"flex-start"}
                    >
                        Изменить пароль {login}
                    </Text>
                </Group>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Fieldset.Root>
                            <Stack margin={"10px"}>
                                <Fieldset.Legend>
                                    Изменение пароля
                                </Fieldset.Legend>
                                <PasswordInput
                                    disabled={putPassword.isPending}
                                    value={editedPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    size="xs"
                                    borderRightRadius="0"
                                    placeholder="Введите новый пароль"
                                />

                                <PasswordInput
                                    disabled={putPassword.isPending}
                                    value={repeatedPassword}
                                    onChange={(e) =>
                                        setRepeatedPassword(e.target.value)
                                    }
                                    size="xs"
                                    borderRightRadius="0"
                                    placeholder="Повторите новый пароль"
                                />
                            </Stack>
                        </Fieldset.Root>
                        <Group
                            attached
                            paddingBottom={"10px"}
                            paddingRight={"10px"}
                            justifyContent={"flex-end"}
                        >
                            <IconButton
                                disabled={putPassword.isPending}
                                loading={putPassword.isPending}
                                onClick={() => passwordChecker()}
                                size={"xs"}
                                colorPalette={"green"}
                                variant={"subtle"}
                            >
                                <LuCheck />
                            </IconButton>
                            <IconButton
                                size={"xs"}
                                colorPalette={"red"}
                                variant={"subtle"}
                                onClick={() => setPasswdOpen(false)}
                            >
                                <LuX />
                            </IconButton>
                        </Group>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
