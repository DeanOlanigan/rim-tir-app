import { Group, IconButton, CheckboxCard } from "@chakra-ui/react";
import { useLogViewerContext } from "../../../../providers/LogViewerProvider/LogViewerContext";
import { useLogContext } from "../../../../providers/LogProvider/LogContext";
import {
    LuCirclePlus,
    LuCircleMinus,
    LuCirclePlay,
    LuCirclePause,
    LuDownload,
    LuWrapText,
    LuEraser
} from "react-icons/lu";

function LogToolBox() {
    const {
        isPaused,
        setIsPaused,
        isLogTextWrapped,
        setIsLogTextWrapped,
        logTextSize,
        setLogTextSize,
        setLogs,
        setPausedLogs
    } = useLogViewerContext();
    const { logData } = useLogContext();

    const handleDownload = async () => {
        window.location.href = (`/api/v1/getLog?logfile=${logData.name}&type=${logData.type}`);
    };

    return (
        <Group attached>
            <IconButton size={"xs"} variant={"outline"} onClick={handleDownload}><LuDownload/></IconButton>
            <IconButton size={"xs"} variant={"outline"}
                onClick={() => setLogTextSize(logTextSize + 1)}>
                <LuCirclePlus/>
            </IconButton>
            <IconButton size={"xs"} variant={"outline"}
                onClick={() => setLogTextSize(logTextSize - 1)}>
                <LuCircleMinus/>
            </IconButton>
            <CheckboxCard.Root
                variant={"surface"}
                checked={isLogTextWrapped}
                onCheckedChange={() => setIsLogTextWrapped(!isLogTextWrapped)}
            >    
                <CheckboxCard.HiddenInput />   
                <CheckboxCard.Control p={"0.45rem"}>
                    <LuWrapText size={"16px"}/>
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <CheckboxCard.Root
                variant={"surface"}
                checked={isPaused}
                onCheckedChange={() => {
                    if (isPaused) {
                        setPausedLogs([]);
                    }
                    setIsPaused(!isPaused);
                }}
            >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control p={"0.45rem"}>
                    {
                        isPaused
                            ? <LuCirclePlay size={"16px"}/>
                            : <LuCirclePause size={"16px"}/>
                    }
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <IconButton size={"xs"} variant={"outline"}
                onClick={() => {
                    setLogs([]);
                    setPausedLogs([]);
                }}>
                <LuEraser/>
            </IconButton>
        </Group>
    );
}

export default LogToolBox;
