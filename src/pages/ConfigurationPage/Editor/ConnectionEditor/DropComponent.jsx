import { Box, AbsoluteCenter, Text, IconButton } from "@chakra-ui/react";
import { useVariablesStore } from "../../../../store/variables-store";
import { memo } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useVariableDrop } from "../../../../hooks/useVariableDrop";

export const DropComponent = memo(function DropComponent(props) {
    //console.log("RENDER DropComponent");
    const { id, variableId, showText = true } = props;
    const unbindVariable = useVariablesStore((state) => state.unbindVariable);

    const { isOver, canDrop, dropRef } = useVariableDrop({ id });
    const variable = useVariablesStore((state) => state.settings[variableId]);

    let borderColor = variableId ? "fg.subtle" : "fg.info";
    let backgroundColor = variableId ? "bg.emphasized" : "bg.info";
    if (isOver && canDrop) {
        borderColor = "fg.success";
        backgroundColor = "bg.success";
    } else if (isOver && !canDrop) {
        borderColor = "fg.error";
        backgroundColor = "bg.error";
    }
    // TODO Добавить подсказку "переменная уже используется" при попытке перетаскивать переменную, которая уже используется
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
                    unbindVariable(id);
                }}
            >
                <LuTrash2 />
            </IconButton>
            <AbsoluteCenter>
                {showText && (
                    <Text fontWeight={"medium"} color={borderColor}>
                        {!variableId
                            ? canDrop
                                ? "Отпустите переменную"
                                : "Переместите переменную"
                            : "Текущая переменная: " + variable.name}
                    </Text>
                )}
            </AbsoluteCenter>
        </Box>
    );
});
