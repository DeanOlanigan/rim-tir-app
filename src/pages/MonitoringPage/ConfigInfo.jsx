import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";
import { ConfigInfo } from "@/components/ConfigInfo";
import { useQuery } from "@tanstack/react-query";

export const ConfigInfoWrapper = () => {
    const { data: config } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ configInfo }) => configInfo,
    });

    return (
        <ConfigInfo
            name={config?.name}
            date={config?.date}
            description={config?.description}
        />
    );
};
