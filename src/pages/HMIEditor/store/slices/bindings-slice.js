import {
    addNodeToIndex,
    removeBindingFunc,
    removeNodeFromIndex,
    updateBindingFunc,
} from "../utils/bindings";
import { withDirty } from "../utils/withDirty";

export const createBindingsSlice = (set) => {
    const dirty = withDirty(set);

    return {
        setBindingGlobalVarId: dirty(
            "bind/setBindingGlobalVarId",
            (ids, varIdOrNull) => {
                set(
                    (s) => {
                        const newNodes = { ...s.nodes };
                        const newVarIndex = { ...s.varIndex };
                        ids.forEach((id) => {
                            const node = newNodes[id];
                            if (!node) return;

                            removeNodeFromIndex(newVarIndex, id);

                            newNodes[id] = {
                                ...node,
                                bindings: {
                                    ...node.bindings,
                                    globalVarId: varIdOrNull,
                                },
                            };

                            addNodeToIndex(newVarIndex, newNodes[id]);
                        });
                        return { nodes: newNodes, varIndex: newVarIndex };
                    },
                    undefined,
                    "bind/setBindingGlobalVarId",
                );
            },
        ),
        updateBinding: dirty(
            "bind/updateBinding",
            (nodeIds, property, changes) =>
                set(
                    (state) => {
                        const newNodes = { ...state.nodes };
                        const newIndex = { ...state.varIndex };

                        nodeIds.forEach((id) => {
                            updateBindingFunc(
                                newNodes,
                                newIndex,
                                id,
                                property,
                                changes,
                            );
                        });

                        return { nodes: newNodes, varIndex: newIndex };
                    },
                    undefined,
                    "bind/updateBinding",
                ),
        ),
        removeBinding: dirty("bind/removeBinding", (ids, property) => {
            set(
                (s) => {
                    const newNodes = { ...s.nodes };
                    ids.forEach((id) => {
                        removeBindingFunc(newNodes, id, property);
                    });
                    return { nodes: newNodes };
                },
                undefined,
                "bind/removeBinding",
            );
        }),
    };
};
