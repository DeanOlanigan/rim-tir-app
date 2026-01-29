import { apiv2 } from "@/api/baseUrl"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useLicense = () => {
    return useSuspenseQuery({
        queryKey: ["get-license"],
        queryFn: async () => {
            //const res = await apiv2.get("getLicense");
            //return res.data;
            const res = "Vryd3q7NQ3BLOOpIuGYsW";
            return res;
        }
    })
}