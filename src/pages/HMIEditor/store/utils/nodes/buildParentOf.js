import { SHAPES } from "@/pages/HMIEditor/constants";

export function buildParentOf(nodes, rootIds) {
    const parentOf = {};
    const stack = [...(rootIds ?? [])];

    while (stack.length) {
        const id = stack.pop();
        const n = nodes[id];
        if (!n || n.type !== SHAPES.group) continue;
        const kids = n.childrenIds;
        if (!Array.isArray(kids) || !kids.length) continue;
        for (const childId of n.childrenIds) {
            if (typeof childId !== "string") continue;
            if (!parentOf[childId]) parentOf[childId] = n.id;
            stack.push(childId);
        }
    }
    return parentOf;
}
