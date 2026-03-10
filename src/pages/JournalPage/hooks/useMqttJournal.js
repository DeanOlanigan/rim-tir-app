import { useEffect } from "react";
import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useJournalStream } from "../JournalStores/journal-stream-store";

export function useMqttJournal() {
    const { subscribe } = useMqttCore();
    useEffect(() => {
        const topic = "journal";
        const buf = [];
        let timer = null;

        const flush = () => {
            if (!buf.length) return;
            const batch = buf.splice(0, buf.length);
            useJournalStream.getState().push(batch);
        };

        const unsub = subscribe(topic, { qos: 0, retain: false }, ({ msg }) => {
            buf.push(msg);

            if (timer) return;

            timer = setTimeout(() => {
                timer = null;
                flush();
            }, 100);
        });

        return () => {
            unsub();
            if (timer) clearTimeout(timer);
            flush();
        };
    }, [subscribe]);
}
