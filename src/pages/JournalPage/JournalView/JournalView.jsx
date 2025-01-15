import { Card, Table, Flex, IconButton, Link, Box, CheckboxGroup } from "@chakra-ui/react";
import { Checkbox } from "../../../components/ui/checkbox";
import {
    MenuContent,
    MenuRoot,
    MenuTrigger
} from "../../../components/ui/menu";
import { LuPause, LuPlay, LuDownload } from "react-icons/lu";
import { useJournalContext } from "../../../providers/JournalProvider/JournalContext";
import { tableColumns } from "../JournalFilter/filterOptions";

function JournalView() {
    const { isPaused, journalHeaders, journalRows, setIsPaused, setHeaders } = useJournalContext();
    console.log("Render JournalView");
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
                        <IconButton 
                            variant={"outline"}
                            size={"xs"}
                            onClick={() => setIsPaused(!isPaused)}
                        >
                            {
                                isPaused ? <LuPause/> : <LuPlay/>
                            }
                        </IconButton>
                    </Flex>
                    <MenuRoot>
                        <MenuTrigger asChild>
                            <Link variant={"underline"} fontSize={"sm"}>
                                показать/спрятать столбцы
                            </Link>
                        </MenuTrigger>
                        <MenuContent>
                            <Box p={"2"}>
                                <CheckboxGroup
                                    value={journalHeaders}
                                    onValueChange={(columns) => setHeaders(columns)}
                                >
                                    {tableColumns.map((column) => (
                                        <Checkbox key={column.value} value={column.value}>{column.label}</Checkbox>
                                    ))}
                                </CheckboxGroup>
                            </Box>
                        </MenuContent>
                    </MenuRoot>
                </Flex>
            </Card.Header>
            <Card.Body h={"100%"} overflow={"auto"} pt={"0"} mt={"1rem"}>
                
                <Table.Root size={"sm"} interactive stickyHeader>
                    <Table.Header>
                        <Table.Row justifyContent={"space-between"}>
                            {
                                journalHeaders.map((item) => {
                                    return (
                                        <Table.ColumnHeader textAlign={"center"} key={item}>
                                            {tableHeadersMap[item]}
                                        </Table.ColumnHeader>
                                    );
                                })
                            }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            journalRows.map((item, index) => {
                                return (
                                    <Table.Row key={index} background={item.mark ? "green.200" : ""}>
                                        {
                                            journalHeaders.map((column)=> {
                                                return (
                                                    <Table.Cell textAlign={"center"} key={column}>{item[column]}</Table.Cell>
                                                );
                                            })
                                        }
                                    </Table.Row>
                                );
                            })
                        }
                    </Table.Body>
                </Table.Root>

            </Card.Body>
        </Card.Root>
    );
}

export default JournalView;
