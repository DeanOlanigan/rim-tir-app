import {
    AbsoluteCenter,
    Box,
    Button,
    Icon,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

export const ErrorModal = ({ text, refetch }) => (
    <Box zIndex={"modal"}>
        <AbsoluteCenter
            backdropFilter={"blur(4px)"}
            h={"100%"}
            w={"100%"}
            justifyContent={"center"}
        >
            <VStack>
                <Icon w={"50%"} h={"50%"} color={"red.400"}>
                    <LuTriangleAlert />
                </Icon>
                <Text color={"fg.muted"} fontSize={"3xl"}>
                    {text}
                </Text>
                <Button
                    onClick={() => refetch()}
                    variant="plain"
                    color={"red.400"}
                >
                    Перезагрузить
                </Button>
            </VStack>
        </AbsoluteCenter>
    </Box>
);
