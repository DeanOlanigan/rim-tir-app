import { decomposeTRKS, mul } from "@/pages/HMIEditor/utils";
import { isHasRadius } from "@/pages/HMIEditor/utils/geometry";
import { getNodeLocalTransformMatrix } from "@/pages/HMIEditor/utils/getNodeLocalTransformMatrix";

export function calcChildTransform(groupMatrix, childNode) {
    const C = getNodeLocalTransformMatrix(childNode);
    const W = mul(groupMatrix, C);
    const { x, y, rotation, skewX, skewY, scaleX, scaleY } = decomposeTRKS(W);

    let newX = x;
    let newY = y;

    if (isHasRadius(childNode.type)) {
        newX = newX - childNode.width / 2;
        newY = newY - childNode.height / 2;
    }
    return {
        x: newX,
        y: newY,
        rotation,
        skewX,
        skewY,
        scaleX,
        scaleY,
    };
}
