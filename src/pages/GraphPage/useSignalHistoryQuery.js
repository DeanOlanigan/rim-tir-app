import { getSignalHistory } from "@/api/graph";
import { useQuery } from "@tanstack/react-query";
import { toChartJsData } from "./toChartJsData";

// TODO В будущем нужно будет убрать из массива переменных имена - вместо них id
function normalizeGraphFormToApiPayload(appliedConfig) {
    const datasets = appliedConfig?.datasets ?? [];
    return {
        from: appliedConfig?.range?.utcFrom,
        to: appliedConfig?.range?.utcTo,
        pointLimit: appliedConfig?.pointLimit ?? 150,
        variables: datasets
            .filter((ds) => ds.variableId)
            .map((item) => ({
                id: item.variableId,
                name: item.variable,
            })),
    };
}

export function useSignalHistoryQuery(appliedConfig) {
    const payload = normalizeGraphFormToApiPayload(appliedConfig);
    const hasVariables = payload.variables.length > 0;

    return useQuery({
        queryKey: ["signal-history", payload],
        queryFn: () => getSignalHistory(payload),
        enabled:
            !!payload?.from &&
            !!payload?.to &&
            hasVariables &&
            appliedConfig?.mode === "period",
        select: (response) => ({
            raw: response,
            chartData: toChartJsData(response, appliedConfig),
        }),
        staleTime: 10_000,
        refetchOnWindowFocus: false,
    });
}
