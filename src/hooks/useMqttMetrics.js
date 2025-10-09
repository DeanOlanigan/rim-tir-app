import { CONN_STATUS } from "@/config/constants";
import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useEffect, useRef, useState } from "react";

export function useMqttMetrics(topic, opts) {
    const { staleMs = 2500, timeoutMs = 5000, parse } = opts;

    const { subscribe, connected } = useMqttCore();

    const [value, setValue] = useState(null);
    const [status, setStatus] = useState(CONN_STATUS.DISCONNECTED);

    const lastClientAtRef = useRef(null);

    useEffect(() => {
        const unsub = subscribe(topic, { qos: 0, retain: false }, ({ msg }) => {
            const v = parse ? parse(msg) : msg;
            setValue(v);
            lastClientAtRef.current = Date.now();
            setStatus(CONN_STATUS.LIVE);
        });

        return () => unsub();
    }, [topic, parse, subscribe]);

    useEffect(() => {
        const id = setInterval(() => {
            const now = Date.now();
            const lastAt = lastClientAtRef.current;

            if (!connected) {
                setStatus(CONN_STATUS.DISCONNECTED);
                return;
            }

            if (!lastAt) {
                setStatus(CONN_STATUS.STALED);
                return;
            }
            const age = now - lastAt;
            if (age > timeoutMs) setStatus(CONN_STATUS.STALED);
            else if (age > staleMs && status === CONN_STATUS.LIVE)
                setStatus(CONN_STATUS.STALED);
            else if (age <= staleMs) setStatus(CONN_STATUS.LIVE);
        }, 500);
        return () => clearInterval(id);
    }, [connected, status, timeoutMs, staleMs]);

    return {
        value,
        status,
        connected,
    };
}
