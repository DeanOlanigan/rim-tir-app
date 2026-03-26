import { QK } from "@/api";
import { getUsers } from "@/api/routes/users.api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useUsersHistory = () => {
    const q = useSuspenseQuery({
        queryKey: QK.users,
        queryFn: getUsers,
    });

    return q.data;
};
