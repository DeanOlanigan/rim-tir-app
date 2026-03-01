export function applyRectPatch(konvaNode) {
    const patch = {
        x: konvaNode.x(),
        y: konvaNode.y(),
        width: konvaNode.width() * konvaNode.scaleX(),
        height: konvaNode.height() * konvaNode.scaleY(),
        rotation: konvaNode.rotation(),
        scaleX: 1,
        scaleY: 1,
        skewX: konvaNode.skewX(),
        skewY: konvaNode.skewY(),
    };
    konvaNode.x(patch.x);
    konvaNode.y(patch.y);
    konvaNode.width(patch.width);
    konvaNode.height(patch.height);
    konvaNode.rotation(patch.rotation);
    konvaNode.scaleX(1);
    konvaNode.scaleY(1);
    konvaNode.skewX(patch.skewX);
    konvaNode.skewY(patch.skewY);
    return patch;
}

export function applyEllipsePatch(konvaNode) {
    const rx = Math.abs(konvaNode.radiusX() * konvaNode.scaleX());
    const ry = Math.abs(konvaNode.radiusY() * konvaNode.scaleY());

    const cx = konvaNode.x();
    const cy = konvaNode.y();

    const x = cx - rx;
    const y = cy - ry;

    const patch = {
        x,
        y,
        width: rx * 2,
        height: ry * 2,
        rotation: konvaNode.rotation(),
        scaleX: 1,
        scaleY: 1,
        skewX: konvaNode.skewX(),
        skewY: konvaNode.skewY(),
    };

    konvaNode.x(cx);
    konvaNode.y(cy);
    konvaNode.radiusX(rx);
    konvaNode.radiusY(ry);
    konvaNode.rotation(patch.rotation);
    konvaNode.scaleX(1);
    konvaNode.scaleY(1);
    konvaNode.skewX(patch.skewX);
    konvaNode.skewY(patch.skewY);

    return patch;
}

export function applyLinePatch(konvaNode) {
    const sx = konvaNode.scaleX();
    const sy = konvaNode.scaleY();

    const oldPoints = konvaNode.points();
    const newPoints = [];
    for (let i = 0; i < oldPoints.length; i += 2) {
        const px = oldPoints[i];
        const py = oldPoints[i + 1];
        newPoints[i] = px * sx;
        newPoints[i + 1] = py * sy;
    }

    const patch = {
        x: konvaNode.x(),
        y: konvaNode.y(),
        width: konvaNode.width(),
        height: konvaNode.height(),
        rotation: konvaNode.rotation(),
        scaleX: 1,
        scaleY: 1,
        skewX: konvaNode.skewX(),
        skewY: konvaNode.skewY(),
        points: newPoints,
    };

    konvaNode.x(patch.x);
    konvaNode.y(patch.y);
    konvaNode.width(patch.width);
    konvaNode.height(patch.height);
    konvaNode.rotation(patch.rotation);
    konvaNode.scaleX(1);
    konvaNode.scaleY(1);
    konvaNode.skewX(patch.skewX);
    konvaNode.skewY(patch.skewY);
    konvaNode.points(newPoints);

    return patch;
}
