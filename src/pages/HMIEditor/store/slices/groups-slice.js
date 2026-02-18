import { groupNodesCommand, ungroupNodesCommand } from "../commands";

export const createGroupsSlice = (api) => {
    return {
        groupNodes: (ids, bbox) => groupNodesCommand(api, ids, bbox),
        ungroupNode: (id) => ungroupNodesCommand(api, [id]),
        ungroupNodes: (ids) => ungroupNodesCommand(api, ids),
    };
};
