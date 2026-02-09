import { withDirty } from "../utils/withDirty";

export const createNodeEventsSlice = (set) => {
    const dirty = withDirty(set);

    return {
        // 1. Добавить новое действие в конец списка
        addNodeEventAction: dirty(
            "actions/addNodeEventAction",
            (nodeId, eventType, action) =>
                set(
                    (state) => {
                        const node = state.nodes[nodeId];
                        if (!node) return state;

                        const currentActions = node.events?.[eventType] || [];

                        return {
                            nodes: {
                                ...state.nodes,
                                [nodeId]: {
                                    ...node,
                                    events: {
                                        ...node.events,
                                        [eventType]: [
                                            ...currentActions,
                                            action,
                                        ],
                                    },
                                },
                            },
                        };
                    },
                    undefined,
                    "actions/addNodeEventAction",
                ),
        ),
        // 2. Обновить конкретное действие (по patch.id)
        updateNodeEventAction: dirty(
            "actions/updateNodeEventAction",
            (nodeId, eventType, patch) =>
                set(
                    (state) => {
                        const node = state.nodes[nodeId];
                        if (!node) return state;

                        const currentActions = node.events?.[eventType] || [];

                        // Находим и обновляем нужное действие
                        const newActions = currentActions.map((a) =>
                            a.id === patch.id ? { ...a, ...patch } : a,
                        );

                        return {
                            nodes: {
                                ...state.nodes,
                                [nodeId]: {
                                    ...node,
                                    events: {
                                        ...node.events,
                                        [eventType]: newActions,
                                    },
                                },
                            },
                        };
                    },
                    undefined,
                    "actions/updateNodeEventAction",
                ),
        ),
        // 3. Удалить действие
        removeNodeEventAction: dirty(
            "actions/removeNodeEventAction",
            (nodeId, eventType, actionId) =>
                set(
                    (state) => {
                        const node = state.nodes[nodeId];
                        if (!node) return state;

                        const currentActions = node.events?.[eventType] || [];

                        return {
                            nodes: {
                                ...state.nodes,
                                [nodeId]: {
                                    ...node,
                                    events: {
                                        ...node.events,
                                        [eventType]: currentActions.filter(
                                            (a) => a.id !== actionId,
                                        ),
                                    },
                                },
                            },
                        };
                    },
                    undefined,
                    "actions/removeNodeEventAction",
                ),
        ),
        // 4. Перезаписать весь список действий для события
        // (Используется для Drag-and-Drop сортировки)
        setNodeEventActions: dirty(
            "actions/setNodeEventActions",
            (nodeId, eventType, newActions) =>
                set(
                    (state) => {
                        const node = state.nodes[nodeId];
                        if (!node) return state;

                        return {
                            nodes: {
                                ...state.nodes,
                                [nodeId]: {
                                    ...node,
                                    events: {
                                        ...node.events,
                                        [eventType]: newActions,
                                    },
                                },
                            },
                        };
                    },
                    undefined,
                    "actions/setNodeEventActions",
                ),
        ),
    };
};
