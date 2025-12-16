import { Group, IconButton } from "@chakra-ui/react";
import {
    LuArrowDownFromLine,
    LuArrowUpFromLine,
    LuMoveDown,
    LuMoveUp,
} from "react-icons/lu";
import { layerShift } from "../utils";

export const Layers = ({ ids }) => {
    const handleMove = (dir) => {
        layerShift(ids, dir);
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
