import { fetchConfigurationState } from "@/api/new/configuration.services";
import { QK } from "@/api/queryKeys";
import { ConfigInfo } from "@/components/ConfigInfo";
import { useQuery } from "@tanstack/react-query";

export const ConfigInfoWrapper = () => {
    const { data: config } = useQuery({
        queryKey: QK.configuration,
        queryFn: fetchConfigurationState,
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
