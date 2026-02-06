import { duplicateNodesService } from "../services/duplicateNodesService";
import { groupNodesService } from "../services/groupService";
import { ungroupNodesService } from "../services/ungroupService";
import { withDirty } from "../utils/withDirty";

export const createGroupsSlice = (set) => {
    const dirty = withDirty(set);

    return {
        groupNodes: dirty("groups/groupNodes", (ids, bbox) =>
            set(
                (state) => groupNodesService(state, ids, bbox),
                undefined,
                "groups/groupNodes",
            ),
        ),
        ungroupNodes: dirty("groups/ungroupNodes", (id) =>
            set(
                (state) => ungroupNodesService(state, [id]),
                undefined,
                "groups/ungroupNodes",
            ),
        ),
        ungroupMultipleNodes: dirty("groups/ungroupMultipleNodes", (ids) =>
            set(
                (state) => ungroupNodesService(state, ids),
                undefined,
                "groups/ungroupMultipleNodes",
            ),
        ),
        duplicateNodes: dirty("groups/duplicateNodes", (ids) =>
            set(
                (state) => duplicateNodesService(state, ids),
                undefined,
                "groups/duplicateNodes",
            ),
        ),
    };
};
