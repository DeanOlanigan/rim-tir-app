import { Group, IconButton, CheckboxCard, Icon } from "@chakra-ui/react";
import {
    LuCirclePlus,
    LuCircleMinus,
    LuDownload,
    LuWrapText,
    LuEraser,
} from "react-icons/lu";
import { useLogStore } from "../../store/store";
import { useLogStream } from "../../store/stream-store";
import { Tooltip } from "@/components/ui/tooltip";

export const LogToolBox = () => {
    const isLogTextWrapped = useLogStore((state) => state.isLogTextWrapped);
    const { reset } = useLogStream.getState();
    const { incLogTextSize, decLogTextSize, toggleLogTextWrapped } =
        useLogStore.getState();

    return (
        <Group shadow={"xs"} zIndex={1}>
            <Tooltip showArrow content={"Скачать файл"}>
                <IconButton
                    size={"xs"}
                    variant={"outline"}
                    //onClick={handleDownload}
                >
                    <LuDownload />
                </IconButton>
            </Tooltip>
            <Tooltip showArrow content={"Увеличить шрифт"}>
                <IconButton
                    size={"xs"}
                    variant={"outline"}
                    onClick={incLogTextSize}
                >
                    <LuCirclePlus />
                </IconButton>
            </Tooltip>
            <Tooltip showArrow content={"Уменьшить шрифт"}>
                <IconButton
                    size={"xs"}
                    variant={"outline"}
                    onClick={decLogTextSize}
                >
                    <LuCircleMinus />
                </IconButton>
            </Tooltip>
            <CheckboxCard.Root
                variant={"surface"}
                checked={isLogTextWrapped}
                onCheckedChange={toggleLogTextWrapped}
                borderColor={"colorPalette.border"}
                _hover={{ bg: "colorPalette.subtle" }}
                transitionProperty="common"
                transitionDuration="moderate"
            >
                <CheckboxCard.HiddenInput />
                <Tooltip showArrow content={"Переносить текст"}>
                    <CheckboxCard.Control p={"0.45rem"}>
                        <Icon
                            as={LuWrapText}
                            size={"sm"}
                            color={"colorPalette.fg"}
                        />
                    </CheckboxCard.Control>
                </Tooltip>
            </CheckboxCard.Root>
            <Tooltip showArrow content={"Очистить"}>
                <IconButton size={"xs"} variant={"outline"} onClick={reset}>
                    <LuEraser />
                </IconButton>
            </Tooltip>
        </Group>
    );
};
