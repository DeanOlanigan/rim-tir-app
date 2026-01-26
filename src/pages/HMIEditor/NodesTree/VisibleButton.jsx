import { IconButton } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { LuEye, LuEyeOff } from "react-icons/lu";

export const VisibleButton = ({ node }) => {
    const isVisible = useNodeStore((state) => state.nodes[node.id].visible);

    return (
        <IconButton
            display={{ base: "none", _groupHover: "flex" }}
            size={"2xs"}
            variant={"ghost"}
            css={{
                _icon: {
                    width: "4",
                    height: "4",
                },
            }}
            onClick={(e) => {
                useNodeStore
                    .getState()
                    .updateNode(node.id, { visible: !isVisible });
                e.stopPropagation();
            }}
        >
            {isVisible ? <LuEye /> : <LuEyeOff />}
        </IconButton>
    );
};
