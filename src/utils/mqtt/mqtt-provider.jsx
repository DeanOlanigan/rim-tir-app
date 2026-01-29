import mqtt from "mqtt";
import {
    createContext,
    useCallback,
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
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const mqttClient = mqtt.connect(url, opt);
        clientRef.current = mqttClient;

        mqttClient.on("close", () => {
            console.log("[MQTT] closed");
            setConnected(false);
        });
        mqttClient.on("connect", () => {
            console.log("[MQTT] connected");
            setConnected(true);
        });
        mqttClient.on("disconnect", () => {
            console.log("[MQTT] disconnect");
            setConnected(false);
        });
        mqttClient.on("end", () => {
            console.log("[MQTT] end");
            setConnected(false);
        });
        mqttClient.on("error", (error) => {
            console.log("[MQTT] error", error);
            setConnected(false);
        });
        mqttClient.on("offline", () => {
            console.log("[MQTT] offline");
            setConnected(false);
        });
        mqttClient.on("reconnect", () => {
            console.log("[MQTT] reconnect");
            setConnected(false);
        });

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
            try {
                mqttClient.end(true);
            } finally {
                clientRef.current = null;
                registryRef.current.clear();
                setConnected(false);
            }
        };
    }, [url, opt]);

    const publish = useCallback((topic, message, opts, cb) => {
        clientRef.current?.publish(topic, message, opts, cb);
    }, []);

    const subscribe = useCallback((topic, opts, fn) => {
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
    }, []);

    const api = useMemo(
        () => ({
            publish,
            subscribe,
            connected,
        }),
        [publish, subscribe, connected],
    );

    return <MqttCtx.Provider value={api}>{children}</MqttCtx.Provider>;
}

export const useMqttCore = () => {
    const ctx = useContext(MqttCtx);
    if (!ctx) throw new Error("useMqttCore must be used within a MqttProvider");
    return ctx;
};
