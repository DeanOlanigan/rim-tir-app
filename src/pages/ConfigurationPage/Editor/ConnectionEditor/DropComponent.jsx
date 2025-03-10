import { Box, AbsoluteCenter, Text, IconButton } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { useVariablesStore } from "../../../../store/variables-store";
import { memo } from "react";
import { LuTrash2 } from "react-icons/lu";

export const DropComponent = memo(function DropComponent(props) {
    console.log("RENDER DropComponent");
    const { id, value, showText = true } = props;
    const settings = useVariablesStore((state) => state.settings);
    const setSettings = useVariablesStore((state) => state.setSettings);

    const [{ isOver, canDrop }, dropRef] = useDrop(
        () => ({
            accept: "NODE",
            canDrop: (item) => {
                return settings[item.id]?.type === "variable";
            },
            drop: (item) => {
                console.log("DROP", item);
                setSettings(id, {
                    variable: settings[item.id].name,
                    variableId: item.id, // TODO Перенести вверх по иерархии
                });
                setSettings(item.id, {
                    usedIn: id,
                });
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }),
        [id, settings, setSettings]
    );

    let borderColor = value ? "fg.subtle" : "fg.info";
    let backgroundColor = value ? "bg.emphasized" : "bg.info";
    if (isOver && canDrop) {
        borderColor = "fg.success";
        backgroundColor = "bg.success";
    } else if (isOver && !canDrop) {
        borderColor = "fg.error";
        backgroundColor = "bg.error";
    }

    return (
        <Box
            ref={dropRef}
            w={"100%"}
            h={"100%"}
            minH={"32px"}
            position={"relative"}
            border={"2px dashed"}
            borderColor={borderColor}
            borderRadius={"md"}
            backgroundColor={backgroundColor}
        >
            <IconButton
                size={"xs"}
                position={"absolute"}
                right={1}
                top={1}
                variant={"ghost"}
                onClick={() => {
                    setSettings(settings[id].setting.variableId, {
                        usedIn: "",
                    });
                    setSettings(id, {
                        variable: "",
                        variableId: "", // TODO Перенести вверх по иерархии
                    });
                }}
            >
                <LuTrash2 />
            </IconButton>
            <AbsoluteCenter>
                {showText && (
                    <Text fontWeight={"medium"} color={borderColor}>
                        {!value
                            ? canDrop
                                ? "Отпустите переменную"
                                : "Переместите переменную"
                            : "Текущая переменная: " + value}
                    </Text>
                )}
            </AbsoluteCenter>
        </Box>
    );
});
