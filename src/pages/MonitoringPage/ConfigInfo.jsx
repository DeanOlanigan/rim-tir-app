import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const ConfigInfo = () => {
    const { data: name } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ configInfo }) => configInfo.name,
    });

    return <div>Конфигурация: {name}</div>;
};
