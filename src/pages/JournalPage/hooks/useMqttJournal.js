import { useEffect } from "react";
import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useJournalStream } from "../JournalStores/journal-stream-store";

export function useMqttJournal() {
    const { subscribe } = useMqttCore();
    const push = useJournalStream((state) => state.push);
    useEffect(() => {
        const topic = "journal";
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
    }, [subscribe, push]);
}
