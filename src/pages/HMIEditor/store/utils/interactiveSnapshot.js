import { RAF_NODE_FIELDS } from "../constants";

function cloneValue(v) {
    // Для твоего набора сейчас массив нужен только для dash.
    // Можно расширить позже, если появятся points и т.п.
    if (Array.isArray(v)) return [...v];
    return v;
}

export function pickNodeFields(node, fields = RAF_NODE_FIELDS) {
    if (!node) return null;
    const out = {};
    for (const key of fields) {
        out[key] = cloneValue(node[key]);
    }
    return out;
}

/**
 * Снимаем baseline только по нужным полям.
 * ids: массив узлов, которые участвуют в интерактиве.
 */
export function buildBaselineById(nodes, ids, fields = RAF_NODE_FIELDS) {
    console.log(fields);
    const out = {};
    for (const id of ids) {
        const node = nodes[id];
        if (!node) continue;
        out[id] = pickNodeFields(node, fields);
    }
    return out;
}

/**
 * Формирует final patch по сравнению baseline -> current.
 * Вернёт patchesById, пригодный для updateNodesCommand.
 */
// [ ]
// eslint-disable-next-line
export function buildFinalPatchFromBaseline(
    nodes,
    baselineById,
    fields = RAF_NODE_FIELDS,
) {
    const patchesById = {};

    for (const id in baselineById) {
        const baseSnap = baselineById[id];
        const cur = nodes[id];
        if (!cur || !baseSnap) continue;

        let patch = null;

        for (const key of fields) {
            const prev = baseSnap[key];
            const next = cur[key];

            const changed =
                Array.isArray(prev) || Array.isArray(next)
                    ? !arrayShallowEqual(prev, next)
                    : prev !== next;

            if (!changed) continue;

            if (!patch) patch = {};
            patch[key] = cloneValue(next);
        }

        if (patch) {
            patchesById[id] = patch;
        }
    }

    return patchesById;
}

/**
 * Формирует rollback patch: current -> baseline (по тем же полям).
 */
// [ ]
// eslint-disable-next-line
export function buildRollbackPatchFromBaseline(
    nodes,
    baselineById,
    fields = RAF_NODE_FIELDS,
) {
    const patchesById = {};

    for (const id in baselineById) {
        const baseSnap = baselineById[id];
        const cur = nodes[id];
        if (!cur || !baseSnap) continue;

        let patch = null;

        for (const key of fields) {
            const prev = cur[key];
            const next = baseSnap[key];

            const changed =
                Array.isArray(prev) || Array.isArray(next)
                    ? !arrayShallowEqual(prev, next)
                    : prev !== next;

            if (!changed) continue;

            if (!patch) patch = {};
            patch[key] = cloneValue(next);
        }

        if (patch) {
            patchesById[id] = patch;
        }
    }

    return patchesById;
}

function arrayShallowEqual(a, b) {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
