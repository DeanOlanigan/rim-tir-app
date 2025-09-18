import { useShallow } from "zustand/shallow";
import { useVariablesStore } from "./variables-store";
import { NODE_TYPES } from "@/config/constants";

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

export function getVarData() {
    const { settings } = useVariablesStore.getState();
    return getVarDataStore(settings);
}

export function getVarDataStore(settings) {
    const varIdsByName = new Map();
    const varNameById = new Map();
    const variables = new Map();
    Object.values(settings).forEach((node) => {
        if (node.type !== NODE_TYPES.variable) return;
        const name = node.name ?? "";
        if (!varIdsByName.has(name)) varIdsByName.set(name, new Set());
        varIdsByName.get(name).add(node.id);
        varNameById.set(node.id, name);
        variables.set(node.id, node);
    });
    return { varIdsByName, varNameById, variables };
}
