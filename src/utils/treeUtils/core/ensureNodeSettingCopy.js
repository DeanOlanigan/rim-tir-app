export function ensureNodeSettingCopy(next, id) {
    const cur = next[id];
    if (!cur) return null;

    if (Object.prototype.hasOwnProperty.call(next, id) && next[id] !== cur) {
        const rec = next[id];
        if (rec.setting === cur.setting) {
            rec.setting = { ...(cur.setting ?? {}) };
        }
        return rec;
    }

    const copy = { ...cur, setting: { ...(cur.setting ?? {}) } };
    next[id] = copy;
    return copy;
}
