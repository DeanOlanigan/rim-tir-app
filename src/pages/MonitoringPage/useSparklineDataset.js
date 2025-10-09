import { useMemo } from "react";
import { useSeries } from "./store/mqtt-stream-store";

export function useSparklineDataset(id, maxPoints) {
    const s = useSeries(id);
    return useMemo(() => {
        if (!s || s.len === 0) return [];
        const { buf, len } = s;
        const start = len === buf.length ? s.idx : 0;
        const arr = new Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = { x: i, y: buf[(start + i) % buf.length] };
        }

        if (arr.length > maxPoints) {
            const step = arr.length / maxPoints;
            const out = new Array(maxPoints);
            for (let i = 0; i < maxPoints; i++) {
                out[i] = { x: i, y: arr[(i * step) | 0].y };
            }
            return out;
        }
        return arr;
    }, [s, maxPoints]);
}
