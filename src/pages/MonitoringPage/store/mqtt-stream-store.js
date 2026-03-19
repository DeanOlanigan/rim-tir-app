import { create } from "zustand";

const MAX_CAPACITY = 32;

export const useMonitoringLive = create((set) => ({
    latest: new Map(),
    spark: new Map(),
    capacity: MAX_CAPACITY,
    nameSwitch: false,

    switchName: (checked) => set({ nameSwitch: checked }),

    upsertMany: (batch) =>
        set((state) => {
            if (!batch.size) return state;
            let changed = false;
            const next = new Map(state.latest);

            for (const [id, msg] of batch) {
                const prev = next.get(id);

                if (!prev || hasLiveChanged(prev, msg)) {
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
                if (msg.valueType === "bool") continue;

                const y = Number(msg.value);
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
        set({
            latest: new Map(),
            spark: new Map(),
        }),
}));

export function useLiveValue(id) {
    return useMonitoringLive((s) => s.latest.get(id), Object.is);
}

export function useSpark(id) {
    return useMonitoringLive((s) => s.spark.get(id), Object.is);
}

function hasLiveChanged(prev, next) {
    if (prev.ts !== next.ts) return true;
    if (prev.value !== next.value) return true;
    if (prev.valueType !== next.valueType) return true;
    if (prev.unit !== next.unit) return true;
    if (prev.version !== next.version) return true;
    if (prev.quality?.good !== next.quality?.good) return true;

    const prevAttrs = prev.quality?.attributes ?? [];
    const nextAttrs = next.quality?.attributes ?? [];
    if (prevAttrs.length !== nextAttrs.length) return true;

    for (let i = 0; i < prevAttrs.length; i++) {
        if (prevAttrs[i] !== nextAttrs[i]) return true;
    }

    return false;
}
