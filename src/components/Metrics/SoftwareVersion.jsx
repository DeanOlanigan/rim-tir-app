import { QK } from "@/api";
import { Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "../ui/tooltip";
import { getSoftwareVersion } from "@/api/routes/system.api";

export const SoftwareVersion = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: QK.version,
        queryFn: getSoftwareVersion,
    });

    if (isLoading) return <Skeleton />;

    const tooltip = isError
        ? "Ошибка считывания версии ПК"
        : `Текущая версия ПК: ${data?.data}`;

    return (
        <Tooltip
            showArrow
            content={tooltip}
            positioning={{ placement: "right" }}
            openDelay={1000}
        >
            <Text fontSize={"2xs"} color={"fg.subtle"} fontWeight={"bold"}>
                {isError ? "Ошибка" : data?.data}
            </Text>
        </Tooltip>
    );
};
