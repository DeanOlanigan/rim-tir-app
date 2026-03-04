import { getSoftwareVer, QK } from "@/api";
import { Badge, Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export const SoftwareVersion = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: QK.version,
        queryFn: getSoftwareVer,
    });

    if (isLoading) return <Skeleton w={"10ch"} />;

    return (
        <Badge
            variant={"outline"}
            colorPalette={isError ? "red" : "cyan"}
            textAlign={"center"}
            title={
                isError
                    ? "Ошибка считывания версии ПК"
                    : `Текущая версия ПК: ${data?.data}`
            }
            size={"xs"}
        >
            <Text minW={"10ch"}>{isError ? "Ошибка" : data?.data}</Text>
        </Badge>
    );
};
