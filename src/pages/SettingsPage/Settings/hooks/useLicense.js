import { apiv2 } from "@/api/baseUrl";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useLicense = (uuid) => {
    return useSuspenseQuery({
        queryKey:["license", uuid],
        queryFn: async ({queryKey }) => {
            const [,uuid] = queryKey;
            const res = await apiv2.get(`checkLecense?uuid=${uuid}`);
            return res.data;
        },
    });
};