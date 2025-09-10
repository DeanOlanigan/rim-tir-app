import { Code } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";
import { memo } from "react";

export const NodeValues = memo(function NodeValues({ id }) {
    const { data: params } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state.settings[id]?.mqttPacket?.v,
    });
    return (
        <Code w={"150px"} variant={"surface"} justifyContent={"center"}>
            {params?.toString()}
        </Code>
    );
});
