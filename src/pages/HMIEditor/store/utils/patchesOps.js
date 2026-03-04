const ARRAY_COMPARE_KEYS = new Set(["points", "dash"]);

function arraysEqualShallow(a, b) {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

function valuesEqualByKey(key, nextVal, curVal) {
    if (nextVal === curVal) return true;

    // Только для заранее известных ключей сравниваем массивы поэлементно
    if (ARRAY_COMPARE_KEYS.has(key)) {
        return arraysEqualShallow(nextVal, curVal);
    }

    return false;
}

export function stripNoops(id, patch, nodes) {
    if (!patch) return null;

    const cur = nodes[id];
    if (!cur) return patch;

    let out = null;

    for (const k in patch) {
        if (!valuesEqualByKey(k, patch[k], cur[k])) {
            if (!out) out = {};
            out[k] = patch[k];
        }
    }
    return out; // null => нет изменений
}

export function patchesEqual(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    for (const k of aKeys) {
        if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
        if (!valuesEqualByKey(k, a[k], b[k])) return false;
    }

    return true;
}
