import { isHasRadius } from "@/pages/HMIEditor/utils/geometry";

export function getNodeLocalBounds(node) {
    const w = node.width ?? 0;
    const h = node.height ?? 0;

    if (isHasRadius(node.type)) {
        return { x: -w / 2, y: -h / 2, width: w, height: h };
    }

    return { x: 0, y: 0, width: w, height: h };
}
