import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useEffect } from "react";
import { useNodeStore } from "../store/node-store";
import { useActionsStore } from "../store/actions-store";
import { resolveBinding } from "../utils/bindings-resolver";

export function useMqttValues(subTopic, api) {
    const { subscribe, connected } = useMqttCore();

    useEffect(() => {
        if (!subTopic || !connected || !api) return;

        const buf = new Map();
        let t = null;

        const unsub = subscribe(
            subTopic,
            { qos: 0, retain: false },
            ({ topic, msg }) => {
                const id = topic.split("/").pop();
                buf.set(id, msg);

                if (!t) {
                    t = setTimeout(() => {
                        t = null;
                        flush(buf, api);
                    }, 100);
                }
            },
        );

        return () => {
            unsub();
            if (t) clearTimeout(t);
            flush(buf, api);
        };
    }, [subTopic, connected, subscribe, api]);
}

function flush(buf, api) {
    if (!buf.size) return;
    const { varIndex, nodes } = useNodeStore.getState();
    const { isLiveUpdate, viewOnlyMode } = useActionsStore.getState();
    const shouldUpdate = isLiveUpdate || viewOnlyMode;
    const nodesMap = api.nodesRef.current;

    if (!shouldUpdate) {
        buf.clear();
        return;
    }

    let layerNeedDraw = false;

    for (const [varId, mqttValue] of buf) {
        const bucket = varIndex[varId];
        if (!bucket) continue;

        for (const depKey in bucket) {
            const { nodeId, prop } = bucket[depKey];

            const konvaNode = nodesMap.get(nodeId);
            const nodeConfig = nodes[nodeId];

            if (!nodeConfig || !konvaNode) continue;

            const binding = nodeConfig.bindings?.byProp?.[prop];
            const staticFallback = nodeConfig[prop];

            const computedValue = resolveBinding(
                binding,
                mqttValue.v,
                staticFallback,
            );

            if (konvaNode.getAttr(prop) !== computedValue) {
                konvaNode.setAttr(prop, computedValue);
                layerNeedDraw = true;
            }
        }
    }

    if (layerNeedDraw) {
        api.nodesLayerRef.current?.batchDraw();
    }

    buf.clear();
}
