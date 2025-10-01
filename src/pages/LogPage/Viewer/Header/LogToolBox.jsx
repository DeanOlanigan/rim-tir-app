import { Group, IconButton, CheckboxCard } from "@chakra-ui/react";
import { useLogViewerContext } from "@/providers/LogViewerProvider/LogViewerContext";
import { useLogContext } from "@/providers/LogProvider/LogContext";
import {
    LuCirclePlus,
    LuCircleMinus,
    LuCirclePlay,
    LuCirclePause,
    LuDownload,
    LuWrapText,
    LuEraser,
} from "react-icons/lu";
import { useLogStore } from "../../Store/store";

function LogToolBox() {
    const isLogTextWrapped = useLogStore((state) => state.isLogTextWrapped);
    const isPaused = useLogStore((state) => state.isPaused);
    const {
        incLogTextSize,
        decLogTextSize,
        togglePaused,
        toggleLogTextWrapped,
        clearLogs,
    } = useLogStore.getState();

    /* const handleDownload = async () => {
        window.location.href = `/api/v1/getLog?logfile=${logData.name}&type=${logData.type}`;
    }; */

    return (
        <Group attached shadow={"xs"}>
            <IconButton
                size={"xs"}
                variant={"outline"}
                //onClick={handleDownload}
            >
                <LuDownload />
            </IconButton>
            <IconButton
                size={"xs"}
                variant={"outline"}
                onClick={incLogTextSize}
            >
                <LuCirclePlus />
            </IconButton>
            <IconButton
                size={"xs"}
                variant={"outline"}
                onClick={decLogTextSize}
            >
                <LuCircleMinus />
            </IconButton>
            <CheckboxCard.Root
                variant={"surface"}
                checked={isLogTextWrapped}
                onCheckedChange={toggleLogTextWrapped}
            >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control p={"0.45rem"}>
                    <LuWrapText size={"16px"} />
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <CheckboxCard.Root
                variant={"surface"}
                checked={isPaused}
                onCheckedChange={togglePaused}
            >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control p={"0.45rem"}>
                    {isPaused ? (
                        <LuCirclePlay size={"16px"} />
                    ) : (
                        <LuCirclePause size={"16px"} />
                    )}
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <IconButton
                size={"xs"}
                variant={"outline"}
                /* onClick={() => {
                    clearLogs();
                }} */
            >
                <LuEraser />
            </IconButton>
        </Group>
    );
}

export default LogToolBox;
