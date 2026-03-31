import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLogStream } from "../store/stream-store";
import { getLog } from "@/api/routes/logs.api";

export function useLogHistory(name, limit) {
    const { hydrate, reset } = useLogStream.getState();

    useEffect(() => {
        reset();
    }, [name, reset]);

    const q = useQuery({
        queryKey: ["log", name, limit],
        enabled: Boolean(name && limit > 0),
        queryFn: async () => {
            const res = await getLog({
                name,
                limit,
            });
            return res?.items ?? [];
        },
    });

    useEffect(() => {
        if (q.isSuccess) hydrate(q.data ?? []);
    }, [q.data, hydrate, q.isSuccess]);

    return q;
}
