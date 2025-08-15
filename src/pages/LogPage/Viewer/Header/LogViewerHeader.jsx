import { HStack, IconButton } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import LogName from "./LogName";
import LogTypesFilterButtons from "./LogTypesFilterButtons";
import LogToolBox from "./LogToolBox";
import { useLogStore } from "../../LogStore/LogStore";
import useLogViewerStore from "../../LogStore/LogViewerStore";

function LogViewerHeader() {
    console.log("Render LogViewerHeader");
    const removeChosenLogFromLocalStorage = useLogStore(state => state.removeChosenLog);
    const resetFilters = useLogViewerStore(state => state.setCurrentFilterZus);
    const resetLogs = useLogViewerStore.getState().clearLogsZus;
    
    //const resetLogData = useLogStore(state => state.updateLogDataZus);

    return (
        <HStack align={"center"} justify={"space-between"} gap={"4"}>
            <IconButton
                size={"xs"}
                shadow={"xs"}
                variant={"outline"}
                onClick={() => {
                    removeChosenLogFromLocalStorage();
                    resetFilters({
                        WARNING: true,
                        ERROR: true,
                        INFO: true,
                    });
                    resetLogs();
                }}
            >
                <LuArrowLeft />
            </IconButton>
            <LogName />
            <LogTypesFilterButtons />
            <LogToolBox />
        </HStack>
    );
}

export default LogViewerHeader;
