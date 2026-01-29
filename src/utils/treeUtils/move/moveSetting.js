export function moveSettingUtil(settings, dragIds, parentId, index) {
    // 1) Сохраняем неизменённый settings для вычисления oldIndex
    const original = settings;

    // 2) Корректируем index так же, как в moveNodesUtil:
    const sameParentCount = dragIds.reduce((count, dragId) => {
        const oldParent = original[dragId].parentId;
        if (oldParent === parentId) {
            const oldIndex = original[oldParent]?.children?.indexOf(dragId);
            if (oldIndex != null && oldIndex < index) {
                return count + 1;
            }
        }
        return count;
    }, 0);
    // сдвиг вниз
    let insertPos = index - sameParentCount;
    if (insertPos < 0) insertPos = 0;

    let updatedSettings = { ...settings };
    dragIds.forEach((dragId) => {
        if (dragId === parentId) return;

        const draggedNode = updatedSettings[dragId];
        const parent = draggedNode.parentId;

        //if (parent === parentId) return;

        if (parent && updatedSettings[parent]?.children) {
            const filteredChildren = updatedSettings[parent].children.filter(
                (child) => child !== dragId,
            );

            updatedSettings = {
                ...updatedSettings,
                [parent]: {
                    ...updatedSettings[parent],
                    children: filteredChildren,
                },
            };
        }

        const updatedDragNode = {
            ...draggedNode,
            parentId: parentId,
        };

        updatedSettings = {
            ...updatedSettings,
            [dragId]: updatedDragNode,
        };

        if (parentId !== null) {
            const newParentChildren = updatedSettings[parentId]?.children ?? [];
            const before = newParentChildren.slice(0, insertPos);
            const after = newParentChildren.slice(insertPos);
            const child = [...before, dragId, ...after];

            updatedSettings = {
                ...updatedSettings,
                //[dragId]: updatedDragNode,
                [parentId]: {
                    ...updatedSettings[parentId],
                    children: child,
                },
            };
            insertPos++;
        } /*  else {
            updatedSettings = {
                ...updatedSettings,
                [dragId]: updatedDragNode,
            };
        } */
    });
    return updatedSettings;
}
