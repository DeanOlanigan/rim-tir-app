import { apiv2 } from "@/api/baseUrl";
import { useQuery } from "@tanstack/react-query";

export const useLecense = (uuid) => {
    return useQuery({
        queryKey:["lecense", uuid],
        queryFn: async ({queryKey }) => {
            const [,uuid] = queryKey;
            console.log(uuid, 40);
            const res = await apiv2.get(`checkLecense?uuid=${uuid}`);
            return res.data;
        },
        retry: false
    });
};