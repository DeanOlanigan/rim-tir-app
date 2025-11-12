import { toWorld } from "./coords";

export function getOuterSize(node) {
    const sx = node.scaleX() ?? 1;
    const sy = node.scaleY() ?? 1;
    const w = (node.width() ?? 0) * sx;
    const h = (node.height() ?? 0) * sy;

    const sw = node.strokeEnabled?.() === false ? 0 : node.strokeWidth?.() ?? 0;
    const half = sw / 2;

    return { width: w + sw, height: h + sw, pad: half };
}

export function getBBox(node) {
    return node.getClientRect({ skipShadow: true, skipStroke: false });
}

export function clampPosInFrame(node, width, height, pos) {
    const { width: ow, height: oh, pad } = getOuterSize(node);
    const minX = pad;
    const minY = pad;
    const maxX = width - ow + pad;
    const maxY = height - oh + pad;
    return {
        x: Math.min(Math.max(pos.x, minX), maxX),
        y: Math.min(Math.max(pos.y, minY), maxY),
    };
}

export function clampRectInFrame(rect, frame) {
    const x = Math.max(rect.x, frame.x);
    const y = Math.max(rect.y, frame.y);
    const maxW = frame.x + frame.width - x;
    const maxH = frame.y + frame.height - y;
    return {
        x,
        y,
        width: Math.min(rect.width, maxW),
        height: Math.min(rect.height, maxH),
    };
}

// TODO fix
export const clampByBBox = (node, frame, pos) => {
    const stage = node.getStage();
    // временно выставим позицию, чтобы посчитать бокс в этой точке
    const old = node.position();
    node.position(pos);
    const boxAbs = getBBox(node); // { x, y, width, height } уже с учётом scale/rotation/stroke
    const box = toWorld(stage, { x: boxAbs.x, y: boxAbs.y });

    // если вылезает — сдвигаем так, чтобы box вписался
    let dx = 0,
        dy = 0;
    if (box.x < frame.x) dx = frame.x - box.x;
    if (box.y < frame.y) dy = frame.y - box.y;
    if (box.x + box.width > frame.x + frame.width)
        dx = frame.x + frame.width - (box.x + box.width);
    if (box.y + box.height > frame.y + frame.height)
        dy = frame.y + frame.height - (box.y + box.height);
    node.position(old); // откатили
    return { x: pos.x + dx, y: pos.y + dy };
};
