export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function snap(v, step, origin = 0) {
    if (step <= 0) return v;
    return Math.round((v - origin) / step) * step + origin;
}
