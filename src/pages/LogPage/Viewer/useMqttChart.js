import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useEffect, useRef } from "react";

export function useMqttChart() {
    const { subscribe } = useMqttCore();

    const bufferRef = useRef({});

    const bufPush = (data, point, target) => {
        if (!target[data.name]) target[data.name] = [];
        target[data.name].push(point);
    };

    useEffect(() => {
        const topic = "graph/#";

        const unsub = subscribe(topic, { qos: 0, retain: false }, ({ msg }) => {
            const point = { x: msg.ts, y: msg.value };
            bufPush(msg, point, bufferRef.current);
        });

        return () => unsub();
    }, [subscribe]);

    return bufferRef;
}
