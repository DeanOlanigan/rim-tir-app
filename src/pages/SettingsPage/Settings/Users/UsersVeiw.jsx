import { Card, Heading, HStack, IconButton, Text } from "@chakra-ui/react";
import { UsersTable } from "./UsersTable";
import { LuUserCog, LuUserRoundPlus } from "react-icons/lu";
import { useTableStore } from "../SettingsStore/tablestore";

export const UsersView = () => {
    const { setIsAdding, selectedRows, isAdding } = useTableStore();
    return (
        <>
            <Heading paddingBottom={"2"}>Редактор пользователей</Heading>
            <Card.Root
                w={"100%"}
                variant={"elevated"}
                h={"2xl"}
                overflow={"clip"}
            >
                <Card.Header>
                    <Text fontSize={"lg"} fontWeight={"medium"}>
                        Создание пользователя, ролей и их редактирование
                    </Text>
                    <HStack justifyContent={"flex-end"}>
                        <IconButton
                            variant={isAdding ? "solid" : "outline"}
                            size="sm"
                            w="50px"
                            onClick={() => {
                                setIsAdding();
                            }}
                        >
                            <LuUserRoundPlus />
                        </IconButton>
                        <IconButton
                            disabled={!selectedRows.length}
                            size="sm"
                            width="50px"
                        >
                            <LuUserCog />
                        </IconButton>
                    </HStack>
                </Card.Header>
                <Card.Body>
                    <UsersTable />
                </Card.Body>
            </Card.Root>
        </>
    );
};
