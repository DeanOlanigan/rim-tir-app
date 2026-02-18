import { arraysEqual } from "@/utils/utils";

/**
 * Сборка финального объекта patch для runCommand
 */
export function buildReorderResponse({
    state,
    pageId,
    page,
    newRootIds,
    nodesPatch,
}) {
    const patch = {};
    const rootChanged = !arraysEqual(newRootIds, page.rootIds ?? []);

    // Обновляем страницу только если rootIds изменились
    if (rootChanged) {
        patch.pages = {
            ...state.pages,
            [pageId]: {
                ...page,
                rootIds: newRootIds,
            },
        };
    }

    // Обновляем ноды только если были изменения внутри контейнеров
    if (nodesPatch) {
        patch.nodes = nodesPatch;
    }

    return {
        patch,
        dirty: true,
        tree: true,
    };
}
