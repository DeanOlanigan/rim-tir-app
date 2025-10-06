import { useChart } from "@chakra-ui/charts";
import { useEffect, useMemo, useRef, useState } from "react";

export const useLiveChart = (config) => {
    const {
        variables,
        intervalMs = 500,
        windowMs = 60_000,
        maxPoints = 50000,
    } = config;

    const series = useMemo(
        () =>
            variables.map((v) => ({
                name: v.name,
                color: v.color ?? "blue.500",
            })),
        [variables]
    );

    const [rows, setRows] = useState([]);

    const pushRow = (t, values) => {
        const date = new Date(t).toISOString();
        setRows((prev) => {
            const next = [...prev, { date, ...values }];
            const cutoff = t - windowMs;
            let sliced = next.filter(
                (r) => new Date(r.date).getTime() >= cutoff
            );

            if (sliced.length > maxPoints) {
                sliced = sliced.slice(-maxPoints);
            }
            return sliced;
        });
    };

    const tickRef = useRef(0);

    useEffect(() => {
        const id = setInterval(() => {
            const i = tickRef.current++;
            const t = Date.now();

            const values = {};

            for (const v of variables) {
                const phase = (i + (Number(v.id) % 10)) / 6;
                values[v.name] = Math.round(
                    // eslint-disable-next-line
                    50 + 25 * Math.sin(phase) + Math.random() * 8 - 4
                );
            }
            pushRow(t, values);
        }, intervalMs);

        return () => clearInterval(id);
    }, [intervalMs, variables]);

    const chart = useChart({
        data: rows,
        series,
        sort: { by: "date", direction: "asc" },
    });

    return {
        chart,
        pushRow,
        rows,
        reset: () => setRows([]),
    };
};
