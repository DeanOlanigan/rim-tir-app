import { getConfiguration, QK } from "@/api";
import { useVariablesStore } from "@/store/variables-store";
import { useQuery } from "@tanstack/react-query";
import { canonicalize } from "json-canonicalize";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const toSyncPayload = (x) => ({
    settings: x.settings,
    info: x.info,
});

export const ConfSyncManager = () => {
    const local = useVariablesStore(
        useShallow((state) => toSyncPayload(state))
    );
    const { setSync } = useVariablesStore.getState();
    const { data } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: (state) => toSyncPayload(state),
    });

    useEffect(() => {
        if (!data || !local) return;
        const isEq = canonicalize(data) === canonicalize(local);
        setSync(isEq);
    }, [local, data, setSync]);

    return null;
};
