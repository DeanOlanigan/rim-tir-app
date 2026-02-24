import { Group, IconButton } from "@chakra-ui/react";
import { LuRedo, LuUndo, LuX } from "react-icons/lu";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";

export const UndoRedoButtons = () => {
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const { futureStates, pastStates } = useNodeStore.temporal.getState();
    const canUndo = !!pastStates.length;
    const canRedo = !!futureStates.length;

    if (viewOnlyMode) return null;

    return (
        <Group attached shadow={"md"} borderRadius={"l2"}>
            <IconButton
                variant={"subtle"}
                size={"xs"}
                disabled={!canUndo}
                onClick={() => useNodeStore.getState().undo()}
            >
                <LuUndo />
            </IconButton>
            <IconButton
                variant={"subtle"}
                size={"xs"}
                disabled={!canRedo}
                onClick={() => useNodeStore.getState().redo()}
            >
                <LuRedo />
            </IconButton>
            <IconButton
                variant={"subtle"}
                size={"xs"}
                onClick={() => useNodeStore.getState().clearHistory()}
            >
                <LuX />
            </IconButton>
        </Group>
    );
};
