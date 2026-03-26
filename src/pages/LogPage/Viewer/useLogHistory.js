import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLogStream } from "../store/stream-store";
import { getLog } from "@/api/routes/logs.api";

export function useLogHistory(type, name, limit) {
    const { hydrate, reset } = useLogStream.getState();

    useEffect(() => {
        reset();
    }, [type, name, reset]);

    const q = useQuery({
        queryKey: ["log", type, name, limit],
        enabled: Boolean(type && name && limit > 0),
        queryFn: async () => {
            const res = await getLog({
                name,
                dir: type,
                limit,
                format: "json",
            });
            return res?.data ?? [];
        },
    });

    useEffect(() => {
        if (q.isSuccess) hydrate(q.data ?? []);
    }, [q.data, hydrate, q.isSuccess]);

    return q;
}
