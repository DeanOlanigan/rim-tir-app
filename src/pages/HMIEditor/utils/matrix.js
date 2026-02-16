import { deg2rad } from "./math";

export function mul(A, B) {
    return {
        a: A.a * B.a + A.c * B.b,
        b: A.b * B.a + A.d * B.b,
        c: A.a * B.c + A.c * B.d,
        d: A.b * B.c + A.d * B.d,
        e: A.a * B.e + A.c * B.f + A.e,
        f: A.b * B.e + A.d * B.f + A.f,
    };
}

function T(x, y) {
    return { a: 1, b: 0, c: 0, d: 1, e: x, f: y };
}

function R(deg) {
    const r = deg2rad(deg);
    const c = Math.cos(r),
        s = Math.sin(r);
    return { a: c, b: s, c: -s, d: c, e: 0, f: 0 };
}

export function matTR(x, y, deg) {
    return mul(T(x, y), R(deg));
}

export function decomposeTR(M) {
    const rotation = (Math.atan2(M.b, M.a) * 180) / Math.PI;
    return { x: M.e, y: M.f, rotation };
}

export function inv(M) {
    const det = M.a * M.d - M.b * M.c;
    if (!det) return null;
    const id = 1 / det;
    return {
        a: M.d * id,
        b: -M.b * id,
        c: -M.c * id,
        d: M.a * id,
        e: (M.c * M.f - M.d * M.e) * id,
        f: (M.b * M.e - M.a * M.f) * id,
    };
}

export const I = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

export function applyToPoint(M, x, y) {
    return {
        x: M.a * x + M.c * y + M.e,
        y: M.b * x + M.d * y + M.f,
    };
}
