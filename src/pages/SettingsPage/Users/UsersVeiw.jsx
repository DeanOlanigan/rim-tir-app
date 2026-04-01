import { Card, Heading, Text, VStack } from "@chakra-ui/react";
import { TableMenu } from "./TableMenu";
import { useUsersHistory } from "./hooks/useUsers";
import { useEffect } from "react";
import { useTableStore } from "../tablestore";
import { UsersTable } from "./UsersTable";

export const UsersView = () => {
    const dataUsers = useUsersHistory();

    useEffect(() => {
        useTableStore.getState().hydrate(dataUsers);
    }, [dataUsers]);

    return (
        <VStack align={"stretch"}>
            <Heading>Редактор пользователей</Heading>
            <Card.Root
                w={"100%"}
                variant={"elevated"}
                maxH={"2xl"}
                overflow={"clip"}
            >
                <Card.Header>
                    <Text fontSize={"lg"} fontWeight={"medium"}>
                        Создание пользователей и редактирование
                    </Text>
                </Card.Header>
                <Card.Body>
                    <TableMenu>
                        <UsersTable />
                    </TableMenu>
                </Card.Body>
            </Card.Root>
        </VStack>
    );
};
