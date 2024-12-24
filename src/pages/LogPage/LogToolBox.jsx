import { Group, IconButton, CheckboxCard } from "@chakra-ui/react";
import { useLogContext } from "../../providers/LogProvider/LogContext";
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
    const { state, dispatch, logData } = useLogContext();
    const { logTextSize, isLogTextWrapped, isPaused, pausedLogs } = state;

    const handleDownload = async () => {
        window.location.href = (`/api/v1/getLog?logfile=${logData.name}&type=${logData.type}`);
    };

    return (
        <Group attached shadow={"md"}>
            <IconButton size={"xs"} variant={"outline"} onClick={handleDownload}><LuDownload/></IconButton>
            <IconButton size={"xs"} variant={"outline"}
                onClick={() => dispatch({ type: "SET_TEXT_SIZE", payload: logTextSize + 1 })}>
                <LuCirclePlus/>
            </IconButton>
            <IconButton size={"xs"} variant={"outline"}
                onClick={() => dispatch({ type: "SET_TEXT_SIZE", payload: logTextSize - 1 })}>
                <LuCircleMinus/>
            </IconButton>
            <CheckboxCard.Root
                variant={"surface"}
                checked={isLogTextWrapped}
                onCheckedChange={(e) => dispatch({ type: "TOGGLE_WRAP", payload: e.checked })}
            >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control p={"0.45rem"}>
                    <LuWrapText size={"16px"}/>
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <CheckboxCard.Root 
                variant={"surface"}
                checked={isPaused}
                onCheckedChange={(e) => {
                    if (isPaused) {
                        dispatch({
                            type: "ADD_LOGS",
                            payload: pausedLogs.concat([{
                                severity: "STATUS",
                                message: "Логи возобновлены",
                            }])
                        });
                        dispatch({ type: "CLEAR_PAUSED_LOGS" });
                    } else {
                        dispatch({
                            type: "ADD_LOGS",
                            payload: [{
                                severity: "STATUS",
                                message: "Логи приостановлены",
                            }]
                        });
                    }
                    dispatch({ type: "TOGGLE_PAUSE", payload: e.checked });
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
                    dispatch({ type: "CLEAR_LOGS" });
                    dispatch({ type: "CLEAR_PAUSED_LOGS" });
                }}>
                <LuEraser/>
            </IconButton>
        </Group>
    );
}

export default LogToolBox;
