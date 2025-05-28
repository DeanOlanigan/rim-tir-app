import { Code, Icon } from "@chakra-ui/react";
import {
    LuUserCheck,
    LuArrowBigRight,
    LuLightbulb,
    LuCircle,
} from "react-icons/lu";
import { useMonitoringStore } from "@/store/monitoring-store";

export const NodeValues = ({ id }) => {
    const valuesMap = useMonitoringStore((state) => state.valuesMap);

    return (
        <>
            <Code w={"150px"} variant={"surface"} justifyContent={"center"}>
                {valuesMap[id]}
            </Code>
            <LuUserCheck />
            <Icon color={"red.500"} fill={"red.500"} as={LuArrowBigRight} />
            <LuLightbulb />
            <LuCircle />
        </>
    );
};
