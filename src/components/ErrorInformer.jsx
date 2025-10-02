import { AbsoluteCenter, Icon, Text, VStack } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

export const ErrorInformer = ({ error }) => {
    return (
        <AbsoluteCenter>
            <VStack textAlign={"center"}>
                <Icon
                    as={LuTriangleAlert}
                    fontSize={"164px"}
                    color={"fg.error/30"}
                />
                <Text color={"fg.error"} fontWeight={"medium"}>
                    Ошибка загрузки
                </Text>
                {error?.message && (
                    <Text color={"fg.error"}>{error.message}</Text>
                )}
            </VStack>
        </AbsoluteCenter>
    );
};
