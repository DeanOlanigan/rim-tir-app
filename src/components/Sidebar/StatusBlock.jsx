import { VStack } from "@chakra-ui/react";
import { Connect } from "../Metrics/Connect";
import { StatusTile } from "./StatusTile";
import { LuClock3, LuCpu, LuMemoryStick } from "react-icons/lu";

export const StatusBlock = ({ collapsed }) => {
    return (
        <VStack w={"full"} gap={1}>
            <Connect collapsed={collapsed} />
            <StatusTile
                icon={LuClock3}
                label={"Время"}
                sub={"stats/time"}
                color={"green"}
                format={(value) => new Date(value).toLocaleTimeString()}
                collapsed={collapsed}
            />
            <StatusTile
                icon={LuCpu}
                label={"CPU"}
                sub={"stats/cpu"}
                color={"purple"}
                collapsed={collapsed}
            />
            <StatusTile
                icon={LuMemoryStick}
                label={"RAM"}
                sub={"stats/ram"}
                color={"orange"}
                collapsed={collapsed}
            />
        </VStack>
    );
};
