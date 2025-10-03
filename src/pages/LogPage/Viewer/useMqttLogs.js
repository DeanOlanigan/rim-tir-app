import { useEffect } from "react";
import { useLogStream } from "../Store/stream-store";
import { useMqttCore } from "@/utils/mqtt/mqtt-provider";

export function useMqttLogs(type, name) {
    const { subscribe } = useMqttCore();
    const { push } = useLogStream.getState();

    useEffect(() => {
        if (!type || !name) return;
        const topic = `log/${type}/${name}`;
        const buf = [];
        let t = null;

        const flush = () => {
            if (!buf.length) return;
            push(buf.splice(0, buf.length));
        };

        const unsub = subscribe(topic, { qos: 0, retain: false }, ({ msg }) => {
            buf.push(msg);
            if (!t)
                t = setTimeout(() => {
                    t = null;
                    flush();
                }, 100);
        });

        return () => {
            unsub();
            if (t) clearTimeout(t);
            flush();
        };
    }, [type, name, subscribe, push]);
}
