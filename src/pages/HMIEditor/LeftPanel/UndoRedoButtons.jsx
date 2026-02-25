import { Group, IconButton } from "@chakra-ui/react";
import { LuRedo, LuUndo, LuX } from "react-icons/lu";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { useStore } from "zustand";

export const UndoRedoButtons = () => {
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const pastStatesCount = useStore(
        useNodeStore.temporal,
        (state) => state.pastStates,
    );
    const futureStatesCount = useStore(
        useNodeStore.temporal,
        (state) => state.futureStates,
    );

    if (viewOnlyMode) return null;

    return (
        <Group attached shadow={"md"} borderRadius={"l2"}>
            <IconButton
                variant={"subtle"}
                size={"xs"}
                disabled={pastStatesCount.length === 0}
                onClick={() => useNodeStore.getState().undo()}
            >
                <LuUndo />
            </IconButton>
            <IconButton
                variant={"subtle"}
                size={"xs"}
                disabled={futureStatesCount.length === 0}
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
