import { useVariablesStore } from "../store/variables-store";
import { useMemo } from "react";

// TODO попытаться еще раз... useShallow
export function useSelectedData(type) {
    const selectedIds = useVariablesStore((state) => state.selectedIds[type]);
    const settings = useVariablesStore((state) => state.settings);
    const selectedData = useMemo(() => {
        if (!selectedIds.size) return [];
        const out = [];
        for (const id of selectedIds) {
            const node = settings[id];
            if (!node) continue;
            const children =
                node?.children
                    ?.map((childId) => settings[childId])
                    .filter(Boolean) ?? [];
            out.push({ node, children });
        }
        return out;
    }, [selectedIds, settings]);
    return selectedData;
}
