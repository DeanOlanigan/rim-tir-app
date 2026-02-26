import { ACTIONS } from "../constants";
import { useActionsStore } from "../store/actions-store";

export function toggleViewOnlyModeAction(tools) {
    tools.manager.setActive(ACTIONS.select);
    if (tools.api.getSelectedIds().length > 0) tools.api.setSelectedIds([]);
    useActionsStore
        .getState()
        .setViewOnlyMode(!useActionsStore.getState().viewOnlyMode);
}
