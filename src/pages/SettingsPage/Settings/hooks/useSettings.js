import { apiv2 } from "@/api/baseUrl";
import { useQuery } from "@tanstack/react-query";


export const useSettings = () => {
    const s = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const res = await apiv2.get("/settings");
            await new Promise((res) => setTimeout(res, 1000));
            return res.data;
        },
    });
    return s;
};