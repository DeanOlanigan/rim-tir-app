import { NodeBase } from "@/components/TreeView/NodeBase";
import clsx from "clsx";
import styles from "@/components/TreeView/TreeView.module.css";
import { NodeContent } from "./NodeContent";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "@/api/queryKeys";
import { NODE_TYPES, TREE_TYPES } from "@/config/constants";
import { memo } from "react";
import { useSelectionSync } from "@/store/selection-sync-store";
import { useTreeRegistry } from "@/store/tree-registry-store";

export const Node = memo(function Node({ node, style }) {
    const qc = useQueryClient();
    const conf = qc.getQueryData(QK.configuration);
    const settings = conf?.state?.settings ?? {};

    const onClick = async (e) => {
        node.handleClick(e);
        if (e.altKey)
            await crossSelect(
                settings,
                node.id,
                "monitoring",
                Object.values(TREE_TYPES)
            );
    };

    return (
        <div
            style={style}
            className={clsx(styles.node, node.state)}
            onClick={onClick}
        >
            <NodeBase
                node={node}
                settings={settings[node.id]?.setting}
                paddingLeft={style.paddingLeft}
                visual={
                    <NodeContent
                        id={node.id}
                        type={node.data.type}
                        name={node.data.name}
                    />
                }
            />
        </div>
    );
});

function getCrossLinks(settings, id) {
    const node = settings[id];
    if (!node) return {};

    if (node.type === NODE_TYPES.variable) {
        const usedIn = node?.setting?.usedIn ?? {};
        const out = { variables: id };
        if (typeof usedIn.receive === "string") out.receive = usedIn.receive;
        if (typeof usedIn.send === "string") out.send = usedIn.send;
        return out;
    }

    if (node.type === NODE_TYPES.dataObject) {
        const variableId = node?.setting?.variableId;
        const out = { [node.rootId]: node.id };
        if (typeof variableId === "string") {
            out.variables = variableId;
            const v = settings[variableId];
            const usedIn = v?.setting?.usedIn ?? {};
            if (typeof usedIn.receive === "string")
                out.receive = usedIn.receive;
            if (typeof usedIn.send === "string") out.send = usedIn.send;
        }
        return out;
    }

    return {};
}

async function pickInTree(api, id) {
    api.scrollTo(id);
    api.focus(id);
    api.select(id);
}

async function crossSelect(settings, id, scope, roots) {
    const links = getCrossLinks(settings, id);

    const { runSilent } = useSelectionSync.getState();
    const { getApi } = useTreeRegistry.getState();

    await runSilent(scope, async () => {
        for (const root of roots) {
            const targetId = links[root];
            if (!targetId) continue;
            const api = getApi(scope, root);
            if (api) await pickInTree(api, targetId);
        }
    });
}
