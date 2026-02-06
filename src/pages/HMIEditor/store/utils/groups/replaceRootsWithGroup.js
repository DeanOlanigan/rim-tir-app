export function replaceRootsWithGroup(rootIds, childIds, groupId) {
    return rootIds.filter((id) => !childIds.includes(id)).concat(groupId);
}
