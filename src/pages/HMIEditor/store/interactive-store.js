import { create } from "zustand";
import { useNodeStore } from "./node-store";
import { useMemo } from "react";
import { devtools } from "zustand/middleware";

const ARRAY_COMPARE_KEYS = new Set(["points", "dash"]);

function arraysEqualShallow(a, b) {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

function valuesEqualByKey(key, nextVal, curVal) {
    if (nextVal === curVal) return true;
    if (ARRAY_COMPARE_KEYS.has(key)) return arraysEqualShallow(nextVal, curVal);
    return false;
}

function stripNoopsAgainstBase(id, patch, baseNodes) {
    if (!patch) return null;
    const cur = baseNodes[id];
    if (!cur) return patch;
    let out = null;
    for (const k in patch) {
        if (!valuesEqualByKey(k, patch[k], cur[k])) {
            if (!out) out = {};
            out[k] = patch[k];
        }
    }
    return out;
}

export const useInteractiveStore = create(
    devtools(
        (set, get) => ({
            active: false,
            patchesById: {},

            begin() {
                set({ active: true, patchesById: {} }, undefined, "begin");
            },

            // сюда будет писать patchStoreRaf.flush() когда active=true
            applyPatchNow(patchById) {
                if (!patchById) return;
                const cur = get().patchesById;
                const next = { ...cur };
                for (const id in patchById) {
                    const p = patchById[id];
                    if (!p) continue;
                    next[id] = { ...(next[id] || {}), ...p };
                }
                set({ patchesById: next }, undefined, "applyPatchNow");
            },

            clearIds(ids) {
                if (!ids || ids.length === 0) return;
                const cur = get().patchesById;
                let next = cur;
                let changed = false;

                for (const id of ids) {
                    if (cur[id] !== undefined) {
                        if (!changed) {
                            next = { ...cur };
                            changed = true;
                        }
                        delete next[id];
                    }
                }
                if (changed) set({ patchesById: next });
            },

            clear() {
                set({ active: false, patchesById: {} }, undefined, "clear");
            },

            cancel() {
                get().clear();
            },

            commit({ undoable = true } = {}) {
                const nodeStore = useNodeStore.getState();
                const { active, patchesById } = get();
                if (!active) return;

                const baseNodes = nodeStore.nodes;
                const cleaned = {};
                for (const id in patchesById) {
                    const p = patchesById[id];
                    if (!p) continue;
                    const c = stripNoopsAgainstBase(id, p, baseNodes);
                    if (!c) continue;
                    cleaned[id] = c;
                }

                get().clear();

                if (!Object.keys(cleaned).length) return;

                if (undoable) nodeStore.updateNodes(cleaned);
                else nodeStore.updateNodesSilent?.(cleaned);
            },
        }),
        {
            name: "interactive-store",
        },
    ),
);

export function getEffectiveNode(id) {
    const base = useNodeStore.getState().nodes[id];
    if (!base) return base;
    const patch = useInteractiveStore.getState().patchesById[id];
    return patch ? { ...base, ...patch } : base;
}

export function getEffectiveNodesByIds(ids) {
    const { nodes } = useNodeStore.getState();
    const { patchesById } = useInteractiveStore.getState();
    return ids.map((id) => {
        const base = nodes[id];
        if (!base) return base;
        const patch = patchesById[id];
        return patch ? { ...base, ...patch } : base;
    });
}

export function useEffectiveNode(id) {
    const base = useNodeStore((s) => s.nodes[id]);
    const patch = useInteractiveStore((s) => s.patchesById[id]);

    return useMemo(() => {
        if (!base) return base;
        if (!patch) return base;
        return { ...base, ...patch };
    }, [base, patch]);
}

export function useEffectiveNodesByIds(ids) {
    // точечные подписки по каждому id
    const bases = useNodeStore((s) => ids.map((id) => s.nodes[id]));
    const patches = useInteractiveStore((s) =>
        ids.map((id) => s.patchesById[id]),
    );

    return useMemo(() => {
        return bases.map((base, i) => {
            if (!base) return base;
            const p = patches[i];
            return p ? { ...base, ...p } : base;
        });
    }, [bases, patches]);
}
