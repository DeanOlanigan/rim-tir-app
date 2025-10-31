import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";
import { ConfigInfo } from "@/components/ConfigInfo";
import { useQuery } from "@tanstack/react-query";

export const ConfigInfoWrapper = () => {
    const { data: config } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: (state) => state.info,
    });

    return (
        <ConfigInfo
            date={config?.ts}
            name={config?.name}
            description={config?.description}
        />
    );
};
