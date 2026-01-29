import { useState } from "react";
import { handleRoleAdd } from "./handleRoleAdd";
import { Group, IconButton, Input, Text } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useRolePostMutation } from "../../hooks/useRolePostMutation";

export const NewRoleAdder = () => {
    const [newRoleName, setNewName] = useState("");

    const postMutation = useRolePostMutation();

    function handlePostRole() {
        const newRole = handleRoleAdd({ newRoleName, setNewName });
        if (!newRole) return;
        postMutation.mutate(newRole);
    }

    return (
        <>
            <Text fontWeight={"500"} mt={"auto"}>
                Добавление новой роли
            </Text>
            <Group attached w={"100%"}>
                <Input
                    value={newRoleName}
                    onChange={(e) => setNewName(e.target.value)}
                    size={"xs"}
                    placeholder="Введите название новой роли"
                />
                <IconButton
                    loading={postMutation.isPending}
                    size={"xs"}
                    onClick={() => {
                        handlePostRole();
                    }}
                >
                    <LuPlus />
                </IconButton>
            </Group>
        </>
    );
};
