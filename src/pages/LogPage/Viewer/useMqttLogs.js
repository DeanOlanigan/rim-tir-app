import { useEffect } from "react";
import { useLogStream } from "../Store/stream-store";
import { useMqttCore } from "@/utils/mqtt/mqtt-provider";

export function useMqttLogs(topic) {
    const { subscribe } = useMqttCore();
    const { push } = useLogStream.getState();

    useEffect(() => {
        if (!topic) return;

        const unsub = subscribe(topic, { qos: 0, retain: false }, ({ msg }) => {
            push([msg]);
        });

        return () => unsub();
    }, [topic, subscribe, push]);
}
