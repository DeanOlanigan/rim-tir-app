import { QK } from "@/api";
import { getUsers } from "@/api/getUsers";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useUsersHistory = () => {
    const q = useSuspenseQuery({
        queryKey: [QK.users],
        queryFn: async () => getUsers(),
    });
    console.log(q.data);
    return q.data;
};
