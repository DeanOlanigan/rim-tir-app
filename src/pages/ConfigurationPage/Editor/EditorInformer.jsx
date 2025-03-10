import {
    AbsoluteCenter,
    Box,
    HStack,
    Icon,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuCog, LuVariable } from "react-icons/lu";

export const EditorInformer = ({ status, type }) => {
    return (
        <Box w={"100%"} h={"100%"} position={"relative"}>
            <AbsoluteCenter>
                <VStack w={"100%"}>
                    <Icon
                        fontSize={"164px"}
                        color={status === "error" ? "red.800" : "bg.muted"}
                    >
                        {type === "connections" ? <LuCog /> : <LuVariable />}
                    </Icon>
                    <HStack>
                        <Text
                            color={status === "error" ? "red.700" : "fg.muted"}
                            fontWeight={"medium"}
                        >
                            {status !== "error"
                                ? type === "connections"
                                    ? "Выберите узел в дереве приема или передачи"
                                    : "Выберите узел в дереве переменных"
                                : "Выберите узлы одинакового типа."}
                        </Text>
                    </HStack>
                </VStack>
            </AbsoluteCenter>
        </Box>
    );
};
