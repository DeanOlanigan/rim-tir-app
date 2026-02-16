import { runCommand } from "../runCommand";

export const removeEventCommand = (api, nodeId, eventType, actionId) => {
    runCommand(api, "cmd/event/remove", (state) => {
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
                        [eventType]: currentActions.filter(
                            (a) => a.id !== actionId,
                        ),
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
