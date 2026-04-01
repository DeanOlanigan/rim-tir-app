import { useState } from "react";
import { handleRoleAdd } from "./handleRoleAdd";
import { Field, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useRolePostMutation } from "./hooks/mutations/useRolePostMutation";

const AddRoleButton = ({ isPending, handleSubmit }) => {
    return (
        <IconButton
            variant={"surface"}
            size={"2xs"}
            me="-2"
            loading={isPending}
            onClick={() => {
                handleSubmit();
            }}
        >
            <LuPlus />
        </IconButton>
    );
};

export const NewRoleAdder = () => {
    const [newRoleName, setNewName] = useState("");

    const postMutation = useRolePostMutation();

    function handlePostRole() {
        const newRole = handleRoleAdd({ newRoleName, setNewName });
        if (!newRole) return;
        postMutation.mutate(newRole);
    }

    return (
        <Field.Root>
            <Field.Label>Добавить роль</Field.Label>
            <InputGroup
                endElement={
                    <AddRoleButton
                        isPending={postMutation.isPending}
                        handleSubmit={handlePostRole}
                    />
                }
            >
                <Input
                    size={"xs"}
                    value={newRoleName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handlePostRole();
                        }
                    }}
                    placeholder={"Введите название новой роли"}
                />
            </InputGroup>
        </Field.Root>
    );
};
