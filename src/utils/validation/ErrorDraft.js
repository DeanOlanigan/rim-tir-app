const toKey = (id, param, validator) => `${id}:${param ?? ""}:${validator}`;

export class ErrorDraft {
    #map = new Map();
    #touchedPrefixes = new Set();

    set(id, param, validator, messages) {
        const key = toKey(id, param, validator);
        this.#touchedPrefixes.add(key);

        if (!messages || messages.length === 0) {
            this.#map.delete(key);
            return;
        }

        this.#map.set(key, {
            id,
            param,
            validator,
            messages,
            severity: "error",
        });
    }

    diff(prevMap) {
        const added = new Map(),
            removed = new Map(),
            changed = new Map();

        const prev = prevMap instanceof Map ? prevMap : new Map();

        for (const key of this.#touchedPrefixes) {
            if (!this.#map.has(key)) {
                const v = prev.get(key);
                if (v) removed.set(key, v);
            }
        }

        for (const [k, v] of this.#map.entries()) {
            const cur = prev.get(k);
            if (!cur) {
                added.set(k, v);
                continue;
            }
            if (!shallowEqualError(cur, v)) changed.set(k, v);
        }

        console.log({ added, removed, changed });
        return { added, removed, changed };
    }

    diff2(prevMap) {
        const base = prevMap instanceof Map ? prevMap : new Map();
        const next = new Map(base);
        for (const key of this.#touchedPrefixes) {
            if (!this.#map.has(key)) {
                next.delete(key);
            }
        }
        for (const [k, v] of this.#map.entries()) {
            next.set(k, v);
        }
        return next;
    }

    merge(other) {
        for (const [k, v] of other.#map.entries()) {
            this.#map.set(k, v);
            this.#touchedPrefixes.add(k);
        }

        for (const k of other.#touchedPrefixes) {
            this.#touchedPrefixes.add(k);
        }
        return this;
    }
}

function shallowEqualError(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.id !== b.id || a.param !== b.param || a.validator !== b.validator)
        return false;
    const am = a.messages || [],
        bm = b.messages || [];
    if (am.length !== bm.length) return false;
    for (let i = 0; i < am.length; i++) if (am[i] !== bm[i]) return false;
    return true;
}
