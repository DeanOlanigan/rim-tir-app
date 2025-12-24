import { Button, Heading, VStack } from "@chakra-ui/react";
import { RoleTree } from "./RoleTree";
import { InputField } from "./InputField";
import { useRightsAndRolesStore } from "../../SettingsStore/rights-and-roles-store";
import { toaster } from "@/components/ui/toaster";

const errors = {
    NO_SELECTED: "Выберите роль",
    EMPTY_NAME: "Имя не может быть пустым",
    ROLE_ALREADY_EXISTS: "Роль с таким именем уже существует",
};

export const RoleEditor = () => {
    function handleEdit() {
        try {
            useRightsAndRolesStore.getState().editRole();
        } catch (err) {
            toaster.create({
                type: "error",
                description: `Ошибка редактирования роли: ${errors[err.message]}`,
                closable: true,
            });
            return;
        }
        toaster.create({
            type: "success",
            description: "Роль успешно изменена",
            closable: true,
        });
    }

    return (
        <VStack w={"50%"} h="md" align="start">
            <Heading>Редактирование роли</Heading>
            <InputField />
            <RoleTree />
            <Button w={"100%"} mt={"auto"} onClick={() => handleEdit()}>
                Применить
            </Button>
        </VStack>
    );
};
