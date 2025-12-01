import { apiv2 } from "@/api/baseUrl";
import { useQuery } from "@tanstack/react-query";

export const useLecense = (uuid) => {
    return useQuery({
        queryKey:["lecense", uuid],
        queryFn: async ({queryKey }) => {
            const [,uuid] = queryKey;
            const res = await apiv2.get(`checkLecense?uuid=${uuid}`);
            return res.data;
        },
        retry: false
    });
};