import { getSoftwareVer, QK } from "@/api";
import { Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export const SoftwareVersion = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: QK.version,
        queryFn: getSoftwareVer,
    });

    if (isLoading) return <Skeleton />;

    return (
        <Text
            fontSize={"2xs"}
            color={"fg.subtle"}
            fontWeight={"bold"}
            minW={"10ch"}
            title={
                isError
                    ? "Ошибка считывания версии ПК"
                    : `Текущая версия ПК: ${data?.data}`
            }
        >
            {isError ? "Ошибка" : data?.data}
        </Text>
    );
};
