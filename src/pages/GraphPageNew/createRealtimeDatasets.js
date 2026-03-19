export function createRealtimeDatasets(appliedConfig) {
    return (appliedConfig?.datasets ?? [])
        .filter((item) => item.variableId)
        .map((item) => ({
            label: item.alias?.trim() || item.variable || item.variableId,
            datasetId: String(item.variableId),
            data: [],
            borderColor: item.color,
            backgroundColor: item.color ? `${item.color}55` : undefined,
            borderWidth: 2,
            tension: 0.3,
            stepped: true,
            pointStyle: "circle",
            pointRadius: 2,
            pointHoverRadius: 5,
            spanGaps: false,
        }));
}
