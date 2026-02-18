import { applyToPoint } from "@/pages/HMIEditor/utils/matrix";

export function aabbOfTransformedBounds(bounds, M) {
    const x0 = bounds.x;
    const y0 = bounds.y;
    const x1 = bounds.x + bounds.width;
    const y1 = bounds.y + bounds.height;

    const p1 = applyToPoint(M, x0, y0);
    const p2 = applyToPoint(M, x1, y0);
    const p3 = applyToPoint(M, x1, y1);
    const p4 = applyToPoint(M, x0, y1);

    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
