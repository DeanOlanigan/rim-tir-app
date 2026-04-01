import { initiateUpdate } from "@/api/routes/update.api";
import { useMutation } from "@tanstack/react-query";

export const useUpdateMutation = () => {
    return useMutation({
        mutationKey: ["start-update"],
        mutationFn: initiateUpdate,
    });
};
