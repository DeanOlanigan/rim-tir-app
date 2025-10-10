import { create } from "zustand";

const MAX_CAPACITY = 32;

export const useMonitoringLive = create((set) => ({
    latest: new Map(),
    spark: new Map(),
    capacity: MAX_CAPACITY,

    upsertMany: (batch) =>
        set((state) => {
            if (!batch.size) return state;
            let changed = false;
            const next = new Map(state.latest);
            for (const [id, msg] of batch) {
                const prev = next.get(id);
                if (!prev || prev.v !== msg.v) {
                    next.set(id, msg);
                    changed = true;
                }
            }
            return changed ? { latest: next } : state;
        }),

    appendManySpark: (batch) =>
        set((state) => {
            if (!batch.size) return state;
            let changed = false;
            const cap = state.capacity;
            const next = new Map(state.spark);

            for (const [id, msg] of batch) {
                const y = Number(msg.v);
                if (!Number.isFinite(y)) continue;

                const arr = next.get(id);

                let out = [];
                if (!arr) {
                    out = [{ x: 0, y }];
                } else if (arr.length < cap) {
                    out = [...arr, { x: arr.length, y }];
                } else {
                    out = new Array(cap);
                    for (let i = 0; i < cap - 1; i++) {
                        out[i] = { x: i, y: arr[i + 1].y };
                    }
                    out[cap - 1] = { x: cap - 1, y };
                }

                next.set(id, out);
                changed = true;
            }

            return changed ? { spark: next } : state;
        }),

    clear: () =>
        set({ latest: new Map(), series: new Map(), spark: new Map() }),
}));

export function useLiveValue(id) {
    return useMonitoringLive((s) => s.latest.get(id), Object.is);
}

export function useSpark(id) {
    return useMonitoringLive((s) => s.spark.get(id), Object.is);
}
