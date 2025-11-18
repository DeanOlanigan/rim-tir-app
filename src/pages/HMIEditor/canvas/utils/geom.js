export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function snap(v, step, origin = 0) {
    if (step <= 0) return v;
    return Math.round((v - origin) / step) * step + origin;
}

export function normalizeRect(x1, y1, x2, y2) {
    return {
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
    };
}

export function clampPointToRect(rect, p) {
    return {
        x: Math.min(Math.max(p.x, rect.x), rect.x + rect.width),
        y: Math.min(Math.max(p.y, rect.y), rect.y + rect.height),
    };
}
