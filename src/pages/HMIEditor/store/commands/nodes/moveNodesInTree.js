import { SHAPES } from "@/pages/HMIEditor/constants";
import {
    pruneNestedSelection,
    recalcGroupsUpwardsDraft,
} from "../../utils/groups";
import { runCommand } from "../runCommand";
import { arraysEqual } from "@/utils/utils";
import { calcChildTransform } from "../../utils/geometry";
import {
    getNodeLocalTransformMatrix,
    I,
    inv,
    mul,
} from "@/pages/HMIEditor/utils";

function getWorldMatrix(nodes, parentId) {
    // identity в формате твоих матриц:
    let M = I;
    const chain = [];
    let p = parentId;
    while (p) {
        const n = nodes[p];
        if (!n) break;
        chain.push(n);
        p = n.parentId ?? null;
    }
    // от корня к листу
    for (let i = chain.length - 1; i >= 0; i--) {
        const L = getNodeLocalTransformMatrix(chain[i]);
        M = mul(M, L);
    }
    return M;
}

/**
 * Перепривязка набора узлов к новому parentId с сохранением world-трансформа.
 * nodes: объект нод (можно мутировать копию)
 */
function reparentNodesKeepWorld(nodes, moveIds, newParentId) {
    const Wnew = getWorldMatrix(nodes, newParentId ?? null);
    const invWnew = inv(Wnew);
    if (!invWnew) return null;

    for (const id of moveIds) {
        const n = nodes[id];
        if (!n) continue;

        const WoldParent = getWorldMatrix(nodes, n.parentId ?? null);

        // матрица перевода локальных координат:
        // LocalNew = inv(Wnew) * WoldParent * LocalOld
        const M = mul(invWnew, WoldParent);

        const { x, y, rotation, skewX, skewY, scaleX, scaleY } =
            calcChildTransform(M, n);

        nodes[id] = {
            ...n,
            parentId: newParentId ?? null,
            x,
            y,
            rotation,
            skewX,
            skewY,
            scaleX,
            scaleY,
        };
    }

    return nodes;
}

function getContainerIds(state, page, parentId) {
    if (parentId === null) return page.rootIds ?? [];
    return state.nodes[parentId]?.childrenIds ?? [];
}

function removeFromContainer(containerIds, moveSet) {
    const movedOrdered = [];
    const rest = [];
    for (const id of containerIds) {
        if (moveSet.has(id)) movedOrdered.push(id);
        else rest.push(id);
    }
    return { rest, movedOrdered };
}

function insertAt(arr, index, items) {
    const i = Math.max(0, Math.min(index ?? arr.length, arr.length));
    const next = arr.slice();
    next.splice(i, 0, ...items);
    return next;
}

function isDescendant(nodes, maybeAncestorId, nodeId) {
    let p = nodes[nodeId]?.parentId ?? null;
    while (p) {
        if (p === maybeAncestorId) return true;
        p = nodes[p]?.parentId ?? null;
    }
    return false;
}

function isTargetInsideMovedSubtree(nodes, targetParentId, movedIds) {
    if (!targetParentId) return false;
    for (const id of movedIds) {
        if (id === targetParentId) return true;
        if (isDescendant(nodes, id, targetParentId)) return true;
    }
    return false;
}

export const moveNodesInTreeCommand = (api, dragIds, targetParentId, index) => {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    runCommand(api, "cmd/nodes/moveNodesInTree", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        // 1) нормализуем набор переносимых (убираем вложенных)
        const moveIds = pruneNestedSelection(dragIds ?? [], state.nodes);
        if (!moveIds.length) return null;

        const newParentId = targetParentId ?? null;

        // 2) валидация контейнера (если у тебя дети допустимы только у group)
        if (newParentId !== null) {
            const p = state.nodes[newParentId];
            if (!p) return null;
            if (p.type !== SHAPES.group) return null;
        }

        // 3) запрет циклов
        if (isTargetInsideMovedSubtree(state.nodes, newParentId, moveIds)) {
            return null;
        }

        // 4) считаем исходный parentId — ВАЖНО:
        // react-arborist onMove обычно отдаёт dragIds из одного контейнера
        // но если вдруг нет — делаем "лучшее усилие": берем parent первого
        const first = state.nodes[moveIds[0]];
        if (!first) return null;
        const oldParentId = first.parentId ?? null;

        // (Опционально) можно жёстко требовать один parent для всех:
        for (const id of moveIds) {
            const n = state.nodes[id];
            if (!n) return null;
            if ((n.parentId ?? null) !== oldParentId) return null;
        }

        const moveSet = new Set(moveIds);

        // 5) получаем контейнеры
        const srcContainer = getContainerIds(state, page, oldParentId);
        const dstContainer =
            oldParentId === newParentId
                ? srcContainer
                : getContainerIds(state, page, newParentId);

        // 6) удаляем из src
        const { rest: srcRest, movedOrdered } = removeFromContainer(
            srcContainer,
            moveSet,
        );
        if (!movedOrdered.length) return null;

        // 7) формируем dst (если тот же контейнер — вставляем в srcRest)
        const dstBase =
            oldParentId === newParentId ? srcRest : dstContainer.slice();

        const nextDst = insertAt(dstBase, index, movedOrdered);

        // если перенос в другой контейнер, то src тоже меняется
        const nextSrc = oldParentId === newParentId ? nextDst : srcRest;

        // 8) собираем новый nodes/pages
        let nextNodes = state.nodes;
        let nextPages = state.pages;

        // 8.1) обновляем контейнеры
        if (oldParentId === null) {
            nextPages = {
                ...nextPages,
                [pageId]: { ...page, rootIds: nextSrc },
            };
        } else {
            const p = nextNodes[oldParentId];
            if (p) {
                nextNodes = {
                    ...nextNodes,
                    [oldParentId]: { ...p, childrenIds: nextSrc },
                };
            }
        }

        if (newParentId !== oldParentId) {
            if (newParentId === null) {
                nextPages = {
                    ...nextPages,
                    [pageId]: { ...nextPages[pageId], rootIds: nextDst },
                };
            } else {
                const p = nextNodes[newParentId] ?? state.nodes[newParentId];
                if (!p) return null;
                nextNodes = {
                    ...nextNodes,
                    [newParentId]: { ...p, childrenIds: nextDst },
                };
            }

            // 8.2) пересчёт локальных трансформов + parentId
            const nodesCopy = { ...nextNodes };
            const reparented = reparentNodesKeepWorld(
                nodesCopy,
                movedOrdered,
                newParentId,
            );
            if (!reparented) return null;
            nextNodes = reparented;
        }

        // 9) если это влияет на bbox групп — пересчитать вверх
        // минимально: старый parent и новый parent (если это группы)
        const affected = new Set();
        if (oldParentId) affected.add(oldParentId);
        if (newParentId) affected.add(newParentId);
        if (affected.size) {
            const nodesCopy = { ...nextNodes };
            recalcGroupsUpwardsDraft(nodesCopy, affected);
            nextNodes = nodesCopy;
        }

        // 10) если нет реальных изменений — не пушим историю
        const rootChanged = !arraysEqual(
            nextPages[pageId]?.rootIds ?? [],
            page.rootIds ?? [],
        );
        const nodesChanged = nextNodes !== state.nodes;
        if (!rootChanged && !nodesChanged) return null;

        return {
            patch: {
                pages: nextPages,
                nodes: nextNodes,
            },
            dirty: true,
            tree: true,
            selection: "set",
            selectedIds: movedOrdered,
        };
    });
};
