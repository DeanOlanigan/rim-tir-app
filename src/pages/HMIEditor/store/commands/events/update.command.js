import { runCommand } from "../runCommand";

export const updateEventCommand = (api, nodeId, eventType, eventPatch) => {
    runCommand(api, "cmd/events/updateEvent", (state) => {
        const node = state.nodes[nodeId];
        if (!node) return null;

        const currentActions = node.events?.[eventType] || [];

        // Находим и обновляем нужное действие
        const newActions = currentActions.map((a) =>
            a.id === eventPatch.id ? { ...a, ...eventPatch } : a,
        );

        const patch = {
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

        return {
            patch,
            dirty: true,
        };
    });
};
