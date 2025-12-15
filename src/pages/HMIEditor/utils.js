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

export function rotateAround(p, pivot, deg) {
    const r = deg2rad(deg);
    const c = Math.cos(r);
    const s = Math.sin(r);

    const x = p.x - pivot.x;
    const y = p.y - pivot.y;

    return {
        x: pivot.x + x * c - y * s,
        y: pivot.y + x * s + y * c,
    };
}

export function centerOf(n) {
    return {
        x: (n.x ?? 0) + (n.width ?? 0) / 2,
        y: (n.y ?? 0) + (n.height ?? 0) / 2,
    };
}

export function xyFromCenter(center, n) {
    return {
        x: center.x - (n.width ?? 0) / 2,
        y: center.y - (n.height ?? 0) / 2,
    };
}

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
