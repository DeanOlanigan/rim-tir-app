import { QK } from "@/api";
import { getRoles } from "@/api/roles";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useRoles = () => {
    const q = useSuspenseQuery({
        queryKey: QK.roles,
        queryFn: getRoles,
    });
    return q.data;
};
