import { Box, AbsoluteCenter, Text } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { useVariablesStore } from "../../../../store/variables-store";

export const DropComponent = ({ id, showText = true }) => {
    console.log("RENDER DropComponent");

    const settings = useVariablesStore((state) => state.settings);
    const setSettings = useVariablesStore((state) => state.setSettings);

    const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
        accept: "NODE",
        canDrop: (item) => {
            return settings[item.id].type === "variable";
        },
        drop: (item) => {
            console.log("DROP", item);
            setSettings(id, {
                variable: settings[item.id].name,
            });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    let borderColor = "fg.info";
    let backgroundColor = "bg.info";
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
            <AbsoluteCenter>
                {showText && (
                    <Text fontWeight={"medium"} color={borderColor}>
                        {canDrop
                            ? "Отпустите переменную"
                            : "Переместите переменную"}
                    </Text>
                )}
            </AbsoluteCenter>
        </Box>
    );
};
