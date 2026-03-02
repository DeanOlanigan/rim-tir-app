import { runGuardedAction } from "@/utils/permissions";
import { ACTIONS } from "../constants";
import { useActionsStore } from "../store/actions-store";
import { toaster } from "@/components/ui/toaster";

export function toggleViewOnlyModeAction(tools) {
    runGuardedAction({
        right: "hmi.editor",
        onForbidden: () => {
            toaster.create({
                title: "Недостаточно прав",
                description: "Недостаточно прав для выполнения операции",
                type: "error",
            });
        },
        action: () => {
            tools.manager.setActive(ACTIONS.select);
            if (tools.api.getSelectedIds().length > 0)
                tools.api.setSelectedIds([]);
            useActionsStore
                .getState()
                .setViewOnlyMode(!useActionsStore.getState().viewOnlyMode);
        },
    });
}
