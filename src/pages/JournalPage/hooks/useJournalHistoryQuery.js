// src/pages/JournalPage/hooks/useJournalHistoryQuery.js
import { getJournals } from "@/api/routes/journal.api";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useJournalHistoryQuery(filters) {
    const { from, to, severity, category } = filters;
    return useInfiniteQuery({
        queryKey: ["journal-history", { from, to, severity, category }],
        queryFn: ({ pageParam }) =>
            getJournals({
                fromUTC: from,
                toUTC: to,
                severity,
                category,
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
