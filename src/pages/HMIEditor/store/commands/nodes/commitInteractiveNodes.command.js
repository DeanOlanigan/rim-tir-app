import { runCommand } from "../runCommand";
import {
    updateNodesCommand,
    updateNodesRafCommand,
} from "./updateNode.commands";
import {
    buildFinalPatchFromBaseline,
    buildRollbackPatchFromBaseline,
} from "../../utils/interactiveSnapshot";

/**
 * Коммитит интерактивный preview в один history step.
 * 1) Берёт baseline из ui.interactiveSnapshot
 * 2) Строит final patch (baseline -> current)
 * 3) Если изменений нет -> просто чистит snapshot
 * 4) Rollback к baseline без history (через updateNodesRafCommand)
 * 5) Apply final patch с history (через updateNodesCommand)
 * 6) Чистит snapshot без history
 */
export const commitInteractiveSnapshotCommand = (api, property) => {
    const state = api.get();
    const snap = state.interactiveSnapshot;
    if (!snap) return;

    const finalPatch = buildFinalPatchFromBaseline(
        state.nodes,
        snap.baselineById,
        property,
    );
    // Если после всех сравнений изменений нет — просто очистить
    if (!finalPatch || Object.keys(finalPatch).length === 0) {
        clearInteractiveSnapshotCommand(api);
        return;
    }

    // rollback к baseline без history
    const rollbackPatch = buildRollbackPatchFromBaseline(
        state.nodes,
        snap.baselineById,
        property,
    );
    if (rollbackPatch && Object.keys(rollbackPatch).length > 0) {
        updateNodesRafCommand(api, rollbackPatch); // history:false уже есть
    }

    // tracked commit (создаст один undo-step)
    updateNodesCommand(api, finalPatch);

    clearInteractiveSnapshotCommand(api);
};

export const cancelInteractiveSnapshotCommand = (api) => {
    const state = api.get();
    const snap = state.interactiveSnapshot;
    if (!snap) return;

    const rollbackPatch = buildRollbackPatchFromBaseline(
        state.nodes,
        snap.baselineById,
    );
    if (rollbackPatch && Object.keys(rollbackPatch).length > 0) {
        updateNodesRafCommand(api, rollbackPatch); // preview rollback without history
    }

    clearInteractiveSnapshotCommand(api);
};

function clearInteractiveSnapshotCommand(api) {
    runCommand(
        api,
        "cmd/ui/clearInteractiveSnapshot",
        (state) => {
            if (!state.interactiveSnapshot) return null;
            return { patch: { interactiveSnapshot: null } };
        },
        { history: false },
    );
}
