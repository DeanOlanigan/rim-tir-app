import { Group, IconButton, CheckboxCard, Icon, Text } from "@chakra-ui/react";
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
import { useLogStream } from "../../Store/stream-store";

export const LogToolBox = () => {
    const isLogTextWrapped = useLogStore((state) => state.isLogTextWrapped);
    const isPaused = useLogStream((state) => state.isPaused);
    const { pause, resume, reset } = useLogStream.getState();
    const { incLogTextSize, decLogTextSize, toggleLogTextWrapped } =
        useLogStore.getState();

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
                onCheckedChange={(e) => (e.checked ? pause() : resume())}
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
            <IconButton size={"xs"} variant={"outline"} onClick={reset}>
                <LuEraser />
            </IconButton>
        </Group>
    );
};
