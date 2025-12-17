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

export function layerShift(ids, dir) {
    const store = useNodeStore.getState();
    const rootIds = store.rootIds;

    const moveIds = Array.isArray(ids) ? ids : [ids];

    const indexed = moveIds
        .map((id) => ({ id, index: rootIds.indexOf(id) }))
        .filter((v) => v.index !== -1);

    if (indexed.length === 0) return;

    indexed.sort((a, b) => a.index - b.index);
    const orderedIds = indexed.map((v) => v.id);

    let rest = rootIds.filter((id) => !orderedIds.includes(id));

    switch (dir) {
        case "moveToTop":
            rest = [...rest, ...orderedIds];
            break;
        case "moveUp": {
            const lastIndex = indexed[indexed.length - 1].index;
            const insertIndex = Math.min(rest.length, lastIndex + 1);
            rest.splice(insertIndex, 0, ...orderedIds);
            break;
        }
        case "moveDown": {
            const firstIndex = indexed[0].index;
            const insertIndex = Math.max(0, firstIndex - 1);
            rest.splice(insertIndex, 0, ...orderedIds);
            break;
        }
        case "moveToBottom":
            rest = [...orderedIds, ...rest];
            break;
        default:
            break;
    }
    store.setRootIds(rest);
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
    if (n.type === SHAPES.polygon) {
        const w = n.width ?? 0;
        const h = n.height ?? 0;
        return matTR(x + w / 2, y + h / 2, rot);
    }

    // остальные: x/y как есть
    return matTR(x, y, rot);
}

export function getPointsRect(points) {
    if (!Array.isArray(points) || points.length < 4) {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0,
        };
    }

    let minX = points[0],
        maxX = points[0];
    let minY = points[1],
        maxY = points[1];

    for (let i = 2; i < points.length; i += 2) {
        const x = points[i];
        const y = points[i + 1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }

    const width = maxX - minX;
    const height = maxY - minY;

    return { x: minX, y: minY, width, height, minX, minY, maxX, maxY };
}
