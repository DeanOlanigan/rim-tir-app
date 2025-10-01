import { Group, IconButton, CheckboxCard, Icon } from "@chakra-ui/react";
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

export const LogToolBox = () => {
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
                borderColor={"colorPalette.muted"}
                _hover={{ bg: "colorPalette.subtle" }}
            >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control p={"0.45rem"}>
                    <Icon
                        as={LuWrapText}
                        size={"sm"}
                        color={"colorPalette.fg"}
                    />
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <CheckboxCard.Root
                variant={"surface"}
                checked={isPaused}
                onCheckedChange={togglePaused}
                borderColor={"colorPalette.muted"}
                _hover={{ bg: "colorPalette.subtle" }}
            >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control p={"0.45rem"}>
                    <Icon
                        as={isPaused ? LuCirclePause : LuCirclePlay}
                        size={"sm"}
                        color={"colorPalette.fg"}
                    />
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
};
