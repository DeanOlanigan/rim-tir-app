import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useEffect } from "react";

export function useMqttChart(chartRef, appliedConfig) {
    const { subscribe, connected } = useMqttCore();

    useEffect(() => {
        const isRealTime = appliedConfig?.mode === "realTime";
        const chart = chartRef?.current;

        if (!isRealTime || !connected || !chart) return;

        const signalIds = (appliedConfig?.datasets ?? [])
            .map((item) => String(item.variableId ?? ""))
            .filter(Boolean);

        if (!signalIds.length) return;

        const datasetIndexBySignalId = new Map();
        chart.data.datasets.forEach((dataset, index) => {
            if (dataset?.datasetId) {
                datasetIndexBySignalId.set(String(dataset.datasetId), index);
            }
        });

        const buf = [];
        let t = null;

        const flush = () => {
            const chart = chartRef.current;
            if (!chart || !buf.length) return;
            let changed = false;
            const pointLimit = appliedConfig?.pointLimit ?? 150;

            for (const msg of buf) {
                if (!msg || msg.valueType === "bool") continue;

                const signalId = String(msg.id ?? "");
                const datasetIndex = datasetIndexBySignalId.get(signalId);
                if (datasetIndex == null) continue;

                const dataset = chart.data.datasets[datasetIndex];
                if (!dataset) continue;

                const x = Number(msg.ts);
                const y = Number(msg.value);
                if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

                dataset.data.push({ x, y });

                if (dataset.data.length > pointLimit) {
                    dataset.data.splice(0, dataset.data.length - pointLimit);
                }

                changed = true;
            }

            buf.length = 0;

            if (changed) {
                chart.update("none");
            }
        };

        const handleMessage = ({ topic, msg }) => {
            const normalized = normalizeLiveMessage(topic, msg);
            if (!normalized) return;

            buf.push(normalized);

            if (!t) {
                t = setTimeout(() => {
                    t = null;
                    flush();
                }, 100);
            }
        };

        const unsubs = signalIds.map((signalId) =>
            subscribe(
                `signals/live/by-id/${signalId}`,
                { qos: 0, retain: false },
                handleMessage,
            ),
        );

        return () => {
            for (const unsub of unsubs) unsub();
            if (t) clearTimeout(t);
            buf.length = 0;
        };
    }, [chartRef, appliedConfig, connected, subscribe]);
}

function normalizeLiveMessage(topic, msg) {
    if (!msg || typeof msg !== "object") return null;

    const fallbackId = topic.split("/").pop();
    const id = msg.id ?? fallbackId;
    if (!id) return null;

    return {
        id,
        ts: Number.isFinite(msg.ts) ? msg.ts : Date.now(),
        value: msg.value,
        valueType: msg.valueType ?? inferValueType(msg.value),
    };
}

function inferValueType(value) {
    if (typeof value === "boolean") return "bool";
    if (typeof value === "number") return "float";
    return "unknown";
}
