import { getSettings } from "@/api/routes/settings.api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSettings = () => {
    const s = useSuspenseQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });
    return s;
};
