import { authKeys } from "@/api/queryKeys";
import { getSession } from "@/api/routes/auth.api";
import { useQuery } from "@tanstack/react-query";

export function useSessionQuery() {
    return useQuery({
        queryKey: authKeys.session(),
        queryFn: getSession,
        retry: false,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
    });
}
