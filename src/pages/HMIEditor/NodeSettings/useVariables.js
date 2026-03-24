import { getVariables } from "@/api/configuration";
import { useQuery } from "@tanstack/react-query";

export const useVariables = () => {
    const q = useQuery({
        queryKey: ["configuration", "variables"],
        queryFn: getVariables,
        staleTime: 60_000,
        retry: 1,
    });
    return q;
};
