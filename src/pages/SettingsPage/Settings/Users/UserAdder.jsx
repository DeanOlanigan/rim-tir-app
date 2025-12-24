import { Field, IconButton, Input, Table } from "@chakra-ui/react";
import { LuUserRoundPlus } from "react-icons/lu";
import { RoleSelector } from "./Roles/RoleSelector";
import { useTableStore } from "../SettingsStore/tablestore";
import { useUserStore } from "../SettingsStore/user-add-store";
import { toaster } from "@/components/ui/toaster";

const inputs = [
    { id: "login", label: "логин" },
    { id: "surname", label: "фамилию" },
    { id: "name", label: "имя" },
    { id: "grandname", label: "отчество" },
    { id: "position", label: "должность" },
];

const errors = {
    EMPTY_FIELDS: "Все поля должны быть заполнены",
    NOT_CYRILLIC_SYMBOLS: "ФИО должно состоять только из кириллицы",
    NOT_UNIQUE_LOGIN: "Пользователь с таким логином уже существует",
};

export const UserAdder = ({ scrollToBottom }) => {
    const addUser = useTableStore.getState().addUser;
    const makeUser = useUserStore.getState().makeUser;
    const newUser = useUserStore((s) => s.newUser);
    const cleanUser = useUserStore.getState().cleanUser;
    const baseText = "Введите";
    function handleAdd() {
        try {
            addUser(newUser);
        } catch (error) {
            console.log(error.message);
            toaster.create({
                type: "error",
                description: `Ошибка добавления пользователя: ${errors[error.message]}`,
                closable: true,
            });
            return;
        }

        setTimeout(() => scrollToBottom(), 0);
        cleanUser();
    }

    return (
        <Table.Row>
            <Table.Cell padding={"4px"}>
                <IconButton
                    size={"xs"}
                    variant={"ghost"}
                    onClick={() => {
                        handleAdd();
                    }}
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
