import { QK } from "@/api";
import { getRoles } from "@/api/getRoles";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useRoles = () => {
    const q = useSuspenseQuery({
        queryKey: QK.roles,
        queryFn: async () => getRoles(),
    });
    return q.data;
};
