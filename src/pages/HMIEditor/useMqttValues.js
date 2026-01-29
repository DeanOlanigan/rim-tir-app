import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useEffect } from "react";
import { useNodeStore } from "./store/node-store";
import { resolveBinding } from "./store/bindings-resolver";
import { useActionsStore } from "./store/actions-store";

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

    const editorState = useActionsStore.getState();
    const { isLiveUpdate, viewOnlyMode } = editorState;

    const shouldUpdate = isLiveUpdate || viewOnlyMode;
    if (!shouldUpdate) {
        buf.clear();
        return;
    }

    const state = useNodeStore.getState();
    const { varIndex, nodes } = state;

    const nodesMap = api.nodesRef.current;
    let layerNeedDraf = false;

    buf.forEach((mqttValue, varId) => {
        const targets = varIndex[varId];
        if (!targets || targets.length === 0) return;

        targets.forEach(({ nodeId, prop, bindingId }) => {
            const konvaNode = nodesMap.get(nodeId);
            if (!konvaNode) return;

            const nodeConfig = nodes[nodeId];
            if (!nodeConfig) return;

            const binding = nodeConfig.bindings?.items?.find(
                (b) => b.id === bindingId,
            );

            const staticFallback = nodeConfig[prop];
            const computedValue = resolveBinding(
                binding,
                mqttValue.v,
                staticFallback,
            );

            if (konvaNode.getAttr(prop) !== computedValue) {
                konvaNode.setAttr(prop, computedValue);
                layerNeedDraf = true;
            }
        });
    });

    if (layerNeedDraf) {
        api.nodesLayerRef.current?.batchDraw();
    }

    buf.clear();
}
