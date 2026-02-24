import { Flex, Group, IconButton } from "@chakra-ui/react";
import {
    LuAlignCenterHorizontal,
    LuAlignCenterVertical,
    LuAlignEndHorizontal,
    LuAlignEndVertical,
    LuAlignStartHorizontal,
    LuAlignStartVertical,
} from "react-icons/lu";
import { useNodeStore } from "../../store/node-store";
import { ALIGN_OPS } from "../../constants";

export const Align = ({ ids }) => {
    const alignHandler = (op) => {
        useNodeStore.getState().alignNodes(ids, op);
    };

    return (
        <Flex w={"100%"} gap={2}>
            <Group attached grow w={"100%"}>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => alignHandler(ALIGN_OPS.LEFT)}
                >
                    <LuAlignStartVertical />
                </IconButton>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => alignHandler(ALIGN_OPS.HCENTER)}
                >
                    <LuAlignCenterVertical />
                </IconButton>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => alignHandler(ALIGN_OPS.RIGHT)}
                >
                    <LuAlignEndVertical />
                </IconButton>
            </Group>
            <Group attached grow w={"100%"}>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => alignHandler(ALIGN_OPS.TOP)}
                >
                    <LuAlignStartHorizontal />
                </IconButton>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => alignHandler(ALIGN_OPS.VCENTER)}
                >
                    <LuAlignCenterHorizontal />
                </IconButton>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => alignHandler(ALIGN_OPS.BOTTOM)}
                >
                    <LuAlignEndHorizontal />
                </IconButton>
            </Group>
        </Flex>
    );
};
