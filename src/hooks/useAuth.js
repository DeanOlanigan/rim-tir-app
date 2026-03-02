import { useMemo } from "react";
import { useSessionQuery } from "@/hooks/useSessionQuery";

export function useAuth() {
    const sessionQuery = useSessionQuery();

    return useMemo(() => {
        const isAuthenticated = sessionQuery.data?.authenticated === true;
        const user = sessionQuery.data?.user ?? null;
        const rights = user?.rights ?? [];

        return {
            ...sessionQuery,
            isAuthenticated,
            user,
            rights,
        };
    }, [sessionQuery]);
}
