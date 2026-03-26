import { QK } from "@/api";
import { fetchConfigurationState } from "@/api/services/configuration.services";
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
        useShallow((state) => toSyncPayload(state)),
    );
    const { setSync } = useVariablesStore.getState();
    const { data } = useQuery({
        queryKey: QK.configuration,
        queryFn: fetchConfigurationState,
        select: (state) => toSyncPayload(state),
    });

    useEffect(() => {
        if (!data || !local) return;
        const dataCanonical = canonicalize(data);
        const localCanonical = canonicalize(local);
        const isEq = dataCanonical === localCanonical;
        setSync(isEq);
    }, [local, data, setSync]);

    return null;
};
