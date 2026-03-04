import { Field, Group, IconButton, Input, Table, Text } from "@chakra-ui/react";
import { LuUserRoundPlus } from "react-icons/lu";
import { RoleSelector } from "./Roles/RoleSelector";
import { useUserStore } from "../SettingsStore/user-add-store";
import { handleAdd } from "./handleAdd";
import { useUserPostMutation } from "../hooks/useUserPostMutation";
import { nanoid } from "nanoid";
import { Tooltip } from "@/components/ui/tooltip";

const inputs = [
    { id: "surname", label: "фамилию" },
    { id: "name", label: "имя" },
    { id: "grandname", label: "отчество (необязательно)" },
    { id: "position", label: "должность" },
];

export const UserAdder = ({ scrollToBottom }) => {
    const makeUser = useUserStore.getState().makeUser;
    const makePassword = useUserStore.getState().makePassword;
    const newUser = useUserStore((s) => s.newUser);
    const password = useUserStore((s) => s.password);
    const postMutation = useUserPostMutation();
    const baseText = "Введите";

    function handleUserPost() {
        const newId = nanoid();

        const isCorrect = handleAdd(newId, newUser, password, scrollToBottom);
        if (isCorrect) postMutation.mutate({ newId, newUser, password });
    }

    return (
        <Table.Row>
            <Table.Cell padding={"4px"}>
                <Tooltip showArrow content={<Text>Добавить пользователя</Text>}>
                    <IconButton
                        size={"xs"}
                        variant={"ghost"}
                        onClick={() => {
                            handleUserPost();
                        }}
                        loading={postMutation.isPending}
                    >
                        <LuUserRoundPlus />
                    </IconButton>
                </Tooltip>
            </Table.Cell>
            <Table.Cell padding={"4px"}>
                <Group attached>
                    <Field.Root invalid={!newUser.login}>
                        <Input
                            value={newUser.login}
                            size="xs"
                            placeholder={`Логин`}
                            onChange={(e) => {
                                makeUser(["login", e.target.value]);
                            }}
                            borderRightRadius={"0"}
                        />
                    </Field.Root>
                    <Field.Root invalid={!password}>
                        <Input
                            value={password}
                            type="password"
                            size="xs"
                            borderLeftRadius="0"
                            placeholder="Пароль"
                            onChange={(e) => {
                                makePassword(e.target.value);
                            }}
                        />
                    </Field.Root>
                </Group>
            </Table.Cell>
            {inputs.map((input) => (
                <Table.Cell key={input.id} padding={"4px"} fontWeight={"500"}>
                    <Field.Root invalid={!newUser[input.id]}>
                        <Input
                            value={newUser[input.id]}
                            size="xs"
                            placeholder={`${baseText} ${input.label}`}
                            onChange={(e) => {
                                makeUser([input.id, e.target.value]);
                            }}
                        />
                    </Field.Root>
                </Table.Cell>
            ))}
            <RoleSelector isEditing={false} />
        </Table.Row>
    );
};
