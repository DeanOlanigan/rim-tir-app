import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useEffect } from "react";
import { TIME_TYPE } from "../GraphSettings/graphSettingsConstants";

export function useMqttChart(chart, type) {
    const { subscribe, connected } = useMqttCore();
    useEffect(() => {
        if (type !== TIME_TYPE.real || !connected || !chart) return;

        const datasetIndex = new Map();
        chart.current.data.datasets.forEach((dataset, index) => {
            datasetIndex.set(dataset.label, index);
        });

        const topic = "graph/#";
        const buf = [];
        let t = null;

        const flush = () => {
            if (!buf.length) return;
            for (const msg of buf) {
                const name = msg.name;
                const chartData =
                    chart.current.data.datasets[datasetIndex.get(name)];
                if (!chartData) continue;
                chartData?.data?.push({
                    x: msg.ts,
                    y: msg.value,
                });
            }
            chart.current.update("quiet");
            buf.splice(0, buf.length);
        };

        const unsub = subscribe(topic, { qos: 0, retain: false }, ({ msg }) => {
            buf.push(msg);
            if (!t)
                t = setTimeout(() => {
                    t = null;
                    flush();
                }, 100);
        });

        return () => {
            unsub();
            if (t) clearTimeout(t);
            flush();
        };
    }, [chart, type, subscribe, connected]);

    useEffect(() => {
        if (type === TIME_TYPE.archive || !chart) return;
        if (!connected) {
            const now = Date.now();

            for (const dataset of chart.current.data.datasets) {
                dataset.data.push({
                    x: now,
                    y: Number(NaN),
                });
            }
            chart.current.update("quiet");
        }
    }, [chart, type, subscribe, connected]);
}
