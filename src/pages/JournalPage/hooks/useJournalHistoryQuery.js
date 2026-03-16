// src/pages/JournalPage/hooks/useJournalHistoryQuery.js
import { useInfiniteQuery } from "@tanstack/react-query";
import { getJournals } from "@/api/journal";

export function useJournalHistoryQuery({
    from,
    to,
    limit,
    severity,
    category,
}) {
    return useInfiniteQuery({
        queryKey: ["journal-history", { from, to, limit, severity, category }],
        queryFn: ({ pageParam }) =>
            getJournals({
                from,
                to,
                limit,
                before: pageParam ?? undefined,
            }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            if (!lastPage?.page?.hasMore) return undefined;
            return lastPage?.page?.nextBefore ?? undefined;
        },
        staleTime: 10_000,
        refetchOnWindowFocus: false,
    });
}
