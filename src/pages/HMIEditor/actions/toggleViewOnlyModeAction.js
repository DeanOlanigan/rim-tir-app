import { ACTIONS } from "../constants";
import { useActionsStore } from "../store/actions-store";

export function toggleViewOnlyModeAction(tools) {
    tools.manager.setActive(ACTIONS.select);
    tools.api.setSelectedIds([]);
    useActionsStore
        .getState()
        .setViewOnlyMode(!useActionsStore.getState().viewOnlyMode);
}
