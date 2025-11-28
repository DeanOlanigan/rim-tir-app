import { Group, IconButton } from "@chakra-ui/react";
import {
    LuArrowDownFromLine,
    LuArrowUpFromLine,
    LuMoveDown,
    LuMoveUp,
} from "react-icons/lu";
import { useNodeStore } from "../store/node-store";

export const Layers = ({ node }) => {
    const handleMove = (dir) => {
        const id = node.id();
        const rootIds = useNodeStore.getState().rootIds;
        const zIndex = rootIds.indexOf(id);
        if (zIndex === -1) return;

        const arr = [...rootIds];
        arr.splice(zIndex, 1);
        switch (dir) {
            case "moveToTop":
                arr.push(id);
                break;
            case "moveUp":
                arr.splice(Math.min(arr.length, zIndex + 1), 0, id);
                break;
            case "moveDown":
                arr.splice(Math.max(0, zIndex - 1), 0, id);
                break;
            case "moveToBottom":
                arr.unshift(id);
                break;
            default:
                break;
        }
        useNodeStore.getState().setRootIds(arr);
    };

    return (
        <Group attached grow w={"100%"}>
            <IconButton size={"xs"} onClick={() => handleMove("moveToTop")}>
                <LuArrowUpFromLine />
            </IconButton>
            <IconButton size={"xs"} onClick={() => handleMove("moveUp")}>
                <LuMoveUp />
            </IconButton>
            <IconButton size={"xs"} onClick={() => handleMove("moveDown")}>
                <LuMoveDown />
            </IconButton>
            <IconButton size={"xs"} onClick={() => handleMove("moveToBottom")}>
                <LuArrowDownFromLine />
            </IconButton>
        </Group>
    );
};
