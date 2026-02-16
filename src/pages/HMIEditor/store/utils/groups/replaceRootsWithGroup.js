export function replaceRootsWithGroup(rootIds, childIds, groupId) {
    const remove = new Set(childIds);
    const idx = rootIds.findIndex((id) => remove.has(id));
    const filtered = rootIds.filter((id) => !remove.has(id));
    const insertAt = idx < 0 ? filtered.length : idx;
    filtered.splice(insertAt, 0, groupId);
    return filtered;
}
