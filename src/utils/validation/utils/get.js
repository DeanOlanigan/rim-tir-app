import { NODE_TYPES } from "./const";

export function getVarDataStore(settings) {
    const varIdsByName = new Map();
    const varNameById = new Map();
    const variables = new Map();

    for (const node of Object.values(settings)) {
        getVariableMaps(node, varIdsByName, varNameById);
    }
    return { varIdsByName, varNameById, variables };
}

export function getVariableMaps(node, varIdsByName, varNameById) {
    if (node.type !== NODE_TYPES.variable) return;
    const name = node.name ?? "";
    if (!varIdsByName.has(name)) varIdsByName.set(name, new Set());
    varIdsByName.get(name).add(node.id);
    varNameById.set(node.id, name);
}
