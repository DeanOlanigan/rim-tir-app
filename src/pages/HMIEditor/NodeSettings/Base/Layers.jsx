import { Group, IconButton } from "@chakra-ui/react";
import {
    LuArrowDownFromLine,
    LuArrowUpFromLine,
    LuMoveDown,
    LuMoveUp,
} from "react-icons/lu";
import { useNodeStore } from "../../store/node-store";
import { LAYERS_OPS } from "../../constants";

export const Layers = ({ ids }) => {
    const handleMove = (dir) => {
        useNodeStore.getState().reorderLayers(ids, dir);
    };

    return (
        <Group attached grow w={"100%"}>
            <IconButton
                variant={"outline"}
                size={"xs"}
                onClick={() => handleMove(LAYERS_OPS.moveToTop)}
            >
                <LuArrowUpFromLine />
            </IconButton>
            <IconButton
                variant={"outline"}
                size={"xs"}
                onClick={() => handleMove(LAYERS_OPS.moveUp)}
            >
                <LuMoveUp />
            </IconButton>
            <IconButton
                variant={"outline"}
                size={"xs"}
                onClick={() => handleMove(LAYERS_OPS.moveDown)}
            >
                <LuMoveDown />
            </IconButton>
            <IconButton
                variant={"outline"}
                size={"xs"}
                onClick={() => handleMove(LAYERS_OPS.moveToBottom)}
            >
                <LuArrowDownFromLine />
            </IconButton>
        </Group>
    );
};
