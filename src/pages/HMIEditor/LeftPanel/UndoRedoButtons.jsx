import { Box, Circle, Float, Group, IconButton } from "@chakra-ui/react";
import { LuRedo, LuUndo, LuX } from "react-icons/lu";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { useStore } from "zustand";

export const UndoRedoButtons = () => {
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const debugMode = useActionsStore((state) => state.debugMode);
    const pastStates = useStore(
        useNodeStore.temporal,
        (state) => state.pastStates,
    );
    const futureStates = useStore(
        useNodeStore.temporal,
        (state) => state.futureStates,
    );

    if (viewOnlyMode) return null;

    return (
        <Group attached shadow={"md"} borderRadius={"l2"}>
            <Box position={"relative"}>
                <IconButton
                    variant={"subtle"}
                    size={"xs"}
                    disabled={pastStates.length === 0}
                    onClick={() => useNodeStore.getState().undo()}
                    borderTopRightRadius={0}
                    borderBottomRightRadius={0}
                >
                    <LuUndo />
                </IconButton>
                {debugMode && (
                    <Float placement={"top-center"}>
                        <Circle size="4" bg="red" color="white" fontSize={"xs"}>
                            {pastStates.length}
                        </Circle>
                    </Float>
                )}
            </Box>
            <Box position={"relative"}>
                <IconButton
                    variant={"subtle"}
                    size={"xs"}
                    disabled={futureStates.length === 0}
                    onClick={() => useNodeStore.getState().redo()}
                    borderTopLeftRadius={0}
                    borderBottomLeftRadius={0}
                >
                    <LuRedo />
                </IconButton>
                {debugMode && (
                    <Float placement={"top-center"}>
                        <Circle size="4" bg="red" color="white" fontSize={"xs"}>
                            {futureStates.length}
                        </Circle>
                    </Float>
                )}
            </Box>
            {debugMode && (
                <IconButton
                    variant={"subtle"}
                    size={"xs"}
                    onClick={() => useNodeStore.getState().clearHistory()}
                >
                    <LuX />
                </IconButton>
            )}
        </Group>
    );
};
