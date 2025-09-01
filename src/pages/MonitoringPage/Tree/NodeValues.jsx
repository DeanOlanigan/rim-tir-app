import { Code, Icon } from "@chakra-ui/react";
import {
    LuUserCheck,
    LuArrowBigRight,
    LuLightbulb,
    LuCircle,
} from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";

export const NodeValues = ({ id }) => {
    const { data: params } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state.settings[id],
    });
    return (
        <>
            <Code w={"150px"} variant={"surface"} justifyContent={"center"}>
                {params.value}
            </Code>
            {params.setting?.cmd && <LuUserCheck />}
            <Icon color={"red.500"} fill={"red.500"} as={LuArrowBigRight} />
            <LuLightbulb />
            <LuCircle />
        </>
    );
};
