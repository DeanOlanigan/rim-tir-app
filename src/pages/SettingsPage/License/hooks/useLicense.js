import { getLicense } from "@/api/routes/license.api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useLicense = () => {
    return useSuspenseQuery({
        queryKey: ["license"],
        queryFn: getLicense,
    });
};
