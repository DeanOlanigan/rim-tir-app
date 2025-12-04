import { Group, IconButton } from "@chakra-ui/react";
import { LuClipboardCopy, LuGroup, LuLayers2, LuTrash2 } from "react-icons/lu";

//TODO WIP

export const ActionsBlock = ({ node, nodesRef, selectedIds }) => {
    const isMultiple = selectedIds.length > 1;
    return (
        <Group>
            {isMultiple && (
                <IconButton size={"xs"}>
                    <LuGroup />
                </IconButton>
            )}
            <IconButton size={"xs"}>
                <LuClipboardCopy />
            </IconButton>
            <IconButton size={"xs"}>
                <LuLayers2 />
            </IconButton>
            <IconButton size={"xs"} colorPalette={"red"}>
                <LuTrash2 />
            </IconButton>
        </Group>
    );
};
