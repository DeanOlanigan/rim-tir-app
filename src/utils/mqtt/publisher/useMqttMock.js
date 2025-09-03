import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { startMockPublisher, stopMockPublisher } from "./mqttPublisher";

export function useMqttMock({ enabled, periodMs, topicBase }) {
    const { data } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => {
            const settings = state.settings;
            return Object.values(settings)
                .map((node) => {
                    if (
                        node.type === "variable" ||
                        node.type === "dataObject"
                    ) {
                        return node.id;
                    }
                })
                .filter(Boolean);
        },
    });

    const uuids = useMemo(() => (Array.isArray(data) ? data : []), [data]);
    const startRef = useRef(false);

    useEffect(() => {
        if (enabled && uuids.length) {
            startMockPublisher(uuids, {
                periodMs,
                topicBase,
                retain: true,
                source: "mixed",
            });
            startRef.current = true;
            return () => {
                stopMockPublisher();
                startRef.current = false;
            };
        } else {
            if (startRef.current) {
                stopMockPublisher();
                startRef.current = false;
            }
        }
    }, [enabled, uuids, periodMs, topicBase]);
}
