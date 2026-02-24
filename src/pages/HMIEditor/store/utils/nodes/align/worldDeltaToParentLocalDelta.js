import { applyToPoint, inv, round4 } from "@/pages/HMIEditor/utils";
import { getParentWorldTransformMatrix } from "../../geometry/getParentWorldTransformMatrix";

/**
 * Перевод вектора смещения из world-space в local-space родителя узла.
 * Через две точки (устойчиво к translation).
 */
export function worldDeltaToParentLocalDelta(nodes, id, dxWorld, dyWorld) {
    const parentWorld = getParentWorldTransformMatrix(nodes, id);

    if (!parentWorld) {
        return { dx: round4(dxWorld), dy: round4(dyWorld) };
    }

    const invParent = inv(parentWorld);
    const p0 = applyToPoint(invParent, 0, 0);
    const p1 = applyToPoint(invParent, dxWorld, dyWorld);

    return {
        dx: round4(p1.x - p0.x),
        dy: round4(p1.y - p0.y),
    };
}
