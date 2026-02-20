import { deg2rad } from "./math";

export const I = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0,
};

function T(x, y) {
    return {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: x,
        f: y,
    };
}

function R(deg) {
    const r = deg2rad(deg);
    const c = Math.cos(r),
        s = Math.sin(r);
    return {
        a: c,
        c: -s,
        e: 0,
        b: s,
        d: c,
        f: 0,
    };
}

export function S(sx, sy) {
    return {
        a: sx,
        b: 0,
        c: 0,
        d: sy,
        e: 0,
        f: 0,
    };
}

// shear factors: x' = x + skewX*y; y' = skewY*x + y
export function K(skewX, skewY) {
    return {
        a: 1,
        b: skewY,
        c: skewX,
        d: 1,
        e: 0,
        f: 0,
    };
}

export function applyLinear(M, x, y) {
    return {
        x: M.a * x + M.c * y,
        y: M.b * x + M.d * y,
    };
}

export function applyToPoint(M, x, y) {
    return {
        x: M.a * x + M.c * y + M.e,
        y: M.b * x + M.d * y + M.f,
    };
}

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

export function matTR(x, y, deg) {
    return mul(T(x, y), R(deg));
}

export function matTRKS(x, y, rotDeg, skewX, skewY, scaleX, scaleY) {
    let M = T(x, y);
    if (rotDeg) M = mul(M, R(rotDeg));
    if (skewX || skewY) M = mul(M, K(skewX, skewY));
    if (scaleX !== 1 || scaleY !== 1) M = mul(M, S(scaleX, scaleY));
    return M;
}

export function decomposeTR(M) {
    const x = M.e;
    const y = M.f;
    const rotation = (Math.atan2(M.b, M.a) * 180) / Math.PI;
    return { x, y, rotation };
}

export function decomposeTRKS(M) {
    // translate
    const x = M.e;
    const y = M.f;

    // rotation (берём направление первой колонки)
    const rotation = (Math.atan2(M.b, M.a) * 180) / Math.PI;
    const r = deg2rad(rotation);
    const c = Math.cos(r);
    const s = Math.sin(r);

    // R(-rot) в твоём формате (a,c,b,d)
    const Rinv = { a: c, b: -s, c: s, d: c, e: 0, f: 0 };

    // A' = R(-rot) * A
    const A2 = mul(Rinv, { ...M, e: 0, f: 0 });

    let scaleX = A2.a;
    let scaleY = A2.d;

    // защита от деления на 0
    const EPS = 1e-9;
    const skewX = Math.abs(scaleY) > EPS ? A2.c / scaleY : 0;
    const skewY = Math.abs(scaleX) > EPS ? A2.b / scaleX : 0;

    return { x, y, rotation, skewX, skewY, scaleX, scaleY };
}
