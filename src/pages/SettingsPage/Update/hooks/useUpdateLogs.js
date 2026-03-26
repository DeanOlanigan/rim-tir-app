import { checkUpdateStatus } from "@/api/routes/update.api";
import { useQuery } from "@tanstack/react-query";

export const useUpdatesLogs = (enabled) => {
    return useQuery({
        queryKey: ["update"],
        queryFn: checkUpdateStatus,
        refetchInterval: 5000,
        enabled,
    });
};
