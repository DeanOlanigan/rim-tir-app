import { Button, Heading, VStack } from "@chakra-ui/react";
import { RoleTree } from "./RoleTree";
import { InputField } from "./InputField";
import { handleEdit } from "./handleEdit";
import { useRolePutMutation } from "./hooks/mutations/useRolePutMutation";
import { useRightsAndRolesStore } from "./store/rights-and-roles-store";

export const RoleEditor = () => {
    const putMutation = useRolePutMutation();

    function handlePutRole() {
        const isAllRights = handleEdit();
        if (!isAllRights) return;

        const selectedRole = useRightsAndRolesStore.getState().selectedRole;
        putMutation.mutate({
            id: selectedRole.id,
            params: { name: selectedRole.name, rights: selectedRole.rights },
        });
    }

    return (
        <VStack w={"50%"} h="md" align="start">
            <Heading>Редактирование роли</Heading>
            <InputField />
            <RoleTree />
            <Button
                size={"xs"}
                w={"100%"}
                mt={"auto"}
                onClick={() => handlePutRole()}
            >
                Применить
            </Button>
        </VStack>
    );
};
