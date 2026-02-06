import { SHAPES } from "@/pages/HMIEditor/constants";
import { matTR } from "./matrix";

export function getNodeLocalTransformMatrix(node) {
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    const rot = node.rotation ?? 0;

    // ellipse: в сторе x/y = top-left bbox, а в konva x/y = center
    if (node.type === SHAPES.ellipse) {
        const w = node.width ?? 0;
        const h = node.height ?? 0;
        return matTR(x + w / 2, y + h / 2, rot);
    }
    if (node.type === SHAPES.polygon) {
        const w = node.width ?? 0;
        const h = node.height ?? 0;
        return matTR(x + w / 2, y + h / 2, rot);
    }

    // остальные: x/y как есть
    return matTR(x, y, rot);
}
