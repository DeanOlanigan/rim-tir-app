import { useSuspenseQuery } from "@tanstack/react-query";

export const useLicense = () => {
    return useSuspenseQuery({
        queryKey: ["get-license"],
        queryFn: async () => {
            const res = "Vryd3q7NQ3BLOOpIuGYsW";
            return res;
        },
    });
};
