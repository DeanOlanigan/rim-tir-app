import { useMutationState } from "@tanstack/react-query";

export function useOpeningState() {
    const openingMutation = useMutationState({
        filters: {
            mutationKey: ["openHmiProject"],
            status: "pending",
        },
        select: (m) => m.state.variables,
    });
    const isOpening = openingMutation.length > 0;

    return { isOpening, openingMutation };
}
