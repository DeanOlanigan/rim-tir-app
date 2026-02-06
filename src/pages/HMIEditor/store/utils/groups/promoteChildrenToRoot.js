import { addRootId } from "./addRootId";
import { calcChildTransform } from "../geometry/calcChildTransform";
import { removeRootId } from "./removeRootId";
import { getNodeLocalTransformMatrix } from "@/pages/HMIEditor/utils/getNodeLocalTransformMatrix";

export function promoteChildrenToRoot({ nodes, rootIds, groupNode }) {
    const G = getNodeLocalTransformMatrix(groupNode);

    let newNodes = { ...nodes };
    let newRootIds = removeRootId(rootIds, groupNode.id);
    const promotedIds = [];

    for (const childId of groupNode.childrenIds ?? []) {
        const child = nodes[childId];
        if (!child) continue;

        const { x, y, rotation } = calcChildTransform(G, child);

        newNodes[childId] = { ...child, x, y, rotation };
        newRootIds = addRootId(newRootIds, childId);
        promotedIds.push(childId);
    }

    delete newNodes[groupNode.id];
    return { newNodes, newRootIds, promotedIds };
}
