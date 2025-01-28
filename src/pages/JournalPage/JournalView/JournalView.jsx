import { Card, Flex, IconButton, Link, Box, CheckboxGroup, AbsoluteCenter, Spinner } from "@chakra-ui/react";
import { Checkbox } from "../../../components/ui/checkbox";
import {
    MenuContent,
    MenuRoot,
    MenuTrigger
} from "../../../components/ui/menu";
import { LuPause, LuPlay, LuDownload } from "react-icons/lu";
import { useJournalContext } from "../../../providers/JournalProvider/JournalContext";
import { tableColumns } from "../JournalFilter/filterOptions";
import { useMemo, useEffect, useRef } from "react";
import "react-virtualized/styles.css";
import JournalTable from "./JournalTable";

function JournalView() {
    const { isPaused, journalHeaders, journalRows, setIsPaused, setHeaders } = useJournalContext();
    console.log("Render JournalView");
    
    const visibleColumns = useMemo(
        () => 
            tableColumns.filter((col) => 
                journalHeaders.includes(col.value)
            ),
        [journalHeaders]
    );
    const scrollContainer = useRef(null);

    useEffect(() => {
        if (!isPaused) {
            scrollToBottom();
        }
    }, [journalRows, isPaused]);

    const scrollToBottom = () => {
        if (scrollContainer.current) {
            const test = journalRows.length;
            scrollContainer.current.scrollToRow(test);
        }
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
                                isPaused ? <LuPlay/> : <LuPause/>
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
                                        <Checkbox key={column.value} value={column.value}>
                                            {column.label}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                            </Box>
                        </MenuContent>
                    </MenuRoot>
                </Flex>
            </Card.Header>
            <Card.Body h={"100%"} pt={"0"} mt={"1rem"}>
                <Box w={"100%"} h={"100%"} position={"relative"}>
                    <JournalTable scrollRef={scrollContainer} rows={journalRows} columns={visibleColumns}/>
                    <AbsoluteCenter hidden={journalRows.length > 0} axis={"both"}>
                        <Spinner size={"xl"} />
                    </AbsoluteCenter>
                </Box>
            </Card.Body>
        </Card.Root>
    );
}
export default JournalView;
