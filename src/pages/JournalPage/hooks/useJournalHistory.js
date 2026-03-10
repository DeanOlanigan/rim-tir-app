import { useQuery } from "@tanstack/react-query";
import { useJournalStream } from "../JournalStores/journal-stream-store";
import { useEffect } from "react";

export const useJournalHistory = () => {
    const hydrate = useJournalStream((s) => s.hydrate);

    const q = useQuery({
        queryKey: ["journal"],
        queryFn: async () => {
            const out = [];
            const count = 1000;

            for (let i = 0; i < count; i++) {
                // eslint-disable-next-line sonarjs/pseudo-random
                const type = ["ts", "tu"][Math.floor(Math.random() * 2)];
                const group = ["noGroup", "danger", "warn", "state"][
                    // eslint-disable-next-line sonarjs/pseudo-random
                    Math.floor(Math.random() * 4)
                ];

                out.push({
                    ts: new Date(),
                    type,
                    var: "тест",
                    // eslint-disable-next-line sonarjs/pseudo-random
                    val: Math.floor(Math.random() * 100),
                    group,
                    desc: "test desc",
                });
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return out;
        },
    });

    useEffect(() => {
        if (q.data) hydrate(q.data);
    }, [q.data, hydrate]);

    return q;
};
