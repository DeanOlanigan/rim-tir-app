import { apiv2 } from "@/api/baseUrl";
import { useSuspenseQuery } from "@tanstack/react-query";

async function getSettings() {
    const res = await apiv2.get("/settings");
    await new Promise((res) => setTimeout(res, 1000));
    return res.data;
} 

export const useSettings = () => {
    const s = useSuspenseQuery({
        queryKey: ["settings"],
        queryFn: async () => getSettings(),
    });
    return s;
};