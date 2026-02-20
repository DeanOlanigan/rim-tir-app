import { matTRKS } from "./matrix";
import { isHasRadius } from "./geometry";

export function getNodeLocalTransformMatrix(node) {
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    const rot = node.rotation ?? 0;

    const skewX = node.skewX ?? 0;
    const skewY = node.skewY ?? 0;
    const scaleX = node.scaleX ?? 1;
    const scaleY = node.scaleY ?? 1;

    // ellipse: в сторе x/y = top-left bbox, а в konva x/y = center
    if (isHasRadius(node.type)) {
        const w = node.width ?? 0;
        const h = node.height ?? 0;
        //return matTR(x + w / 2, y + h / 2, rot);
        return matTRKS(x + w / 2, y + h / 2, rot, skewX, skewY, scaleX, scaleY);
    }

    // остальные: x/y как есть
    //return matTR(x, y, rot);
    return matTRKS(x, y, rot, skewX, skewY, scaleX, scaleY);
}
