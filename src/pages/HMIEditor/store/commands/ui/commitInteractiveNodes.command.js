import { useNodeStore } from "../../node-store";
import {
    consumePendingBaseline,
    setPendingBaseline,
} from "../../pendingBaseline";

export const commitInteractiveSnapshotCommand = () => {
    finalizeInteractiveHistory(50);
};

function finalizeInteractiveHistory(limit = 50) {
    const baseline = consumePendingBaseline();
    if (!baseline) return;
    useNodeStore.temporal.setState((t) => {
        const past = [...t.pastStates, baseline];
        const trimmed =
            past.length > limit ? past.slice(past.length - limit) : past;
        return { pastStates: trimmed, futureStates: [] };
    });
}

export const beginInteractiveSnapshotCommand = (api) => {
    const state = api.get();
    const baseline = partializeHistory(state);
    setPendingBaseline(baseline);
};

function partializeHistory(state) {
    return {
        varIndex: state.varIndex,
        nodeIndex: state.nodeIndex,
        nodes: state.nodes,
        activePageId: state.activePageId,
        pageIdWithThumb: state.pageIdWithThumb,
        pages: state.pages,
        projectName: state.projectName,
        selectedIds: state.selectedIds,
    };
}
