import { Card, Heading, HStack, Text } from "@chakra-ui/react";
import { TableMenu } from "./TableAndMenu/TableMenu";
import { UsersTable } from "./TableAndMenu/UsersTable";
import { RoleEditorAndAdder } from "./Roles/RoleEditorAndAdder";
import { useUsersHistory } from "../hooks/useUsers";
import { useRoles } from "../hooks/useRoles";
import { useEffect } from "react";
import { useTableStore } from "../SettingsStore/tablestore";
import { useRightsAndRolesStore } from "../SettingsStore/rights-and-roles-store";

export const UsersView = () => {
    const dataUsers = useUsersHistory();
    const dataRoles = useRoles();

    useEffect(() => {
        useTableStore.getState().hydrate(dataUsers);
        useRightsAndRolesStore.getState().setRoles(dataRoles);
    }, [dataUsers, dataRoles]);

    return (
        <>
            <Heading paddingBottom={"2"}>Редактор пользователей</Heading>
            <Card.Root
                w={"100%"}
                variant={"elevated"}
                maxH={"2xl"}
                overflow={"clip"}
            >
                <Card.Header>
                    <Text fontSize={"lg"} fontWeight={"medium"}>
                        Создание пользователя, ролей и их редактирование
                    </Text>
                    <HStack justifyContent={"flex-end"}>
                        <RoleEditorAndAdder />
                    </HStack>
                </Card.Header>
                <Card.Body>
                    <TableMenu>
                        <UsersTable />
                    </TableMenu>
                </Card.Body>
            </Card.Root>
        </>
    );
};
