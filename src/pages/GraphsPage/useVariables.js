import { getConfiguration, QK } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useVariables = () => {
    const q = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: (state) => {
            const variables = Object.values(state.settings).filter(
                (node) => node.type === "variable" && node.setting.graph,
            );
            const items = variables.map((v) => ({
                label: v.name,
                value: v.name,
                id: v.id,
            }));
            return items;
        },
    });

    return q;
};
