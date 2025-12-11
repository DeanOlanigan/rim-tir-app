import { getSettings } from "@/api/getSettings";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSettings = () => {
    const s = useSuspenseQuery({
        queryKey: ["settings"],
        queryFn: async () => getSettings(),
    });
    return s;
};
