import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useValidationStore = create(
    devtools((set, get) => ({
        clearErrors: (nodeIds) =>
            set((state) => {
                if (!nodeIds)
                    return {
                        errorsMap: new Map(),
                        errorsTree: new Map(),
                    };

                const updatedMap = new Map(state.errorsMap);
                for (const id of nodeIds) {
                    for (const key of updatedMap.keys()) {
                        if (key.startsWith(`${id}:`)) {
                            updatedMap.delete(key);
                        }
                    }
                }
                const updatedTree = rebuildTree(updatedMap);

                return {
                    errorsMap: updatedMap,
                    errorsTree: updatedTree,
                };
            }),

        errorsMap: new Map(),
        //errorsById: new Map(),
        //errorsByParam: new Map(),
        errorsTree: new Map(),

        applyDraft: (draft) => {
            const prev = get().errorsMap;
            const { added, changed, removed } = draft.diff(prev);

            if (added.size === 0 && changed.size === 0 && removed.size === 0)
                return;

            const next = new Map(prev);

            for (const [k] of removed) next.delete(k);
            for (const [k, v] of added) next.set(k, v);
            for (const [k, v] of changed) next.set(k, v);

            console.log("STORE:", next);
            set({ errorsMap: next });
        },

        applyDraft2: (draft) => {
            set((state) => {
                const next = draft.diff2(state.errorsMap);
                //const byId = rebuildById(next);
                //const byIdParam = rebuildByIdParam(next);
                const tree = rebuildTree(next);
                console.log("STORE:", next);
                //console.log("byId", byId);
                //console.log("byIdParam", byIdParam);
                console.log("tree", tree);
                return {
                    errorsMap: next,
                    //errorsById: byId,
                    //errorsByParam: byIdParam,
                    errorsTree: tree,
                };
            });
        },
    }))
);

/* function rebuildById(errorsMap) {
    const byId = new Map();
    for (const rec of errorsMap.values()) {
        if (!byId.has(rec.id)) byId.set(rec.id, []);
        byId.get(rec.id).push(rec);
    }
    return byId;
} */

/* function rebuildByIdParam(errorsMap) {
    const byIdParam = new Map();
    for (const rec of errorsMap.values()) {
        const key = `${rec.id}:${rec.param}`;
        if (!byIdParam.has(key)) byIdParam.set(key, []);
        byIdParam.get(key).push(rec);
    }
    return byIdParam;
} */

function rebuildTree(errorsMap) {
    const tree = new Map();
    for (const rec of errorsMap.values()) {
        if (!tree.has(rec.id)) tree.set(rec.id, new Map());
        const paramMap = tree.get(rec.id);
        if (!paramMap.has(rec.param)) paramMap.set(rec.param, new Map());
        const validatorMap = paramMap.get(rec.param);
        validatorMap.set(rec.validator, rec);
    }
    return tree;
}
