import { useChart } from "@chakra-ui/charts";
import { useMemo } from "react";

function generateMockData(config) {
    const { points, start, end, variables } = config;

    const duration = end - start;
    const step = points > 1 ? duration / (points - 1) : 0;

    const result = {};

    variables.forEach((v) => {
        const data = [];

        for (let i = 0; i < points; i++) {
            const timestamp = Math.round(start + i * step);

            const value = Math.round(
                // eslint-disable-next-line
                50 + 50 * Math.sin(i / 5) + Math.random() * 10 - 5
            );

            data.push({ t: timestamp, v: value });
        }

        result[v.id] = data;
    });

    return result;
}

function toUseChart(cfg, gen) {
    const varList = cfg.variables;
    const seriesKeys = Object.fromEntries(varList.map((v) => [v.id, v.name]));

    const points = cfg.points;
    const rows = [];

    for (let i = 0; i < points; i++) {
        const sampleSeries = gen[varList[0].id];
        const t = sampleSeries?.[i]?.t ?? cfg.start;
        const row = { date: new Date(t).toISOString() };

        for (const v of varList) {
            const key = seriesKeys[v.id];
            row[key] = gen[v.id]?.[i]?.v ?? 0;
        }
        rows.push(row);
    }

    const series = varList.map((v) => ({
        name: seriesKeys[v.id],
        color: v.color ?? "blue.500",
    }));

    return { data: rows, series };
}

export function useGeneratedChart(config) {
    const generated = useMemo(() => generateMockData(config), [config]);

    const { data, series } = useMemo(
        () => toUseChart(config, generated),
        [config, generated]
    );

    const chart = useChart({
        data,
        series,
        sort: { by: "date", direction: "asc" },
    });

    return chart;
}
