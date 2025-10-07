import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useEffect } from "react";
import { TIME_TYPE } from "../GraphSettings/graphSettingsConstants";

export function useMqttChart(chart, type) {
    const { subscribe } = useMqttCore();
    useEffect(() => {
        if (type === TIME_TYPE.archive) return;
        const topic = "graph/#";

        const unsub = subscribe(topic, { qos: 0, retain: false }, ({ msg }) => {
            const name = msg.name;
            const chartData = chart.current.data.datasets.find(
                (d) => d.label === name
            );
            chartData.data.push({
                x: msg.ts,
                y: msg.value,
            });
            chart.current.update("quiet");
        });

        return () => {
            unsub();
            console.log("[MQTT CHART] unsubscribed");
        };
    }, [chart, type, subscribe]);
}
