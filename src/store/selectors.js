import { shallow, useShallow } from "zustand/shallow";
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

export function useSelectedIds(type) {
    return useVariablesStore((state) => state.selectedIds[type]);
}

export const useNodesByIds = (ids) =>
    useVariablesStore(useShallow((s) => ids.map((id) => s.settings[id])));

export const useTypesByIds = (ids) =>
    useVariablesStore((s) => ids.map((id) => s.settings[id]?.type), shallow);

export const useChildrenIds = (id) =>
    useVariablesStore(useShallow((s) => s.settings[id]?.children ?? []));

export const useChildrenNodes = (id) => {
    const childrenIds = useChildrenIds(id);
    return useNodesByIds(childrenIds);
};
