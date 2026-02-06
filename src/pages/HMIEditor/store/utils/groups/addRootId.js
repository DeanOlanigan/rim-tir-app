export function addRootId(rootIds, id) {
    return rootIds.includes(id) ? rootIds : rootIds.concat(id);
}
