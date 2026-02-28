import { isHasRadius, isLineLikeType } from "@/pages/HMIEditor/utils/geometry";

export function getNodeLocalBounds(node) {
    const w = node.width ?? 0;
    const h = node.height ?? 0;

    if (isLineLikeType(node.type)) {
        return getLineLocalBounds(node);
    }

    if (isHasRadius(node.type)) {
        return { x: -w / 2, y: -h / 2, width: w, height: h };
    }

    return { x: 0, y: 0, width: w, height: h };
}

function getLineLocalBounds(node) {
    const pts = node.points ?? [0, 0];
    if (pts.length < 2) return { x: 0, y: 0, width: 0, height: 0 };

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < pts.length; i += 2) {
        const x = pts[i];
        const y = pts[i + 1];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
