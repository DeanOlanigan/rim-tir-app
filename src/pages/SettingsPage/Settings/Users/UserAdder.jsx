import { Field, IconButton, Input, Table } from "@chakra-ui/react";
import { LuUserRoundPlus } from "react-icons/lu";
import { RoleSelector } from "./Roles/RoleSelector";
import { useUserStore } from "../SettingsStore/user-add-store";
import { handleAdd } from "./handleAdd";
import { useUserPostMutation } from "../hooks/useUserPostMutation";
import { nanoid } from "nanoid";

const inputs = [
    { id: "login", label: "логин" },
    { id: "surname", label: "фамилию" },
    { id: "name", label: "имя" },
    { id: "grandname", label: "отчество" },
    { id: "position", label: "должность" },
];

export const UserAdder = ({ scrollToBottom }) => {
    const makeUser = useUserStore.getState().makeUser;
    const newUser = useUserStore((s) => s.newUser);
    const postMutation = useUserPostMutation();
    const baseText = "Введите";

    function handleUserPost() {
        const newId = nanoid();
        const isCorrect = handleAdd(newId, newUser, scrollToBottom);
        if (isCorrect) postMutation.mutate({ newId, newUser });
    }

    return (
        <Table.Row>
            <Table.Cell padding={"4px"}>
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
