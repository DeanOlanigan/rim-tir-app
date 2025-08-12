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
    let message;
    if (status === "error") {
        message = "Выберите узлы одинакового типа.";
    } else if (type === "connections") {
        message = "Выберите узел в дереве приема или передачи";
    } else {
        message = "Выберите узел в дереве переменных";
    }

    return (
        <Box w={"100%"} h={"100%"} position={"relative"}>
            <AbsoluteCenter>
                <VStack w={"100%"}>
                    <Icon
                        as={type === "connections" ? LuCog : LuVariable}
                        fontSize={"164px"}
                        color={status === "error" ? "fg.error" : "bg.muted"}
                    />
                    <HStack>
                        <Text
                            color={status === "error" ? "fg.error" : "fg.muted"}
                            fontWeight={"medium"}
                        >
                            {message}
                        </Text>
                    </HStack>
                </VStack>
            </AbsoluteCenter>
        </Box>
    );
};
