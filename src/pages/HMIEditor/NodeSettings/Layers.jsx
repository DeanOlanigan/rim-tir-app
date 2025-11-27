import { Group, IconButton } from "@chakra-ui/react";
import {
    LuArrowDownFromLine,
    LuArrowUpFromLine,
    LuMoveDown,
    LuMoveUp,
} from "react-icons/lu";

export const Layers = ({ node }) => {
    return (
        <Group attached grow w={"100%"}>
            <IconButton
                size={"xs"}
                onClick={() => {
                    node.moveToTop();
                }}
            >
                <LuArrowUpFromLine />
            </IconButton>
            <IconButton
                size={"xs"}
                onClick={() => {
                    node.moveUp();
                }}
            >
                <LuMoveUp />
            </IconButton>
            <IconButton
                size={"xs"}
                onClick={() => {
                    node.moveDown();
                }}
            >
                <LuMoveDown />
            </IconButton>
            <IconButton
                size={"xs"}
                onClick={() => {
                    node.moveToBottom();
                }}
            >
                <LuArrowDownFromLine />
            </IconButton>
        </Group>
    );
};
