import { round4 } from "@/pages/HMIEditor/utils";

const EPS = 1e-9;

function qNumber(v) {
    if (typeof v !== "number" || !Number.isFinite(v)) return v;
    if (Math.abs(v) < EPS) return 0;
    const r = round4(v);
    return Object.is(r, -0) ? 0 : r;
}

const ARRAY_COMPARE_KEYS = new Set(["points", "dash"]);

function isFiniteNumberArray(arr) {
    if (!Array.isArray(arr)) return false;
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== "number" || !Number.isFinite(arr[i]))
            return false;
    }
    return true;
}

function quantizeValueByKey(key, value) {
    if (typeof value === "number") {
        return qNumber(value);
    }

    // Квантизуем только массивы чисел для известных ключей
    if (ARRAY_COMPARE_KEYS.has(key) && isFiniteNumberArray(value)) {
        let changed = false;
        const out = new Array(value.length);

        for (let i = 0; i < value.length; i++) {
            const qv = qNumber(value[i]);
            out[i] = qv;
            if (qv !== value[i]) changed = true;
        }

        return changed ? out : value; // сохраняем ссылку, если ничего не изменилось
    }

    return value;
}

export function quantizePatch(patch) {
    if (!patch) return null;
    let out = null;

    for (const k in patch) {
        const v = patch[k];
        const qv = quantizeValueByKey(k, v);
        if (!out) out = {};
        out[k] = qv;
    }

    return out;
}
