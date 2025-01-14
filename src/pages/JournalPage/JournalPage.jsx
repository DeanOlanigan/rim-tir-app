import { useEffect, useRef, useState } from "react";
import { Container, HStack } from "@chakra-ui/react";
import JournalFilter from "./JournalFilter/JournalFilter";
import JournalView from "./JournalView/JournalView";
import websocketService from "../../services/websocketService";
const wsService = new websocketService("ws://192.168.1.1:8800");

function JournalPage() {
    //const [filter, setFilter] = useState({});
    const [jData, setJData] = useState([]);
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) {
            wsService.connect();
            const messageHandler = (message) => {
                console.log(message);
                //const parsedData = JSON.parse(message);
                //setJData(prevData => [...prevData, ...parsedData]);
            };
            wsService.addMessageHandler(messageHandler);
            //wsService.sendMessage({ journal: filter });
            return () => {
                wsService.removeMessageHandler(messageHandler);
                wsService.close();
            };
        } else {
            isMounted.current = true;
        }
    }, []);

    const transferDate = (date) => {
        const newDate = new Date(date);
        const month = ("0" + (newDate.getMonth() + 1)).substr(-2);
        const day = ("0" + (newDate.getDate() + 1)).substr(-2);
        const hour = ("0" + (newDate.getHours())).substr(-2);
        const minute = ("0" + (newDate.getMinutes())).substr(-2);
        return `${newDate.getFullYear()}-${month}-${day} ${hour}:${minute}`;
    };

    const handleFilter = (filters) => {
        //setJData([]);
        const oldDates = transferDate(filters.archiveStartDatePick);
        const newDates = transferDate(filters.archiveEndDatePick);
        //setFilter({...filters, archiveStartDatePick: oldDates, archiveEndDatePick: newDates});
        wsService.sendMessage({ journal: {...filters, archiveStartDatePick: oldDates, archiveEndDatePick: newDates} });
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
            <HStack
                w={"100%"}
                flex={"1"}
                display={"flex"}
                flexDirection={"row"}
                align={"flex-start"}
                minH={"0"}
            >
                <JournalFilter onApplyFilters={handleFilter} />
                <JournalView journalData={jData}/>
            </HStack>
        </Container>
    );
}

export default JournalPage;
