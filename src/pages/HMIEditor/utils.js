import { SHAPES } from "./constants";
import { useNodeStore } from "./store/node-store";

export function round4(x) {
    return Math.round(x * 1e4) / 1e4;
}

export function isLineLikeType(type) {
    return type === SHAPES.arrow || type === SHAPES.line;
}

export function isHasRadius(type) {
    return type === SHAPES.ellipse || type === SHAPES.polygon;
}

export const deg2rad = (deg) => (deg * Math.PI) / 180;

export function layerShift(id, dir) {
    const rootIds = useNodeStore.getState().rootIds;
    const zIndex = rootIds.indexOf(id);
    if (zIndex === -1) return;

    const arr = [...rootIds];
    arr.splice(zIndex, 1);
    switch (dir) {
        case "moveToTop":
            arr.push(id);
            break;
        case "moveUp":
            arr.splice(Math.min(arr.length, zIndex + 1), 0, id);
            break;
        case "moveDown":
            arr.splice(Math.max(0, zIndex - 1), 0, id);
            break;
        case "moveToBottom":
            arr.unshift(id);
            break;
        default:
            break;
    }
    useNodeStore.getState().setRootIds(arr);
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

function T(x, y) {
    return { a: 1, b: 0, c: 0, d: 1, e: x, f: y };
}

function R(deg) {
    const r = deg2rad(deg);
    const c = Math.cos(r),
        s = Math.sin(r);
    return { a: c, b: s, c: -s, d: c, e: 0, f: 0 };
}

export function decomposeTR(M) {
    const rotation = (Math.atan2(M.b, M.a) * 180) / Math.PI;
    return { x: M.e, y: M.f, rotation };
}

export function matTR(x, y, deg) {
    return mul(T(x, y), R(deg));
}

export function nodeLocalMatrix(n) {
    const x = n.x ?? 0;
    const y = n.y ?? 0;
    const rot = n.rotation ?? 0;

    // ellipse: в сторе x/y = top-left bbox, а в konva x/y = center
    if (n.type === SHAPES.ellipse) {
        const w = n.width ?? 0;
        const h = n.height ?? 0;
        return matTR(x + w / 2, y + h / 2, rot);
    }

    // остальные: x/y как есть
    return matTR(x, y, rot);
}
