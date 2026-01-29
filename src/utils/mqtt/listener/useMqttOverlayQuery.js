import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { mqttClient } from "../mqttClient";
import { matchTopic } from "../matchTopic";

const mqttListenerStyle =
    "color: #ffffffff; background: #0d8832ff; padding: 2px 4px;";

export function useMqttOverlayQuery(params) {
    const { queryKey, queryFn, topic, parseMessage, projectToCache, enabled } =
        params;
    const qc = useQueryClient();

    const q = useQuery({
        queryKey,
        queryFn,
        staleTime: Infinity,
    });

    const handler = useMemo(() => {
        const onMessage = (t, payload) => {
            if (!enabled) return;
            if (!matchTopic(topic, t)) return;
            const msg = parseMessage(t, payload);
            if (!msg) return;
            //console.log("%c[MQTT LISTENER] message", mqttListenerStyle, msg);
            qc.setQueryData(queryKey, (prev) => projectToCache(prev, msg));
        };
        return onMessage;
    }, [enabled, parseMessage, projectToCache, qc, queryKey, topic]);

    useEffect(() => {
        if (!enabled || q.isLoading || q.isFetching || q.isError) return;

        mqttClient.subscribe(topic, { qos: 0 }, (err) => {
            if (err)
                console.log("%c[MQTT] subscribe error", mqttListenerStyle, err);
        });

        mqttClient.on("message", handler);

        return () => {
            mqttClient.unsubscribe(topic, (err) => {
                if (err)
                    console.log(
                        "%c[MQTT] unsubscribe error",
                        mqttListenerStyle,
                        err,
                    );
            });
            mqttClient.off("message", handler);
        };
    }, [enabled, handler, topic, q.isLoading, q.isFetching, q.isError]);

    return q;
}
