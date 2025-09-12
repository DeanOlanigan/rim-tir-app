import { useVariablesStore } from "@/store/variables-store";
import { createListCollection } from "@chakra-ui/react";
import { useMemo } from "react";

export function useVariablesCollection() {
    const settings = useVariablesStore((state) => state.settings);

    const items = Object.entries(settings)
        .map(([, item]) => {
            if (item.type === "variable") {
                return {
                    label: item.name,
                    value: item.name,
                    disabled: item.setting.usedIn ? true : false,
                    id: item.id,
                };
            }
        })
        .filter(Boolean);

    return createListCollection({ items });
}

// TODO Для ComboboxInput
export function useVariablesCollectionMemo(rootId, currentOwnerId) {
    const settings = useVariablesStore((state) => state.settings);

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
