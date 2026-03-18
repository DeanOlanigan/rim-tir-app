// src/pages/GraphPageNew/generateChartData.js

function calendarDateToJsDate(date, endOfDay = false) {
    if (!date) return null;

    const year = date.year;
    const month = date.month;
    const day = date.day;

    if (endOfDay) {
        return new Date(year, month - 1, day, 23, 59, 59, 999);
    }

    return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function buildTimeRange(appliedConfig) {
    if (appliedConfig.mode === "period" && appliedConfig.range) {
        const startDate = calendarDateToJsDate(appliedConfig.range.from, false);
        const endDate = calendarDateToJsDate(appliedConfig.range.to, true);

        return { startDate, endDate };
    }

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 15 * 60 * 1000);

    return { startDate, endDate };
}

function createSeriesValue(datasetIndex, pointIndex) {
    const base = 50 + datasetIndex * 12;
    const amplitude = 18 + datasetIndex * 3;
    // eslint-disable-next-line
    const noise = Math.random() * 4;

    return Math.sin(pointIndex / 5 + datasetIndex) * amplitude + base + noise;
}

export function generateChartData(appliedConfig) {
    const datasetsConfig = appliedConfig?.datasets ?? [];
    if (!datasetsConfig.length) return { datasets: [] };

    const { startDate, endDate } = buildTimeRange(appliedConfig);
    const points = appliedConfig?.pointLimit ?? 150;

    const startTs = startDate.getTime();
    const endTs = endDate.getTime();
    const timeStep = (endTs - startTs) / points;

    const datasets = datasetsConfig.map((ds, datasetIndex) => {
        const data = Array.from({ length: points }, (_, i) => {
            const ts = startTs + i * timeStep;
            return {
                x: ts,
                y: createSeriesValue(datasetIndex, i),
            };
        });

        return {
            label: ds.alias || ds.variable,
            data,
            borderColor: ds.color,
            backgroundColor: `${ds.color}55`,
            borderWidth: 2,
            tension: 0.3,
            stepped: false,
            pointStyle: "circle",
            pointRadius: 2,
            pointHoverRadius: 5,
            spanGaps: false,
        };
    });

    return { datasets };
}
