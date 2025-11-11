import { Group, IconButton } from "@chakra-ui/react";
import { LuRedo, LuUndo } from "react-icons/lu";

export const UndoRedoButtons = () => {
    return (
        <Group attached shadow={"md"}>
            <IconButton variant={"subtle"} size={"xs"}>
                <LuUndo />
            </IconButton>
            <IconButton variant={"subtle"} size={"xs"}>
                <LuRedo />
            </IconButton>
        </Group>
    );
};
