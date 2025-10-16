import { getConfiguration, QK } from "@/api";
import { useVariablesStore } from "@/store/variables-store";
import { useQuery } from "@tanstack/react-query";
import { canonicalize } from "json-canonicalize";
import { useEffect } from "react";

export const ConfSyncManager = () => {
    const settings = useVariablesStore((state) => state.settings);
    const { setSync } = useVariablesStore.getState();
    const { data } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state.settings,
    });

    useEffect(() => {
        if (!data || !settings) return;

        async function calcHashes() {
            const encoder = new TextEncoder();

            const [buf1, buf2] = await Promise.all([
                crypto.subtle.digest(
                    "SHA-256",
                    encoder.encode(canonicalize(settings))
                ),
                crypto.subtle.digest(
                    "SHA-256",
                    encoder.encode(canonicalize(data))
                ),
            ]);

            const hash1 = Array.from(new Uint8Array(buf1))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            const hash2 = Array.from(new Uint8Array(buf2))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            const isEqual = hash1 && hash2 && hash1 === hash2;
            setSync(isEqual);
        }

        calcHashes();
    }, [settings, data, setSync]);

    return null;
};
