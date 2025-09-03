import { useEffect, useMemo, useState } from "react";
import { mqttClient } from "../mqttClient";
import { matchTopic } from "../matchTopic";

export const useTopic = (topic) => {
    const [data, setData] = useState(null);

    const handler = useMemo(() => {
        const onMessage = (t, payload) => {
            if (!matchTopic(topic, t)) return;
            try {
                const txt = new TextDecoder("utf-8").decode(payload);
                const msg = JSON.parse(txt);
                setData(msg);
            } catch {
                return;
            }
        };
        return onMessage;
    }, []);

    useEffect(() => {
        mqttClient.subscribe(topic, { qos: 0 }, (err) => {
            if (err) console.log("[MQTT] subscribe error", err);
        });

        mqttClient.on("message", handler);

        return () => {
            mqttClient.unsubscribe(topic, (err) => {
                if (err) console.log("[MQTT] unsubscribe error", err);
            });
            mqttClient.off("message", handler);
        };
    }, [topic, handler]);

    return data;
};
