import { groupNodesCommand, ungroupNodesCommand } from "../commands";

// TODO Реализовать nested группировку/разгруппировку
// TODO Разобраться с порядком слоев при разгруппировке
export const createGroupsSlice = (api) => {
    return {
        groupNodes: (ids, bbox) => groupNodesCommand(api, ids, bbox),
        ungroupNode: (id) => ungroupNodesCommand(api, [id]),
        ungroupNodes: (ids) => ungroupNodesCommand(api, ids),
    };
};
