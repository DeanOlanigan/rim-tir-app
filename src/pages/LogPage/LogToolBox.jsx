import { Group, IconButton, Icon, CheckboxCard } from "@chakra-ui/react";
import { useLogContext } from "../../providers/LogProvider/LogContext";
import {
    LuCirclePlus,
    LuCircleMinus,
    LuCirclePlay,
    LuCirclePause,
    LuCopy,
    LuDownload,
    LuWrapText,
    LuEraser
} from "react-icons/lu";

function LogToolBox() {
    const { state, dispatch } = useLogContext();
    const { logTextSize, isLogTextWrapped, isPaused } = state;

    return (
        <Group attached shadow={"md"}>
            <IconButton size={"xs"} variant={"outline"}><LuDownload/></IconButton>
            <IconButton size={"xs"} variant={"outline"}><LuCopy/></IconButton>
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
                    <Icon fontSize={"16px"}>
                        <LuWrapText/>
                    </Icon>
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <CheckboxCard.Root 
                variant={"surface"}
                checked={isPaused}
                onCheckedChange={(e) => dispatch({ type: "TOGGLE_PAUSE", payload: e.checked })}
            >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control p={"0.45rem"}>
                    <Icon fontSize={"16px"}>
                        {
                            isPaused
                                ? <LuCirclePlay/>
                                : <LuCirclePause/>
                        }
                    </Icon>
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <IconButton size={"xs"} variant={"outline"}
                onClick={() => dispatch({ type: "CLEAR_LOGS" })}>
                <LuEraser/>
            </IconButton>
        </Group>
    );
}

export default LogToolBox;
