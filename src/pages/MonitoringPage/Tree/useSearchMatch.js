import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";
import { NODE_TYPES } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

function buildAliasIndex(settings) {
    const m = new Map();
    for (const [id, rec] of Object.entries(settings)) {
        if (!rec) continue;
        let display = rec.name ?? "";
        if (rec.type === NODE_TYPES.dataObject) {
            const vid = rec.setting?.variableId;
            const vname = vid ? settings[vid]?.name : undefined;
            if (vname) display = vname;
        }
        if (display) m.set(id, String(display).toLowerCase());
    }
    return m;
}

export const useSearchMatch = () => {
    const { data: settings } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state.settings,
    });

    const aliasIndex = useMemo(() => buildAliasIndex(settings), [settings]);

    const searchMatch = useCallback(
        (node, term) => {
            if (!term) return true;
            const key = node?.data?.id;
            if (!key) return false;
            const nameLower = aliasIndex.get(key);
            return !!nameLower && nameLower.includes(term.toLowerCase());
        },
        [aliasIndex]
    );

    return searchMatch;
};
