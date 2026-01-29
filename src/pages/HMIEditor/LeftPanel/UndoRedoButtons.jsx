import { Group, IconButton } from "@chakra-ui/react";
import { LuRedo, LuUndo } from "react-icons/lu";
import { useActionsStore } from "../store/actions-store";

export const UndoRedoButtons = () => {
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    if (viewOnlyMode) return null;

    return (
        <Group attached shadow={"md"} borderRadius={"l2"}>
            <IconButton variant={"subtle"} size={"xs"}>
                <LuUndo />
            </IconButton>
            <IconButton variant={"subtle"} size={"xs"}>
                <LuRedo />
            </IconButton>
        </Group>
    );
};
