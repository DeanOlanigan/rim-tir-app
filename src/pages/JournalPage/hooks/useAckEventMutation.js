// src/pages/JournalPage/hooks/useAckEventHistoryMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ackJournalEvent } from "@/api/routes/journal.api";

export function useAckEventHistoryMutation(filters) {
    const queryClient = useQueryClient();
    const queryKey = ["journal-history", filters];

    return useMutation({
        mutationFn: ({ eventId }) => ackJournalEvent({ eventId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}

export function useAckEventStreamMutation() {
    return useMutation({
        mutationFn: ({ eventId }) => ackJournalEvent({ eventId }),
    });
}
