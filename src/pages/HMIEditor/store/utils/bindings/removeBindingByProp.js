export function removeBindingByProp({ node, property }) {
    const b = node.bindings;
    if (!b?.byProp || !b.byProp[property]) return node;

    const nextByProp = { ...b.byProp };
    delete nextByProp[property];

    return {
        ...node,
        bindings: {
            globalVarId: b.globalVarId ?? null,
            byProp: nextByProp,
        },
    };
}
