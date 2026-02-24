import { SHAPES } from "../constants";
import { round4 } from "./math";

export function isGroupType(type) {
    return type === SHAPES.group;
}

export function isLineLikeType(type) {
    return type === SHAPES.arrow || type === SHAPES.line;
}

export function isHasRadius(type) {
    return type === SHAPES.ellipse || type === SHAPES.polygon;
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

export function calcBBox(nodes) {
    const minX = round4(Math.min(...nodes.map((n) => n.x)));
    const minY = round4(Math.min(...nodes.map((n) => n.y)));
    const maxX = Math.max(...nodes.map((n) => n.x + n.width));
    const maxY = Math.max(...nodes.map((n) => n.y + n.height));
    return {
        x: minX,
        y: minY,
        width: round4(maxX - minX),
        height: round4(maxY - minY),
    };
}
