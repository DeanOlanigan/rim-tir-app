import { Flex, IconButton } from "@chakra-ui/react";
import { LuRedo, LuUndo } from "react-icons/lu";

export const UndoRedoButtons = () => {
    return (
        <Flex bg={"bg.subtle"} rounded={"md"} shadow={"md"}>
            <IconButton variant={"ghost"} size={"md"}>
                <LuUndo />
            </IconButton>
            <IconButton variant={"ghost"} size={"md"}>
                <LuRedo />
            </IconButton>
        </Flex>
    );
};
