import { getConfiguration, QK } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useVariables = () => {
    const q = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: (state) => {
            const variables = Object.values(state.settings).filter(
                (node) => node.type === "variable",
            );
            const items = variables.map((v) => ({
                label: v.name,
                value: v.id,
                id: v.id,
                type: v.setting.type,
                path: v.path,
            }));
            return items;
        },
    });

    return q;
};
