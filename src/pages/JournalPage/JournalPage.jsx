import { Container, Heading, HStack, Stack, Card, Button, Flex } from "@chakra-ui/react";
import JournalFilter from "./JournalFilter/JournalFilter";
import JournalView from "./JournalView/JournalView";
import websocketService from "../../services/websocketService";
import { useEffect, useState } from "react";
const wsService = new websocketService("ws://192.168.1.1:8800");

function JournalPage() {
    const [filter, setFilter] = useState({});
    const [jData, setJData] = useState([]);

    useEffect(() => {
        wsService.connect();

        const messageHandler = (message) => {
            setJData(message);
        };

        wsService.addMessageHandler(messageHandler);

        wsService.sendMessage({ journal: filter });
        
        return () => {
            wsService.removeMessageHandler(messageHandler);
            wsService.close();
        };
    }, [filter]);

    const handleFilter = (filters) => {
        const oldDate = new Date(filters.archiveStartDatePick);
        const oldmonth = ("0" + (oldDate.getMonth() + 1)).substr(-2);
        const oldday = ("0" + (oldDate.getDate() + 1)).substr(-2);
        const oldHour = ("0" + (oldDate.getHours())).substr(-2);
        const oldMinute = ("0" + (oldDate.getMinutes())).substr(-2);
        const newDate = new Date(filters.archiveEndDatePick);
        const newmonth = ("0" + (newDate.getMonth() + 1)).substr(-2);
        const newday = ("0" + (newDate.getDate() + 1)).substr(-2);
        const newHour = ("0" + (newDate.getHours())).substr(-2);
        const newMinute = ("0" + (newDate.getMinutes())).substr(-2);
        const oldDates = `${oldDate.getFullYear()}-${oldmonth}-${oldday} ${oldHour}:${oldMinute}`;
        const newDates = `${newDate.getFullYear()}-${newmonth}-${newday} ${newHour}:${newMinute}`;

        setFilter({...filters, archiveStartDatePick: oldDates, archiveEndDatePick: newDates});
    };

    return (
        <Container
            maxW={"6xl"}
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
            gap={"2"}
        >
            <Heading>Журнал</Heading>
            <HStack
                w={"100%"}
                flex={"1"}
                display={"flex"}
                flexDirection={"row"}
                align={"flex-start"}
                minH={"0"}
            >
                <Stack direction={"column"}>
                    <Card.Root shadow={"xl"}>
                        <Card.Body>
                            <Flex gap={"2"} justifyContent={"space-between"}>
                                <Button size={"xs"}>Скачать</Button>
                                <Button size={"xs"}>Пауза</Button>
                            </Flex>
                        </Card.Body>
                    </Card.Root>
                    <JournalFilter onApplyFilters={handleFilter} />
                </Stack>
                
                <JournalView journalData={jData}/>
            </HStack>
        </Container>
    );
}

export default JournalPage;