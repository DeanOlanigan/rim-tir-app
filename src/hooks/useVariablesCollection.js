import { useVariablesStore } from "../store/variables-store";
import { createListCollection } from "@chakra-ui/react";

export function useVariablesCollection() {
    const settings = useVariablesStore((state) => state.settings);

    const items = Object.entries(settings)
        .map(([, item]) => {
            if (item.type === "variable") {
                return {
                    label: item.name,
                    value: item.name,
                    disabled: item.usedIn ? true : false,
                    id: item.id,
                };
            }
        })
        .filter(Boolean);

    return createListCollection({ items });
}
