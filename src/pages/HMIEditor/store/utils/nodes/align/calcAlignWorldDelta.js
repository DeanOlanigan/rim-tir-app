import { ALIGN_OPS } from "@/pages/HMIEditor/constants";

export function calcAlignWorldDelta(alignType, nodeBBox, targetBBox) {
    const nodeCx = nodeBBox.x + nodeBBox.width / 2;
    const nodeCy = nodeBBox.y + nodeBBox.height / 2;
    const targetCx = targetBBox.x + targetBBox.width / 2;
    const targetCy = targetBBox.y + targetBBox.height / 2;

    switch (alignType) {
        case ALIGN_OPS.LEFT:
            return { dx: targetBBox.x - nodeBBox.x, dy: 0 };
        case ALIGN_OPS.RIGHT:
            return {
                dx:
                    targetBBox.x +
                    targetBBox.width -
                    (nodeBBox.x + nodeBBox.width),
                dy: 0,
            };
        case ALIGN_OPS.TOP:
            return { dx: 0, dy: targetBBox.y - nodeBBox.y };
        case ALIGN_OPS.BOTTOM:
            return {
                dx: 0,
                dy:
                    targetBBox.y +
                    targetBBox.height -
                    (nodeBBox.y + nodeBBox.height),
            };
        case ALIGN_OPS.HCENTER:
            return { dx: targetCx - nodeCx, dy: 0 };
        case ALIGN_OPS.VCENTER:
            return { dx: 0, dy: targetCy - nodeCy };
        default:
            return { dx: 0, dy: 0 };
    }
}
