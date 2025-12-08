export function toWorld(stage, point) {
    const tr = stage.getAbsoluteTransform().copy();
    tr.invert();
    return tr.point(point);
}

export function toAbs(stage, worldPoint) {
    const t = stage.getAbsoluteTransform().copy();
    return t.point(worldPoint); // world -> abs
}

// not used
export function absRectToWorld(stage, rect) {
    const p1 = toWorld(stage, { x: rect.x, y: rect.y });
    const p2 = toWorld(stage, {
        x: rect.x + rect.width,
        y: rect.y + rect.height,
    });
    return {
        x: Math.min(p1.x, p2.x),
        y: Math.min(p1.y, p2.y),
        width: Math.abs(p2.x - p1.x),
        height: Math.abs(p2.y - p1.y),
        rotation: rect.rotation || 0,
    };
}

// not used
export function worldRectToAbs(stage, rect) {
    const p1 = toAbs(stage, { x: rect.x, y: rect.y });
    const p2 = toAbs(stage, {
        x: rect.x + rect.width,
        y: rect.y + rect.height,
    });
    return {
        x: Math.min(p1.x, p2.x),
        y: Math.min(p1.y, p2.y),
        width: Math.abs(p2.x - p1.x),
        height: Math.abs(p2.y - p1.y),
        rotation: rect.rotation || 0,
    };
}
