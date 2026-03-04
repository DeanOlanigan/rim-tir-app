import { QK } from "../../../api/queryKeys";
import { toaster } from "@/components/ui/toaster";
import { useTableStore } from "../tablestore";
import { CK } from "../crudKeys";

export function usersSuccessMutate(queryClient, crudKey) {
    queryClient.setQueryData(QK.users, () => {
        return useTableStore.getState().live;
    });
    toaster.create({
        type: "success",
        description: CK[crudKey],
        closable: true,
    });
}
