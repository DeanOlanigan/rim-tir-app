import { AbsoluteCenter, Icon, Text, VStack } from "@chakra-ui/react";
import { LuFileQuestion } from "react-icons/lu";

export const NoData = ({ message = "Нет данных" }) => {
    return (
        <AbsoluteCenter>
            <VStack textAlign={"center"}>
                <Icon
                    as={LuFileQuestion}
                    fontSize={"164px"}
                    color={"bg.muted"}
                />
                <Text color={"fg.muted"} fontWeight={"medium"}>
                    {message}
                </Text>
            </VStack>
        </AbsoluteCenter>
    );
};
