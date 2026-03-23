// src/pages/JournalPage/hooks/useAckRangeMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventAcknowledgeRange } from "@/api/commands";

export function useAckRangeHistoryMutation(filters) {
    const queryClient = useQueryClient();

    const queryKey = ["journal-history", filters];

    return useMutation({
        mutationFn: ({ fromTs, toTs }) =>
            eventAcknowledgeRange({ fromTs, toTs }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}

export function useAckRangeStreamMutation() {
    return useMutation({
        mutationFn: ({ fromTs, toTs }) =>
            eventAcknowledgeRange({ fromTs, toTs }),
    });
}
