import { useCallback, useEffect, useRef } from "react";
import { useActionsStore } from "../store/actions-store";
import { setEquals, toSet } from "./helpers";

function getTreeFocusId(tree) {
    return tree?.mostRecentNode?.id ?? tree?.focusedNode?.id ?? null;
}

function reorderByTarget(ids, target) {
    if (!target) return ids;
    const out = [];
    for (const id of ids) if (id !== target) out.push(id);
    out.push(target);
    return out;
}

function applyMultiSelection(tree, ids, targetId) {
    tree.deselectAll();
    if (!ids.length) return;

    const ordered = reorderByTarget(ids, targetId);
    tree.select(ordered[0]);
    for (let i = 1; i < ordered.length; i++) {
        tree.selectMulti(ordered[i]);
    }

    if (targetId) tree.focus(targetId);
}

function focusStageContainer(api) {
    const stage = api.getStage();
    const el = stage?.container?.();
    if (!el) return;
    if (el.tabIndex < 0) el.tabIndex = 0;
    el.focus({ preventScroll: true });
    useActionsStore.getState().setFocusOwner("canvas");
}

function shouldReturnFocusToCanvas(focusOwner, tree) {
    return focusOwner !== "nodesTree" && !tree.isEditing;
}

/**
 * Синхронизирует selectedIds (из стора) -> arborist Tree selection.
 * Без хранения меты в сторе.
 *
 * Возвращает:
 * - isReadyRef/isSyncingRef: чтобы в handleSelect гейтить обновления
 * - markSelectionFromTree(): чтобы пропускать обратный sync после shift+arrow в дереве
 */
export function useArboristSelectionSync({
    api,
    treeRef,
    selectedIds,
    canRenderTree,
    data,
}) {
    const isReadyRef = useRef(false);
    const isSyncingRef = useRef(false);

    // Если selectedIds обновились из дерева — дерево уже знает “правильный” focus/anchor.
    // Поэтому следующий sync (store -> tree) лучше пропустить.
    const skipNextSyncRef = useRef(false);

    const markSelectionFromTree = useCallback(() => {
        skipNextSyncRef.current = true;
    }, []);

    useEffect(() => {
        if (!canRenderTree) return;

        const tree = treeRef.current;
        if (!tree) return;

        // 1) Если апдейт пришёл из дерева — обычно ничего делать не надо
        if (skipNextSyncRef.current) {
            skipNextSyncRef.current = false;
            if (setEquals(tree.selectedIds, toSet(selectedIds))) return;
            // если вдруг дерево уже не совпадает (редко) — продолжим обычный sync
        }

        isReadyRef.current = false;
        isSyncingRef.current = true;

        // 2) Выбираем targetId так, чтобы не ломать “курсор” при активном дереве
        const focusOwner = useActionsStore.getState().focusOwner;
        const prevFocusId =
            focusOwner === "nodesTree" ? getTreeFocusId(tree) : null;

        const targetId =
            prevFocusId && selectedIds.includes(prevFocusId)
                ? prevFocusId
                : selectedIds[selectedIds.length - 1];

        applyMultiSelection(tree, selectedIds, targetId);

        // 3) Держим syncing ещё кадр, чтобы проглотить поздний onSelect от arborist
        let raf = 0;
        let t = 0;

        raf = requestAnimationFrame(() => {
            isSyncingRef.current = false;
            isReadyRef.current = true;

            if (shouldReturnFocusToCanvas(focusOwner, tree)) {
                t = setTimeout(() => focusStageContainer(api), 0);
            }
        });

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t);
        };
    }, [api, canRenderTree, selectedIds, data, treeRef]);

    return {
        isReadyRef,
        isSyncingRef,
        markSelectionFromTree,
    };
}
