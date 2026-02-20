import { SHAPES } from "@/pages/HMIEditor/constants";
import { recalcGroupBBoxDraft } from "./recalcGroupBBoxDRAFT";

function collectAncestors(nodes, startIds) {
    const set = new Set();
    const stack = [...startIds];

    while (stack.length) {
        const id = stack.pop();
        if (!id || set.has(id)) continue;

        const n = nodes[id];
        if (!n || n.type !== SHAPES.group) continue;

        set.add(id);

        const pid = n.parentId ?? null;
        if (pid) stack.push(pid);
    }

    return [...set];
}

function depthOf(nodes, id, memo) {
    if (memo.has(id)) return memo.get(id);
    let d = 0;
    let p = nodes[id]?.parentId ?? null;
    while (p) {
        d++;
        p = nodes[p]?.parentId ?? null;
    }
    memo.set(id, d);
    return d;
}

export function recalcGroupsUpwardsDraft(nodes, startGroupIds) {
    const ids = collectAncestors(nodes, startGroupIds);
    if (ids.length === 0) return false;

    const memo = new Map();
    ids.sort((a, b) => depthOf(nodes, b, memo) - depthOf(nodes, a, memo));

    let changed = false;
    for (const gid of ids) {
        if (recalcGroupBBoxDraft(nodes, gid)) changed = true;
    }
    return changed;
}
