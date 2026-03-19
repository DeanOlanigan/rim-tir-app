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
                const normalized = normalizeLiveMessage(topic, msg);
                if (!normalized) return;

                buf.set(normalized.id, normalized);

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
        quality: normalizeQuality(msg.quality),
        unit: typeof msg.unit === "string" ? msg.unit : undefined,
        version: Number.isFinite(msg.version) ? msg.version : 1,
    };
}

function inferValueType(value) {
    if (typeof value === "boolean") return "bool";
    if (typeof value === "number") return "float";
    return "unknown";
}

function normalizeQuality(quality) {
    const attributes = Array.isArray(quality?.attributes)
        ? quality.attributes
        : [];

    return {
        good: quality?.good !== false,
        attributes,
    };
}
