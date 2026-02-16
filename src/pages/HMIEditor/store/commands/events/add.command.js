import { runCommand } from "../runCommand";

export const addEventCommand = (api, nodeId, eventType, action) => {
    runCommand(api, "cmd/events/add", (state) => {
        const node = state.nodes[nodeId];
        if (!node) return null;

        const currentActions = node.events?.[eventType] || [];

        const patch = {
            nodes: {
                ...state.nodes,
                [nodeId]: {
                    ...node,
                    events: {
                        ...node.events,
                        [eventType]: [...currentActions, action],
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
