export function selectSelectedData(settings, selectedIds) {
    return Array.from(selectedIds)
        .map((key) => settings[key])
        .filter(Boolean);
    //.reverse();
}

import { useShallow } from "zustand/shallow";
import { useVariablesStore } from "./variables-store";
import { useMemo } from "react";
export function useVariablesList() {
    return useVariablesStore(
        useShallow((state) =>
            Object.values(state.settings).filter(
                (node) => node.type === "variable"
            )
        )
    );
}

export function useVariablesNames() {
    return useVariablesStore(
        useShallow((state) =>
            Object.values(state.settings)
                .filter((node) => node.type === "variable")
                .map((node) => node.name)
        )
    );
}

export function getVarIdsByName() {
    const { settings } = useVariablesStore.getState();
    const variables = Object.values(settings).filter(
        (node) => node.type === "variable"
    );
    const varIdsByName = new Map();
    variables.forEach((node) => {
        if (!varIdsByName.has(node.name))
            varIdsByName.set(node.name, new Set());
        varIdsByName.get(node.name).add(node.id);
    });
    return varIdsByName;
}

export function useVarIdsByName() {
    const varsLite = useVariablesStore(
        useShallow((state) =>
            Object.values(state.settings)
                .filter((node) => node.type === "variable")
                .map((node) => ({ id: node.id, name: node.name }))
        )
    );

    return useMemo(() => {
        const map = new Map();
        for (const { id, name } of varsLite) {
            if (!name) continue;
            let set = map.get(name);
            if (!set) {
                set = new Set();
                map.set(name, set);
            }
            set.add(id);
        }
        return map;
    }, [varsLite]);
}
