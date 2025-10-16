import { CONN_STATUS } from "@/config/constants";
import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useEffect, useRef, useState } from "react";

export function useMqttMetrics(topic, opts) {
    const { staleMs = 2500, timeoutMs = 5000 } = opts;

    const { subscribe, connected } = useMqttCore();

    const [value, setValue] = useState(null);
    const [status, setStatus] = useState(CONN_STATUS.DISCONNECTED);

    const lastClientAtRef = useRef(null);

    const staleTimerRef = useRef(null);
    const timeoutTimerRef = useRef(null);

    const clearTimers = () => {
        if (staleTimerRef.current) {
            clearTimeout(staleTimerRef.current);
            staleTimerRef.current = null;
        }
        if (timeoutTimerRef.current) {
            clearTimeout(timeoutTimerRef.current);
            timeoutTimerRef.current = null;
        }
    };

    const armTimers = () => {
        clearTimers();
        staleTimerRef.current = setTimeout(() => {
            setStatus(CONN_STATUS.STALED);
        }, staleMs);
        timeoutTimerRef.current = setTimeout(() => {
            setStatus(CONN_STATUS.DISCONNECTED);
        }, timeoutMs);
    };

    useEffect(() => {
        lastClientAtRef.current = null;
        setValue(null);

        if (!topic || !connected) {
            setStatus(CONN_STATUS.DISCONNECTED);
            clearTimers();
            return;
        }

        setStatus(CONN_STATUS.STALED);

        const unsub = subscribe(topic, { qos: 0, retain: false }, ({ msg }) => {
            setValue(msg);
            lastClientAtRef.current = Date.now();
            setStatus(CONN_STATUS.LIVE);
            armTimers();
        });

        return () => {
            clearTimers();
            unsub();
        };
        // eslint-disable-next-line
    }, [topic, connected, subscribe, staleMs, timeoutMs]);

    useEffect(() => {
        if (!connected) {
            clearTimers();
            setStatus(CONN_STATUS.DISCONNECTED);
        }
    }, [connected]);

    return {
        value,
        status,
        connected,
    };
}
