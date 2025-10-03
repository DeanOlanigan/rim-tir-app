import { getLog } from "@/api/log";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLogStream } from "../Store/stream-store";

export function useLogHistory(type, name, limit) {
    const { hydrate } = useLogStream.getState();
    const q = useQuery({
        queryKey: ["log", type, name, limit],
        queryFn: async () => {
            const res = await getLog(name, type, limit, "json");
            return res?.data ?? [];
        },
    });

    useEffect(() => {
        if (q.data) hydrate(q.data);
    }, [q.data, hydrate]);

    return q;
}
