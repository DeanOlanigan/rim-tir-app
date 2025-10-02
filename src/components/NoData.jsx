import { AbsoluteCenter, Icon, Text, VStack } from "@chakra-ui/react";
import { LuFileQuestion } from "react-icons/lu";

export const NoData = () => {
    return (
        <AbsoluteCenter>
            <VStack textAlign={"center"}>
                <Icon
                    as={LuFileQuestion}
                    fontSize={"164px"}
                    color={"bg.muted"}
                />
                <Text color={"fg.subtle"} fontWeight={"medium"}>
                    Нет данных
                </Text>
            </VStack>
        </AbsoluteCenter>
    );
};
