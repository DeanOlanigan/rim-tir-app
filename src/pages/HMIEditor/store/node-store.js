import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createMetaSlice } from "./slices/meta-slice";
import { createProjectSlice } from "./slices/project-slice";
import { createNodeEventsSlice } from "./slices/node-events-slice";
import { createBindingsSlice } from "./slices/bindings-slice";
import { createGroupsSlice } from "./slices/groups-slice";
import { createNodesSlice } from "./slices/nodes-slice";
import { createPagesSlice } from "./slices/pages-slice";
import { createUiSlice } from "./slices/ui-slice";
import { isNodeHistoryMuted } from "./history-gate";
import { temporal } from "zundo";
import { createAssetsSlice } from "./slices/assets-slice";

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

// Трюк: используем diff как "фильтр" для конкретных команд.
// Если возвращаем null — zundo не трекает этот апдейт.
function historyDiff(past) {
    if (isNodeHistoryMuted()) return null;
    // Возвращаем full current как "дельту" (рабочий компромисс)
    return past;
}

// Важно: no-op set(state => state) не должен создавать шаг истории
function historyEquality(a, b) {
    return (
        a.varIndex === b.varIndex &&
        a.nodeIndex === b.nodeIndex &&
        a.nodes === b.nodes &&
        a.activePageId === b.activePageId &&
        a.pageIdWithThumb === b.pageIdWithThumb &&
        a.pages === b.pages &&
        a.projectName === b.projectName &&
        a.selectedIds === b.selectedIds
    );
}

export const useNodeStore = create(
    devtools(
        temporal(
            (set, get) => {
                const api = { set, get };
                return {
                    ...createNodeEventsSlice(api),
                    ...createBindingsSlice(api),
                    ...createGroupsSlice(api),
                    ...createMetaSlice(api),
                    ...createNodesSlice(api),
                    ...createPagesSlice(api),
                    ...createProjectSlice(api),
                    ...createUiSlice(api),
                    ...createAssetsSlice(api),
                };
            },
            {
                limit: 50,
                partialize: partializeHistory,
                equality: historyEquality,
                diff: historyDiff,
            },
        ),
        { name: "node-store" },
    ),
);
