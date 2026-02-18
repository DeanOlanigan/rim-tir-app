import { toWorld } from "../utils/coords";
import { snap } from "../utils/geom";

export const snapPointToGrid = (p, gridSize, snapToGrid) => {
    const step = snapToGrid ? gridSize : 1;
    return {
        x: snap(p.x, step, 0),
        y: snap(p.y, step, 0),
    };
};

export const BASE_PARAMS = {
    fill: "#c3c3c3",
    fillAfterStrokeEnabled: true,
    shadowForStrokeEnabled: false,
};

export function getSnappedWorldPointer(stage, ctx) {
    const ptr = stage.getPointerPosition();
    if (!ptr) return;

    const { gridSize, snapToGrid } = ctx.getGrid();
    const worldPos = toWorld(stage, ptr);
    return snapPointToGrid(worldPos, gridSize, snapToGrid);
}

export function computeDragBox(
    start,
    cur,
    { alt = false, shift = false, minSize = 0 } = {},
) {
    let left = Math.min(start.x, cur.x);
    let top = Math.min(start.y, cur.y);
    let w = Math.abs(cur.x - start.x);
    let h = Math.abs(cur.y - start.y);

    if (alt) {
        const absDx = Math.abs(cur.x - start.x);
        const absDy = Math.abs(cur.y - start.y);
        w = absDx * 2;
        h = absDy * 2;
        left = start.x - w / 2;
        top = start.y - h / 2;
    }

    if (shift) {
        const size = Math.max(w, h);
        w = size;
        h = size;
        if (!alt) {
            left = cur.x < start.x ? start.x - w : start.x;
            top = cur.y < start.y ? start.y - h : start.y;
        } else {
            left = start.x - w / 2;
            top = start.y - h / 2;
        }
    }

    if (w < minSize || h < minSize) return null;

    const centerX = left + w / 2;
    const centerY = top + h / 2;

    return {
        left,
        top,
        width: w,
        height: h,
        centerX,
        centerY,
        radiusX: w / 2,
        radiusY: h / 2,
    };
}

export function computeDragLine(start, cur, minSize = 4) {
    const dx = cur.x - start.x;
    const dy = cur.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < minSize) return null;
    return { x1: start.x, y1: start.y, x2: cur.x, y2: cur.y, dx, dy, distance };
}

export function buildPolygon(
    radiusX,
    radiusY,
    sides,
    startAngle = -Math.PI / 2,
) {
    const pts = [];
    const step = (Math.PI * 2) / sides;

    for (let i = 0; i < sides; i++) {
        const angle = startAngle + i * step;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        pts.push(x, y);
    }

    return pts;
}
