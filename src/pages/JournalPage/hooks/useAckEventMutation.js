// src/pages/JournalPage/hooks/useAckEventHistoryMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventAcknowledge } from "@/api/commands";

export function useAckEventHistoryMutation(filters) {
    const queryClient = useQueryClient();
    const queryKey = ["journal-history", filters];

    return useMutation({
        mutationFn: ({ eventId, event, message }) =>
            eventAcknowledge({ eventId, event, message }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}

export function useAckEventStreamMutation() {
    return useMutation({
        mutationFn: ({ eventId, event, message }) =>
            eventAcknowledge({ eventId, event, message }),
    });
}
