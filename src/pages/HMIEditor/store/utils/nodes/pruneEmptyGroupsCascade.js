import { SHAPES } from "@/pages/HMIEditor/constants";

/**
 * Логика каскадного удаления пустых групп вынесена сюда.
 * Это резко снижает когнитивную сложность основной функции.
 */
export function pruneEmptyGroupsCascade({
    nodes,
    rootIds,
    initialQueue,
    deleteSet,
}) {
    const extraDeleted = new Set();
    const queue = [...initialQueue];
    // Работаем с ссылкой на объект nodes, так как он уже скопирован в основной функции
    // Но для чистоты можно считать, что мы мутируем локальную копию newNodes
    const currentNodes = nodes;
    let currentRootIds = rootIds;

    while (queue.length) {
        const gid = queue.pop();
        if (!shouldProcessGroup(gid, currentNodes, deleteSet, extraDeleted)) {
            continue;
        }

        // Группа пуста -> помечаем на удаление
        extraDeleted.add(gid);

        const g = currentNodes[gid];
        const parentId = g.parentId ?? null;

        // Удаляем ссылку на эту группу из родителя или корня
        if (parentId === null) {
            currentRootIds = currentRootIds.filter((id) => id !== gid);
        } else {
            updateParentAfterCascade(currentNodes, parentId, gid, queue);
        }

        delete currentNodes[gid];
    }

    return {
        nodes: currentNodes,
        rootIds: currentRootIds,
        extraDeleted,
    };
}

/**
 * Хелпер для проверки, нужно ли обрабатывать группу в каскаде
 */
function shouldProcessGroup(gid, nodes, deleteSet, extraDeleted) {
    if (!gid) return false;
    if (deleteSet.has(gid) || extraDeleted.has(gid)) return false;

    const g = nodes[gid];
    // Если это не группа или у неё еще остались дети — пропускаем
    if (!g || g.type !== SHAPES.group) return false;
    if ((g.childrenIds?.length ?? 0) > 0) return false;

    return true;
}

/**
 * Обновление родителя при каскадном удалении
 */
function updateParentAfterCascade(nodes, parentId, childIdToRemove, queue) {
    const parent = nodes[parentId];
    if (!parent) return;

    const prevKids = parent.childrenIds ?? [];
    const nextKids = prevKids.filter((id) => id !== childIdToRemove);

    if (nextKids.length !== prevKids.length) {
        nodes[parentId] = {
            ...parent,
            childrenIds: nextKids,
        };
    }
    // Добавляем родителя в очередь, так как он тоже мог опустеть
    queue.push(parentId);
}
