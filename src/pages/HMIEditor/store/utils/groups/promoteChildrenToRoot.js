import { addRootId } from "./addRootId";
import { calcChildTransform } from "../geometry/calcChildTransform";
import { removeRootId } from "./removeRootId";
import { getNodeLocalTransformMatrix } from "@/pages/HMIEditor/utils/getNodeLocalTransformMatrix";

// nodes - копия state.nodes
export function promoteChildrenToRoot({ newNodes, newRootIds, groupNode }) {
    const G = getNodeLocalTransformMatrix(groupNode);

    newRootIds = removeRootId(newRootIds, groupNode.id);
    const promotedIds = [];

    for (const childId of groupNode.childrenIds ?? []) {
        const child = newNodes[childId];
        if (!child) continue;

        const { x, y, rotation } = calcChildTransform(G, child);

        newNodes[childId] = { ...child, x, y, rotation };
        newRootIds = addRootId(newRootIds, childId);
        promotedIds.push(childId);
    }

    delete newNodes[groupNode.id];
    return { newNodes, newRootIds, promotedIds };
}
