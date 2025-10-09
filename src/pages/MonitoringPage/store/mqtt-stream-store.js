import { create } from "zustand";

export const useMonitoringLive = create((set) => ({
    latest: new Map(),
    series: new Map(),
    capacity: 64,

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

    appendManyHistory: (batch) =>
        set((state) => {
            if (!batch.size) return state;
            let changed = false;
            const cap = state.capacity;
            const next = new Map(state.series);

            for (const [id, msg] of batch) {
                const prev = next.get(id);
                let s;
                if (!prev)
                    s = { buf: new Float64Array(cap), idx: 0, len: 0, ver: 0 };
                else s = { ...prev };

                s.buf[s.idx] = msg.v;
                s.idx = (s.idx + 1) % cap;
                s.len = Math.min(s.len + 1, cap);
                s.ver++;
                next.set(id, s);
                changed = true;
            }
            return changed ? { series: next } : state;
        }),

    clear: () => set({ latest: new Map(), series: new Map() }),
}));

export function useLiveValue(id) {
    return useMonitoringLive((s) => s.latest.get(id), Object.is);
}

export function useSeries(id) {
    return useMonitoringLive((s) => s.series.get(id), Object.is);
}
