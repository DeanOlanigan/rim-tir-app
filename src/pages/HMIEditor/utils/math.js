export function round4(x) {
    return Math.round(x * 1e4) / 1e4;
}

export function deg2rad(deg) {
    return (deg * Math.PI) / 180;
}

export function clampVal(v, eps = 1e-3) {
    if (Number.isNaN(v) || !Number.isFinite(v)) return 1;
    // не даём проходить через 0, чтобы не было сингулярности
    if (Math.abs(v) < eps) return v < 0 ? -eps : eps;
    return v;
}
