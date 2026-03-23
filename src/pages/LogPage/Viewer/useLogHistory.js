import { getLog } from "@/api/log";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLogStream } from "../store/stream-store";

export function useLogHistory(type, name, limit) {
    const { hydrate, reset } = useLogStream.getState();

    useEffect(() => {
        reset();
    }, [type, name, reset]);

    const q = useQuery({
        queryKey: ["log", type, name, limit],
        enabled: Boolean(type && name && limit > 0),
        queryFn: async () => {
            const res = await getLog(name, type, limit, "json");
            return res?.data ?? [];
        },
    });

    useEffect(() => {
        if (q.isSuccess) hydrate(q.data ?? []);
    }, [q.data, hydrate, q.isSuccess]);

    return q;
}
