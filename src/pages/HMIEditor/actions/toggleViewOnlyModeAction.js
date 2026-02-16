import { ACTIONS } from "../constants";
import { useActionsStore } from "../store/actions-store";

export function toggleViewOnlyModeAction(tools) {
    tools.manager.setActive(ACTIONS.select);
    useActionsStore
        .getState()
        .setViewOnlyMode(!useActionsStore.getState().viewOnlyMode);
}
