import { Field, IconButton, Input, Table } from "@chakra-ui/react";
import { LuUserRoundPlus } from "react-icons/lu";
import { RoleSelector } from "./Roles/RoleSelector";
import { useTableStore } from "../SettingsStore/tablestore";
import { useUserStore } from "../SettingsStore/user-add-store";

const Inputs = [
    { id: "login", label: "логин" },
    { id: "surname", label: "фамилию" },
    { id: "name", label: "имя" },
    { id: "grandname", label: "отчество" },
    { id: "position", label: "должность" },
];

export const UserAdder = () => {
    const addUser = useTableStore((s) => s.addUser);
    const { newUser, makeUser, isUserValid, cleanUser } = useUserStore();
    const baseText = "Введите";
    const valid = isUserValid();
    return (
        <Table.Body>
            <Table.Row>
                <Table.Cell padding={"-1.5"}>
                    <IconButton
                        title={valid ? "" : "Заполните все поля"}
                        disabled={!valid}
                        size={"xs"}
                        variant={"ghost"}
                        onClick={() => {
                            addUser(newUser);
                            cleanUser();
                        }}
                    >
                        <LuUserRoundPlus />
                    </IconButton>
                </Table.Cell>
                {Inputs.map((input) => (
                    <Table.Cell
                        key={input.id}
                        padding={"4px"}
                        fontWeight={"500"}
                    >
                        <Field.Root invalid={!newUser[input.id]}>
                            <Input
                                value={newUser[input.id]}
                                size="xs"
                                placeholder={`${baseText} ${input.label}`}
                                onChange={(e) =>
                                    makeUser([input.id, e.target.value])
                                }
                            />
                        </Field.Root>
                    </Table.Cell>
                ))}
                <RoleSelector />
            </Table.Row>
        </Table.Body>
    );
};
