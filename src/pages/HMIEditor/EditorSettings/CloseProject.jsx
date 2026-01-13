import { IconButton } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { LuX } from "react-icons/lu";

export const CloseProject = () => {
    const closeHandler = () => {
        useNodeStore.setState({
            rootIds: [],
            nodes: {},
            selectedIds: [],
        });
    };

    return (
        <IconButton size={"xs"} variant={"surface"} onClick={closeHandler}>
            <LuX />
        </IconButton>
    );
};
