import { NODE_TYPES } from "@/config/constants";
import { useSelectionSync } from "@/store/selection-sync-store";
import { useTreeRegistry } from "@/store/tree-registry-store";

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

export async function crossSelect(settings, id, scope, roots) {
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
