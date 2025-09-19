import { useVariablesStore } from "@/store/variables-store";
import { useMemo } from "react";

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
