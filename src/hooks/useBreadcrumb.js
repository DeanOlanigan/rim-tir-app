import { useVariablesStore } from "@/store/variables-store";
import { truncateString } from "@/utils/truncateString";
import { useShallow } from "zustand/shallow";

export function useBreadcrumbParts(id) {
    return useVariablesStore(
        useShallow((s) => {
            const out = [];
            let cur = s.settings[id];
            while (cur) {
                out.unshift(
                    cur.type === "dataObject"
                        ? cur.id
                        : truncateString(cur.name, 15),
                );
                cur = cur.parentId ? s.settings[cur.parentId] : null;
            }
            return out;
        }),
    );
}
