import { runCommand } from "../runCommand";

export const reorderEventsCommand = (api, nodeId, eventType, newActions) => {
    runCommand(api, "cmd/event/reorder", (state) => {
        const node = state.nodes[nodeId];
        if (!node) return null;

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
