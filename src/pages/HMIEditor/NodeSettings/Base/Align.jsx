import { Flex, Group, IconButton } from "@chakra-ui/react";
import {
    LuAlignCenterHorizontal,
    LuAlignCenterVertical,
    LuAlignEndHorizontal,
    LuAlignEndVertical,
    LuAlignStartHorizontal,
    LuAlignStartVertical,
} from "react-icons/lu";

export const Align = ({ ids }) => {
    console.log(ids);
    return (
        <Flex w={"100%"} gap={2}>
            <Group attached grow w={"100%"}>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuAlignStartVertical />
                </IconButton>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuAlignCenterVertical />
                </IconButton>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuAlignEndVertical />
                </IconButton>
            </Group>
            <Group attached grow w={"100%"}>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuAlignStartHorizontal />
                </IconButton>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuAlignCenterHorizontal />
                </IconButton>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuAlignEndHorizontal />
                </IconButton>
            </Group>
        </Flex>
    );
};
