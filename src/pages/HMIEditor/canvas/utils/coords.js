export function toWorld(stage, point) {
    const tr = stage.getAbsoluteTransform().copy();
    tr.invert();
    return tr.point(point);
}

export function toAbs(stage, worldPoint) {
    const t = stage.getAbsoluteTransform().copy();
    return t.point(worldPoint); // world -> abs
}
