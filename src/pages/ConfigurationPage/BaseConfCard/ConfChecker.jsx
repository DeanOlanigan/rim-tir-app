import { Tooltip } from "@/components/ui/tooltip";
import { useVariablesStore } from "@/store/variables-store";
import { Icon } from "@chakra-ui/react";
import { LuRefreshCcwDot, LuRefreshCwOff } from "react-icons/lu";

export const ConfChecker = () => {
    const sync = useVariablesStore((state) => state.sync);
    return (
        <Tooltip
            showArrow
            content={sync ? "Синхронизировано" : "Не синхронизировано"}
        >
            <Icon
                as={sync ? LuRefreshCcwDot : LuRefreshCwOff}
                color={sync ? "fg.success" : "fg.error"}
            />
        </Tooltip>
    );
};
