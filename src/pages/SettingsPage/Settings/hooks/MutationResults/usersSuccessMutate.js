import { QK } from "../../../../../api/queryKeys";
import { toaster } from "@/components/ui/toaster";
import { useTableStore } from "../../SettingsStore/tablestore";

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
