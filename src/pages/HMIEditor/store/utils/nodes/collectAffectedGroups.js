import { SHAPES } from "@/pages/HMIEditor/constants";

export function collectAffectedGroups(parentsToFix, nodes) {
    const affectedGroups = new Set();
    for (const pid of parentsToFix) {
        if (nodes[pid]?.type === SHAPES.group) affectedGroups.add(pid);
    }
    return affectedGroups;
}
