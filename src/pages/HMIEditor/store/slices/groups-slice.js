import { duplicateNodesService } from "../services/duplicateNodesService";
import { groupNodesService } from "../services/groupService";
import { ungroupNodesService } from "../services/ungroupService";
import { withDirty } from "../utils/withDirty";

export const createGroupsSlice = (set, get) => {
    const dirty = withDirty(set);

    return {
        groupNodes: dirty("groups/groupNodes", (ids, bbox) =>
            set(
                (state) => groupNodesService(state, ids, bbox),
                undefined,
                "groups/groupNodes",
            ),
        ),
        ungroupNode: dirty("groups/ungroupNode", (id) =>
            get().ungroupNodes([id]),
        ),
        ungroupNodes: dirty("groups/ungroupNodes", (ids) =>
            set(
                (state) => ungroupNodesService(state, ids),
                undefined,
                "groups/ungroupNodes",
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
