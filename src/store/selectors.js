import { useShallow } from "zustand/shallow";
import { useVariablesStore } from "./variables-store";
import { useMemo } from "react";

function useSelectedIds(type) {
    return useVariablesStore((s) => s.selectedIds[type]);
}

function useNodesByIds(ids) {
    return useVariablesStore(
        useShallow((s) => ids.map((id) => s.settings[id]))
    );
}

function useChildrenIds(id) {
    return useVariablesStore(useShallow((s) => s.settings[id]?.children ?? []));
}

function useChildrenNodes(id) {
    const childrenIds = useChildrenIds(id);
    return useNodesByIds(childrenIds);
}

function useVariablesCollectionMemo(currentOwnerId) {
    const settings = useVariablesStore((state) => state.settings);
    const rootId = settings[currentOwnerId]?.rootId;

    return useMemo(
        () =>
            Object.values(settings)
                .filter((item) => item.type === "variable")
                .map((item) => {
                    const map = item.setting?.usedIn ?? {};

                    const disabled =
                        map[rootId] && map[rootId] !== currentOwnerId;

                    return {
                        label: item.name,
                        value: item.id,
                        disabled,
                        usedIn: map,
                    };
                }),
        [settings, rootId, currentOwnerId]
    );
}

export {
    useSelectedIds,
    useNodesByIds,
    useChildrenIds,
    useChildrenNodes,
    useVariablesCollectionMemo,
};
