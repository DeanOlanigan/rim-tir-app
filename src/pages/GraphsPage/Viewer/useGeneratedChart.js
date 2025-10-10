export function generateChartData(state) {
    const { startDate, endDate, points, variables } = state;
    const datasets = [];
    const timeStep = (endDate - startDate) / points;

    for (const v of Object.values(variables)) {
        const data = Array.from({ length: points }, (_, i) => {
            const t = startDate + i * timeStep;
            // eslint-disable-next-line
            const value = Math.sin(i / 5) * 20 + 50 + Math.random() * 5; // синусоида + шум
            return { x: new Date(t), y: value };
        });

        datasets.push({
            label: v.name,
            data,
            borderColor: v.color,
            backgroundColor: v.color + "55",
            borderWidth: 2,
            tension: 0.3,
            stepped: true,
            pointStyle: "circle",
            pointRadius: 5,
            pointHoverRadius: 10,
            spanGaps: false,
        });
    }

    return {
        labels: datasets[0].data.map((p) => p.x),
        datasets,
    };
}
