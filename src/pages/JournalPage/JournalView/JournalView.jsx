import { useMemo } from "react";
import { Card, Table, Flex, IconButton, Link, Box, CheckboxGroup } from "@chakra-ui/react";
import { Checkbox } from "../../../components/ui/checkbox";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger
} from "../../../components/ui/menu";
import { LuPause, LuPlay, LuDownload } from "react-icons/lu";

function JournalView({ journalData }) {
    
    const tableHeaders = useMemo(() => {
        if (journalData.length === 0) return [];
        return Object.keys(journalData[0]);
    }, [journalData]);
    
    const tableHeadersMap = {
        date: "Дата и время",
        type: "Тип",
        var: "Переменная",
        desc: "Описание",
        val: "Значение",
        group: "Группа"
    };

    return (
        <Card.Root
            w={"100%"}
            h={"100%"}
            shadow={"xl"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Flex justifyContent={"space-between"}>
                    <Flex gap={"1"}>
                        <IconButton variant={"outline"} size={"xs"}><LuDownload/></IconButton>
                        <IconButton variant={"outline"} size={"xs"}><LuPlay/></IconButton>
                    </Flex>
                    <MenuRoot>
                        <MenuTrigger asChild>
                            <Link variant={"underline"} fontSize={"sm"}>
                                показать/спрятать столбцы
                            </Link>
                        </MenuTrigger>
                        <MenuContent>
                            <Box p={"2"}>
                                <CheckboxGroup>
                                    <Checkbox value="date">Дата и время</Checkbox>
                                    <Checkbox value="date">Тип</Checkbox>
                                    <Checkbox value="date">Переменная   </Checkbox>
                                    <Checkbox value="date">Описание</Checkbox>
                                    <Checkbox value="date">Значение</Checkbox>
                                    <Checkbox value="date">Группа</Checkbox>
                                </CheckboxGroup>
                            </Box>
                        </MenuContent>
                    </MenuRoot>
                </Flex>
            </Card.Header>
            <Card.Body h={"100%"} overflow={"auto"} pt={"0"} mt={"1rem"}>
                {
                    // TODO Изменить для постоянного отображения на странице 
                    // и управлении с помощью чекбоксов выше
                    tableHeaders && tableHeaders.length > 0 && (
                        <Table.Root size={"sm"} interactive stickyHeader>
                            <Table.Header>
                                <Table.Row justifyContent={"space-between"}>
                                    {tableHeaders.map((item, index) => {
                                        return (
                                            <Table.ColumnHeader key={index}>
                                                {tableHeadersMap[item]}
                                            </Table.ColumnHeader>
                                        );
                                    })}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    journalData.map((item, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                {
                                                    tableHeaders.map((column)=> {
                                                        return (
                                                            <Table.Cell key={column}>{item[column]}</Table.Cell>
                                                        );
                                                    })
                                                }
                                            </Table.Row>
                                        );
                                    })
                                }
                            </Table.Body>
                        </Table.Root>
                    )
                }
            </Card.Body>
        </Card.Root>
    );
}

export default JournalView;
