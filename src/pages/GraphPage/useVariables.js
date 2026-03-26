import { getGraphVariables } from "@/api/routes/configuration.api";
import { useQuery } from "@tanstack/react-query";

export const useVariables = () => {
    const q = useQuery({
        queryKey: ["configuration", "variables", "graph"],
        queryFn: getGraphVariables,
        staleTime: 60_000,
        retry: 1,
    });
    return q;
};
