import { Card, Heading, HStack, Text } from "@chakra-ui/react";
import { TableMenu } from "./TableMenu";
import { RoleEditorAndAdder } from "../Roles/RoleEditorAndAdder";
import { useUsersHistory } from "./hooks/useUsers";
import { useEffect } from "react";
import { useTableStore } from "../tablestore";
import { useRightsAndRolesStore } from "../Roles/store/rights-and-roles-store";
import { CanAccess } from "@/CanAccess";
import { useRoles } from "../Roles/hooks/useRoles";
import { UsersTable } from "./UsersTable";

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
                        Создание пользователей, ролей и их редактирование
                    </Text>
                    <CanAccess right={"security.roles.edit"}>
                        <HStack justifyContent={"flex-end"}>
                            <RoleEditorAndAdder />
                        </HStack>
                    </CanAccess>
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
