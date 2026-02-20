import { apiv2 } from "@/api/baseUrl";
import { useQuery } from "@tanstack/react-query";

export const useUpdatesLogs = (enabled) => {
    return useQuery({
        queryKey: ["update"],
        queryFn: async () => {
            const res = await apiv2.get("/checkUpdate");
            if (res.data?.error)
                throw new Error("Ошибка при получении статуса обновления");
            return res.data;
        },
        refetchInterval: 5000,
        enabled,
    });
};
