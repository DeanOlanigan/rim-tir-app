import { useVariablesStore } from "@/store/variables-store";
import { useShallow } from "zustand/shallow";

export function useParamValues(id, filter) {
    return useVariablesStore(
        useShallow((state) => {
            const settings = state.settings[id]?.setting ?? {};
            return filter.reduce((acc, key) => {
                if (settings[key.param] !== undefined)
                    acc[key.label] = settings[key.param];
                return acc;
            }, {});
        })
    );
}
