import { useVariablesStore } from "@/store/variables-store";
import { Icon } from "@chakra-ui/react";
import { LuRefreshCcwDot, LuRefreshCwOff } from "react-icons/lu";

export const ConfChecker = () => {
    const sync = useVariablesStore((state) => state.sync);
    return (
        <Icon
            as={sync ? LuRefreshCcwDot : LuRefreshCwOff}
            title={
                sync
                    ? "Синхронизировано c сервером"
                    : "Не синхронизировано с сервером"
            }
            color={sync ? "fg.success" : "fg.error"}
        />
    );
};
