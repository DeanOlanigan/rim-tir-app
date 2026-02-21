import { buildIndexesFromNodes } from "../../utils/bindings";
import { prepareInsertFromPayload } from "../../utils/clipboard/prepareInsert";
import { recalcGroupsUpwardsDraft } from "../../utils/groups";

/** ---------------- insertion strategy ---------------- */

function insertAfter(containerIds, pairs /* [{oldId,newId}] */) {
    if (!pairs?.length) return containerIds;

    const index = new Map(containerIds.map((id, i) => [id, i]));
    const present = [];
    const missing = [];

    for (const p of pairs) {
        if (!p?.newId) continue;
        (index.has(p.oldId) ? present : missing).push(p);
    }

    present.sort((a, b) => index.get(a.oldId) - index.get(b.oldId));

    const out = [...containerIds];
    let shift = 0;

    for (const p of present) {
        const i = index.get(p.oldId) + 1 + shift;
        out.splice(i, 0, p.newId);
        shift++;
    }

    for (const p of missing) out.push(p.newId);
    return out;
}

function appendEnd(containerIds, pairs) {
    return [...containerIds, ...pairs.map((p) => p.newId).filter(Boolean)];
}

function applyInsertStrategy(containerIds, pairs, strategy) {
    return strategy === "after"
        ? insertAfter(containerIds, pairs)
        : appendEnd(containerIds, pairs);
}

/** ---------------- plan building ---------------- */

function getActivePage(state) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    return page ? { pageId, page } : null;
}

function buildPairs(oldRootIds, idMap) {
    return oldRootIds
        .map((oldId) => ({ oldId, newId: idMap?.[oldId] }))
        .filter((p) => p.newId);
}

function groupPairsByParent(pairs, nodes) {
    const byParent = new Map(); // pid|null -> pairs[]
    for (const p of pairs) {
        const pid = nodes[p.newId]?.parentId ?? null;
        const list = byParent.get(pid) ?? [];
        list.push(p);
        byParent.set(pid, list);
    }
    return byParent;
}

function detachPairsToRoot(pairs, nodes) {
    if (!pairs?.length) return;
    for (const p of pairs) {
        const n = nodes[p.newId];
        if (!n) continue;
        if ((n.parentId ?? null) === null) continue;
        nodes[p.newId] = { ...n, parentId: null };
    }
}

function applyPairsToParentChildren({ nodes, parentId, pairs, strategy }) {
    const parent = nodes[parentId];
    if (!parent || !Array.isArray(parent.childrenIds)) return false;

    const nextChildren = applyInsertStrategy(
        parent.childrenIds,
        pairs,
        strategy,
    );
    nodes[parentId] = { ...parent, childrenIds: nextChildren };
    return true;
}

function collectRecalcStartGroupIds(rootIdsToInsert, nodes) {
    const set = new Set();
    for (const rid of rootIdsToInsert) {
        const pid = nodes[rid]?.parentId ?? null;
        if (pid) set.add(pid);
    }
    return [...set];
}

function runRecalcUpwards(nodes, startGroupIds) {
    for (const gid of startGroupIds) {
        // ожидаем, что функция возвращает новый nodes (COW)
        recalcGroupsUpwardsDraft(nodes, gid);
    }
}

/**
 * Возвращает:
 * - nextNodes (копия nodes с применёнными childrenIds у родителей)
 * - nextRootIds
 * - affectedGroupIds (для recalc)
 */
function applyRespectRootParentPlan({ page, nodes, payload, prepared, opts }) {
    const strategy = opts.insertStrategy ?? "after";
    const pairs = buildPairs(payload.rootIds, prepared.idMap);
    const byParent = groupPairsByParent(pairs, nodes);

    // 1) корень страницы
    const rootPairs = byParent.get(null) ?? [];
    let nextRootIds = applyInsertStrategy(page.rootIds, rootPairs, strategy);

    // 2) родители (группы/контейнеры)
    const fallbackToRoot = [];
    const affectedGroupIds = [];

    for (const [pid, pidPairs] of byParent.entries()) {
        if (pid === null) continue;

        const ok = applyPairsToParentChildren({
            nodes,
            parentId: pid,
            pairs: pidPairs,
            strategy,
        });

        if (ok) affectedGroupIds.push(pid);
        else fallbackToRoot.push(...pidPairs);
    }

    // 3) фолбек: если parent невалиден — уводим в корень
    if (fallbackToRoot.length) {
        detachPairsToRoot(fallbackToRoot, nodes);
        nextRootIds = applyInsertStrategy(
            nextRootIds,
            fallbackToRoot,
            strategy,
        );
    }

    return { nextNodes: nodes, nextRootIds, affectedGroupIds };
}

function applyDefaultRootInsertPlan({ page, nodes, prepared }) {
    return {
        nextNodes: nodes,
        nextRootIds: [...page.rootIds, ...prepared.rootIdsToInsert],
        affectedGroupIds: [],
    };
}

/** ---------------- patch assembly ---------------- */

function withIndexesIfNeeded(state, patchNodes, patch) {
    if (!state.nodeIndex && !state.varIndex) return patch;

    const { nodeIndex, varIndex } = buildIndexesFromNodes(patchNodes);
    return { ...patch, nodeIndex, varIndex };
}

/**
 * opts:
 * - respectRootParent?: boolean
 * - insertStrategy?: "after" | "end"
 * - recalcGroups?: boolean
 */
export function buildInsertPatch(state, payload, placement, opts = {}) {
    const ctx = getActivePage(state);
    if (!ctx) return null;
    const { pageId, page } = ctx;

    const respectRootParent = !!opts.respectRootParent;
    const prepared = prepareInsertFromPayload(payload, placement, {
        keepRootParent: respectRootParent,
    });
    if (!prepared) return null;

    const mergedNodes = { ...state.nodes, ...prepared.nodesToInsert };

    let plan;
    if (respectRootParent) {
        plan = applyRespectRootParentPlan({
            page,
            nodes: mergedNodes,
            payload,
            prepared,
            opts,
        });
    } else {
        plan = applyDefaultRootInsertPlan({
            page,
            nodes: mergedNodes,
            prepared,
        });
    }

    let finalNodes = plan.nextNodes;
    if (opts.recalcGroups) {
        const startIds = opts.respectRootParent
            ? plan.affectedGroupIds
            : collectRecalcStartGroupIds(plan.rootIdsToInsert, finalNodes);

        if (startIds.length) {
            runRecalcUpwards(finalNodes, startIds);
        }
    }

    const nextPage = { ...page, rootIds: plan.nextRootIds };
    const basePatch = {
        nodes: finalNodes,
        pages: { ...state.pages, [pageId]: nextPage },
    };

    const patch = withIndexesIfNeeded(state, finalNodes, basePatch);

    return { patch, insertedRootIds: prepared.rootIdsToInsert };
}
