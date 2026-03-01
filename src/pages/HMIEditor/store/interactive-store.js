import { create } from "zustand";
import { useNodeStore } from "./node-store";
import { useMemo } from "react";
import { devtools } from "zustand/middleware";
import { stripNoops } from "./utils/patchesOps";
import { getNodeLocalTransformMatrix, mul } from "../utils";
import { useShallow } from "zustand/shallow";
import {
    calculateContentBounds,
    getNodeParentLocalAABB,
} from "./utils/geometry";

export const useInteractiveStore = create(
    devtools(
        (set, get) => ({
            active: false,
            patchesById: {},
            baselineNodes: null,

            begin() {
                if (get().active) return;
                const baseNodesSnapshot = useNodeStore.getState().nodes;
                set(
                    {
                        active: true,
                        patchesById: {},
                        baselineNodes: baseNodesSnapshot,
                    },
                    undefined,
                    "begin",
                );
            },

            replacePatches(patchById) {
                if (!patchById || Object.keys(patchById).length === 0) return;

                const cur = get().patchesById;
                let changed = false;
                let next = cur;

                for (const id in patchById) {
                    const incoming = patchById[id];
                    if (cur[id] === incoming) continue;

                    if (!changed) {
                        next = { ...cur };
                        changed = true;
                    }

                    next[id] = incoming;
                }

                if (changed) {
                    set({ patchesById: next }, undefined, "replacePatches");
                }
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
                if (changed) set({ patchesById: next }, undefined, "clearIds");
            },

            clear() {
                set(
                    { active: false, patchesById: {}, baselineNodes: null },
                    undefined,
                    "clear",
                );
            },

            cancel() {
                get().clear();
            },

            commit() {
                const nodeStore = useNodeStore.getState();
                const { active, patchesById, baselineNodes } = get();
                if (!active) return;

                const cleaned = {};
                for (const id in patchesById) {
                    const p = patchesById[id];
                    if (!p) continue;
                    const c = stripNoops(id, p, baselineNodes);
                    if (!c) continue;
                    cleaned[id] = c;
                }

                if (!Object.keys(cleaned).length) {
                    get().clear();
                    return;
                }
                try {
                    nodeStore.updateNodes(cleaned);
                } finally {
                    get().clear();
                }
            },
        }),
        {
            name: "interactive-store",
        },
    ),
);

export function getEffectiveNodeWorldTransformMatrix(id) {
    let node = getEffectiveNode(id);
    if (!node) return null;

    let M = getNodeLocalTransformMatrix(node);
    let p = node.parentId ?? null;

    const guard = new Set([id]);

    while (p) {
        if (guard.has(p)) break;
        guard.add(p);

        const parent = getEffectiveNode(p);
        if (!parent) break;

        const P = getNodeLocalTransformMatrix(parent);
        M = mul(P, M);
        p = parent.parentId ?? null;
    }

    return M;
}

export function getEffectiveNode(id) {
    const int = useInteractiveStore.getState();
    const base = int.active
        ? (int.baselineNodes[id] ?? useNodeStore.getState().nodes[id])
        : useNodeStore.getState().nodes[id];

    if (!base) return base;

    const patch = int.patchesById[id];
    return patch ? { ...base, ...patch } : base;
}

export function useEffectiveNode(id) {
    const active = useInteractiveStore((s) => s.active);
    const baseline = useInteractiveStore((s) => s.baselineNodes?.[id]);
    const patch = useInteractiveStore((s) => s.patchesById[id]);
    const liveBase = useNodeStore((s) => s.nodes[id]);

    return useMemo(() => {
        const base = active ? (baseline ?? liveBase) : liveBase;
        if (!base) return base;
        if (!patch) return base;
        return { ...base, ...patch };
    }, [patch, active, baseline, liveBase]);
}

export function useSelectionBounds(selectedIds) {
    const active = useInteractiveStore((s) => s.active);
    const baselineList = useInteractiveStore(
        useShallow((s) => selectedIds.map((id) => s.baselineNodes?.[id])),
    );
    const patchList = useInteractiveStore(
        useShallow((s) => selectedIds.map((id) => s.patchesById[id])),
    );
    const liveBaseList = useNodeStore(
        useShallow((s) => selectedIds.map((id) => s.nodes[id])),
    );

    return useMemo(() => {
        if (!selectedIds.length) return null;

        const nodes = {};
        for (let i = 0; i < selectedIds.length; i++) {
            const liveBase = liveBaseList[i];
            const baseline = baselineList[i];
            const patch = patchList[i];

            const base = active ? (baseline ?? liveBase) : liveBase;
            if (!base) continue;

            nodes[selectedIds[i]] = patch ? { ...base, ...patch } : base;
        }

        if (selectedIds.length === 1) {
            const node = nodes[selectedIds[0]];
            if (!node) return null;
            return getNodeParentLocalAABB(node);
        }

        const bounds = calculateContentBounds(nodes, selectedIds, (_id, node) =>
            getNodeParentLocalAABB(node),
        );

        return {
            x: bounds.minX,
            y: bounds.minY,
            width: bounds.maxX - bounds.minX,
            height: bounds.maxY - bounds.minY,
        };
    }, [selectedIds, active, baselineList, patchList, liveBaseList]);
}
