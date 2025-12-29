import { useTableStore } from "@/pages/SettingsPage/Settings/SettingsStore/tablestore";
import { QK } from "./queryKeys";
import { toaster } from "@/components/ui/toaster";

export function usersSuccessMutate(queryClient, text) {
    queryClient.setQueryData([QK.users], () => {
        return useTableStore.getState().live;
    });
    toaster.create({
        type: "success",
        description: text,
        closable: true,
    });
}
