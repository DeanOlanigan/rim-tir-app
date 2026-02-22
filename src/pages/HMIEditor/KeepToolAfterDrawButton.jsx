import { IconButton } from "@chakra-ui/react";
import { LuLockKeyhole, LuLockKeyholeOpen } from "react-icons/lu";
import { useActionsStore } from "./store/actions-store";
import { Tooltip } from "@/components/ui/tooltip";

export const KeepToolAfterDrawButton = () => {
    const viewOnlyMode = useActionsStore((s) => s.viewOnlyMode);
    const lockTool = useActionsStore((s) => s.lockTool);
    if (viewOnlyMode) return null;

    return (
        <Tooltip showArrow content={"Сохранять инструмент активным"}>
            <IconButton
                size="sm"
                variant={lockTool ? "solid" : "subtle"}
                onClick={() => useActionsStore.getState().toggleLockTool()}
            >
                {lockTool ? <LuLockKeyhole /> : <LuLockKeyholeOpen />}
            </IconButton>
        </Tooltip>
    );
};
