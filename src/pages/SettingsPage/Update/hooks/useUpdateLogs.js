import { checkUpdateStatus } from "@/api/routes/update.api";
import { useQuery } from "@tanstack/react-query";

export const useUpdatesLogs = (enabled) => {
    return useQuery({
        queryKey: ["update-status"],
        queryFn: checkUpdateStatus,
        enabled,
        refetchInterval: enabled ? 5000 : false,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 0,
    });
};
