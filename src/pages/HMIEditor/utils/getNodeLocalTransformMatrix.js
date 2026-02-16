import { matTR } from "./matrix";
import { isHasRadius } from "./geometry";

export function getNodeLocalTransformMatrix(node) {
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    const rot = node.rotation ?? 0;

    // ellipse: в сторе x/y = top-left bbox, а в konva x/y = center
    if (isHasRadius(node.type)) {
        const w = node.width ?? 0;
        const h = node.height ?? 0;
        return matTR(x + w / 2, y + h / 2, rot);
    }

    // остальные: x/y как есть
    return matTR(x, y, rot);
}
