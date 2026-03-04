import { isHasRadius, isLineLikeType } from "./geometry";
import { getNodeLocalTransformMatrix } from "./getNodeLocalTransformMatrix";

function getNodeLocalCorners(node) {
    const w = node.width || 0;
    const h = node.height || 0;

    if (isLineLikeType(node.type)) {
        const pts = node.points ?? [0, 0];
        const out = [];
        for (let i = 0; i < pts.length; i += 2) {
            out.push({ x: pts[i], y: pts[i + 1] });
        }
        return out.length ? out : [{ x: 0, y: 0 }];
    }

    if (isHasRadius(node.type)) {
        const hw = w / 2;
        const hh = h / 2;
        return [
            { x: -hw, y: -hh },
            { x: hw, y: -hh },
            { x: hw, y: hh },
            { x: -hw, y: hh },
        ];
    }

    return [
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: h },
        { x: 0, y: h },
    ];
}

export function calcGroupAABBCenter(nodesList) {
    let minX = Infinity,
        minY = Infinity;
    let maxX = -Infinity,
        maxY = -Infinity;

    nodesList.forEach((node) => {
        const M = getNodeLocalTransformMatrix(node);
        const pts = getNodeLocalCorners(node);

        for (let i = 0; i < pts.length; i++) {
            const gx = M.a * pts[i].x + M.c * pts[i].y + M.e;
            const gy = M.b * pts[i].x + M.d * pts[i].y + M.f;

            if (gx < minX) minX = gx;
            if (gx > maxX) maxX = gx;
            if (gy < minY) minY = gy;
            if (gy > maxY) maxY = gy;
        }
    });

    if (minX === Infinity) return { x: 0, y: 0 };

    return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
    };
}
