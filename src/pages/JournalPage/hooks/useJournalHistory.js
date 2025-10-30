import { useQuery } from "@tanstack/react-query";
import { useJournalStream } from "../JournalStores/journal-stream-store";
import { useEffect } from "react";

export const useJournalHistory = () => {

    const { hydrate } = useJournalStream.getState();

    const q = useQuery({
        queryKey: ["journal"],
        queryFn: async () => {
            const out = [];
            const count = 1000;

            for (let i = 0; i < count; i++) {
                out.push({
                    date: new Date(),
                    // eslint-disable-next-line sonarjs/pseudo-random                    
                    type: ["ТС", "ТУ"][Math.floor(Math.random() * 2)],
                    var: "тест",
                    // eslint-disable-next-line sonarjs/pseudo-random
                    val: Math.floor(Math.random() * 100),
                    group: ["Без Группы", "Аварийная", "Предупредительная", "Состояние"][
                        // eslint-disable-next-line sonarjs/pseudo-random
                        Math.floor(Math.random() * 4)
                    ],
                    desc: "test Descripbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbtion"
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