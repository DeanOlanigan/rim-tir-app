import { SHAPES } from "@/pages/HMIEditor/constants";

export function buildParentOf(nodes) {
    const parentOf = {};
    for (const n of Object.values(nodes)) {
        if (!n || n.type !== SHAPES.group) continue;
        const kids = n.childrenIds;
        if (!Array.isArray(kids)) continue;
        for (const childId of kids) {
            if (typeof childId !== "string") continue;
            if (parentOf[childId] == null) parentOf[childId] = n.id; // один родитель
        }
    }
    return parentOf;
}
