export function collectDepsForNode(node) {
    const bindings = node.bindings;
    if (!bindings?.byProp) return [];

    const globalVarId = bindings.globalVarId ?? null;
    const byProp = bindings.byProp;

    const out = [];
    for (const prop in byProp) {
        const b = byProp[prop];
        if (!b?.enabled) continue;

        const varId = b.useGlobal ? globalVarId : b.varId;
        if (!varId) continue;

        out.push({ varId, prop });
    }
    return out;
}

export const depKeyOf = (nodeId, prop) => `${nodeId}:${prop}`;

export function removeNodeDeps(
    nodeId,
    nextNodeIndex,
    nextVarIndex,
    baseVarIndex,
) {
    const prevProps = nextNodeIndex[nodeId];
    if (!prevProps) return;

    for (const prop in prevProps) {
        const varId = prevProps[prop];

        if (!nextVarIndex[varId]) continue;

        nextVarIndex[varId] = ensureCOW(
            nextVarIndex[varId],
            baseVarIndex[varId],
        );

        const depKey = depKeyOf(nodeId, prop);
        delete nextVarIndex[varId][depKey];

        if (Object.keys(nextVarIndex[varId]).length === 0) {
            delete nextVarIndex[varId];
        }
    }

    delete nextNodeIndex[nodeId];
}

export function ensureBindings(node) {
    const b = node.bindings;
    if (b?.byProp) return b;
    return { globalVarId: b?.globalVarId ?? null, byProp: {} };
}

export function ensureNodeBindingsGlobal({ node, varIdOrNull }) {
    const b = ensureBindings(node);
    if (b.globalVarId === varIdOrNull && node.bindings?.byProp) return node;

    return {
        ...node,
        bindings: {
            globalVarId: varIdOrNull,
            byProp: b.byProp ?? {},
        },
    };
}

export function ensureCOW(current, base) {
    if (current === base) return { ...current };
    return current;
}
