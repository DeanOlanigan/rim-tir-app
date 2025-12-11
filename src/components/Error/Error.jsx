import { queryClient } from "@/queryClients";
import { AbsoluteCenter, Button, Icon, Text, VStack } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export const ErrorElement = ({ text, keys, way }) => {
    const navigate = useNavigate(way);

    const refetch = async () => {
        await queryClient.refetchQueries([keys]);
        navigate();
    };

    return (
        <AbsoluteCenter backdropFilter={"blur(4px)"} h={"100%"} w={"100%"}>
            <VStack>
                <Icon w={"50%"} h={"50%"} color={"red.400"}>
                    <LuTriangleAlert />
                </Icon>
                <Text color={"fg.muted"} fontSize={"3xl"}>
                    Ошибка загрузки {text}
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
    );
};
