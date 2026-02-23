import { round4 } from "@/pages/HMIEditor/utils";

const EPS = 1e-9;

function qNumber(v) {
    if (typeof v !== "number" || !Number.isFinite(v)) return v;
    if (Math.abs(v) < EPS) return 0;
    const r = round4(v);
    return Object.is(r, -0) ? 0 : r;
}

export function quantizePatch(patch) {
    if (!patch) return null;
    let out = null;

    for (const k in patch) {
        const v = patch[k];
        const qv = qNumber(v);
        if (!out) out = {};
        out[k] = qv;
    }

    return out;
}
