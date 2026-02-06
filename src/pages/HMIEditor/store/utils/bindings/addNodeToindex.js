export function addNodeToIndex(index, node) {
    const items = node.bindings?.items ?? [];
    const globalVarId = node.bindings?.globalVarId;

    items.forEach((b) => {
        let varId;
        if (b.enabled) varId = b.useGlobal ? globalVarId : b.varId;
        if (varId) {
            if (!index[varId]) index[varId] = [];
            index[varId].push({
                nodeId: node.id,
                prop: b.property,
                bindingId: b.id,
            });
        }
    });
}
