import {
    addEventCommand,
    removeEventCommand,
    reorderEventsCommand,
    updateEventCommand,
} from "../commands";

export const createNodeEventsSlice = (api) => {
    return {
        // 1. Добавить новое действие в конец списка
        addNodeEventAction: (nodeId, eventType, action) =>
            addEventCommand(api, nodeId, eventType, action),

        // 2. Обновить конкретное действие (по patch.id)
        updateNodeEventAction: (nodeId, eventType, eventPatch) =>
            updateEventCommand(api, nodeId, eventType, eventPatch),

        // 3. Удалить действие
        removeNodeEventAction: (nodeId, eventType, actionId) =>
            removeEventCommand(api, nodeId, eventType, actionId),

        // 4. Перезаписать весь список действий для события
        // (Используется для Drag-and-Drop сортировки)
        reorderNodeEventActions: (nodeId, eventType, newActions) =>
            reorderEventsCommand(api, nodeId, eventType, newActions),
    };
};
