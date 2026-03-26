import { getLicense } from "@/api/routes/license.api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useLicenseCheck = (uuid) => {
    return useSuspenseQuery({
        queryKey: ["license", uuid],
        queryFn: getLicense,
    });
};
