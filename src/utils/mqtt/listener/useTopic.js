import { useEffect, useState } from "react";
import { useMqttCore } from "../mqtt-provider";

export const useTopic = (topic) => {
    const { subscribe, connected } = useMqttCore();
    const [data, setData] = useState(null);

    useEffect(() => {
        const unsub = subscribe(topic, { qos: 0, retain: false }, ({ msg }) => {
            setData(msg);
        });

        return () => unsub();
    }, [topic, subscribe]);

    return { data, connected };
};
