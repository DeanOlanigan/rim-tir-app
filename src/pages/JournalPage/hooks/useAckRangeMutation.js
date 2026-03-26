// src/pages/JournalPage/hooks/useAckRangeMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ackJournalRange } from "@/api/routes/journal.api";

export function useAckRangeHistoryMutation(filters) {
    const queryClient = useQueryClient();

    const queryKey = ["journal-history", filters];

    return useMutation({
        mutationFn: ({ fromUTC, toUTC }) => ackJournalRange({ fromUTC, toUTC }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}

export function useAckRangeStreamMutation() {
    return useMutation({
        mutationFn: ({ fromUTC, toUTC }) => ackJournalRange({ fromUTC, toUTC }),
    });
}
