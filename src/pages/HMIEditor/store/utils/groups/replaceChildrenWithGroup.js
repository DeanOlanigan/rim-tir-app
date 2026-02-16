export function replaceChildrenWithGroup(
    containerIds,
    childIds,
    groupId,
    where = "max",
) {
    const remove = new Set(childIds);

    const indices = [];
    for (let i = 0; i < containerIds.length; i++) {
        if (remove.has(containerIds[i])) indices.push(i);
    }
    if (indices.length === 0) return null;

    const pivot = where === "min" ? Math.min(...indices) : Math.max(...indices);

    // дети в порядке слоёв контейнера
    const orderedChildIds = containerIds.filter((id) => remove.has(id));

    // replace “на месте” (важно для predictability)
    const next = [];
    for (let i = 0; i < containerIds.length; i++) {
        const id = containerIds[i];
        if (remove.has(id)) {
            if (i === pivot) next.push(groupId);
            continue;
        }
        next.push(id);
    }

    return {
        nextContainerIds: next,
        orderedChildIds,
        insertIndex: next.indexOf(groupId),
    };
}
