export function toChartJsData(response, appliedConfig) {
    const configById = new Map(
        (appliedConfig?.datasets ?? []).map((item) => [
            String(item.variableId),
            item,
        ]),
    );

    return {
        datasets: (response?.series ?? []).map((series) => {
            const sourceConfig = configById.get(String(series.id));

            const color = sourceConfig?.color;
            const label =
                sourceConfig?.alias?.trim() ||
                sourceConfig?.variable ||
                series.name ||
                series.id;

            return {
                label,
                data: (series.points ?? []).map((point) => ({
                    x: point.ts,
                    y: point.value,
                })),
                borderColor: color,
                backgroundColor: color ? `${color}55` : undefined,
                borderWidth: 2,
                tension: 0.3,
                stepped: true,
                pointStyle: "circle",
                pointRadius: 2,
                pointHoverRadius: 5,
                spanGaps: false,
            };
        }),
    };
}
