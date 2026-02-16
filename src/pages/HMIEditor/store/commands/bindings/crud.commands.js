import {
    reindexNodeCOW,
    removeBindingByProp,
    upsertBindingByProp,
} from "../../utils/bindings";
import { ensureNodeBindingsGlobal } from "../../utils/bindings/helpers";
import { runCommand } from "../runCommand";

function wrap({ fn, state, ids, args }) {
    const baseNodes = state.nodes;
    const baseVarIndex = state.varIndex;
    const baseNodeIndex = state.nodeIndex;

    let nodes = null;
    let varIndex = baseVarIndex;
    let nodeIndex = baseNodeIndex;

    const uniqueIds = Array.from(new Set(ids));
    for (const id of uniqueIds) {
        const curNodes = nodes ?? baseNodes;
        const prev = curNodes[id];
        if (!prev) continue;

        const next = fn({ node: prev, ...args });
        if (next === prev) continue;

        if (!nodes) nodes = { ...baseNodes };
        nodes[id] = next;

        ({ varIndex, nodeIndex } = reindexNodeCOW({
            baseVarIndex,
            baseNodeIndex,
            varIndex,
            nodeIndex,
            node: next,
        }));
    }

    if (!nodes && varIndex === baseVarIndex && nodeIndex === baseNodeIndex)
        return null;

    const patch = {
        nodes: nodes ?? baseNodes,
        varIndex,
        nodeIndex,
    };

    return {
        patch,
        dirty: true,
    };
}

export const removeBindingCommand = (api, ids, property) => {
    runCommand(api, "cmd/bind/removeBinding", (state) => {
        return wrap({
            fn: removeBindingByProp,
            state,
            ids,
            args: { property },
        });
    });
};

export const setGlobalVarIdCommand = (api, ids, varIdOrNull) => {
    runCommand(api, "cmd/bind/setGlobalVarId", (state) => {
        return wrap({
            fn: ensureNodeBindingsGlobal,
            state,
            ids,
            args: { varIdOrNull },
        });
    });
};

export const updateBindingCommand = (api, ids, property, changes) => {
    runCommand(api, "cmd/bind/updateBinding", (state) => {
        return wrap({
            fn: upsertBindingByProp,
            state,
            ids,
            args: { property, changes },
        });
    });
};
