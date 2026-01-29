import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useEffect } from "react";
import { useMonitoringLive } from "./store/mqtt-stream-store";

export function useMqttLive(subTopic) {
    const { subscribe, connected } = useMqttCore();

    useEffect(() => {
        if (!subTopic || !connected) return;

        const buf = new Map();
        let t = null;

        const flush = () => {
            if (!buf.size) return;
            const { upsertMany, appendManySpark } =
                useMonitoringLive.getState();
            upsertMany(buf);
            appendManySpark(buf);
            buf.clear();
        };

        const unsub = subscribe(
            subTopic,
            { qos: 0, retain: false },
            ({ topic, msg }) => {
                const id = topic.split("/").pop();
                buf.set(id, msg);

                if (!t) {
                    t = setTimeout(() => {
                        t = null;
                        flush();
                    }, 100);
                }
            },
        );

        return () => {
            unsub();
            if (t) clearTimeout(t);
            flush();
        };
    }, [subTopic, connected, subscribe]);
}
