export function selectSelectedData(settings, selectedIds) {
    return Array.from(selectedIds)
        .map((key) => settings[key])
        .filter(Boolean);
    //.reverse();
}

import { useShallow } from "zustand/shallow";
import { useVariablesStore } from "./variables-store";
export function useVariablesList() {
    return useVariablesStore(
        useShallow((state) =>
            Object.values(state.settings).filter(
                (node) => node.type === "variable"
            )
        )
    );
}
