import mqtt from "mqtt";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { matchTopic } from "./matchTopic";

const MqttCtx = createContext();

function safeDecode(payload) {
    try {
        return new TextDecoder("utf-8").decode(payload);
    } catch {
        return undefined;
    }
}

function safeJSON(text) {
    if (!text) return undefined;
    const s = text.trim();
    try {
        return JSON.parse(s);
    } catch {
        return undefined;
    }
}

export function MqttProvider({ url, opt, children }) {
    const clientRef = useRef(null);
    const registryRef = useRef(new Map());

    useEffect(() => {
        const mqttClient = mqtt.connect(url, opt);
        clientRef.current = mqttClient;

        mqttClient.on("connect", () => {
            console.log("[MQTT] connected");
        });
        mqttClient.on("close", () => {
            console.log("[MQTT] closed");
        });
        mqttClient.on("reconnect", () => {
            console.log("[MQTT] reconnect");
        });
        mqttClient.on("error", (error) => console.log("[MQTT] error", error));

        mqttClient.on("message", (topic, payload) => {
            const txt = safeDecode(payload);
            const msg = safeJSON(txt);
            const u8 =
                payload instanceof Uint8Array
                    ? payload
                    : new Uint8Array(payload);

            for (const [t, subs] of registryRef.current) {
                if (matchTopic(t, topic)) {
                    for (const fn of subs) {
                        fn({ topic, msg, txt, u8 });
                    }
                }
            }
        });

        return () => {
            mqttClient.end(true);
            clientRef.current = null;
            registryRef.current.clear();
        };
    }, [url, opt]);

    const api = useMemo(
        () => ({
            publish: (topic, message, opts, cb) => {
                clientRef.current?.publish(topic, message, opts, cb);
            },
            subscribe: (topic, opts, fn) => {
                let set = registryRef.current.get(topic);
                if (!set) {
                    set = new Set();
                    registryRef.current.set(topic, set);
                    clientRef.current?.subscribe(topic, opts);
                }
                set.add(fn);
                return () => {
                    const set = registryRef.current.get(topic);
                    if (!set) return;
                    set.delete(fn);
                    if (!set.size) {
                        registryRef.current.delete(topic);
                        clientRef.current?.unsubscribe(topic);
                    }
                };
            },
        }),
        []
    );

    return <MqttCtx.Provider value={api}>{children}</MqttCtx.Provider>;
}

export const useMqttCore = () => {
    const ctx = useContext(MqttCtx);
    if (!ctx) throw new Error("useMqttCore must be used within a MqttProvider");
    return ctx;
};
