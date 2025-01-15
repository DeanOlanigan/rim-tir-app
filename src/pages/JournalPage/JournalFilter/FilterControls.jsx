import { useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { useJournalContext } from "../../../providers/JournalProvider/JournalContext";
import websocketService from "../../../services/websocketService";
const wsService = new websocketService("ws://192.168.1.1:8800");

function FilterControls({ filters, setFilters}) {
    const { setJournalRows, clearJournalRows} = useJournalContext();
    console.log("Render FilterControls");
    useEffect(() => {
        wsService.connect();
        const messageHandler = (message) => {
            setJournalRows(message);
        };
        wsService.addMessageHandler(messageHandler);
        wsSend();
        return () => {
            wsService.removeMessageHandler(messageHandler);
            wsService.close();
        };
    }, []);

    const transferDate = (date) => {
        const newDate = new Date(date);
        const month = ("0" + (newDate.getMonth() + 1)).substr(-2);
        const day = ("0" + (newDate.getDate() + 1)).substr(-2);
        const hour = ("0" + (newDate.getHours())).substr(-2);
        const minute = ("0" + (newDate.getMinutes())).substr(-2);
        return `${newDate.getFullYear()}-${month}-${day} ${hour}:${minute}`;
    };

    const handleApply = () => {
        clearJournalRows();
        wsSend();
    };

    const handleReset = () => {
        clearJournalRows();
        setFilters([]);
    };

    const wsSend = () => {
        const oldDates = transferDate(filters.archiveStartDatePick);
        const newDates = transferDate(filters.archiveEndDatePick);
        wsService.sendMessage({ journal: {...filters, archiveStartDatePick: oldDates, archiveEndDatePick: newDates} });
    };

    return (
        <>
            <Button size={"xs"} disabled={!filters.columns.length} onClick={handleApply}>Применить</Button>
            <Button size={"xs"} onClick={handleReset}>Сбросить</Button>
        </>
    );
}

export default FilterControls;
